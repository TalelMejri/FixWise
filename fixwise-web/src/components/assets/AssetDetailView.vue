<template>
  <DashboardLayout>
    <div class="max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-4">
      <!-- Back Button -->
      <router-link to="/assets"
        class="inline-flex items-center gap-1 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] mb-4 transition-colors">
        <ArrowLeft class="w-4 h-4" />
        Back to assets
      </router-link>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-2 border-[var(--accent-primary)] border-t-transparent">
        </div>
      </div>

      <!-- Asset Not Found -->
      <div v-else-if="!asset"
        class="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-8 text-center">
        <p class="text-[var(--text-muted)]">Asset not found.</p>
        <router-link to="/assets" class="mt-4 inline-block text-[var(--accent-primary)] hover:underline">
          Back to assets
        </router-link>
      </div>

      <!-- Asset Details -->
      <template v-else>
        <!-- Asset Header -->
        <div class="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] overflow-hidden">
          <div class="bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)] px-4 sm:px-6 py-6 sm:py-8">
            <div class="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div class="flex items-center flex-wrap gap-2">
                  <h1 class="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">{{ asset.name }}</h1>
                  <span class="text-xs font-semibold px-2 py-0.5 rounded-full"
                    :class="getStatusBadgeClass(asset.status)">
                    {{ asset.status }}
                  </span>
                </div>
                <p class="text-sm text-[var(--text-muted)] mt-1">
                  {{ asset.brand }} · {{ asset.model }} · {{ asset.location }}
                </p>
              </div>
              <div class="flex flex-wrap gap-2">
                <button class="btn-outline" @click="showEditModal = true">
                  <Pencil class="w-4 h-4" />
                  Edit
                </button>
                <button class="btn-primary-assets" @click="showLogModal = true">
                  <Plus class="w-4 h-4" />
                  Add Log
                </button>
                <button class="btn-outline" @click="showReminderModal = true">
                  <CalendarPlus class="w-4 h-4" />
                  Add Reminder
                </button>
                <button class="btn-danger" @click="deleteAsset">
                  <Trash2 class="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>

          <!-- Specs -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 sm:p-6">
            <div class="bg-[var(--bg-secondary)] rounded-xl p-3">
              <p class="text-xs text-[var(--text-muted)]">Category</p>
              <p class="text-sm font-medium text-[var(--text-primary)] mt-1">{{ asset.category }}</p>
            </div>
            <div class="bg-[var(--bg-secondary)] rounded-xl p-3">
              <p class="text-xs text-[var(--text-muted)]">Serial Number</p>
              <p class="text-sm font-medium text-[var(--text-primary)] mt-1">{{ asset.serial || 'N/A' }}</p>
            </div>
            <div class="bg-[var(--bg-secondary)] rounded-xl p-3">
              <p class="text-xs text-[var(--text-muted)]">Purchased</p>
              <p class="text-sm font-medium text-[var(--text-primary)] mt-1">{{ formatDate(asset.purchaseDate) }}</p>
            </div>
            <div class="bg-[var(--bg-secondary)] rounded-xl p-3">
              <p class="text-xs text-[var(--text-muted)]">Warranty End</p>
              <p class="text-sm font-medium text-[var(--text-primary)] mt-1">{{ formatDate(asset.warrantyEnd) }}</p>
            </div>
            <div class="bg-[var(--bg-secondary)] rounded-xl p-3">
              <p class="text-xs text-[var(--text-muted)]">Maintenance Logs</p>
              <p class="text-sm font-medium text-[var(--text-primary)] mt-1">{{ logs.length }}</p>
            </div>
            <div class="bg-[var(--bg-secondary)] rounded-xl p-3">
              <p class="text-xs text-[var(--text-muted)]">Total Spend</p>
              <p class="text-sm font-medium text-[var(--text-primary)] mt-1">${{ totalCost.toLocaleString() }}</p>
            </div>
            <div class="bg-[var(--bg-secondary)] rounded-xl p-3">
              <p class="text-xs text-[var(--text-muted)]">Average per Log</p>
              <p class="text-sm font-medium text-[var(--text-primary)] mt-1">${{ averageCost }}</p>
            </div>
            <div class="bg-[var(--bg-secondary)] rounded-xl p-3">
              <p class="text-xs text-[var(--text-muted)]">Open Reminders</p>
              <p class="text-sm font-medium text-[var(--text-primary)] mt-1">{{ reminders.length }}</p>
            </div>
          </div>
        </div>

        <!-- Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
          <!-- Timeline -->
          <div class="lg:col-span-2 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-4 sm:p-6">
            <h3 class="text-sm font-semibold text-[var(--text-primary)] mb-4">Maintenance Timeline</h3>
            <div v-if="logs.length === 0" class="text-center py-8">
              <p class="text-sm text-[var(--text-muted)]">No maintenance recorded yet.</p>
              <button class="mt-4 btn-primary-assets" @click="showLogModal = true">
                <Plus class="w-4 h-4" />
                Add First Log
              </button>
            </div>
            <div v-else class="relative space-y-6 border-l-2 border-[var(--border-color)] pl-6 ml-2">
              <div v-for="log in logs" :key="log.id" class="relative">
                <div
                  class="absolute -left-[1.65rem] top-1.5 w-3 h-3 rounded-full bg-[var(--accent-primary)] ring-4 ring-[var(--bg-card)]">
                </div>
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
                <p class="text-xs text-[var(--text-muted)] mt-1">
                  {{ formatDate(log.performedDate) }} · ${{ log.cost }} · {{ log.durationMinutes }} min
                </p>
                <p v-if="log.notes" class="text-sm text-[var(--text-muted)] mt-1">{{ log.notes }}</p>
                <div v-if="log.aiSummary"
                  class="mt-2 bg-[var(--accent-primary)]/5 rounded-lg px-3 py-2 text-sm text-[var(--text-muted)]">
                  🤖 {{ log.aiSummary }}
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="space-y-4">
            <!-- Reminders -->
            <div class="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-4 sm:p-6">
              <h3 class="text-sm font-semibold text-[var(--text-primary)] mb-3">Upcoming Reminders</h3>
              <div v-if="reminders.length === 0" class="text-center py-4">
                <p class="text-sm text-[var(--text-muted)]">Nothing scheduled.</p>
                <button class="mt-2 text-xs text-[var(--accent-primary)] hover:underline"
                  @click="showReminderModal = true">
                  Add Reminder
                </button>
              </div>
              <div v-for="reminder in reminders" :key="reminder.id"
                class="flex items-center justify-between border border-[var(--border-color)] rounded-lg p-3 mb-2 last:mb-0">
                <div>
                  <p class="text-sm font-medium text-[var(--text-primary)]">{{ reminder.title }}</p>
                  <p class="text-xs text-[var(--text-muted)]">Due {{ formatDate(reminder.dueDate) }}</p>
                </div>
                <span class="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500">
                  {{ reminder.frequencyType }}
                </span>
              </div>
            </div>

            <!-- AI Recommendations -->
            <div class="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-4 sm:p-6">
              <h3 class="text-sm font-semibold text-[var(--text-primary)] mb-3">🤖 AI Recommendations</h3>
              <div v-if="recommendations.length === 0" class="text-center py-4">
                <p class="text-sm text-[var(--text-muted)]">No recommendations right now.</p>
              </div>
              <div v-for="rec in recommendations" :key="rec.id"
                class="border border-[var(--border-color)] rounded-lg p-3 mb-2 last:mb-0">
                <div class="flex items-start justify-between gap-2">
                  <p class="text-sm font-medium text-[var(--text-primary)]">{{ rec.title }}</p>
                  <span class="text-xs font-semibold px-2 py-0.5 rounded-full"
                    :class="getUrgencyBadgeClass(rec.urgency)">
                    {{ rec.urgency }}
                  </span>
                </div>
                <p class="text-sm text-[var(--text-muted)] mt-1">{{ rec.action }}</p>
              </div>
              <p class="text-xs text-[var(--text-muted)] mt-2">AI-generated, informational only.</p>
            </div>

            <!-- Related DIY Projects -->
            <div class="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-4 sm:p-6">
              <h3 class="text-sm font-semibold text-[var(--text-primary)] mb-3">Related DIY Projects</h3>
              <div v-if="projects.length === 0" class="text-center py-4">
                <p class="text-sm text-[var(--text-muted)]">No linked projects.</p>
              </div>
              <router-link v-for="project in projects" :key="project.id" to="/diy"
                class="block border border-[var(--border-color)] rounded-lg p-3 mb-2 last:mb-0 hover:bg-[var(--bg-secondary)] transition-colors">
                <p class="text-sm font-medium text-[var(--text-primary)]">{{ project.title }}</p>
              </router-link>
            </div>
          </div>
        </div>
      </template>

      <!-- Modals -->
      <AssetFormModal v-if="asset" :open="showEditModal" :asset="asset" @update:open="showEditModal = $event"
        @save="handleAssetUpdated" />

      <LogFormModal :open="showLogModal" :asset-id="asset?.id" @update:open="showLogModal = $event"
        @save="handleLogAdded" />

      <ReminderFormModal :open="showReminderModal" :asset-id="asset?.id" @update:open="showReminderModal = $event"
        @save="handleReminderAdded" />
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
  ArrowLeft,
  Pencil,
  Plus,
  CalendarPlus,
  Trash2
} from 'lucide-vue-next'
import DashboardLayout from '@/components/dashboard/DashboardLayout.vue'
import AssetFormModal from '@/components/assets/AssetFormModal.vue'
import LogFormModal from '@/components/maintenance/LogFormModal.vue'
import ReminderFormModal from '@/components/reminders/ReminderFormModal.vue'
import { useWorkspaceStore } from '@/stores/workspace'
import { format } from 'date-fns'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const workspaceStore = useWorkspaceStore()

