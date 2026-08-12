<template>
  <div class="kpi-card">
    <div class="kpi-content">
      <p class="kpi-label">{{ label }}</p>
      <p class="kpi-value">{{ value }}</p>
      <p class="kpi-hint" :class="tone">
        <TrendingUp class="size-3" />
        {{ hint }}
      </p>
    </div>
    <span class="kpi-icon">
      <component :is="icon" class="size-5" />
    </span>
  </div>
</template>

<script setup lang="ts">
import { TrendingUp } from 'lucide-vue-next'

defineProps<{
  icon: any
  label: string
  value: string
  hint: string
  tone?: 'default' | 'danger'
}>()
</script>

<style scoped>
.kpi-card {
  background: var(--bg-card);
  border-radius: 1rem;
  border: 1px solid var(--border-color);
  padding: 1.25rem;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  transition: all 0.2s ease;
}

.kpi-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
}

.kpi-content {
  flex: 1;
}

.kpi-label {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.kpi-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-top: 0.25rem;
}

.kpi-hint {
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.25rem;
}

.kpi-hint.default {
  color: var(--text-muted);
}

.kpi-hint.danger {
  color: #ef4444;
}

.kpi-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.75rem;
  background: rgba(232, 122, 0, 0.1);
  color: var(--accent-primary);
  flex-shrink: 0;
}
</style>