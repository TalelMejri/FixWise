<template>
  <DashboardLayout>
    <div class="max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-4">
      <!-- Detail View -->
      <template v-if="selectedProject">
        <button
          @click="selectedProject = null"
          class="inline-flex items-center gap-1 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] mb-4 transition-colors"
        >
          <ArrowLeft class="w-4 h-4" />
          All Projects
        </button>
        <ProjectDetail
          :project="selectedProject"
          @deleted="selectedProject = null"
          @update="handleProjectUpdate"
        />
      </template>

      <!-- List View -->
      <template v-else>
        <!-- Page Header -->
        <div class="flex flex-wrap items-center justify-between gap-3 mb-4 sm:mb-6">
          <div class="flex-1 min-w-0">
            <h1 class="text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight">
              DIY Projects
            </h1>
            <p class="text-sm text-[var(--text-muted)] mt-1">
              From idea to finished job, one task at a time.
            </p>
          </div>
          <button class="btn-primary-diy" @click="showCreateModal = true">
            <Plus class="w-4 h-4" />
            New Project
          </button>
        </div>

        <!-- Projects Grid -->
        <div v-if="projects.length === 0" class="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-12 text-center">
          <p class="text-sm text-[var(--text-muted)]">No DIY projects yet.</p>
          <button class="mt-4 text-[var(--accent-primary)] hover:underline" @click="showCreateModal = true">
            Create your first project
          </button>
        </div>

        <div v-else class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div
            v-for="project in projects"
            :key="project.id"
            class="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-4 cursor-pointer hover:border-[var(--accent-primary)] transition-all hover:shadow-md"
            @click="selectedProject = project"
          >
            <div class="flex items-start justify-between gap-2">
              <p class="font-semibold text-[var(--text-primary)]">{{ project.title }}</p>
              <span class="text-xs font-semibold px-2 py-0.5 rounded-full" :class="getStatusBadgeClass(project.status)">
                {{ project.status }}
              </span>
            </div>
            <p class="mt-1 line-clamp-2 text-sm text-[var(--text-muted)]">{{ project.goal }}</p>
            <div class="mt-3 flex flex-wrap items-center gap-2">
              <span class="text-xs font-medium px-2 py-0.5 rounded-full" :class="getPriorityBadgeClass(project.priority)">
                {{ project.priority }}
              </span>
              <span class="text-xs font-medium px-2 py-0.5 rounded-full bg-[var(--bg-secondary)] text-[var(--text-muted)]">
                ${{ project.budget }}
              </span>
              <span class="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500">
                {{ project.experience }}
              </span>
            </div>
            <div class="mt-4">
              <div class="flex justify-between text-xs text-[var(--text-muted)]">
                <span>Progress</span>
                <span>{{ calculateProgress(project) }}%</span>
              </div>
              <div class="mt-1 w-full h-1.5 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                <div
                  class="h-full bg-[var(--accent-primary)] rounded-full transition-all duration-300"
                  :style="{ width: `${calculateProgress(project)}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Create Project Modal -->
        <ProjectFormModal
          :open="showCreateModal"
          @update:open="showCreateModal = $event"
          @save="handleProjectCreated"
        />
      </template>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowLeft, Plus } from 'lucide-vue-next'
import DashboardLayout from '@/components/dashboard/DashboardLayout.vue'
import ProjectDetail from '@/components/diy/ProjectDetail.vue'
import ProjectFormModal from '@/components/diy/ProjectFormModal.vue'
import { useWorkspaceStore } from '@/stores/workspace'

const { t } = useI18n()
const workspaceStore = useWorkspaceStore()

// State
const showCreateModal = ref(false)
const selectedProject = ref<any>(null)

// Computed
const projects = computed(() => workspaceStore.workspaceProjects)

// Methods
const calculateProgress = (project: any) => {
  if (!project.tasks || project.tasks.length === 0) return 0
  const completed = project.tasks.filter((t: any) => t.status === 'Completed').length
  return Math.round((completed / project.tasks.length) * 100)
}

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    Planning: 'bg-blue-500/10 text-blue-500',
    InProgress: 'bg-yellow-500/10 text-yellow-500',
    Completed: 'bg-green-500/10 text-green-500',
    OnHold: 'bg-orange-500/10 text-orange-500',
    Cancelled: 'bg-gray-500/10 text-gray-500'
  }
  return classes[status] || 'bg-gray-500/10 text-gray-500'
}

const getPriorityBadgeClass = (priority: string) => {
  const classes: Record<string, string> = {
    Low: 'bg-green-500/10 text-green-500',
    Medium: 'bg-yellow-500/10 text-yellow-500',
    High: 'bg-red-500/10 text-red-500'
  }
  return classes[priority] || 'bg-gray-500/10 text-gray-500'
}

const handleProjectCreated = () => {
  showCreateModal.value = false
}

const handleProjectUpdate = () => {
  // Refresh projects
}
</script>

<style scoped>
.btn-primary-diy {
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

.btn-primary-diy:hover {
  background: var(--accent-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(232, 122, 0, 0.3);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>