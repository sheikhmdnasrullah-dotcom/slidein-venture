// The shipped favicon.ico must contain exactly the 16/32/48 layers of the exact-pixel PNGs, and nothing else.
import { readFileSync } from 'node:fs';
const pub = new URL('../../../public/', import.meta.url).pathname, d = readFileSync(pub + 'favicon.ico');
const n = d.readUInt16LE(4); let ok = n === 3 && d.readUInt16LE(2) === 1;
for (let i = 0; i < n; i++) { const e = 6 + 16 * i, s = d[e] || 256, len = d.readUInt32LE(e + 8), off = d.readUInt32LE(e + 12);
  const same = d.subarray(off, off + len).equals(readFileSync(`${pub}favicon-${s}x${s}.png`)); ok &&= same && [16, 32, 48].includes(s);
  console.log(`layer ${s}x${s}: ${len} B, identical to favicon-${s}x${s}.png: ${same}`); }
console.log(ok ? 'ICO OK' : 'ICO PROBLEM'); process.exit(ok ? 0 : 1);
