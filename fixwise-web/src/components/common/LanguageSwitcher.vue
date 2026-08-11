<template>
  <div class="language-switcher">
    <!-- Language Selector Button -->
    <button
      @click="isOpen = !isOpen"
      class="lang-btn"
      :class="{ 'lang-btn-open': isOpen }"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
    >
      <div class="lang-btn-content">
        <span class="lang-flag">{{ currentFlag }}</span>
        <span class="lang-name">{{ currentName }}</span>
        <ChevronDown :size="14" class="lang-chevron" :class="{ 'rotate-180': isOpen }" />
      </div>
      <div class="lang-btn-glow" />
    </button>

    <!-- Dropdown - Opens Upward Centered -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-3 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 -translate-y-3 scale-95"
    >
      <div v-if="isOpen" class="lang-dropdown" role="listbox">
        <!-- Arrow pointer -->
        <div class="lang-dropdown-arrow" />

        <div class="lang-dropdown-header">
          <span class="lang-dropdown-title">Select Language</span>
          <span class="lang-dropdown-subtitle">Choose your preferred language</span>
        </div>

        <div class="lang-dropdown-divider" />

        <button
          v-for="(locale, key) in locales"
          :key="key"
          @click="selectLanguage(key as Locale)"
          class="lang-option"
          :class="{
            'lang-option-active': currentLocale === key,
            'lang-option-rtl': key === 'tn'
          }"
          role="option"
          :aria-selected="currentLocale === key"
        >
          <div class="lang-option-content">
            <span class="lang-option-flag">{{ locale.flag }}</span>
            <div class="lang-option-info">
              <span class="lang-option-name">{{ locale.name }}</span>
              <span class="lang-option-native">{{ locale.name }}</span>
            </div>
          </div>
          <div v-if="currentLocale === key" class="lang-option-check">
            <span class="check-icon">✓</span>
          </div>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ChevronDown } from 'lucide-vue-next'
import { locales, setLocale, type Locale } from '@/i18n'

const { locale } = useI18n()
const isOpen = ref(false)

const currentLocale = computed(() => locale.value as Locale)
const currentName = computed(() => locales[currentLocale.value]?.name || 'English')
const currentFlag = computed(() => locales[currentLocale.value]?.flag || '🇬🇧')

function selectLanguage(locale: Locale) {
  setLocale(locale)
  isOpen.value = false
}

// Close dropdown when clicking outside
function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (!target.closest('.language-switcher')) {
    isOpen.value = false
  }
}

// Close dropdown on Escape key
function handleEscape(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    isOpen.value = false
  }
}

// Close dropdown on scroll
function handleScroll() {
  if (isOpen.value) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleEscape)
  document.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleEscape)
  document.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* ========================================
   LANGUAGE SWITCHER CONTAINER
   ======================================== */
.language-switcher {
  position: relative;
  display: inline-block;
}

/* ========================================
   LANGUAGE BUTTON
   ======================================== */
.lang-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem 0.5rem 0.75rem;
  border-radius: 9999px;
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  color: var(--text-primary);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  overflow: hidden;
}

.lang-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  padding: 1px;
  background: linear-gradient(135deg,
      var(--accent-primary) 0%,
      transparent 50%,
      var(--accent-primary) 100%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.lang-btn:hover::before {
  opacity: 1;
}

.lang-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 20px rgba(var(--accent-primary-rgb), 0.15);
}

.lang-btn:active {
  transform: translateY(0) scale(0.98);
}

.lang-btn-open {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 4px rgba(var(--accent-primary-rgb), 0.1);
}

.lang-btn-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  z-index: 1;
}

.lang-btn-glow {
  position: absolute;
  inset: -2px;
  border-radius: 9999px;
  background: radial-gradient(circle at center,
      rgba(var(--accent-primary-rgb), 0.05) 0%,
      transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.lang-btn:hover .lang-btn-glow {
  opacity: 1;
}

.lang-flag {
  font-size: 1.1rem;
  line-height: 1;
}

.lang-name {
  font-size: 0.813rem;
  font-weight: 500;
  color: var(--text-primary);
}

.lang-chevron {
  transition: transform 0.3s ease;
  color: var(--text-muted);
  flex-shrink: 0;
}

.rotate-180 {
  transform: rotate(180deg);
}

/* ========================================
   DROPDOWN - CENTERED
   ======================================== */
.lang-dropdown {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: calc(100% + 0.75rem);
  min-width: 240px;
  padding: 0.5rem;
  border-radius: 1rem;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  box-shadow: 0 -20px 60px rgba(0, 0, 0, 0.15), 0 -4px 20px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  z-index: 50;
  overflow: hidden;
  transform-origin: bottom center;
}

/* ========================================
   DROPDOWN ARROW - CENTERED
   ======================================== */
.lang-dropdown-arrow {
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  width: 12px;
  height: 12px;
  background: var(--bg-primary);
  border-right: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
  border-radius: 0 0 2px 0;
  pointer-events: none;
}

/* ========================================
   DROPDOWN HEADER
   ======================================== */
.lang-dropdown-header {
  padding: 0.5rem 0.75rem 0.25rem;
}

.lang-dropdown-title {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: 0.01em;
}

.lang-dropdown-subtitle {
  display: block;
  font-size: 0.65rem;
  color: var(--text-muted);
  margin-top: 0.125rem;
}

.lang-dropdown-divider {
  height: 1px;
  background: var(--border-color);
  margin: 0.5rem 0.75rem;
}

/* ========================================
   LANGUAGE OPTIONS
   ======================================== */
.lang-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.5rem 0.75rem;
  border-radius: 0.75rem;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  gap: 0.5rem;
}

.lang-option:hover {
  background: var(--bg-secondary);
}

.lang-option-active {
  background: rgba(var(--accent-primary-rgb), 0.08) !important;
}

.lang-option-active:hover {
  background: rgba(var(--accent-primary-rgb), 0.12) !important;
}

.lang-option-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.lang-option-flag {
  font-size: 1.25rem;
  line-height: 1;
  flex-shrink: 0;
}

.lang-option-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.0625rem;
}

