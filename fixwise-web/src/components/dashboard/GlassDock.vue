<template>
  <div class="glass-dock-wrapper">
    <div class="glass-dock" @mouseleave="hoveredIndex = null">
      <!-- Tooltip -->
      <Transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="opacity-0 scale-90 -translate-y-4"
        enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition-all duration-150 ease-in"
        leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-90 -translate-y-4"
      >
        <div v-if="hoveredIndex !== null" class="dock-tooltip" :style="{ left: `${hoveredIndex * 52 + 12}px` }">
          <span class="dock-tooltip-text">{{ items[hoveredIndex]?.label || '' }}</span>
        </div>
      </Transition>

      <button
        v-for="(item, index) in items"
        :key="item.id"
        class="dock-item"
        :class="{ active: item.active }"
        @mouseenter="hoveredIndex = index"
        @click="item.action"
        :title="item.label"
      >
        <component :is="item.icon" class="dock-icon" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

export interface DockItem {
  id: string
  label: string
  icon: any
  action: () => void
  active?: boolean
}

defineProps<{
  items: DockItem[]
}>()

const hoveredIndex = ref<number | null>(null)
</script>

<style scoped>
.glass-dock-wrapper {
  display: flex;
  justify-content: center;
  padding: 0.5rem;
  width: 100%;
}

.glass-dock {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border-radius: 1.5rem;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  min-width: 280px;
  justify-content: center;
}

.dark .glass-dock {
  background: rgba(0, 0, 0, 0.6);
  border-color: rgba(255, 255, 255, 0.06);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.dock-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--text-muted);
  position: relative;
  background: transparent;
  border: none;
  padding: 0;
}

.dock-item:hover {
  color: var(--text-primary);
  background: rgba(232, 122, 0, 0.08);
  transform: translateY(-2px);
}

.dock-item.active {
  color: var(--accent-primary);
  background: rgba(232, 122, 0, 0.12);
}

.dock-item.active .dock-icon {
  color: var(--accent-primary);
}

.dock-icon {
  width: 20px;
  height: 20px;
  transition: transform 0.2s ease;
}

.dock-item:hover .dock-icon {
  transform: scale(1.1);
}

/* Tooltip */
.dock-tooltip {
  position: absolute;
  top: -44px;
  padding: 0.375rem 0.75rem;
  border-radius: 0.5rem;
  background: var(--text-primary);
  color: var(--bg-primary);
  font-size: 0.7rem;
  font-weight: 500;
  white-space: nowrap;
  pointer-events: none;
  transform: translateX(-50%);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.dark .dock-tooltip {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.dock-tooltip::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  width: 8px;
  height: 8px;
  background: var(--text-primary);
}

.dark .dock-tooltip::after {
  background: var(--bg-secondary);
}

/* Responsive */
@media (max-width: 480px) {
  .glass-dock {
    padding: 0.5rem 0.75rem;
    gap: 0.25rem;
    border-radius: 1rem;
    min-width: auto;
  }

  .dock-item {
    width: 38px;
    height: 38px;
  }

  .dock-icon {
    width: 17px;
    height: 17px;
  }

  .dock-tooltip {
    top: -38px;
    font-size: 0.6rem;
    padding: 0.25rem 0.5rem;
  }
}
</style>