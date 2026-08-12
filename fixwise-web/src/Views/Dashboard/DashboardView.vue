<template>
    <DashboardLayout>
        <div class="max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-4">
            <!-- Page Header -->
            <div class="flex flex-wrap items-center justify-between gap-3 mb-4 sm:mb-6">
                <div class="flex-1 min-w-0">
                    <h1 class="text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight">
                        Hi {{ userName }}, here's your workspace
                    </h1>
                    <p class="text-sm text-[var(--text-muted)] mt-1">
                        {{ currentWorkspace.name || 'My Home' }} · {{ currentWorkspace.type || 'Personal' }}
                    </p>
                </div>
                <router-link to="/assets" class="flex-shrink-0 w-full sm:w-auto">
                    <button
                        class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-[var(--accent-primary)] text-white font-semibold text-sm hover:bg-[var(--accent-hover)] transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-[var(--accent-primary)]/30">
                        <Plus class="w-4 h-4" />
                        <span>Manage Assets</span>
                    </button>
                </router-link>
            </div>

            <!-- KPI Cards -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div v-for="kpi in kpis" :key="kpi.label"
                    class="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-3 sm:p-4 hover:shadow-md transition-all">
                    <div class="flex items-start justify-between gap-2">
                        <div class="flex-1 min-w-0">
                            <p class="text-xs sm:text-sm text-[var(--text-muted)]">{{ kpi.label }}</p>
                            <p class="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mt-1">{{ kpi.value }}</p>
                            <p class="text-xs text-[var(--text-muted)] mt-1 flex items-center gap-1">
                                <TrendingUp class="w-3 h-3" />
                                {{ kpi.hint }}
                            </p>
                        </div>
                        <div
                            class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] flex items-center justify-center flex-shrink-0">
                            <component :is="kpi.icon" class="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Charts Row -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <!-- Cost by Category - Bar Chart -->
                <div
                    class="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-3 sm:p-5 hover:shadow-md transition-all">
                    <div class="flex items-center justify-between mb-3">
                        <h3 class="text-sm sm:text-base font-semibold text-[var(--text-primary)]">📊 Cost by Category
                        </h3>
                    </div>
                    <div class="h-[200px] sm:h-[250px] w-full">
                        <BarChart :labels="byCategory.map(d => d.name)" :datasets="[{
                            label: 'Cost',
                            data: byCategory.map(d => d.value),
                            backgroundColor: ['#e87a00', '#f58a1a', '#ff9a2a', '#ffb347', '#ffcc66']
                        }]" />
                    </div>
                </div>

                <!-- Logs by Type - Pie Chart -->
                <div
                    class="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-3 sm:p-5 hover:shadow-md transition-all">
                    <div class="flex items-center justify-between mb-3">
                        <h3 class="text-sm sm:text-base font-semibold text-[var(--text-primary)]">📈 Logs by Type</h3>
                    </div>
                    <div class="h-[200px] sm:h-[250px] w-full">
                        <PieChart :labels="byType.map(d => d.name)" :data="byType.map(d => d.value)"
                            :colors="['#e87a00', '#f58a1a', '#ff9a2a', '#ffb347', '#ffcc66']" />
                    </div>
                </div>
            </div>

            <!-- Bottom Row -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <!-- Cost Trend - Line Chart -->
                <div
                    class="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-3 sm:p-5 hover:shadow-md transition-all">
                    <div class="flex items-center justify-between mb-3">
                        <h3 class="text-sm sm:text-base font-semibold text-[var(--text-primary)]">📉 Cost Trend</h3>
                    </div>
                    <div class="h-[180px] sm:h-[220px] w-full">
                        <LineChart :labels="trend.map(d => d.date)" :datasets="[{
                            label: 'Cost',
                            data: trend.map(d => d.cost),
                            borderColor: '#e87a00',
                            backgroundColor: 'rgba(232, 122, 0, 0.1)',
                            fill: true
                        }]" />
                    </div>
                </div>

                <!-- Recent Activity -->
                <div
                    class="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-3 sm:p-5 hover:shadow-md transition-all flex flex-col">
                    <div class="flex items-center justify-between mb-3">
                        <h3 class="text-sm sm:text-base font-semibold text-[var(--text-primary)]">🕐 Recent Activity
                        </h3>
                        <router-link to="/maintenance"
                            class="text-xs sm:text-sm text-[var(--accent-primary)] hover:underline">
                            View All →
                        </router-link>
                    </div>
                    <div class="flex-1 overflow-y-auto max-h-[220px] sm:max-h-[300px] space-y-2">
                        <div v-for="log in recentLogs" :key="log.id"
                            class="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-secondary)] transition-all">
                            <div class="flex-shrink-0">
                                <span
                                    class="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[var(--accent-primary)]/10 flex items-center justify-center text-sm sm:text-base">
                                    {{ getActivityIcon(log.type) }}
                                </span>
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-xs sm:text-sm font-medium text-[var(--text-primary)] truncate">{{
                                    log.title }}</p>
                                <p class="text-[10px] sm:text-xs text-[var(--text-muted)] truncate">
                                    {{ getAssetName(log.assetId) }} · {{ formatDate(log.performedAt) }}
                                </p>
                            </div>
                            <span
                                class="text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex-shrink-0"
                                :class="getStatusClass(log.status)">
                                {{ log.status }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- AI Recommendations -->
            <div
                class="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-3 sm:p-5 hover:shadow-md transition-all">
                <div class="flex items-center flex-wrap justify-between gap-2 mb-4">
                    <h3 class="text-sm sm:text-base font-semibold text-[var(--text-primary)]">🤖 AI Recommendations</h3>
                    <span
                        class="text-[10px] sm:text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded-full bg-purple-500/10 text-purple-500">
                        AI-Generated
                    </span>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div v-for="rec in recommendations" :key="rec.id"
                        class="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] p-3 sm:p-4 hover:shadow-md transition-all">
                        <div class="flex items-start justify-between gap-2">
                            <p class="text-xs sm:text-sm font-medium text-[var(--text-primary)]">{{ rec.title }}</p>
                            <span
                                class="text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 rounded-full flex-shrink-0"
                                :class="getUrgencyClass(rec.urgency)">
                                {{ rec.urgency }}
                            </span>
                        </div>
                        <p class="text-[11px] sm:text-sm text-[var(--text-muted)] mt-1 leading-relaxed">{{
                            rec.description }}</p>
                        <p class="text-[11px] sm:text-sm text-[var(--text-muted)] mt-1">
                            <span class="font-medium text-[var(--text-primary)]">Action:</span> {{ rec.action }}
                        </p>
                        <div v-if="rec.urgency === 'High' || rec.urgency === 'Critical'"
                            class="mt-2 p-2 rounded-lg bg-red-500/10 text-red-500 text-[10px] sm:text-xs">
                            ⚠️ Consult a qualified professional before attempting this yourself.
                        </div>
                        <button
                            class="w-full mt-3 px-3 py-1.5 sm:py-2 rounded-lg border border-[var(--border-color)] bg-transparent text-[var(--text-primary)] text-[11px] sm:text-sm font-medium hover:bg-[var(--accent-primary)]/5 hover:border-[var(--accent-primary)] transition-all"
                            @click="convertToLog(rec)">
                            Convert to maintenance log
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
    Boxes,
    ClipboardList,
    AlertTriangle,
    CircleDollarSign,
    Plus,
    TrendingUp
} from 'lucide-vue-next'
import DashboardLayout from '@/components/dashboard/DashboardLayout.vue'
import BarChart from '@/components/charts/BarChart.vue'
import PieChart from '@/components/charts/PieChart.vue'
import LineChart from '@/components/charts/LineChart.vue'
import { useWorkspaceStore } from '@/stores/workspace'
import { format } from 'date-fns'

