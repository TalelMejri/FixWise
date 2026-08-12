<template>
  <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="close"></div>
    <div class="relative max-h-[90vh] w-full max-w-lg overflow-y-auto bg-[var(--bg-primary)] p-6 rounded-2xl shadow-2xl border border-[var(--border-color)]">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold text-[var(--text-primary)]">New DIY Project</h2>
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
            placeholder="Enter project title"
            class="form-input"
            required
          />
        </div>

        <!-- Goal -->
        <div class="form-group">
          <label class="form-label">Goal</label>
          <textarea
            v-model="form.goal"
            class="form-input"
            rows="3"
            placeholder="What do you want to achieve?"
          ></textarea>
        </div>

        <!-- Linked Asset -->
        <div class="form-group">
          <label class="form-label">Linked Asset (optional)</label>
          <select v-model="form.assetId" class="form-input">
            <option value="none">No asset</option>
            <option v-for="asset in assets" :key="asset.id" :value="asset.id">
              {{ asset.name }}
            </option>
          </select>
        </div>

        <div class="grid gap-4 sm:grid-cols-3">
          <!-- Priority -->
          <div class="form-group">
            <label class="form-label">Priority</label>
            <select v-model="form.priority" class="form-input">
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <!-- Budget -->
          <div class="form-group">
            <label class="form-label">Budget</label>
            <input
              v-model.number="form.budget"
              type="number"
              placeholder="100"
              class="form-input"
              min="0"
            />
          </div>

          <!-- Experience -->
          <div class="form-group">
            <label class="form-label">Experience</label>
            <select v-model="form.experience" class="form-input">
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        <p v-if="error" class="text-sm text-red-500">{{ error }}</p>

        <div class="flex justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
          <button type="button" class="btn-cancel" @click="close">
            Cancel
          </button>
          <button type="submit" class="btn-save">
            Create Project
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

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'save', data: any): void
}>()

const workspaceStore = useWorkspaceStore()

const form = ref({
  title: '',
  goal: '',
  assetId: 'none',
  priority: 'Medium' as 'Low' | 'Medium' | 'High',
  budget: 100,
  experience: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced'
})

const error = ref('')
const assets = computed(() => workspaceStore.workspaceAssets)

const resetForm = () => {
  form.value = {
    title: '',
    goal: '',
    assetId: 'none',
    priority: 'Medium',
    budget: 100,
    experience: 'Beginner'
  }
  error.value = ''
}

watch(() => props.open, (isOpen) => {
  if (isOpen) {
    resetForm()
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

  const projectData = {
    title: form.value.title.trim(),
    goal: form.value.goal.trim(),
    workspaceId: workspaceStore.currentWorkspaceId,
    priority: form.value.priority,
    budget: form.value.budget,
    experience: form.value.experience,
    status: 'Planning' as const,
    tasks: [],
    aiPlan: ''
  }

  if (form.value.assetId !== 'none') {
    Object.assign(projectData, { assetId: form.value.assetId })
  }

  emit('save', projectData)
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