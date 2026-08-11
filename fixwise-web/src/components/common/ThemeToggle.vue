<!-- src/components/common/ThemeToggle.vue -->
<template>
  <button
    @click="toggleTheme"
    class="group fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border-color)] bg-[var(--bg-primary)]/90 text-[var(--text-primary)] shadow-lg backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:border-[var(--accent-primary)]/50 hover:shadow-[var(--accent-primary)]/20 md:bottom-8 md:right-8"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
  >
    <!-- Glow ring on hover -->
    <span class="absolute inset-0 rounded-full bg-[var(--accent-primary)]/0 transition-all duration-500 group-hover:bg-[var(--accent-primary)]/10"></span>
    
    <!-- Sun (light mode) - shown when in dark mode -->
    <svg
      v-if="isDark"
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="relative transition-transform duration-500 group-hover:rotate-90 group-hover:scale-110"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>

    <!-- Moon (dark mode) - shown when in light mode -->
    <svg
      v-else
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="relative transition-transform duration-500 group-hover:-rotate-90 group-hover:scale-110"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>

    <span class="sr-only">
      {{ isDark ? 'Switch to light mode' : 'Switch to dark mode' }}
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark())

function toggleTheme() {
  themeStore.toggleTheme()
}
</script>