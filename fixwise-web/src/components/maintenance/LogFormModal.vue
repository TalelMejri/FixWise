<template>
  <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="close"></div>
    <div
      class="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto bg-[var(--bg-primary)] p-6 rounded-2xl shadow-2xl border border-[var(--border-color)]">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold text-[var(--text-primary)]">
          {{ log ? 'Edit Maintenance Log' : 'New Maintenance Log' }}
        </h2>
        <button class="modal-close" @click="close">
          <X class="w-5 h-5" />
        </button>
      </div>

      <form @submit.prevent="save" class="space-y-4">
        <!-- Title -->
        <div class="form-group">
          <label class="form-label">Title</label>
          <input v-model="form.title" type="text" placeholder="Enter log title" class="form-input" required />
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <!-- Asset -->
          <div class="form-group">
            <label class="form-label">Asset</label>
            <select v-model="form.assetId" class="form-input">
              <option v-for="asset in assets" :key="asset.id" :value="asset.id">
                {{ asset.name }}
              </option>
            </select>
          </div>

          <!-- Type -->
          <div class="form-group">
            <label class="form-label">Type</label>
            <select v-model="form.type" class="form-input">
              <option v-for="type in logTypes" :key="type" :value="type">
                {{ type }}
              </option>
            </select>
          </div>

          <!-- Status -->
          <div class="form-group">
            <label class="form-label">Status</label>
            <select v-model="form.status" class="form-input">
              <option v-for="status in logStatuses" :key="status" :value="status">
                {{ status }}
              </option>
            </select>
          </div>

          <!-- Performed Date -->
          <div class="form-group">
            <label class="form-label">Performed Date</label>
            <input v-model="form.performedDate" type="date" class="form-input" />
          </div>

          <!-- Duration -->
          <div class="form-group">
            <label class="form-label">Duration (minutes)</label>
            <input v-model.number="form.durationMinutes" type="number" placeholder="60" class="form-input" min="0" />
          </div>

          <!-- Labour Cost -->
          <div class="form-group">
            <label class="form-label">Labour / Other Cost</label>
            <input v-model.number="form.labourCost" type="number" placeholder="0" class="form-input" min="0"
              step="0.01" />
          </div>
        </div>

        <!-- Notes -->
        <div class="form-group">
          <label class="form-label">Notes</label>
          <div class="relative">
            <textarea v-model="form.notes" class="form-input" rows="4" placeholder="Add notes about the maintenance..."
              maxlength="1000"></textarea>
            <div class="flex items-center justify-between mt-2">
              <span class="text-xs text-[var(--text-muted)]">{{ form.notes.length }}/1000</span>
              <button type="button" class="btn-ai-summary" @click="generateSummary"
                :disabled="isSummarizing || !form.notes.trim()">
                <Loader2 v-if="isSummarizing" class="w-4 h-4 animate-spin" />
                <Sparkles v-else class="w-4 h-4" />
                AI Summarize
              </button>
            </div>
          </div>
          <div v-if="form.aiSummary"
            class="mt-2 bg-[var(--accent-primary)]/5 rounded-lg px-3 py-2 text-sm text-[var(--text-muted)]">
            🤖 {{ form.aiSummary }}
          </div>
        </div>

        <!-- Materials -->
        <div class="form-group">
          <div class="flex items-center justify-between">
            <label class="form-label">Materials</label>
            <button type="button" class="btn-add-material" @click="addMaterial">
              <Plus class="w-4 h-4" />
              Add Material
            </button>
          </div>
          <div class="space-y-2 mt-2">
            <div v-for="(material, index) in form.materials" :key="material.id || index"
              class="grid grid-cols-12 gap-2">
              <input v-model="material.name" type="text" placeholder="Name"
                class="col-span-4 form-input form-input-sm" />
              <input v-model.number="material.quantity" type="number" placeholder="Qty"
                class="col-span-2 form-input form-input-sm" min="1" />
              <input v-model="material.unit" type="text" placeholder="Unit"
                class="col-span-2 form-input form-input-sm" />
              <input v-model.number="material.unitCost" type="number" placeholder="Cost"
                class="col-span-3 form-input form-input-sm" min="0" step="0.01" />
              <button type="button" class="col-span-1 btn-remove-material" @click="removeMaterial(index)">
                <X class="w-4 h-4" />
              </button>
            </div>
          </div>
          <p class="mt-2 text-sm text-[var(--text-muted)]">
            Total Cost: <span class="font-semibold text-[var(--text-primary)]">${{ totalCost.toFixed(2) }}</span>
          </p>
        </div>

        <!-- File Upload -->
        <div class="form-group">
          <label class="form-label">Attachments & Invoices</label>
          <div class="upload-zone" @dragover.prevent @drop.prevent="handleDrop">
            <UploadCloud class="upload-icon" />
            <p class="upload-text">Drag & drop or browse files</p>
            <p class="upload-hint">PDF, JPG, PNG, DOCX, XLSX up to 10MB</p>
            <input type="file" multiple class="upload-input" @change="handleFileSelect" />
          </div>
          <div v-if="files.length > 0" class="file-list">
            <div v-for="file in files" :key="file" class="file-item">
              <span class="file-name">✓ {{ file }}</span>
            </div>
          </div>
        </div>

        <p v-if="error" class="text-sm text-red-500">{{ error }}</p>

        <div class="flex justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
          <button type="button" class="btn-cancel" @click="close">
            Cancel
          </button>
          <button type="submit" class="btn-save">
            Save Log
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { X, Plus, Sparkles, Loader2, UploadCloud } from 'lucide-vue-next'
import { useWorkspaceStore } from '@/stores/workspace'

