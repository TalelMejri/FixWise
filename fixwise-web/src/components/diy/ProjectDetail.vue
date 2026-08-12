<template>
    <div>
        <!-- Header -->
        <div class="flex flex-wrap items-start justify-between gap-3 mb-6">
            <div>
                <div class="flex items-center flex-wrap gap-2">
                    <h1 class="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">{{ project.title }}
                    </h1>
                    <span class="text-xs font-semibold px-2 py-0.5 rounded-full"
                        :class="getStatusBadgeClass(project.status)">
                        {{ project.status }}
                    </span>
                    <span class="text-xs font-semibold px-2 py-0.5 rounded-full"
                        :class="getPriorityBadgeClass(project.priority)">
                        {{ project.priority }}
                    </span>
                </div>
                <p class="mt-1 text-sm text-[var(--text-muted)]">{{ project.goal }}</p>
            </div>
            <div class="flex flex-wrap gap-2">
                <select v-model="project.status"
                    class="px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-input)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                    @change="updateStatus">
                    <option v-for="status in statuses" :key="status" :value="status">
                        {{ status }}
                    </option>
                </select>
                <button class="btn-danger" @click="deleteProject">
                    <Trash2 class="w-4 h-4" />
                    Delete
                </button>
            </div>
        </div>

        <!-- Content Grid -->
        <div class="grid gap-4 lg:grid-cols-3">
            <!-- Tasks -->
            <div class="lg:col-span-2 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-4 sm:p-6">
                <h3 class="text-sm font-semibold text-[var(--text-primary)] mb-4">Tasks</h3>

                <!-- Progress -->
                <div class="mb-4">
                    <div class="flex justify-between text-xs text-[var(--text-muted)]">
                        <span>Progress</span>
                        <span>{{ progress }}%</span>
                    </div>
                    <div class="mt-1 w-full h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                        <div class="h-full bg-[var(--accent-primary)] rounded-full transition-all duration-300"
                            :style="{ width: `${progress}%` }"></div>
                    </div>
                </div>

                <!-- Task List -->
                <ul class="space-y-2">
                    <li v-for="(task, index) in project.tasks" :key="task.id" draggable="true"
                        class="flex items-center gap-2 rounded-lg border border-[var(--border-color)] p-3 hover:bg-[var(--bg-secondary)] transition-colors"
                        @dragstart="dragStart(Number(index))" @dragover.prevent @drop="dropTask(Number(index))">
                        <GripVertical class="w-4 h-4 shrink-0 cursor-grab text-[var(--text-muted)]" />
                        <button class="flex-1 text-left text-sm" @click="toggleTask(task.id)">
                            <span :class="{ 'line-through opacity-60': task.status === 'Completed' }">
                                {{ task.title }}
                            </span>
                            <span v-if="task.completedAt" class="ml-2 text-xs text-[var(--text-muted)]">
                                done {{ formatDate(task.completedAt) }}
                            </span>
                        </button>
                        <span class="text-xs font-medium px-2 py-0.5 rounded-full"
                            :class="getTaskStatusBadgeClass(task.status)">
                            {{ task.status }}
                        </span>
                        <button class="btn-remove-task" @click="removeTask(task.id)">
                            <X class="w-4 h-4" />
                        </button>
                    </li>
                </ul>

                <!-- Add Task -->
                <div class="mt-3 flex gap-2">
                    <input v-model="newTaskTitle" type="text" placeholder="Add a task"
                        class="flex-1 px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-input)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                        @keyup.enter="addTask" />
                    <button class="btn-add-task" @click="addTask">
                        Add
                    </button>
                </div>
            </div>

            <!-- AI Plan -->
            <div class="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-4 sm:p-6">
                <h3 class="text-sm font-semibold text-[var(--text-primary)] mb-3">🤖 AI Plan</h3>
                <p class="text-sm text-[var(--text-muted)]">
                    {{ project.aiPlan || 'No plan generated yet.' }}
                </p>
                <button class="btn-ai-plan w-full mt-3" @click="generatePlan">
                    <Sparkles class="w-4 h-4" />
                    Regenerate Plan
                </button>
                <p class="text-xs text-[var(--text-muted)] mt-2">AI-generated, informational only.</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { GripVertical, Trash2, X, Sparkles } from 'lucide-vue-next'
import { useWorkspaceStore } from '@/stores/workspace'
import { format } from 'date-fns'

