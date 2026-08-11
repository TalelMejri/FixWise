<template>
  <section id="top" class="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-[#0a0e17]">
    <!-- Video Background -->
    <div class="absolute inset-0 -z-20 h-full w-full overflow-hidden">
      <video class="h-full w-full object-cover opacity-80" autoplay muted loop playsinline :src="BG_VIDEO" />
      <div class="absolute inset-0 bg-gradient-to-t from-[#0a0e17] via-[#0a0e17]/70 to-[#0a0e17]/40" />
      <div class="absolute inset-0 grid-pattern opacity-40" aria-hidden="true" />
    </div>

    <!-- Glow Effect -->
    <div
      class="absolute -top-40 right-[-10%] -z-10 h-[38rem] w-[38rem] rounded-full bg-[var(--accent-primary)]/20 blur-[140px] animate-float-slow"
      aria-hidden="true"
    />

    <!-- Content -->
    <div class="mx-auto w-full max-w-7xl px-5 pt-32 pb-16 md:px-8 md:pb-24">
      <div class="grid items-end gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <!-- Left Content -->
        <div class="animate-rise">
          <!-- Badge -->
          <span class="badge-glass">
            <span class="h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)] animate-pulse-dot" />
            <span class="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">
              {{ $t('hero.badge') }}
            </span>
          </span>

          <!-- Title -->
          <h1
            class="mt-6 max-w-[15ch] text-[2.6rem] font-semibold leading-[1.02] text-white sm:text-6xl xl:text-[4.4rem]"
          >
            {{ $t('hero.title') }}
            <span class="text-gradient">{{ $t('hero.titleHighlight') }}</span>
            {{ $t('hero.titleEnd') }}
          </h1>

          <!-- Description -->
          <p class="mt-6 max-w-lg text-base leading-relaxed text-white/55">
            {{ $t('hero.description') }}
          </p>

          <!-- CTAs -->
          <div class="mt-9 flex flex-wrap items-center gap-3">
            <button class="btn-gradient group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm">
              {{ $t('hero.ctaPrimary') }}
              <ArrowRight :size="17" class="transition-transform group-hover:translate-x-1" />
            </button>
            <button
              class="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-[var(--accent-primary)]/30 hover:bg-[var(--accent-primary)]/10"
            >
              <PlayCircle :size="17" />
              {{ $t('hero.ctaSecondary') }}
            </button>
          </div>
        </div>

        <!-- Stats -->
        <dl
          class="grid grid-cols-3 divide-x divide-[var(--border-color)] rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-1 backdrop-blur-xl"
        >
          <div v-for="stat in stats" :key="stat.key" class="px-4 py-5 text-center">
            <dt class="font-display text-2xl font-semibold text-[var(--text-primary)] md:text-3xl">
              {{ stat.value }}
            </dt>
            <dd class="mt-1 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-[var(--text-muted)]">
              {{ $t(`stats.${stat.key}`) }}
            </dd>
          </div>
        </dl>
      </div>
    </div>

    <!-- Scroll Indicator -->
    <div class="pointer-events-none absolute right-8 bottom-10 hidden flex-col items-center gap-3 lg:flex">
      <span class="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-white/35">
        {{ $t('hero.scroll') }}
      </span>
      <span class="relative h-14 w-px overflow-hidden bg-white/12">
        <span class="absolute inset-x-0 top-0 h-1/3 bg-[var(--accent-primary)] animate-scroll-bounce" />
      </span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ArrowRight, PlayCircle } from 'lucide-vue-next'

const { t } = useI18n()

const BG_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260511_230229_7c9bc431-46cf-489a-948d-e8144d8eb5d4.mp4'

const stats = [
  { value: '10K+', key: 'assets' },
  { value: '5K+', key: 'logs' },
  { value: '98%', key: 'satisfaction' },
]
</script>

<style scoped>
/* Custom animations */
@keyframes float-slow {
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

@keyframes pulse-dot {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(0.8);
  }
}

@keyframes scroll-bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(60%);
  }
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(2rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-float-slow {
  animation: float-slow 8s ease-in-out infinite;
}

.animate-pulse-dot {
  animation: pulse-dot 2s ease-in-out infinite;
}

.animate-scroll-bounce {
  animation: scroll-bounce 2s ease-in-out infinite;
}

.animate-rise {
  animation: rise 1s ease-out forwards;
}
</style>