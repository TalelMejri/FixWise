<template>
  <section id="solutions" class="bg-[var(--bg-primary)] py-20 md:py-32">
    <div class="mx-auto max-w-7xl px-5 md:px-8">
      <!-- Section Headers -->
      <div class="mb-14 md:mb-16">
        <span class="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
          {{ $t('audience.eyebrow') }}
        </span>
        <h2 class="mt-3 text-3xl font-bold leading-tight text-[var(--text-primary)] md:text-4xl lg:text-5xl">
          {{ $t('audience.title') }}
          <span class="text-gradient">{{ $t('audience.titleHighlight') }}</span>
        </h2>
      </div>

      <!-- Audience Grid -->
      <div
        class="grid overflow-hidden rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] sm:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="(audience, index) in audiences"
          :key="audience.key"
          class="audience-card group relative border-b border-[var(--border-color)] p-7 transition-colors hover:bg-[var(--bg-secondary)] sm:border-r sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(3n)]:border-r-0 md:p-8"
          :style="{ animationDelay: `${0.05 + index * 0.05}s` }"
        >
          <!-- Top Border Line -->
          <span
            class="absolute inset-x-0 top-0 h-0.5 scale-x-0 bg-gradient-to-r from-[#e87a00] to-[#f58a1a] transition-transform duration-300 group-hover:scale-x-100"
          />

          <!-- Icon -->
          <span
            class="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] transition-colors group-hover:bg-[var(--accent-primary)]/20 group-hover:scale-105"
          >
            <component :is="audience.icon" :size="20" />
          </span>

          <!-- Content -->
          <h3 class="mt-5 text-base font-semibold text-[var(--text-primary)]">
            {{ $t(`audience.items.${audience.key}.title`) }}
          </h3>
          <p class="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
            {{ $t(`audience.items.${audience.key}.description`) }}
          </p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Building2, Car, Eye, Hammer, Home, Wrench } from 'lucide-vue-next'

const { t } = useI18n()

// Audience Data with keys for translation
const audiences = [
  {
    key: 'homeowners',
    icon: Home,
  },
  {
    key: 'vehicleOwners',
    icon: Car,
  },
  {
    key: 'diyEnthusiasts',
    icon: Hammer,
  },
  {
    key: 'smallBusinesses',
    icon: Building2,
  },
  {
    key: 'technicians',
    icon: Wrench,
  },
  {
    key: 'viewers',
    icon: Eye,
  },
]
</script>

<style scoped>
/* ========================================
   ANIMATIONS
   ======================================== */
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

.audience-card {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
}
</style>