<template>
  <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="close"></div>
    <div class="relative max-h-[90vh] w-full max-w-lg overflow-y-auto bg-[var(--bg-primary)] p-6 rounded-2xl shadow-2xl border border-[var(--border-color)]">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold text-[var(--text-primary)]">
          {{ reminder ? 'Edit Reminder' : 'New Reminder' }}
        </h2>
        <button class="modal-close" @click="close">
          <X class="w-5 h-5" />
        </button>
      </div>

      <form @submit.prevent="save" class="space-y-4">
        <!-- Title -->
        <div class="form-group">
          <label class="form-label">Title</label>
          <input
            v-model="form.title"
            type="text"
            placeholder="Enter reminder title"
            class="form-input"
            required
          />
        </div>

        <!-- Asset -->
        <div class="form-group">
          <label class="form-label">Asset</label>
          <select v-model="form.assetId" class="form-input">
            <option v-for="asset in assets" :key="asset.id" :value="asset.id">
              {{ asset.name }}
            </option>
          </select>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <!-- Frequency Type -->
          <div class="form-group">
            <label class="form-label">Frequency</label>
            <select v-model="form.frequencyType" class="form-input">
              <option v-for="freq in frequencies" :key="freq" :value="freq">
                {{ freq }}
              </option>
            </select>
          </div>

          <!-- Frequency Value -->
          <div class="form-group">
            <label class="form-label">Frequency Value</label>
            <input
              v-model.number="form.frequencyValue"
              type="number"
              placeholder="1"
              class="form-input"
              min="1"
            />
          </div>
        </div>

        <!-- Due Date -->
        <div class="form-group">
          <label class="form-label">Due Date</label>
          <input
            v-model="form.dueDate"
            type="date"
            class="form-input"
          />
        </div>

        <!-- Preview -->
        <div v-if="form.frequencyType !== 'Once'" class="bg-[var(--bg-secondary)] rounded-lg p-3 text-sm text-[var(--text-muted)]">
          Next due after completion: <span class="font-medium text-[var(--text-primary)]">{{ nextDuePreview }}</span>
        </div>
        <div v-else class="bg-[var(--bg-secondary)] rounded-lg p-3 text-sm text-[var(--text-muted)]">
          No repeat
        </div>

        <p v-if="error" class="text-sm text-red-500">{{ error }}</p>

        <div class="flex justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
          <button type="button" class="btn-cancel" @click="close">
            Cancel
          </button>
          <button type="submit" class="btn-save">
            {{ reminder ? 'Save Changes' : 'Create Reminder' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { X } from 'lucide-vue-next'
import { useWorkspaceStore } from '@/stores/workspace'
import { addDays, format } from 'date-fns'

const props = defineProps<{
  open: boolean
  reminder?: any
  assetId?: string
  dueDate?: string
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'save', data: any): void
}>()

const workspaceStore = useWorkspaceStore()

const frequencies = [
  'Once',
  'Daily',
  'Weekly',
  'Monthly',
  'Yearly',
  'EveryXDays',
  'EveryXWeeks',
  'EveryXMonths'
]

const form = ref({
  title: '',
  assetId: '',
  frequencyType: 'Monthly',
  frequencyValue: 1,
  dueDate: new Date().toISOString().split('T')[0]
})

const error = ref('')
const assets = computed(() => workspaceStore.workspaceAssets)

const nextDuePreview = computed(() => {
  if (form.value.frequencyType === 'Once') return 'No repeat'
  
  const date = new Date()
  const value = form.value.frequencyValue || 1
  
  switch (form.value.frequencyType) {
    case 'Daily':
      return format(addDays(date, value), 'MMM d, yyyy')
    case 'Weekly':
      return format(addDays(date, value * 7), 'MMM d, yyyy')
    case 'Monthly':
      return format(addDays(date, value * 30), 'MMM d, yyyy')
    case 'Yearly':
      return format(addDays(date, value * 365), 'MMM d, yyyy')
    case 'EveryXDays':
      return format(addDays(date, value), 'MMM d, yyyy')
    case 'EveryXWeeks':
      return format(addDays(date, value * 7), 'MMM d, yyyy')
    case 'EveryXMonths':
      return format(addDays(date, value * 30), 'MMM d, yyyy')
    default:
      return 'Unknown'
  }
})

const resetForm = () => {
  form.value = {
    title: '',
    assetId: props.assetId || assets.value[0]?.id || '',
    frequencyType: 'Monthly',
    frequencyValue: 1,
    dueDate: props.dueDate || new Date().toISOString().split('T')[0]
  }
  error.value = ''
}

watch(() => props.open, (isOpen) => {
  if (isOpen) {
    if (props.reminder) {
      form.value = {
        title: props.reminder.title || '',
        assetId: props.reminder.assetId || props.assetId || assets.value[0]?.id || '',
        frequencyType: props.reminder.frequencyType || 'Monthly',
        frequencyValue: props.reminder.frequencyValue || 1,
        dueDate: props.reminder.dueDate || new Date().toISOString().split('T')[0]
      }
    } else {
      resetForm()
    }
  }
})

const close = () => {
  emit('update:open', false)
}

const save = () => {
  if (!form.value.title.trim()) {
    error.value = 'Title is required'
    return
  }
  if (!form.value.assetId) {
    error.value = 'Please select an asset'
    return
  }

  emit('save', {
    ...form.value,
    completed: props.reminder?.completed || false
  })
  close()
}
</script>

<style scoped>
.modal-close {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: var(--bg-secondary);
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: var(--border-color);
  color: var(--text-primary);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
}

.form-input {
  padding: 0.625rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid var(--border-color);
  background: var(--bg-input);
  color: var(--text-primary);
  font-size: 0.875rem;
  transition: all 0.2s ease;
  width: 100%;
}

.form-input:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(232, 122, 0, 0.1);
}

.btn-cancel {
  padding: 0.625rem 1.5rem;
  border-radius: 0.75rem;
  border: 1px solid var(--border-color);
  background: transparent;
  color: var(--text-primary);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cancel:hover {
  background: var(--bg-secondary);
}

.btn-save {
  padding: 0.625rem 1.5rem;
  border-radius: 0.75rem;
  border: none;
  background: var(--accent-primary);
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-save:hover {
  background: var(--accent-hover);
  transform: scale(1.02);
}
</style>