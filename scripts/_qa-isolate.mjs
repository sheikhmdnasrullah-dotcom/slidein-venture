import { chromium } from 'playwright';
const browser = await chromium.launch();
const errors = [];

// 1. Homepage at 390 WITHOUT opening modal
const p1 = await browser.newPage({ viewport: { width: 390, height: 844 } });
p1.on('console', (m) => { if (m.type() === 'error') errors.push(`[home390-nomodal] ${m.text().slice(0, 200)}`); });
p1.on('pageerror', (e) => errors.push(`[home390-nomodal] ${String(e).slice(0, 200)}`));
await p1.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await p1.waitForTimeout(2000);
await p1.close();

// 2. Homepage at 1440 WITH modal (recheck)
const p2 = await browser.newPage({ viewport: { width: 1440, height: 900 } });
p2.on('console', (m) => { if (m.type() === 'error') errors.push(`[home1440-modal] ${m.text().slice(0, 200)}`); });
p2.on('pageerror', (e) => errors.push(`[home1440-modal] ${String(e).slice(0, 200)}`));
await p2.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await p2.waitForTimeout(1500);
const cta = await p2.$('[data-testid="hero-cta-primary"]');
await cta?.click();
await p2.waitForTimeout(1500);
await p2.close();

await browser.close();
console.log('ERRORS:', errors.length ? errors : 'none');