const { t } = useI18n()
const workspaceStore = useWorkspaceStore()

// User
const userName = computed(() => workspaceStore.user?.name || 'User')
const currentWorkspace = computed(() => workspaceStore.currentWorkspace || { name: 'My Home', type: 'Personal' })

// Mock Data (replace with real store data)
const assets = ref([
    { id: '1', name: 'Samsung Washing Machine', category: 'Appliances', status: 'Active' },
    { id: '2', name: 'Renault Clio', category: 'Vehicles', status: 'Active' },
    { id: '3', name: 'Daikin AC', category: 'HVAC', status: 'UnderRepair' },
    { id: '4', name: 'LG Refrigerator', category: 'Appliances', status: 'Active' },
    { id: '5', name: 'BMW 320i', category: 'Vehicles', status: 'Active' }
])

const logs = ref([
    { id: '1', title: 'Oil Change', assetId: '2', type: 'Preventive', status: 'Completed', cost: 120, performedAt: '2024-03-15' },
    { id: '2', title: 'Filter Cleaning', assetId: '1', type: 'Cleaning', status: 'Completed', cost: 45, performedAt: '2024-03-10' },
    { id: '3', title: 'AC Service', assetId: '3', type: 'Corrective', status: 'InProgress', cost: 200, performedAt: '2024-03-05' },
    { id: '4', title: 'Tyre Check', assetId: '2', type: 'Inspection', status: 'Scheduled', cost: 80, performedAt: '2024-03-01' },
    { id: '5', title: 'Refrigerator Defrost', assetId: '4', type: 'Maintenance', status: 'Completed', cost: 60, performedAt: '2024-02-28' }
])

