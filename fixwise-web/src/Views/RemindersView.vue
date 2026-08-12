<template>
  <DashboardLayout>
    <div class="max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-4">
      <!-- Page Header -->
      <div class="flex flex-wrap items-center justify-between gap-3 mb-4 sm:mb-6">
        <div class="flex-1 min-w-0">
          <h1 class="text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight">
            Reminders
          </h1>
          <p class="text-sm text-[var(--text-muted)] mt-1">
            Stay ahead of every service interval.
          </p>
        </div>
        <button class="btn-primary-reminders" @click="openCreateModal()">
          <Plus class="w-4 h-4" />
          New Reminder
        </button>
      </div>

      <!-- Tabs -->
      <div class="mb-4">
        <div class="flex flex-wrap gap-2 border-b border-[var(--border-color)]">
          <button v-for="tab in tabs" :key="tab.key" class="px-4 py-2 text-sm font-medium transition-colors relative"
            :class="[
              activeTab === tab.key
                ? 'text-[var(--accent-primary)] border-b-2 border-[var(--accent-primary)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            ]" @click="activeTab = tab.key">
            {{ tab.label }}
            <span v-if="tab.count !== undefined"
              class="ml-1.5 text-xs bg-[var(--bg-secondary)] px-2 py-0.5 rounded-full">
              {{ tab.count }}
            </span>
          </button>
        </div>
      </div>

      <!-- Content -->
      <div v-if="activeTab === 'calendar'">
        <CalendarView :reminders="allReminders" :today="today" @pick="openCreateModalWithDate" />
      </div>

      <div v-else>
        <ReminderList :items="filteredReminders" @edit="openEditModal" @delete="deleteReminder"
          @complete="completeReminder" />
      </div>

      <!-- Reminder Form Modal -->
      <ReminderFormModal :open="showModal" :reminder="editingReminder" :asset-id="defaultAssetId" :due-date="presetDate"
        @update:open="showModal = $event" @save="handleReminderSaved" />
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Plus } from 'lucide-vue-next'
import DashboardLayout from '@/components/dashboard/DashboardLayout.vue'
import ReminderFormModal from '@/components/reminders/ReminderFormModal.vue'
import ReminderList from '@/components/reminders/ReminderList.vue'
import CalendarView from '@/components/reminders/CalendarView.vue'
import { useWorkspaceStore } from '@/stores/workspace'

const { t } = useI18n()
const workspaceStore = useWorkspaceStore()

// State
const showModal = ref(false)
const editingReminder = ref<any>(null)
const defaultAssetId = ref('')
const presetDate = ref('')
const activeTab = ref('upcoming')
const today = new Date().toISOString().slice(0, 10)

// Computed
const allReminders = computed(() => workspaceStore.workspaceReminders)

const upcomingReminders = computed(() => {
  return allReminders.value.filter(r => !r.completed && r.dueDate >= today)
})

const overdueReminders = computed(() => {
  return allReminders.value.filter(r => !r.completed && r.dueDate < today)
})

const completedReminders = computed(() => {
  return allReminders.value.filter(r => r.completed)
})

const filteredReminders = computed(() => {
  switch (activeTab.value) {
    case 'upcoming': return upcomingReminders.value
    case 'overdue': return overdueReminders.value
    case 'completed': return completedReminders.value
    default: return allReminders.value
  }
})

const tabs = computed(() => [
  { key: 'upcoming', label: 'Upcoming', count: upcomingReminders.value.length },
  { key: 'overdue', label: 'Overdue', count: overdueReminders.value.length },
  { key: 'all', label: 'All', count: allReminders.value.length },
  { key: 'completed', label: 'Completed', count: completedReminders.value.length },
  { key: 'calendar', label: 'Calendar' }
])

// Methods
const openCreateModal = () => {
  editingReminder.value = null
  defaultAssetId.value = ''
  presetDate.value = ''
  showModal.value = true
}

const openCreateModalWithDate = (date: string) => {
  editingReminder.value = null
  defaultAssetId.value = ''
  presetDate.value = date
  showModal.value = true
}

const openEditModal = (reminder: any) => {
  editingReminder.value = reminder
  defaultAssetId.value = reminder.assetId
  presetDate.value = ''
  showModal.value = true
}

const handleReminderSaved = () => {
  showModal.value = false
  editingReminder.value = null
  presetDate.value = ''
}

const completeReminder = (id: string) => {
  workspaceStore.completeReminder(id)
}

const deleteReminder = (id: string) => {
  if (confirm('Are you sure you want to delete this reminder?')) {
    workspaceStore.deleteReminder(id)
  }
}

// Initialize
onMounted(() => {
  // Any initialization
})
</script>

<style scoped>
.btn-primary-reminders {
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

.btn-primary-reminders:hover {
  background: var(--accent-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(232, 122, 0, 0.3);
}
</style>