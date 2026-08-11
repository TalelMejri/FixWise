import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export type Theme = 'light' | 'dark'

export const useThemeStore = defineStore('theme', () => {
  const currentTheme = ref<Theme>('dark')

  // Initialize theme from localStorage or system preference
  function initTheme() {
    const savedTheme = localStorage.getItem('theme') as Theme | null
    
    if (savedTheme) {
      currentTheme.value = savedTheme
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      currentTheme.value = 'light'
    } else {
      currentTheme.value = 'dark'
    }
    
    applyTheme(currentTheme.value)
  }

  // Apply theme to document
  function applyTheme(theme: Theme) {
    const html = document.documentElement
    
    if (theme === 'dark') {
      html.classList.add('dark')
      html.classList.remove('light')
    } else {
      html.classList.add('light')
      html.classList.remove('dark')
    }
    
    // Save to localStorage
    localStorage.setItem('theme', theme)
  }

  // Toggle theme
  function toggleTheme() {
    const newTheme = currentTheme.value === 'dark' ? 'light' : 'dark'
    currentTheme.value = newTheme
    applyTheme(newTheme)
  }

  // Set specific theme
  function setTheme(theme: Theme) {
    currentTheme.value = theme
    applyTheme(theme)
  }

  // Watch for changes
  watch(currentTheme, (newTheme) => {
    applyTheme(newTheme)
  })

  return {
    currentTheme,
    initTheme,
    toggleTheme,
    setTheme,
    isDark: () => currentTheme.value === 'dark',
    isLight: () => currentTheme.value === 'light',
  }
})