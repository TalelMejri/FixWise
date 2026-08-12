<template>
  <DashboardLayout>
    <div class="max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-4">
      <!-- Page Header -->
      <div class="flex flex-wrap items-center justify-between gap-3 mb-4 sm:mb-6">
        <div class="flex-1 min-w-0">
          <h1 class="text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight">
            Maintenance Diary
          </h1>
          <p class="text-sm text-[var(--text-muted)] mt-1">
            Every job, cost and material in one timeline.
          </p>
        </div>
        <button class="btn-primary-maintenance" @click="openCreateModal()">
          <Plus class="w-4 h-4" />
          New Log
        </button>
      </div>

      <!-- Filters -->
      <div class="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4 sm:mb-5">
        <select v-model="filters.assetId"
          class="px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-input)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
          aria-label="Filter by asset">
          <option value="all">All Assets</option>
          <option v-for="asset in assets" :key="asset.id" :value="asset.id">
            {{ asset.name }}
          </option>
        </select>

        <select v-model="filters.type"
          class="px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-input)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
          aria-label="Filter by type">
          <option value="all">All Types</option>
          <option v-for="type in logTypes" :key="type" :value="type">
            {{ type }}
          </option>
        </select>

        <select v-model="filters.status"
          class="px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-input)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
          aria-label="Filter by status">
          <option value="all">All Statuses</option>
          <option v-for="status in logStatuses" :key="status" :value="status">
            {{ status }}
          </option>
        </select>

        <input v-model="filters.fromDate" type="date"
          class="px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-input)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
          aria-label="From date" />
      </div>

      <!-- Logs List -->
      <div v-if="filteredLogs.length === 0"
        class="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-8 text-center">
        <p class="text-sm text-[var(--text-muted)]">No maintenance logs match your filters.</p>
      </div>

      <ol v-else class="relative space-y-4 border-l-2 border-[var(--border-color)] pl-6">
        <li v-for="log in filteredLogs" :key="log.id" class="relative">
          <span
            class="absolute top-6 -left-[1.65rem] w-3 h-3 rounded-full bg-[var(--accent-primary)] ring-4 ring-[var(--bg-card)]"></span>

          <div
            class="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] overflow-hidden hover:shadow-md transition-all">
            <div class="p-4 sm:p-5">
              <!-- Header - Click to expand -->
              <button class="flex w-full items-start justify-between gap-3 text-left" @click="toggleExpand(log.id)"
                :aria-expanded="expandedId === log.id">
                <div class="flex-1 min-w-0">
                  <div class="flex flex-wrap items-center gap-2">
                    <p class="font-medium text-[var(--text-primary)]">{{ log.title }}</p>
                    <span class="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500">
                      {{ log.type }}
                    </span>
                    <span class="text-xs font-medium px-2 py-0.5 rounded-full"
                      :class="getLogStatusBadgeClass(log.status)">
                      {{ log.status }}
                    </span>
                  </div>
                  <p class="mt-1 text-xs text-[var(--text-muted)]">
                    {{ getAssetName(log.assetId) }} · {{ formatDate(log.performedDate) }} · ${{ log.cost }} · {{
                      log.durationMinutes }} min
                  </p>
                </div>
                <ChevronDown class="w-5 h-5 flex-shrink-0 text-[var(--text-muted)] transition-transform duration-200"
                  :class="{ 'rotate-180': expandedId === log.id }" />
              </button>

              <!-- Expanded Content -->
              <div v-if="expandedId === log.id" class="mt-4 space-y-3 border-t border-[var(--border-color)] pt-4">
                <p v-if="log.notes" class="text-sm text-[var(--text-muted)]">{{ log.notes }}</p>

                <div v-if="log.aiSummary"
                  class="bg-[var(--accent-primary)]/5 rounded-lg px-3 py-2 text-sm text-[var(--text-muted)]">
                  🤖 {{ log.aiSummary }}
                </div>

                <div v-if="log.materials && log.materials.length > 0">
                  <p class="text-sm font-medium text-[var(--text-primary)]">Materials</p>
                  <ul class="mt-1 space-y-1 text-sm text-[var(--text-muted)]">
                    <li v-for="material in log.materials" :key="material.id">
                      {{ material.name }} — {{ material.quantity }} {{ material.unit }} × ${{ material.unitCost }} =
                      ${{ (material.quantity * material.unitCost).toFixed(2) }}
                    </li>
                  </ul>
                </div>

                <div class="flex gap-2 pt-2">
                  <button class="btn-outline-sm" @click="openEditModal(log)">
                    <Pencil class="w-4 h-4" />
                    Edit
                  </button>
                  <button class="btn-danger-sm" @click="deleteLog(log.id)">
                    <Trash2 class="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ol>

      <!-- Log Form Modal -->
      <LogFormModal :open="showModal" :log="editingLog" :asset-id="defaultAssetId" @update:open="showModal = $event"
        @save="handleLogSaved" />
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Plus, ChevronDown, Pencil, Trash2 } from 'lucide-vue-next'
import DashboardLayout from '@/components/dashboard/DashboardLayout.vue'
import LogFormModal from '@/components/maintenance/LogFormModal.vue'
import { useWorkspaceStore } from '@/stores/workspace'
import { format } from 'date-fns'

