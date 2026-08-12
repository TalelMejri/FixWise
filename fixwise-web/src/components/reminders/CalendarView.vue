<template>
  <div class="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] overflow-hidden">
    <div class="p-4 sm:p-6">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <button
          class="btn-calendar-nav"
          @click="shiftMonth(-1)"
        >
          <ChevronLeft class="w-4 h-4" />
          Previous
        </button>
        <p class="font-medium text-[var(--text-primary)]">
          {{ monthName }} {{ year }}
        </p>
        <button
          class="btn-calendar-nav"
          @click="shiftMonth(1)"
        >
          Next
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>

      <!-- Weekday Headers -->
      <div class="grid grid-cols-7 gap-1 text-center text-xs text-[var(--text-muted)]">
        <span v-for="day in weekDays" :key="day" class="py-1 font-medium">
          {{ day }}
        </span>
      </div>

      <!-- Calendar Grid -->
      <div class="mt-1 grid grid-cols-7 gap-1">
        <div
          v-for="(day, index) in calendarCells"
          :key="index"
          class="min-h-[80px] sm:min-h-[100px] rounded-lg border border-[var(--border-color)] p-1 transition-colors"
          :class="{
            'bg-[var(--accent-primary)]/5 border-[var(--accent-primary)]/30': isToday(day),
            'hover:border-[var(--accent-primary)]/50 cursor-pointer': day
          }"
          @click="day && $emit('pick', getDateKey(day))"
        >
          <div v-if="day" class="h-full">
            <span class="text-xs font-medium text-[var(--text-primary)]">{{ day }}</span>
            <div class="mt-1 flex flex-col gap-0.5">
              <div
                v-for="reminder in getRemindersForDay(day)"
                :key="reminder.id"
                class="truncate rounded px-1 py-0.5 text-[10px] leading-tight"
                :class="getReminderBadgeClass(reminder)"
                :title="reminder.title"
              >
                {{ reminder.title }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Legend -->
      <div class="mt-4 flex flex-wrap items-center gap-4 text-xs text-[var(--text-muted)]">
        <div class="flex items-center gap-1.5">
          <span class="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/30"></span>
          <span>Completed</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="w-3 h-3 rounded-full bg-blue-500/20 border border-blue-500/30"></span>
          <span>Upcoming</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/30"></span>
          <span>Overdue</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="w-3 h-3 rounded-full bg-[var(--accent-primary)]/20 border border-[var(--accent-primary)]/30"></span>
          <span>Today</span>
        </div>
      </div>

      <!-- Click hint -->
      <p class="mt-3 text-xs text-[var(--text-muted)] text-center">
        Click on a date to add a reminder
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps<{
  reminders: any[]
  today: string
}>()

const emit = defineEmits<{
  (e: 'pick', date: string): void
}>()

const now = new Date()
const currentMonth = ref(now.getMonth())
const currentYear = ref(now.getFullYear())

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const monthName = computed(() => {
  return new Date(currentYear.value, currentMonth.value, 1).toLocaleString('en', { month: 'long' })
})

const year = computed(() => currentYear.value)

const calendarCells = computed(() => {
  const first = new Date(currentYear.value, currentMonth.value, 1)
  const daysInMonth = new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
  const offset = (first.getDay() + 6) % 7 // Monday first
  
  const cells: (number | null)[] = []
  for (let i = 0; i < offset; i++) {
    cells.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    cells.push(i)
  }
  return cells
})

const isToday = (day: number | null) => {
  if (!day) return false
  const dateKey = getDateKey(day)
  return dateKey === props.today
}

const getDateKey = (day: number) => {
  return `${currentYear.value}-${String(currentMonth.value + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

const getRemindersForDay = (day: number) => {
  const dateKey = getDateKey(day)
  return props.reminders.filter(r => r.dueDate === dateKey)
}

const getReminderBadgeClass = (reminder: any) => {
  if (reminder.completed) {
    return 'bg-green-500/15 text-green-600 dark:text-green-400'
  }
  if (reminder.dueDate < props.today) {
    return 'bg-red-500/12 text-red-600 dark:text-red-400'
  }
  return 'bg-blue-500/12 text-blue-600 dark:text-blue-400'
}

const shiftMonth = (delta: number) => {
  const d = new Date(currentYear.value, currentMonth.value + delta, 1)
  currentMonth.value = d.getMonth()
  currentYear.value = d.getFullYear()
}
</script>

<style scoped>
.btn-calendar-nav {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
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

.btn-calendar-nav:hover {
  background: var(--bg-secondary);
}
</style>