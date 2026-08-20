import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const OUT = "/tmp/slidein-shots";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();

async function shoot(name, theme) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, colorScheme: theme === "night" ? "dark" : "light" });
  await page.addInitScript((t) => { try { localStorage.setItem("theme", t); } catch (e) {} }, theme);
  await page.goto("http://localhost:3000/login", { waitUntil: "networkidle" });
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${OUT}/${name}.png` });
  const data = await page.evaluate(() => ({
    htmlClass: document.documentElement.className,
    bg: getComputedStyle(document.body).backgroundColor,
    cardBg: document.querySelector("[data-slot=card]") && getComputedStyle(document.querySelector("[data-slot=card]")).backgroundColor,
    textDefault: getComputedStyle(document.documentElement).getPropertyValue("--text-default").trim(),
    textMuted: getComputedStyle(document.documentElement).getPropertyValue("--text-muted").trim(),
    surface: getComputedStyle(document.documentElement).getPropertyValue("--surface").trim(),
    rule: getComputedStyle(document.documentElement).getPropertyValue("--rule").trim(),
    flame: getComputedStyle(document.documentElement).getPropertyValue("--color-flame").trim(),
    buttonFont: getComputedStyle(document.querySelector("button")).fontFamily.trim(),
  }));
  console.log(name, JSON.stringify(data, null, 2));
  await page.close();
}

await shoot("login-day", "day");
await shoot("login-night", "night");

await browser.close();
console.log("done");
