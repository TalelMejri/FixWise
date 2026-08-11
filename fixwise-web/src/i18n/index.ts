import { createI18n } from 'vue-i18n'
import en from '@/locales/en.json'
import fr from '@/locales/fr.json'
import tn from '@/locales/tn.json'

// Define available languages
export type Locale = 'en' | 'fr' | 'tn'

export const locales: Record<Locale, { name: string; flag: string; dir: 'ltr' | 'rtl' }> = {
  en: { name: 'EN', flag: '🇬🇧', dir: 'ltr' },
  fr: { name: 'FR', flag: '🇫🇷', dir: 'ltr' },
  tn: { name: 'TN', flag: '🇹🇳', dir: 'rtl' },
}

// Detect browser language
function getBrowserLocale(): Locale {
  const browserLang = navigator.language.split('-')[0]
  if (browserLang === 'fr') return 'fr'
  if (browserLang === 'tn' || browserLang === 'ar') return 'tn'
  return 'en'
}

// Get saved locale from localStorage or browser
function getInitialLocale(): Locale {
  const saved = localStorage.getItem('locale') as Locale | null
  if (saved && saved in locales) return saved
  return getBrowserLocale()
}

const i18n = createI18n({
  legacy: false,
  locale: getInitialLocale(),
  fallbackLocale: 'en',
  messages: {
    en,
    fr,
    tn,
  },
  numberFormats: {
    en: {
      currency: {
        style: 'currency',
        currency: 'USD',
      },
    },
    fr: {
      currency: {
        style: 'currency',
        currency: 'EUR',
      },
    },
    tn: {
      currency: {
        style: 'currency',
        currency: 'TND',
      },
    },
  },
  datetimeFormats: {
    en: {
      short: {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      },
      long: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
      },
    },
    fr: {
      short: {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      },
      long: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
      },
    },
    tn: {
      short: {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      },
      long: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
      },
    },
  },
})

// Set HTML lang attribute and direction
export function setLocale(locale: Locale) {
  const { dir } = locales[locale]
  document.documentElement.lang = locale
  document.documentElement.dir = dir
  localStorage.setItem('locale', locale)
  i18n.global.locale.value = locale
}

// Initialize locale
setLocale(getInitialLocale())

export default i18n