<template>
  <section id="how-it-works" class="relative overflow-hidden bg-[var(--bg-primary)] py-20 md:py-32">
    <!-- Background Pattern -->
    <div class="pointer-events-none absolute inset-0 grid-pattern-diagonal opacity-50" aria-hidden="true" />

    <!-- Glow Effect -->
    <div class="pointer-events-none absolute -top-32 right-[-8%] h-[34rem] w-[34rem] rounded-full bg-[var(--accent-primary)]/12 blur-[130px] animate-float" aria-hidden="true" />

    <div class="relative mx-auto max-w-7xl px-5 md:px-8">
      <!-- Section Headers -->
      <div class="mb-16">
        <span class="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
          {{ $t('howItWorks.eyebrow') }}
        </span>
        <h2 class="mt-3 text-3xl font-bold leading-tight text-[var(--text-primary)] md:text-4xl lg:text-5xl">
          {{ $t('howItWorks.title') }}
          <span class="text-gradient">{{ $t('howItWorks.titleHighlight') }}</span>
        </h2>
      </div>

      <!-- Steps -->
      <ol class="grid gap-10 md:grid-cols-3 justify-center md:gap-8">
        <li v-for="(step, index) in steps" :key="step.key" class="step-item" :style="{ animationDelay: `${0.1 + index * 0.1}s` }">
          <!-- Step Number & Connector -->
          <div class="flex items-center gap-4">
            <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--accent-primary)]/35 bg-[var(--accent-primary)]/12 font-mono text-sm font-bold text-[var(--accent-primary)] shadow-[var(--accent-primary)]/30">
              {{ String(index + 1).padStart(2, '0') }}
            </span>
            <span class="hidden h-px flex-1 bg-gradient-to-r from-[var(--accent-primary)]/45 to-transparent md:block" aria-hidden="true" />
          </div>

          <!-- Content -->
          <h3 class="mt-6 text-xl font-semibold text-[var(--text-primary)]">
            {{ $t(`howItWorks.${step.key}.title`) }}
          </h3>
          <p class="mt-2.5 max-w-sm text-sm leading-relaxed text-[var(--text-muted)]">
            {{ $t(`howItWorks.${step.key}.description`) }}
          </p>
        </li>
      </ol>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Steps Data with keys for translation
const steps = [
  {
    key: 'step1',
  },
  {
    key: 'step2',
  },
  {
    key: 'step3',
  },
]
</script>

<style scoped>
/* ========================================
   ANIMATIONS
   ======================================== */
@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(-20px, 20px) scale(1.02);
  }
  66% {
    transform: translate(20px, -10px) scale(0.98);
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

.animate-float {
  animation: float 8s ease-in-out infinite;
}

.step-item {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
}

/* Scroll animation with Intersection Observer */
.step-item {
  opacity: 0;
  transform: translateY(2rem);
  transition: all 0.6s ease-out;
}

.step-item.visible {
  opacity: 1;
  transform: translateY(0);
}
</style>