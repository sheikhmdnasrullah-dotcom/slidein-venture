import { test, expect } from '@playwright/test';

const ORIGIN = process.env.TEST_ORIGIN ?? 'http://localhost:3000';

test('debug mobile sheet', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${ORIGIN}/`);
  await page.waitForTimeout(700);
  await page.getByRole('button', { name: /toggle menu/i }).click();
  await page.waitForTimeout(1600);
  const out = await page.evaluate(() => {
    const res: string[] = [];
    for (const t of ['Platform', 'The platform runs the same sequence']) {
      const el = [...document.querySelectorAll<HTMLElement>('body *')].find(
        (e) => (e.textContent ?? '').trim().startsWith(t) && !e.children.length
      );
      if (!el) { res.push(t + ' NOT FOUND'); continue; }
      const s = getComputedStyle(el);
      res.push(`${t} color=${s.color} op=${s.opacity} rect=${JSON.stringify(el.getBoundingClientRect().toJSON())}`);
      let n: Element | null = el;
      while (n && res.length < 12) {
        const cs = getComputedStyle(n);
        res.push(`   ${n.tagName}.${(n.className || '').toString().slice(0, 34)} bgc=${cs.backgroundColor.slice(0, 42)} bgi=${cs.backgroundImage.slice(0, 60)} op=${cs.opacity} pos=${cs.position}`);
        n = n.parentElement;
      }
    }
    return res;
  });
  console.log('DBG\n' + out.join('\n'));
  expect(true).toBe(true);
});
