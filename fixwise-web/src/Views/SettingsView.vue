<template>
  <DashboardLayout>
    <div class="max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-4">
      <div class="flex flex-wrap items-center justify-between gap-3 mb-4 sm:mb-6">
        <div class="flex-1 min-w-0">
          <h1 class="text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight">
            Settings
          </h1>
          <p class="text-sm text-[var(--text-muted)] mt-1">
            Manage your workspace settings
          </p>
        </div>
      </div>

      <div class="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-6 text-center">
        <p class="text-[var(--text-muted)]">Settings will appear here</p>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import DashboardLayout from '@/components/dashboard/DashboardLayout.vue'
</script>