const assetId = computed(() => route.params.id as string)
const loading = ref(false)

// State
const showEditModal = ref(false)
const showLogModal = ref(false)
const showReminderModal = ref(false)

// Get asset from store
const asset = computed(() => {
  return workspaceStore.getAsset(assetId.value)
})

// Get related data from store
const logs = computed(() => {
  return workspaceStore.getLogsForAsset(assetId.value)
    .sort((a, b) => b.performedDate.localeCompare(a.performedDate))
})

const reminders = computed(() => {
  return workspaceStore.getRemindersForAsset(assetId.value)
    .filter(r => !r.completed)
})

// FIX: Access recommendations correctly
const recommendations = computed(() => {
  // Get all workspace recommendations and filter by assetId
  const allRecommendations = workspaceStore.workspaceRecommendations
  return allRecommendations.filter(r => r.assetId === assetId.value)
})

const projects = computed(() => {
  const workspaceProjects = workspaceStore.workspaceProjects
  return workspaceProjects.filter(p => p.assetId === assetId.value)
})

const totalCost = computed(() => {
  return logs.value.reduce((sum, l) => sum + l.cost, 0)
})

const averageCost = computed(() => {
  if (logs.value.length === 0) return 0
  return Math.round(totalCost.value / logs.value.length)
})

