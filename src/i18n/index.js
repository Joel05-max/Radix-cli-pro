import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_LOCALE = 'en';
const SUPPORTED_LOCALES = ['en', 'de', 'es', 'fr'];

let currentTranslations = {};
let activeLocale = DEFAULT_LOCALE;

function detectLocale() {
  const langArg = process.argv.find(arg => arg.startsWith('--lang='));
  if (langArg) {
    const code = langArg.split('=')[1]?.toLowerCase();
    if (SUPPORTED_LOCALES.includes(code)) return code;
  }

  const envLang = (process.env.LC_ALL || process.env.LC_MESSAGES || process.env.LANG || process.env.LANGUAGE || '').toLowerCase();
  for (const locale of SUPPORTED_LOCALES) {
    if (envLang.startsWith(locale)) return locale;
  }

  return DEFAULT_LOCALE;
}

export function initI18n() {
  activeLocale = detectLocale();
  const filePath = path.join(__dirname, 'locales', `${activeLocale}.json`);

  try {
    const data = fs.readFileSync(filePath, 'utf8');
    currentTranslations = JSON.parse(data);
  } catch {
    const fallbackPath = path.join(__dirname, 'locales', `${DEFAULT_LOCALE}.json`);
    currentTranslations = JSON.parse(fs.readFileSync(fallbackPath, 'utf8'));
  }
}

export function t(key, vars = {}) {
  const keys = key.split('.');
  let value = currentTranslations;

  for (const k of keys) {
    value = value?.[k];
  }

  if (typeof value !== 'string') return key;

  return value.replace(/\{(\w+)\}/g, (_, v) => vars[v] ?? `{${v}}`);
}

export function getActiveLocale() {
  return activeLocale;
}
