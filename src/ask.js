import { getActiveLocale } from './i18n/index.js';

export async function askAI(query, options = {}) {
  const locale = options.lang || getActiveLocale();
  
  if (!query) {
    return {
      success: false,
      error: 'Query parameter is required.'
    };
  }

  // Simulated AI response localized based on active locale
  const responses = {
    en: `[AI Diagnostic]: Analysis complete for "${query}". System optimal.`,
    de: `[KI-Diagnose]: Analyse abgeschlossen für "${query}". System optimal.`,
    es: `[Diagnóstico IA]: Análisis completado para "${query}". Sistema óptimo.`,
    fr: `[Diagnostic IA] : Analyse terminée pour "${query}". Système optimal.`
  };

  const message = responses[locale] || responses.en;

  return {
    success: true,
    locale,
    query,
    answer: message
  };
}