const props = defineProps<{
    project: any
}>()

const emit = defineEmits<{
    (e: 'deleted'): void
    (e: 'update'): void
}>()

const workspaceStore = useWorkspaceStore()

// State
const newTaskTitle = ref('')
const dragIndex = ref<number | null>(null)

// Statuses
const statuses = ['Planning', 'InProgress', 'Completed', 'OnHold', 'Cancelled']

// Computed
const progress = computed(() => {
    const tasks = props.project.tasks || []
    if (tasks.length === 0) return 0
    const completed = tasks.filter((t: any) => t.status === 'Completed').length
    return Math.round((completed / tasks.length) * 100)
})

// Methods
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

const getTaskStatusBadgeClass = (status: string) => {
    const classes: Record<string, string> = {
        Pending: 'bg-gray-500/10 text-gray-500',
        InProgress: 'bg-yellow-500/10 text-yellow-500',
        Completed: 'bg-green-500/10 text-green-500'
    }
    return classes[status] || 'bg-gray-500/10 text-gray-500'
}

const formatDate = (date: string) => {
    if (!date) return ''
    try {
        return format(new Date(date), 'MMM d, yyyy')
    } catch {
        return date
    }
}

// ============================================
// FIX: Type-safe drag and drop methods
// ============================================

// FIX 1: Convert index to number explicitly
const dragStart = (index: number) => {
    dragIndex.value = index
}

// FIX 2: Ensure index is a number before using
const dropTask = (index: number) => {
    // Check if dragIndex is valid
    if (dragIndex.value === null || dragIndex.value === index) {
        dragIndex.value = null
        return
    }

    // Now TypeScript knows dragIndex.value is a number
    const tasks = [...props.project.tasks]
    const [moved] = tasks.splice(dragIndex.value, 1)
    tasks.splice(index, 0, moved)

    // Update the project with reordered tasks
    dragIndex.value = null
    emit('update')
}

// FIX 3: Use Number() on index in the template
// @dragstart="dragStart(Number(index))"
// @drop="dropTask(Number(index))"

// ============================================
// Other methods
// ============================================

const updateStatus = () => {
    emit('update')
}

const toggleTask = (taskId: string) => {
    const task = props.project.tasks.find((t: any) => t.id === taskId)
    if (!task) return

    let newStatus = 'Pending'
    let completedAt = null

    if (task.status === 'Pending') {
        newStatus = 'InProgress'
    } else if (task.status === 'InProgress') {
        newStatus = 'Completed'
        completedAt = new Date().toISOString().split('T')[0]
    } else {
        newStatus = 'Pending'
    }

    const updatedTasks = props.project.tasks.map((t: any) =>
        t.id === taskId ? { ...t, status: newStatus, completedAt } : t
    )

    emit('update')
}

const addTask = () => {
    if (!newTaskTitle.value.trim()) return

    const newTask = {
        id: `task-${Date.now()}`,
        title: newTaskTitle.value.trim(),
        status: 'Pending' as const
    }

    const updatedTasks = [...props.project.tasks, newTask]
    newTaskTitle.value = ''
    emit('update')
}

const removeTask = (taskId: string) => {
    const updatedTasks = props.project.tasks.filter((t: any) => t.id !== taskId)
    emit('update')
}

const generatePlan = () => {
    const plan = `Plan for "${props.project.title}" (${props.project.experience} level, $${props.project.budget} budget): gather tools, prepare the work area, complete the build in stages, then inspect and clean up. Wear eye protection and stop if any step needs electrical or gas work.`

    emit('update')
}

const deleteProject = () => {
    if (confirm(`Are you sure you want to delete "${props.project.title}"?`)) {
        emit('deleted')
    }
}
</script>

<style scoped>
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

.btn-remove-task {
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

.btn-remove-task:hover {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
}

.btn-add-task {
    padding: 0.5rem 1rem;
    border-radius: 0.75rem;
    background: var(--accent-primary);
    color: white;
    font-weight: 500;
    font-size: 0.875rem;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
}

.btn-add-task:hover {
    background: var(--accent-hover);
}

.btn-ai-plan {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 0.75rem;
    border: 1px solid var(--border-color);
    background: transparent;
    color: var(--text-primary);
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    width: 100%;
}

.btn-ai-plan:hover {
    background: var(--bg-secondary);
}
</style>