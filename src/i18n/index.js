import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.js";
import tr from "./locales/tr.js";

// Dil seçicideki sıra. Etiketler bilerek kendi dillerinde.
export const LANGUAGES = [
  { code: "tr", label: "Türkçe" },
  { code: "en", label: "English" },
];

// Tarayıcılar bölgesel kod bildirir (tr-TR, en-US…). Türkçe ise tr, gerisi en.
function toSupported(code) {
  return String(code || "").toLowerCase().startsWith("tr") ? "tr" : "en";
}

i18next.use(LanguageDetector).init({
  resources: {
    en: { translation: en },
    tr: { translation: tr },
  },
  supportedLngs: LANGUAGES.map((l) => l.code),
  fallbackLng: "en",
  initAsync: false,
  interpolation: { escapeValue: false },
  detection: {
    order: ["localStorage", "navigator"],
    lookupLocalStorage: "vc-lang",
    caches: ["localStorage"],
    convertDetectedLanguage: toSupported,
  },
});

export const t = (key, options) => i18next.t(key, options);

export function currentLanguage() {
  return i18next.resolvedLanguage || "en";
}

export function setText(el, key, options) {
  if (!el) return;
  el.dataset.i18n = key;
  if (options) el.dataset.i18nOptions = JSON.stringify(options);
  else delete el.dataset.i18nOptions;
  el.textContent = t(key, options);
}

export function setRawText(el, text) {
  if (!el) return;
  delete el.dataset.i18n;
  delete el.dataset.i18nOptions;
  el.textContent = text;
}

export function applyTranslations(root = document) {
  root.querySelectorAll("[data-i18n]").forEach((el) => {
    const options = el.dataset.i18nOptions ? JSON.parse(el.dataset.i18nOptions) : undefined;
    el.textContent = t(el.dataset.i18n, options);
  });
  root.querySelectorAll("[data-i18n-html]").forEach((el) => {
    el.innerHTML = t(el.dataset.i18nHtml);
  });
  root.querySelectorAll("[data-i18n-alt]").forEach((el) => {
    el.alt = t(el.dataset.i18nAlt);
  });
  root.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
    el.setAttribute("aria-label", t(el.dataset.i18nAriaLabel));
  });
  document.documentElement.lang = currentLanguage();
  document.title = t("meta.title");
}

export function changeLanguage(code) {
  return i18next.changeLanguage(code);
}

i18next.on("languageChanged", () => {
  applyTranslations();
  window.dispatchEvent(new Event("vc:languagechange"));
});

window.t = t;
window.vcI18n = { t, setText, setRawText, currentLanguage };