const reminders = ref([
    { id: '1', title: 'Oil Change', dueDate: '2024-04-15', completed: false },
    { id: '2', title: 'Filter Cleaning', dueDate: '2024-03-20', completed: false },
    { id: '3', title: 'AC Service', dueDate: '2024-02-20', completed: false }
])

const recommendations = ref([
    {
        id: '1',
        title: 'Washing Machine Filter',
        description: 'Clean the filter and check hoses for wear.',
        urgency: 'Medium',
        action: 'Schedule cleaning'
    },
    {
        id: '2',
        title: 'Car Oil Change Due',
        description: 'Your Renault Clio is due for an oil change.',
        urgency: 'High',
        action: 'Book service'
    },
    {
        id: '3',
        title: 'AC Filter Replacement',
        description: 'Replace the air conditioner filter.',
        urgency: 'Low',
        action: 'Order filter'
    }
])

// Computed
const totalAssets = computed(() => assets.value.length)
const activeAssets = computed(() => assets.value.filter(a => a.status === 'Active').length)
const totalLogs = computed(() => logs.value.length)
const totalCost = computed(() => logs.value.reduce((sum, l) => sum + l.cost, 0))
const upcomingReminders = computed(() => reminders.value.filter(r => !r.completed).length)
const overdueReminders = computed(() => {
    const today = new Date().toISOString().slice(0, 10)
    return reminders.value.filter(r => !r.completed && r.dueDate < today).length
})

const kpis = computed(() => [
    {
        icon: Boxes,
        label: 'Total Assets',
        value: totalAssets.value.toString(),
        hint: `${activeAssets.value} active`
    },
    {
        icon: ClipboardList,
        label: 'Maintenance Logs',
        value: totalLogs.value.toString(),
        hint: '+2 vs last month'
    },
    {
        icon: AlertTriangle,
        label: 'Upcoming Reminders',
        value: upcomingReminders.value.toString(),
        hint: overdueReminders.value ? `${overdueReminders.value} overdue` : 'Nothing overdue'
    },
    {
        icon: CircleDollarSign,
        label: 'Maintenance Cost',
        value: `$${totalCost.value.toLocaleString()}`,
        hint: 'All-time recorded'
    }
])

const byCategory = computed(() => {
    const cats: Record<string, number> = {}
    logs.value.forEach(log => {
        const asset = assets.value.find(a => a.id === log.assetId)
        if (asset) {
            cats[asset.category] = (cats[asset.category] || 0) + log.cost
        }
    })
    return Object.entries(cats).map(([name, value]) => ({ name, value }))
})

const byType = computed(() => {
    const types: Record<string, number> = {}
    logs.value.forEach(log => {
        types[log.type] = (types[log.type] || 0) + 1
    })
    return Object.entries(types).map(([name, value]) => ({ name, value }))
})

const trend = computed(() => {
    return logs.value
        .sort((a, b) => a.performedAt.localeCompare(b.performedAt))
        .reduce((acc, l) => {
            const month = l.performedAt.slice(0, 7)
            const last = acc[acc.length - 1]
            if (last && last.date === month) {
                last.cost += l.cost
            } else {
                acc.push({ date: month, cost: l.cost })
            }
            return acc
        }, [] as Array<{ date: string; cost: number }>)
})

const recentLogs = computed(() => {
    return logs.value
        .sort((a, b) => b.performedAt.localeCompare(a.performedAt))
        .slice(0, 5)
})

// Methods
const getAssetName = (assetId: string) => {
    const asset = assets.value.find(a => a.id === assetId)
    return asset?.name || 'Unknown'
}

const getActivityIcon = (type: string) => {
    const icons: Record<string, string> = {
        Preventive: '🔧',
        Corrective: '🛠️',
        Inspection: '🔍',
        Cleaning: '🧹',
        Maintenance: '📝'
    }
    return icons[type] || '📝'
}

const getStatusClass = (status: string) => {
    const classes: Record<string, string> = {
        Completed: 'bg-green-500/10 text-green-500',
        InProgress: 'bg-yellow-500/10 text-yellow-500',
        Scheduled: 'bg-blue-500/10 text-blue-500',
        Cancelled: 'bg-gray-500/10 text-gray-500'
    }
    return classes[status] || 'bg-gray-500/10 text-gray-500'
}

const getUrgencyClass = (urgency: string) => {
    const classes: Record<string, string> = {
        Low: 'bg-green-500/10 text-green-500',
        Medium: 'bg-yellow-500/10 text-yellow-500',
        High: 'bg-orange-500/10 text-orange-500',
        Critical: 'bg-red-500/10 text-red-500'
    }
    return classes[urgency] || 'bg-gray-500/10 text-gray-500'
}

const formatDate = (date: string) => {
    try {
        return format(new Date(date), 'MMM d, yyyy')
    } catch {
        return date
    }
}

const convertToLog = (rec: any) => {
    console.log('Converting recommendation:', rec)
}
</script>