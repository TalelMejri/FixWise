<template>
  <section class="bg-[var(--bg-primary)] px-5 pb-20 md:px-8 md:pb-32">
    <div class="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[var(--bg-primary)] px-6 py-16 text-center md:px-12 md:py-24">
      <!-- Background Pattern -->
      <div class="pointer-events-none absolute inset-0 grid-pattern-diagonal opacity-40" aria-hidden="true" />
      
      <!-- Glow Effect -->
      <div class="pointer-events-none absolute -top-1/3 left-1/2 h-80 w-[42rem] -translate-x-1/2 rounded-full bg-[var(--accent-primary)]/25 blur-[120px] animate-pulse-glow" aria-hidden="true" />

      <!-- Content -->
      <div class="relative cta-content">
        <h2 class="mx-auto max-w-2xl text-3xl font-semibold text-[var(--text-primary)] md:text-5xl">
          {{ $t('cta.title') }}
        </h2>
        <p class="mx-auto mt-5 max-w-md text-sm leading-relaxed text-[var(--text-muted)] md:text-base">
          {{ $t('cta.description') }}
        </p>
        <div class="mt-9 flex flex-wrap justify-center gap-3">
          <button class="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#e87a00] to-[#f58a1a] px-7 py-3.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#e87a00]/30">
            {{ $t('cta.primary') }}
            <ArrowRight :size="17" class="transition-transform group-hover:translate-x-1" />
          </button>
          <button class="rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] px-7 py-3.5 text-sm font-semibold text-[var(--text-primary)] backdrop-blur-md transition-all hover:-translate-y-0.5 hover:bg-[var(--bg-secondary)]">
            {{ $t('cta.secondary') }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ArrowRight } from 'lucide-vue-next'

const { t } = useI18n()
</script>

<style scoped>
/* ========================================
   ANIMATIONS
   ======================================== */
@keyframes pulse-glow {
  0%, 100% {
    opacity: 0.8;
    transform: translateX(-50%) scale(1);
  }
  50% {
    opacity: 1;
    transform: translateX(-50%) scale(1.05);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(2rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-pulse-glow {
  animation: pulse-glow 4s ease-in-out infinite;
}

.cta-content {
  animation: fadeInUp 0.8s ease-out forwards;
  opacity: 0;
}

.cta-content {
  opacity: 0;
  transform: translateY(2rem);
  transition: all 0.8s ease-out;
}

.cta-content.visible {
  opacity: 1;
  transform: translateY(0);
}
</style>