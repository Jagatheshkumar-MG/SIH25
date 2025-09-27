import { en } from './en.js';
import { hi } from './hi.js';

export const translations = {
  en,
  hi
};

export const availableLanguages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' }
];

// Simple translation helper function
export function t(key, language = 'en', params = {}) {
  const translation = translations[language] || translations.en;
  
  // Navigate through nested keys (e.g., 'header.title')
  const keys = key.split('.');
  let value = translation;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // Fallback to English if key not found
      value = translations.en;
      for (const fallbackKey of keys) {
        if (value && typeof value === 'object' && fallbackKey in value) {
          value = value[fallbackKey];
        } else {
          return key; // Return key if not found anywhere
        }
      }
      break;
    }
  }
  
  // Replace parameters in the translation
  if (typeof value === 'string' && Object.keys(params).length > 0) {
    return value.replace(/\{(\w+)\}/g, (match, param) => {
      return params[param] || match;
    });
  }
  
  return typeof value === 'string' ? value : key;
}