.lang-option-name {
  font-size: 0.813rem;
  font-weight: 500;
  color: var(--text-primary);
}

.lang-option-native {
  font-size: 0.688rem;
  color: var(--text-muted);
}

.lang-option-check {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--accent-primary);
  color: white;
  font-size: 0.625rem;
  font-weight: 700;
}

.check-icon {
  line-height: 1;
}

/* RTL support for options */
.lang-option-rtl .lang-option-content {
  flex-direction: row-reverse;
}

.lang-option-rtl .lang-option-info {
  align-items: flex-end;
}

/* ========================================
   RESPONSIVE
   ======================================== */

/* Tablet */
@media (max-width: 768px) {
  .lang-dropdown {
    min-width: 220px;
    bottom: calc(100% + 0.625rem);
  }
}

/* Mobile */
@media (max-width: 640px) {
  .lang-btn {
    padding: 0.375rem 0.75rem 0.375rem 0.5rem;
    font-size: 0.75rem;
  }

  .lang-name {
    display: none;
  }

  .lang-flag {
    font-size: 1rem;
  }

  .lang-dropdown {
    min-width: 200px;
    bottom: calc(100% + 0.5rem);
    padding: 0.375rem;
  }

  .lang-dropdown-arrow {
    width: 10px;
    height: 10px;
    bottom: -5px;
  }

  .lang-option {
    padding: 0.375rem 0.5rem;
  }

  .lang-option-flag {
    font-size: 1rem;
  }

  .lang-option-name {
    font-size: 0.75rem;
  }

  .lang-option-native {
    font-size: 0.625rem;
  }

  .lang-dropdown-header {
    padding: 0.375rem 0.5rem 0.125rem;
  }

  .lang-dropdown-title {
    font-size: 0.688rem;
  }

  .lang-dropdown-subtitle {
    font-size: 0.563rem;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .lang-dropdown {
    min-width: 180px;
    bottom: calc(100% + 0.375rem);
    padding: 0.25rem;
    border-radius: 0.75rem;
  }

  .lang-dropdown-header {
    display: none;
  }

  .lang-dropdown-divider {
    display: none;
  }

  .lang-option {
    padding: 0.375rem 0.5rem;
    border-radius: 0.5rem;
  }

  .lang-option-flag {
    font-size: 0.875rem;
  }

  .lang-option-name {
    font-size: 0.688rem;
  }

  .lang-option-native {
    font-size: 0.563rem;
  }

  .lang-option-check {
    width: 16px;
    height: 16px;
    font-size: 0.5rem;
  }

  .lang-dropdown-arrow {
    width: 8px;
    height: 8px;
    bottom: -4px;
  }
}

/* Very Small Mobile */
@media (max-width: 360px) {
  .lang-dropdown {
    min-width: 150px;
    bottom: calc(100% + 0.25rem);
  }

  .lang-option-content {
    gap: 0.375rem;
  }

  .lang-option-flag {
    font-size: 0.75rem;
  }

  .lang-option-name {
    font-size: 0.625rem;
  }

  .lang-option-native {
    font-size: 0.5rem;
  }
}

/* ========================================
   ACCESSIBILITY
   ======================================== */
@media (prefers-reduced-motion: reduce) {
  .lang-btn,
  .lang-option,
  .lang-chevron,
  .lang-btn::before,
  .lang-btn-glow {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}

.lang-btn:focus-visible {
  outline: 2px solid var(--accent-primary);
  outline-offset: 2px;
}

.lang-option:focus-visible {
  outline: 2px solid var(--accent-primary);
  outline-offset: -2px;
}

/* ========================================
   DARK MODE SUPPORT
   ======================================== */
.dark .lang-dropdown {
  box-shadow: 0 -20px 60px rgba(0, 0, 0, 0.4), 0 -4px 20px rgba(0, 0, 0, 0.2);
}

.dark .lang-dropdown-arrow {
  background: var(--bg-primary);
}
</style>