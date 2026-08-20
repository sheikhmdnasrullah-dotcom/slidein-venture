import { chromium } from "playwright";

const browser = await chromium.launch();

async function probe(name, theme) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, colorScheme: theme === "night" ? "dark" : "light" });
  const logs = [];
  page.on("console", (m) => logs.push(`${m.type()}: ${m.text()}`));
  page.on("pageerror", (e) => logs.push(`pageerror: ${e.message}`));
  await page.addInitScript((t) => { try { localStorage.setItem("theme", t); } catch (e) {} }, theme);
  await page.goto("http://localhost:3000/login", { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  const data = await page.evaluate(() => {
    const cs = (sel) => { const el = document.querySelector(sel); return el ? getComputedStyle(el).backgroundColor : null; };
    const root = getComputedStyle(document.documentElement);
    return {
      htmlClass: document.documentElement.className,
      htmlDataTheme: document.documentElement.getAttribute("data-theme"),
      bodyBg: getComputedStyle(document.body).backgroundColor,
      bodyClass: document.body.className,
      pageFill: root.getPropertyValue("--page-fill").trim(),
      background: root.getPropertyValue("--background").trim(),
      colorBackground: root.getPropertyValue("--color-background").trim(),
      surface: root.getPropertyValue("--surface").trim(),
      darkSurface: getComputedStyle(document.documentElement).getPropertyValue("--surface").trim(),
      localStorageTheme: localStorage.getItem("theme"),
      hasBodyBgBackgroundUtil: document.body.classList.toString(),
    };
  });
  console.log(`\n=== ${name} ===`);
  console.log(JSON.stringify(data, null, 2));
  if (logs.length) console.log("logs:", logs.slice(0, 5).join("\n"));
  await page.close();
}

await probe("day", "day");
await probe("night", "night");
await browser.close();
