import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const VIDEO_FOLDER = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', 'how-it-works-video');
const NEXT_BUILD_DIR = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', '.next');
const CHUNK_BUDGET = 150 * 1024; // 150KB gzipped

async function main() {
  const results: { check: string; status: 'PASS' | 'FAIL'; detail?: string }[] = [];

  // 1. Typecheck
  try {
    execSync('npx tsc --noEmit', { stdio: 'pipe' });
    results.push({ check: 'tsc --noEmit', status: 'PASS' });
  } catch (e) {
    const detail = (e as { stderr?: Buffer }).stderr?.toString().slice(0, 500) || 'typecheck failed';
    results.push({ check: 'tsc --noEmit', status: 'FAIL', detail: detail.slice(0, 200) });
  }

  // 2. Lint (video folder only)
  try {
    execSync(`npx eslint ${VIDEO_FOLDER} --ext .ts,.tsx --max-warnings=999`, { stdio: 'pipe' });
    results.push({ check: 'eslint (video)', status: 'PASS' });
  } catch (e) {
    const detail = (e as { stdout?: Buffer }).stdout?.toString().slice(0, 300) || 'lint failed';
    results.push({ check: 'eslint (video)', status: 'FAIL', detail: detail.slice(0, 200) });
  }

  // 3. Build
  try {
    execSync('npm run build', { stdio: 'pipe' });
    results.push({ check: 'next build', status: 'PASS' });
  } catch (e) {
    results.push({ check: 'next build', status: 'FAIL' });
  }

  // 4. Bundle size check
  try {
    const videoChunk = findVideoChunk(NEXT_BUILD_DIR);
    if (videoChunk) {
      const gzippedSize = await measureGzipSize(videoChunk);
      const passed = gzippedSize <= CHUNK_BUDGET;
      results.push({
        check: `video chunk size (budget: 150KB)`,
        status: passed ? 'PASS' : 'FAIL',
        detail: `${Math.round(gzippedSize / 1024)}KB ${passed ? '<=' : '>'} 150KB`,
      });
    } else {
      results.push({ check: 'video chunk size', status: 'PASS', detail: 'no dedicated video chunk (inline player)' });
    }
  } catch (e) {
    results.push({ check: 'video chunk size', status: 'FAIL', detail: 'could not measure' });
  }

  // 5. Impeccable detect
  try {
    if (fs.existsSync(VIDEO_FOLDER)) {
      execSync(`npx impeccable detect ${VIDEO_FOLDER}`, { stdio: 'pipe' });
      results.push({ check: 'impeccable detect', status: 'PASS' });
    }
  } catch (e) {
    const detail = (e as { stdout?: Buffer }).stdout?.toString().slice(0, 300) || 'detect found issues';
    results.push({ check: 'impeccable detect', status: 'FAIL', detail: detail.slice(0, 200) });
  }

  // Print results
  console.log('\n=== video:check results ===\n');
  results.forEach((r) => {
    console.log(`[${r.status}] ${r.check}` + (r.detail ? ` - ${r.detail}` : ''));
  });

  const failed = results.filter((r) => r.status === 'FAIL');
  if (failed.length > 0) {
    console.log(`\n${failed.length} check(s) failed.`);
    process.exit(1);
  } else {
    console.log('\nAll checks passed.');
  }
}

function findVideoChunk(buildDir: string): string | null {
  const chunksDir = path.join(buildDir, 'static', 'chunks');
  if (!fs.existsSync(chunksDir)) return null;

  const files = fs.readdirSync(chunksDir, { recursive: true });
  for (const file of files) {
    if (typeof file === 'string' && file.endsWith('.js')) {
      const filePath = path.join(chunksDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.includes('vp-player') || content.includes('video-player')) {
        return filePath;
      }
    }
  }
  return null;
}

async function measureGzipSize(filePath: string): Promise<number> {
  const { gzipSync } = await import('node:zlib');
  const content = fs.readFileSync(filePath);
  return gzipSync(content).length;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

export {};