const { t } = useI18n()
const workspaceStore = useWorkspaceStore()

// Types
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

// State
const showModal = ref(false)
const editingLog = ref<any>(null)
const defaultAssetId = ref('')
const expandedId = ref<string | null>(null)

const filters = ref({
  assetId: 'all',
  type: 'all',
  status: 'all',
  fromDate: ''
})

// Computed
const assets = computed(() => workspaceStore.workspaceAssets)
const logs = computed(() => workspaceStore.workspaceLogs)

const filteredLogs = computed(() => {
  let result = logs.value

  // Filter by asset
  if (filters.value.assetId !== 'all') {
    result = result.filter(l => l.assetId === filters.value.assetId)
  }

  // Filter by type
  if (filters.value.type !== 'all') {
    result = result.filter(l => l.type === filters.value.type)
  }

  // Filter by status
  if (filters.value.status !== 'all') {
    result = result.filter(l => l.status === filters.value.status)
  }

  // Filter by date
  if (filters.value.fromDate) {
    result = result.filter(l => l.performedDate >= filters.value.fromDate)
  }

  // Sort by date (newest first)
  return result.sort((a, b) => b.performedDate.localeCompare(a.performedDate))
})

// Methods
const getAssetName = (assetId: string) => {
  const asset = assets.value.find(a => a.id === assetId)
  return asset?.name || 'Unknown Asset'
}

const getLogStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    Completed: 'bg-green-500/10 text-green-500',
    InProgress: 'bg-yellow-500/10 text-yellow-500',
    Scheduled: 'bg-blue-500/10 text-blue-500',
    Cancelled: 'bg-gray-500/10 text-gray-500'
  }
  return classes[status] || 'bg-gray-500/10 text-gray-500'
}

const formatDate = (date: string) => {
  if (!date) return 'N/A'
  try {
    return format(new Date(date), 'MMM d, yyyy')
  } catch {
    return date
  }
}

const toggleExpand = (id: string) => {
  expandedId.value = expandedId.value === id ? null : id
}

const openCreateModal = () => {
  editingLog.value = null
  defaultAssetId.value = ''
  showModal.value = true
}

const openEditModal = (log: any) => {
  editingLog.value = log
  defaultAssetId.value = log.assetId
  showModal.value = true
}

const handleLogSaved = () => {
  showModal.value = false
  editingLog.value = null
}

const deleteLog = (id: string) => {
  if (confirm('Are you sure you want to delete this maintenance log?')) {
    workspaceStore.deleteLog(id)
  }
}

// Initialize
onMounted(() => {
  // Any initialization
})
</script>

<style scoped>
.btn-primary-maintenance {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1.25rem;
  border-radius: 0.75rem;
  background: var(--accent-primary);
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.btn-primary-maintenance:hover {
  background: var(--accent-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(232, 122, 0, 0.3);
}

.btn-outline-sm {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 0.375rem 0.875rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
  background: transparent;
  color: var(--text-primary);
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-outline-sm:hover {
  background: var(--bg-secondary);
}

.btn-danger-sm {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 0.375rem 0.875rem;
  border-radius: 0.5rem;
  background: rgba(239, 68, 68, 0.08);
  color: #ef4444;
  font-size: 0.75rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-danger-sm:hover {
  background: rgba(239, 68, 68, 0.15);
}
</style>