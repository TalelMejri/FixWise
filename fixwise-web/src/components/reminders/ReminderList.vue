<template>
  <div class="space-y-3">
    <div v-if="items.length === 0" class="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-12 text-center">
      <p class="text-sm text-[var(--text-muted)]">Nothing here.</p>
    </div>

    <div v-for="reminder in items" :key="reminder.id" class="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] overflow-hidden hover:shadow-md transition-all">
      <div class="p-4 sm:p-5">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap items-center gap-2">
              <p class="font-medium text-[var(--text-primary)]">{{ reminder.title }}</p>
              <span class="text-xs font-semibold px-2 py-0.5 rounded-full" :class="getStatusBadgeClass(reminder)">
                {{ getStatusLabel(reminder) }}
              </span>
              <span class="text-xs font-medium px-2 py-0.5 rounded-full bg-[var(--bg-secondary)] text-[var(--text-muted)]">
                {{ getFrequencyLabel(reminder) }}
              </span>
            </div>
            <p class="mt-1 text-xs text-[var(--text-muted)]">
              {{ getAssetName(reminder.assetId) }} · due {{ formatDate(reminder.dueDate) }}
              <span v-if="reminder.nextDueDate" class="ml-2">
                Next: {{ formatDate(reminder.nextDueDate) }}
              </span>
            </p>
          </div>
          <div class="flex gap-2">
            <button
              v-if="!reminder.completed"
              class="btn-complete"
              @click="$emit('complete', reminder.id)"
            >
              <CheckCircle2 class="w-4 h-4" />
              Complete
            </button>
            <button
              class="btn-edit"
              @click="$emit('edit', reminder)"
            >
              <Pencil class="w-4 h-4" />
            </button>
            <button
              class="btn-delete"
              @click="$emit('delete', reminder.id)"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CheckCircle2, Pencil, Trash2 } from 'lucide-vue-next'
import { useWorkspaceStore } from '@/stores/workspace'
import { format } from 'date-fns'

const props = defineProps<{
  items: any[]
}>()

const emit = defineEmits<{
  (e: 'complete', id: string): void
  (e: 'edit', reminder: any): void
  (e: 'delete', id: string): void
}>()

const workspaceStore = useWorkspaceStore()
const today = new Date().toISOString().slice(0, 10)

const getAssetName = (assetId: string) => {
  const asset = workspaceStore.assets.find(a => a.id === assetId)
  return asset?.name || 'Unknown Asset'
}

const getStatusLabel = (reminder: any) => {
  if (reminder.completed) return 'Completed'
  if (reminder.dueDate < today) return 'Overdue'
  return 'Pending'
}

const getStatusBadgeClass = (reminder: any) => {
  if (reminder.completed) return 'bg-green-500/10 text-green-500'
  if (reminder.dueDate < today) return 'bg-red-500/10 text-red-500'
  return 'bg-blue-500/10 text-blue-500'
}

const getFrequencyLabel = (reminder: any) => {
  if (reminder.frequencyType.startsWith('Every')) {
    return `${reminder.frequencyType} (${reminder.frequencyValue})`
  }
  return reminder.frequencyType
}

const formatDate = (date: string) => {
  if (!date) return 'N/A'
  try {
    return format(new Date(date), 'MMM d, yyyy')
  } catch {
    return date
  }
}
</script>

<style scoped>
.btn-complete {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.875rem;
  border-radius: 0.5rem;
  background: var(--color-success);
  color: white;
  font-size: 0.75rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-complete:hover {
  background: #059669;
  transform: scale(1.02);
}

.btn-edit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.375rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
  background: transparent;
  color: var(--text-primary);
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-edit:hover {
  background: var(--bg-secondary);
}

.btn-delete {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.375rem 0.75rem;
  border-radius: 0.5rem;
  background: rgba(239, 68, 68, 0.08);
  color: #ef4444;
  font-size: 0.75rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-delete:hover {
  background: rgba(239, 68, 68, 0.15);
}
</style>