// Methods
const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    Active: 'bg-green-500/10 text-green-500',
    UnderRepair: 'bg-yellow-500/10 text-yellow-500',
    Archived: 'bg-gray-500/10 text-gray-500',
    Disposed: 'bg-red-500/10 text-red-500'
  }
  return classes[status] || 'bg-gray-500/10 text-gray-500'
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

const getUrgencyBadgeClass = (urgency: string) => {
  const classes: Record<string, string> = {
    Low: 'bg-green-500/10 text-green-500',
    Medium: 'bg-yellow-500/10 text-yellow-500',
    High: 'bg-orange-500/10 text-orange-500',
    Critical: 'bg-red-500/10 text-red-500'
  }
  return classes[urgency] || 'bg-gray-500/10 text-gray-500'
}

const formatDate = (date: string) => {
  if (!date) return 'N/A'
  try {
    return format(new Date(date), 'MMM d, yyyy')
  } catch {
    return date
  }
}

const handleAssetUpdated = (updatedAsset: any) => {
  workspaceStore.updateAsset(assetId.value, updatedAsset)
}

const handleLogAdded = (newLog: any) => {
  workspaceStore.addLog({
    ...newLog,
    workspaceId: workspaceStore.currentWorkspaceId,
    assetId: assetId.value
  })
}

const handleReminderAdded = (newReminder: any) => {
  workspaceStore.addReminder({
    ...newReminder,
    workspaceId: workspaceStore.currentWorkspaceId,
    assetId: assetId.value,
    completed: false
  })
}

const deleteAsset = () => {
  if (confirm(`Are you sure you want to delete "${asset.value?.name}"?`)) {
    workspaceStore.deleteAsset(assetId.value)
    router.push('/assets')
  }
}

// Initialize
onMounted(() => {
  loading.value = false
})
</script>

<style scoped>
.btn-primary-assets {
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

.btn-primary-assets:hover {
  background: var(--accent-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(232, 122, 0, 0.3);
}

.btn-outline {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1.25rem;
  border-radius: 0.75rem;
  border: 1px solid var(--border-color);
  background: transparent;
  color: var(--text-primary);
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.btn-outline:hover {
  background: var(--bg-secondary);
}

.btn-danger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1.25rem;
  border-radius: 0.75rem;
  background: #ef4444;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.btn-danger:hover {
  background: #dc2626;
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
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