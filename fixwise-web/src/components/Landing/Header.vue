<template>
  <header class="fixed inset-x-0 top-0 z-50 transition-all duration-300" :class="[
    scrolled ? 'border-b border-[var(--border-color)] bg-[var(--bg-primary)]/85 backdrop-blur-xl shadow-sm' : 'border-b border-[var(--border-color)] bg-[var(--bg-primary)]/85 backdrop-blur-xl shadow-sm'
  ]">
    <div class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 transition-all duration-300 md:px-8"
      :class="scrolled ? 'py-3' : 'py-2'">
      <!-- Logo -->
      <router-link to="/" class="flex shrink-0 items-center gap-2.5 group">
        <img :src="logo" alt="FixWise" width="40" height="40"
          class="h-10 w-10 object-contain transition-transform duration-300 group-hover:scale-105 md:h-12 md:w-12" />
        <span
          class="font-display text-lg font-semibold tracking-tight text-[var(--text-primary)] transition-colors md:text-xl">
          FixWise
        </span>
      </router-link>

      <!-- Desktop Navigation -->
      <nav
        class="hidden items-center gap-1 rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] p-1 backdrop-blur-md md:flex">
        <a v-for="link in links" :key="link.href" :href="link.href"
          class="rounded-full px-4 py-1.5 text-sm text-[var(--text-secondary)] transition-all duration-200 hover:bg-[var(--accent-primary)]/15 hover:text-[var(--text-primary)] hover:scale-105"
          :class="{ 'bg-[var(--accent-primary)]/10 text-[var(--text-primary)]': link.active }">
          {{ $t(`nav.${link.key}`) }}
        </a>
      </nav>

      <!-- Desktop CTAs -->
      <div class="hidden items-center gap-2 md:flex">
        <router-link to="/login">
          <button
            class="rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] backdrop-blur-md transition-all duration-200 hover:bg-[var(--bg-secondary)] hover:scale-105">
            {{ $t('nav.login') }}
          </button>
        </router-link>
        <router-link to="/register">
          <button
            class="btn-gradient rounded-full px-5 py-2 text-sm transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-[var(--accent-primary)]/30">
            {{ $t('nav.beginNow') }}
          </button>
        </router-link>
      </div>

      <!-- Mobile Menu Toggle -->
      <button :aria-label="open ? $t('common.closeMenu') : $t('common.openMenu')" @click="open = !open"
        class="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-2 text-[var(--text-primary)] backdrop-blur-md transition-all duration-200 hover:bg-[var(--bg-secondary)] md:hidden">
        <X v-if="open" :size="18" class="transition-transform duration-300" />
        <Menu v-else :size="18" class="transition-transform duration-300" />
      </button>
    </div>

    <!-- Mobile Menu -->
    <Transition enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-4 scale-95" enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition-all duration-200 ease-in" leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 -translate-y-4 scale-95">
      <div v-if="open"
        class="mx-4 flex flex-col gap-1 rounded-2xl border border-[var(--accent-primary)]/15 bg-[var(--bg-primary)]/95 p-3 backdrop-blur-xl shadow-xl md:hidden">
        <a v-for="link in links" :key="link.href" :href="link.href" @click="open = false"
          class="rounded-xl px-4 py-3 text-sm text-[var(--text-secondary)] transition-all duration-200 hover:bg-[var(--accent-primary)]/12 hover:text-[var(--text-primary)] hover:translate-x-1"
          :class="{ 'bg-[var(--accent-primary)]/10 text-[var(--text-primary)]': link.active }">
          {{ $t(`nav.${link.key}`) }}
        </a>

        <!-- Mobile Menu Divider -->
        <div class="mt-1 border-t border-[var(--border-color)] pt-3">
          <div class="flex items-center justify-between gap-2">
            <ThemeToggle />
            <span class="text-xs text-[var(--text-muted)]">{{ $t('nav.theme') }}</span>
          </div>
        </div>

        <!-- Mobile CTAs -->
        <div class="mt-1 flex gap-2 border-t border-[var(--border-color)] pt-3">
          <router-link to="/login" class="flex-1" @click="open = false">
            <button
              class="w-full rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] py-2.5 text-sm font-medium text-[var(--text-primary)] transition-all duration-200 hover:bg-[var(--bg-secondary)]">
              {{ $t('nav.login') }}
            </button>
          </router-link>
          <router-link to="/register" class="flex-1" @click="open = false">
            <button class="btn-gradient w-full rounded-full py-2.5 text-sm transition-all duration-200 hover:scale-105">
              {{ $t('nav.beginNow') }}
            </button>
          </router-link>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Menu, X } from 'lucide-vue-next'
import ThemeToggle from '../common/ThemeToggle.vue'
import logo from '@/assets/logo.png'

const { t } = useI18n()

// Navigation links with active state
const links = ref([
  { label: 'Features', href: '#features', key: 'features', active: false },
  { label: 'How it works', href: '#how-it-works', key: 'howItWorks', active: false },
  { label: 'Solutions', href: '#solutions', key: 'solutions', active: false },
  { label: 'About', href: '#about', key: 'about', active: false },
])

const open = ref(false)
const scrolled = ref(false)
const activeSection = ref('')

// Handle scroll for header background
const handleScroll = () => {
  scrolled.value = window.scrollY > 24

  // Update active section based on scroll position
  const sections = ['features', 'how-it-works', 'solutions', 'about']
  let currentSection = ''

  for (const section of sections) {
    const el = document.getElementById(section)
    if (el) {
      const rect = el.getBoundingClientRect()
      if (rect.top <= 100) {
        currentSection = section
      }
    }
  }

  activeSection.value = currentSection

  // Update active links
  links.value = links.value.map(link => ({
    ...link,
    active: link.href === `#${currentSection}`
  }))
}

// Close mobile menu on resize to desktop
const handleResize = () => {
  if (window.innerWidth >= 768 && open.value) {
    open.value = false
  }
}

// Handle escape key to close menu
const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && open.value) {
    open.value = false
  }
}

// Prevent body scroll when mobile menu is open
watch(open, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', handleResize)
  document.addEventListener('keydown', handleEscape)

  // Initial active section check
  setTimeout(handleScroll, 100)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('keydown', handleEscape)
  document.body.style.overflow = ''
})
</script>

<style scoped>
/* ========================================
   CUSTOM BUTTON GRADIENT
   ======================================== */
.btn-gradient {
  background: linear-gradient(135deg, #e87a00, #f58a1a);
  color: white;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-gradient:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 30px rgba(232, 122, 0, 0.3);
}

.btn-gradient:active {
  transform: translateY(0) scale(0.98);
}

/* ========================================
   RESPONSIVE FIXES
   ======================================== */
@media (max-width: 480px) {
  .header-container {
    padding-inline: 0.75rem;
  }
}

/* ========================================
   ACCESSIBILITY
   ======================================== */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}

:focus-visible {
  outline: 2px solid var(--accent-primary);
  outline-offset: 2px;
}
</style>