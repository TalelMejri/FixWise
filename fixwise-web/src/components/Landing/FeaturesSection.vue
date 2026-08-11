<template>
  <section id="features" class="relative overflow-hidden bg-[var(--bg-primary)] py-20 md:py-32">
    <!-- Background Pattern -->
    <div class="pointer-events-none absolute inset-0 grid-pattern opacity-45" aria-hidden="true" />

    <div class="relative mx-auto max-w-7xl px-5 md:px-8">
      <!-- Section Headers -->
      <div class="mb-14 md:mb-16">
        <span class="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
          {{ $t('features.eyebrow') }}
        </span>
        <h2 class="mt-3 text-3xl font-bold leading-tight text-[var(--text-primary)] md:text-4xl lg:text-5xl">
          {{ $t('features.title') }}
          <span class="text-gradient">{{ $t('features.titleHighlight') }}</span>
        </h2>
        <p class="mt-5 max-w-xl text-base leading-relaxed text-[var(--text-muted)]">
          {{ $t('features.description') }}
        </p>
      </div>

      <!-- Pillars Grid -->
      <div class="grid gap-5 md:grid-cols-3 md:gap-6">
        <article v-for="(pillar, index) in pillars" :key="pillar.key"
          class="group relative overflow-hidden rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-[var(--accent-primary)]/30 hover:shadow-xl md:p-8"
          :style="{ animationDelay: `${0.1 + index * 0.1}s` }">
          <!-- Glow Effect -->
          <span
            class="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-[var(--accent-primary)]/8 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

          <!-- Header -->
          <div class="flex items-start justify-between">
            <span
              class="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] transition-colors group-hover:bg-[var(--accent-primary)] group-hover:text-white">
              <component :is="pillar.icon" :size="21" />
            </span>
            <span class="font-mono text-xs tracking-widest text-[var(--text-muted)]/60">
              {{ pillar.index }}
            </span>
          </div>

          <!-- Content -->
          <h3 class="mt-6 text-xl font-semibold text-[var(--text-primary)]">
            {{ $t(`features.${pillar.key}.title`) }}
          </h3>
          <p class="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
            {{ $t(`features.${pillar.key}.description`) }}
          </p>

          <!-- Features List -->
          <ul class="mt-5 space-y-2.5 border-t border-[var(--border-color)] pt-5">
            <li v-for="(item, itemIndex) in pillar.items" :key="itemIndex"
              class="relative pl-5 text-sm text-[var(--text-secondary)]">
              <span class="absolute left-0 top-2 h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)]" />
              {{ $t(`features.${pillar.key}.items.${itemIndex}`) }}
            </li>
          </ul>
        </article>
      </div>

      <!-- Modules Section -->
      <div class="mt-14 border-t border-[var(--border-color)] pt-8 md:mt-16 md:pt-10">
        <p class="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
          {{ $t('features.modulesLabel') }}
        </p>
        <div class="mt-4 flex flex-wrap gap-2.5">
          <span v-for="(module, moduleIndex) in modules" :key="module"
            class="rounded-full border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-1.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-primary)]/35 hover:bg-[var(--accent-primary)]/8 hover:text-[var(--text-primary)]">
            {{ $t(`features.modules.${moduleIndex}`) }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { BellRing, BookOpen, Sparkles } from 'lucide-vue-next'

const { t } = useI18n()

// Pillars Data with keys for translation
const pillars = [
  {
    key: 'diary',
    icon: BookOpen,
    index: '01',
    items: [0, 1, 2], // item indices for translation
  },
  {
    key: 'ai',
    icon: Sparkles,
    index: '02',
    items: [0, 1, 2],
  },
  {
    key: 'reminders',
    icon: BellRing,
    index: '03',
    items: [0, 1, 2],
  },
]

// Modules Data (keys for translation)
const modules = [
  'assetManager',
  'diyPlanner',
  'fileManager',
  'dashboardKpis',
  'workspaceRoles',
  'notifications',
  'technicianAccess',
  'categoryLibrary',
]
</script>

<style scoped>
/* Only keep animations and custom keyframes */
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

.pillar-card {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
}
</style>