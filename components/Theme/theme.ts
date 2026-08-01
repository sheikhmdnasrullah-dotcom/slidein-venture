export const THEMES = ['day', 'night'] as const;
export type Theme = (typeof THEMES)[number];

/** One key, one place. Read by the pre-paint script and by ThemeToggle. */
export const THEME_STORAGE_KEY = 'siv-theme';

/**
 * Runs before first paint, inlined into <head>.
 *
 * It has to be a string rather than an imported function because it must
 * execute synchronously ahead of hydration — anything that waits for React has
 * already let the browser paint the wrong theme once, and that flash is the
 * single most common way a theme toggle looks cheap.
 *
 * Deliberately defensive: localStorage throws in Safari private mode and in
 * some embedded webviews. A theme is not worth a blank page, so every failure
 * path falls through to day.
 */
export const THEME_BOOTSTRAP = `(function(){try{
var s=localStorage.getItem('${THEME_STORAGE_KEY}');
var t=(s==='day'||s==='night')?s:(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'night':'day');
var r=document.documentElement;
r.setAttribute('data-theme',t);
r.style.colorScheme=(t==='night'?'dark':'light');
}catch(e){
document.documentElement.setAttribute('data-theme','day');
}})();`;