const props = defineProps<{
  open: boolean
  log?: any
  assetId?: string
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'save', data: any): void
}>()

const workspaceStore = useWorkspaceStore()

const logTypes = [
  'Preventive',
  'Corrective',
  'Inspection',
  'Cleaning',
  'DIY',
  'Installation',
  'Replacement'
]

const logStatuses = [
  'Scheduled',
  'InProgress',
  'Completed',
  'Cancelled'
]

const form = ref({
  title: '',
  assetId: '',
  type: 'Preventive',
  status: 'Completed',
  performedDate: new Date().toISOString().split('T')[0],
  durationMinutes: 60,
  labourCost: 0,
  notes: '',
  aiSummary: '',
  materials: [] as any[]
})

const files = ref<string[]>([])
const error = ref('')
const isSummarizing = ref(false)

const assets = computed(() => workspaceStore.workspaceAssets)

const totalCost = computed(() => {
  const materialsTotal = form.value.materials.reduce((sum, m) => {
    return sum + (m.quantity || 0) * (m.unitCost || 0)
  }, 0)
  return materialsTotal + (form.value.labourCost || 0)
})

const resetForm = () => {
  form.value = {
    title: '',
    assetId: props.assetId || assets.value[0]?.id || '',
    type: 'Preventive',
    status: 'Completed',
    performedDate: new Date().toISOString().split('T')[0],
    durationMinutes: 60,
    labourCost: 0,
    notes: '',
    aiSummary: '',
    materials: []
  }
  files.value = []
  error.value = ''
}

watch(() => props.open, (isOpen) => {
  if (isOpen) {
    if (props.log) {
      form.value = {
        title: props.log.title || '',
        assetId: props.log.assetId || props.assetId || assets.value[0]?.id || '',
        type: props.log.type || 'Preventive',
        status: props.log.status || 'Completed',
        performedDate: props.log.performedDate || new Date().toISOString().split('T')[0],
        durationMinutes: props.log.durationMinutes || 60,
        labourCost: props.log.labourCost || 0,
        notes: props.log.notes || '',
        aiSummary: props.log.aiSummary || '',
        materials: props.log.materials ? [...props.log.materials] : []
      }
    } else {
      resetForm()
    }
  }
})

const close = () => {
  emit('update:open', false)
}

const addMaterial = () => {
  form.value.materials.push({
    id: `mat-${Date.now()}`,
    name: '',
    quantity: 1,
    unit: 'pc',
    unitCost: 0
  })
}

const removeMaterial = (index: number) => {
  form.value.materials.splice(index, 1)
}

const generateSummary = () => {
  if (!form.value.notes.trim()) {
    error.value = 'Add some notes first'
    return
  }

  isSummarizing.value = true
  error.value = ''

  setTimeout(() => {
    isSummarizing.value = false
    const asset = assets.value.find(a => a.id === form.value.assetId)
    const summary = `${form.value.type} work on ${asset?.name || 'asset'}: ${form.value.notes.trim().slice(0, 140)}${form.value.notes.length > 140 ? '…' : ''} Suggested follow-up in 3 months.`
    form.value.aiSummary = summary
  }, 800)
}

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files) {
    processFiles(input.files)
  }
}

const handleDrop = (event: DragEvent) => {
  const files = event.dataTransfer?.files
  if (files) {
    processFiles(files)
  }
}

const processFiles = (fileList: FileList) => {
  const allowed = /\.(jpe?g|png|pdf|docx|xlsx)$/i
  const accepted: string[] = []
  Array.from(fileList).forEach((f) => {
    if (!allowed.test(f.name)) {
      // toast error
      return
    }
    if (f.size > 10 * 1024 * 1024) {
      // toast error
      return
    }
    accepted.push(f.name)
  })
  files.value = [...files.value, ...accepted]
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
    cost: totalCost.value,
    materials: form.value.materials.filter(m => m.name.trim())
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

.form-input-sm {
  padding: 0.375rem 0.625rem;
  font-size: 0.8rem;
}

.btn-ai-summary {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
  background: transparent;
  color: var(--text-primary);
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-ai-summary:hover:not(:disabled) {
  background: var(--bg-secondary);
}

.btn-ai-summary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-add-material {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
  background: transparent;
  color: var(--text-primary);
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-add-material:hover {
  background: var(--bg-secondary);
}

.btn-remove-material {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  border-radius: 0.375rem;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-remove-material:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.upload-zone {
  position: relative;
  padding: 2rem;
  border-radius: 1rem;
  border: 2px dashed var(--border-color);
  background: var(--bg-secondary);
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.upload-zone:hover {
  border-color: var(--accent-primary);
  background: rgba(232, 122, 0, 0.02);
}

.upload-icon {
  width: 2rem;
  height: 2rem;
  color: var(--text-muted);
  margin: 0 auto 0.5rem;
}

.upload-text {
  font-size: 0.875rem;
  color: var(--text-primary);
  margin: 0;
}

.upload-hint {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin: 0.25rem 0 0;
}

.upload-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.file-list {
  margin-top: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.file-item {
  padding: 0.25rem 0.75rem;
  background: var(--bg-secondary);
  border-radius: 9999px;
  font-size: 0.75rem;
  color: var(--text-muted);
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

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>