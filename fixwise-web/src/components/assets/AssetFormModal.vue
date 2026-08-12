<template>
  <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="close"></div>
    <div
      class="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto bg-[var(--bg-primary)] p-6 rounded-2xl shadow-2xl border border-[var(--border-color)]">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold text-[var(--text-primary)]">
          {{ asset ? 'Edit Asset' : 'Add Asset' }}
        </h2>
        <button class="modal-close" @click="close">
          <X class="w-5 h-5" />
        </button>
      </div>

      <form @submit.prevent="save" class="space-y-4">
        <!-- Name -->
        <div class="form-group">
          <label class="form-label">Name</label>
          <input v-model="form.name" type="text" placeholder="Enter asset name" class="form-input" required />
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <!-- Category -->
          <div class="form-group">
            <label class="form-label">Category</label>
            <select v-model="form.category" class="form-input">
              <option v-for="cat in categories" :key="cat" :value="cat">
                {{ cat }}
              </option>
            </select>
          </div>

          <!-- Status -->
          <div class="form-group">
            <label class="form-label">Status</label>
            <select v-model="form.status" class="form-input">
              <option v-for="status in statuses" :key="status" :value="status">
                {{ status }}
              </option>
            </select>
          </div>

          <!-- Brand -->
          <div class="form-group">
            <label class="form-label">Brand</label>
            <input v-model="form.brand" type="text" placeholder="Brand" class="form-input" />
          </div>

          <!-- Model -->
          <div class="form-group">
            <label class="form-label">Model</label>
            <input v-model="form.model" type="text" placeholder="Model" class="form-input" />
          </div>

          <!-- Serial Number -->
          <div class="form-group">
            <label class="form-label">Serial Number</label>
            <input v-model="form.serial" type="text" placeholder="Serial number" class="form-input" />
          </div>

          <!-- Location -->
          <div class="form-group">
            <label class="form-label">Location</label>
            <input v-model="form.location" type="text" placeholder="Location" class="form-input" />
          </div>

          <!-- Purchase Date -->
          <div class="form-group">
            <label class="form-label">Purchase Date</label>
            <input v-model="form.purchaseDate" type="date" class="form-input" />
          </div>

          <!-- Warranty End -->
          <div class="form-group">
            <label class="form-label">Warranty End</label>
            <input v-model="form.warrantyEnd" type="date" class="form-input" />
          </div>
        </div>

        <!-- File Upload -->
        <div class="form-group">
          <label class="form-label">Photos & Documents</label>
          <div class="upload-zone" @dragover.prevent @drop.prevent="handleDrop">
            <UploadCloud class="upload-icon" />
            <p class="upload-text">Drag & drop or browse</p>
            <p class="upload-hint">jpg, png, pdf, docx, xlsx up to 10MB</p>
            <input type="file" multiple class="upload-input" @change="handleFileSelect" />
          </div>
          <div v-if="files.length > 0" class="file-list">
            <div v-for="file in files" :key="file" class="file-item">
              <span class="file-name">✓ {{ file }}</span>
            </div>
          </div>
        </div>

        <!-- Error -->
        <p v-if="error" class="text-sm text-red-500">{{ error }}</p>

        <!-- Actions -->
        <div class="flex justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
          <button type="button" class="btn-cancel" @click="close">
            Cancel
          </button>
          <button type="submit" class="btn-save">
            {{ asset ? 'Save Changes' : 'Create Asset' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { X, UploadCloud } from 'lucide-vue-next'

const props = defineProps<{
  open: boolean
  asset?: any
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'save', data: any): void
}>()

const categories = ['Appliances', 'Vehicles', 'Electronics', 'Tools', 'HVAC', 'Plumbing']
const statuses = ['Active', 'UnderRepair', 'Archived', 'Disposed']

const form = ref({
  name: '',
  category: 'Appliances',
  brand: '',
  model: '',
  serial: '',
  purchaseDate: '',
  warrantyEnd: '',
  location: '',
  status: 'Active'
})

const files = ref<string[]>([])
const error = ref('')

const resetForm = () => {
  form.value = {
    name: '',
    category: 'Appliances',
    brand: '',
    model: '',
    serial: '',
    purchaseDate: '',
    warrantyEnd: '',
    location: '',
    status: 'Active'
  }
  files.value = []
  error.value = ''
}

watch(() => props.open, (isOpen) => {
  if (isOpen) {
    if (props.asset) {
      form.value = { ...props.asset }
    } else {
      resetForm()
    }
  }
})

const close = () => {
  emit('update:open', false)
}

const save = () => {
  if (!form.value.name.trim()) {
    error.value = 'Asset name is required'
    return
  }
  emit('save', { ...form.value })
  close()
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
</style>