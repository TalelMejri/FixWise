import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
    WORKSPACES,
    ASSETS,
    LOGS,
    REMINDERS,
    PROJECTS,
    RECOMMENDATIONS,
    NOTIFICATIONS
} from '@/types/index'
import type {
    Workspace,
    Asset,
    MaintenanceLog,
    Reminder,
    DiyProject,
    Recommendation,
    AppNotification,
} from '@/types'

export const useWorkspaceStore = defineStore('workspace', () => {
    // ============ STATE ============

    // Workspaces - from mock data
    const workspaces = ref<Workspace[]>(WORKSPACES)

    // Current workspace ID - from localStorage or default
    const currentWorkspaceId = ref<string>(
        localStorage.getItem('selectedWorkspace') || WORKSPACES[0]?.id || 'ws-1'
    )

    // Current user
    const user = ref<any>({
        id: 'u-1',
        name: 'Alex Rivera',
        email: 'demo@fixwise.app',
        role: 'Owner'
    })

    // All data - from mock data
    const assets = ref<Asset[]>(ASSETS)
    const logs = ref<MaintenanceLog[]>(LOGS)
    const reminders = ref<Reminder[]>(REMINDERS)
    const projects = ref<DiyProject[]>(PROJECTS)
    const recommendations = ref<Recommendation[]>(RECOMMENDATIONS)
    const notifications = ref<AppNotification[]>(NOTIFICATIONS)

    // ============ COMPUTED ============

    // Current workspace
    const currentWorkspace = computed(() => {
        return workspaces.value.find(w => w.id === currentWorkspaceId.value) || workspaces.value[0]
    })

    const currentWorkspaceName = computed(() => currentWorkspace.value?.name || 'No Workspace')
    const currentWorkspaceType = computed(() => currentWorkspace.value?.type || 'Personal')
    const currentWorkspaceMembers = computed(() => currentWorkspace.value?.members || [])

    // User role in current workspace
    const userRole = computed(() => {
        const member = currentWorkspace.value?.members.find(m => m.id === user.value.id)
        return member?.role || 'Viewer'
    })

    const isOwner = computed(() => userRole.value === 'Owner')
    const canWrite = computed(() => userRole.value === 'Owner' || userRole.value === 'Member')

    // Filtered data by workspace
    const workspaceAssets = computed(() => {
        return assets.value.filter(a => a.workspaceId === currentWorkspaceId.value)
    })

    const workspaceLogs = computed(() => {
        return logs.value.filter(l => l.workspaceId === currentWorkspaceId.value)
    })

    const workspaceReminders = computed(() => {
        return reminders.value.filter(r => r.workspaceId === currentWorkspaceId.value)
    })

    const workspaceProjects = computed(() => {
        return projects.value.filter(p => p.workspaceId === currentWorkspaceId.value)
    })

    const workspaceRecommendations = computed(() => {
        return recommendations.value.filter(r => {
            const asset = assets.value.find(a => a.id === r.assetId)
            return asset?.workspaceId === currentWorkspaceId.value
        })
    })

    // Stats
    const totalAssets = computed(() => workspaceAssets.value.length)
    const totalLogs = computed(() => workspaceLogs.value.length)
    const totalReminders = computed(() => workspaceReminders.value.length)
    const totalProjects = computed(() => workspaceProjects.value.length)

    const totalCost = computed(() => {
        return workspaceLogs.value.reduce((sum, log) => sum + log.cost, 0)
    })

    const upcomingReminders = computed(() => {
        return workspaceReminders.value.filter(r => !r.completed)
    })

    const overdueReminders = computed(() => {
        const today = new Date().toISOString().slice(0, 10)
        return workspaceReminders.value.filter(r => !r.completed && r.dueDate < today)
    })

    const unreadNotifications = computed(() => {
        return notifications.value.filter(n => !n.read)
    })

    // ============ ASSET ACTIONS ============

    // Create asset - type safe with required fields
    function addAsset(assetData: Omit<Asset, 'id'>): Asset {
        const newAsset: Asset = {
            ...assetData,
            id: `a-${Date.now()}`
        }
        assets.value.push(newAsset)
        return newAsset
    }

    // Update asset - exclude id from updates
    function updateAsset(id: string, data: Partial<Omit<Asset, 'id'>>): Asset | null {
        const index = assets.value.findIndex(a => a.id === id)
        const existing = assets.value[index]
        if (index !== -1 && existing) {
            const updated: Asset = { ...existing, ...data }
            assets.value[index] = updated
            return updated
        }
        return null
    }

    function deleteAsset(id: string): boolean {
        const index = assets.value.findIndex(a => a.id === id)
        if (index !== -1) {
            assets.value.splice(index, 1)
            return true
        }
        return false
    }

    function getAsset(id: string): Asset | undefined {
        return assets.value.find(a => a.id === id)
    }

    // ============ LOG ACTIONS ============

    function addLog(logData: Omit<MaintenanceLog, 'id'>): MaintenanceLog {
        const newLog: MaintenanceLog = {
            ...logData,
            id: `l-${Date.now()}`
        }
        logs.value.push(newLog)
        return newLog
    }

    function updateLog(id: string, data: Partial<Omit<MaintenanceLog, 'id'>>): MaintenanceLog | null {
        const index = logs.value.findIndex(l => l.id === id)
        const existing = logs.value[index]
        if (index !== -1 && existing) {
            const updated: MaintenanceLog = { ...existing, ...data }
            logs.value[index] = updated
            return updated
        }
        return null
    }

    function deleteLog(id: string): boolean {
        const index = logs.value.findIndex(l => l.id === id)
        if (index !== -1) {
            logs.value.splice(index, 1)
            return true
        }
        return false
    }

    function getLogsForAsset(assetId: string): MaintenanceLog[] {
        return workspaceLogs.value.filter(l => l.assetId === assetId)
    }

    // ============ REMINDER ACTIONS ============

    function addReminder(reminderData: Omit<Reminder, 'id'>): Reminder {
        const newReminder: Reminder = {
            ...reminderData,
            id: `r-${Date.now()}`
        }
        reminders.value.push(newReminder)
        return newReminder
    }

    function updateReminder(id: string, data: Partial<Omit<Reminder, 'id'>>): Reminder | null {
        const index = reminders.value.findIndex(r => r.id === id)
        const existing = reminders.value[index]
        if (index !== -1 && existing) {
            const updated: Reminder = { ...existing, ...data }
            reminders.value[index] = updated
            return updated
        }
        return null
    }

    function deleteReminder(id: string): boolean {
        const index = reminders.value.findIndex(r => r.id === id)
        if (index !== -1) {
            reminders.value.splice(index, 1)
            return true
        }
        return false
    }

    function completeReminder(id: string): Reminder | null {
        const reminder = reminders.value.find(r => r.id === id)
        if (reminder) {
            reminder.completed = true
            return reminder
        }
        return null
    }

    function getRemindersForAsset(assetId: string): Reminder[] {
        return workspaceReminders.value.filter(r => r.assetId === assetId)
    }

    // ============ WORKSPACE ACTIONS ============

    function selectWorkspace(id: string): void {
        if (workspaces.value.some(w => w.id === id)) {
            currentWorkspaceId.value = id
            localStorage.setItem('selectedWorkspace', id)
        }
    }

    function addWorkspace(workspaceData: Omit<Workspace, 'id'>): Workspace {
        const newWorkspace: Workspace = {
            ...workspaceData,
            id: `ws-${Date.now()}`
        }
        workspaces.value.push(newWorkspace)
        return newWorkspace
    }

    function updateWorkspace(id: string, data: Partial<Omit<Workspace, 'id'>>): Workspace | null {
        const index = workspaces.value.findIndex(w => w.id === id)
        const existing = workspaces.value[index]
        if (index !== -1 && existing) {
            const updated: Workspace = { ...existing, ...data }
            workspaces.value[index] = updated
            return updated
        }
        return null
    }

    function deleteWorkspace(id: string): boolean {
        const index = workspaces.value.findIndex(w => w.id === id)
        if (index !== -1) {
            workspaces.value.splice(index, 1)
            if (currentWorkspaceId.value === id) {
                const fallbackId = workspaces.value[0]?.id || ''
                currentWorkspaceId.value = fallbackId
                localStorage.setItem('selectedWorkspace', fallbackId)
            }
            return true
        }
        return false
    }

    // ============ MEMBER ACTIONS ============

    function addMember(workspaceId: string, memberData: Omit<Workspace['members'][number], 'id'>): Workspace['members'][number] | null {
        const workspace = workspaces.value.find(w => w.id === workspaceId)
        if (workspace) {
            const newMember: Workspace['members'][number] = {
                ...memberData,
                id: `u-${Date.now()}`
            }
            workspace.members.push(newMember)
            return newMember
        }
        return null
    }

    function removeMember(workspaceId: string, memberId: string): boolean {
        const workspace = workspaces.value.find(w => w.id === workspaceId)
        if (workspace) {
            workspace.members = workspace.members.filter(m => m.id !== memberId)
            return true
        }
        return false
    }

    function updateMemberRole(workspaceId: string, memberId: string, role: Workspace['members'][number]['role']): Workspace['members'][number] | null {
        const workspace = workspaces.value.find(w => w.id === workspaceId)
        if (workspace) {
            const member = workspace.members.find(m => m.id === memberId)
            if (member) {
                member.role = role
                return member
            }
        }
        return null
    }

    // ============ NOTIFICATION ACTIONS ============

    function markNotificationRead(id: string): AppNotification | null {
        const notif = notifications.value.find(n => n.id === id)
        if (notif) {
            notif.read = true
            return notif
        }
        return null
    }

    function markAllNotificationsRead(): void {
        notifications.value.forEach(n => n.read = true)
    }

    function addNotification(notificationData: Omit<AppNotification, 'id'>): AppNotification {
        const newNotif: AppNotification = {
            ...notificationData,
            id: `n-${Date.now()}`
        }
        notifications.value.push(newNotif)
        return newNotif
    }

    // ============ RETURN ============

    return {
        // State
        workspaces,
        currentWorkspaceId,
        assets,
        logs,
        reminders,
        projects,
        recommendations,
        notifications,
        user,

        // Computed
        currentWorkspace,
        currentWorkspaceName,
        currentWorkspaceType,
        currentWorkspaceMembers,
        userRole,
        isOwner,
        canWrite,
        workspaceAssets,
        workspaceLogs,
        workspaceReminders,
        workspaceProjects,
        workspaceRecommendations,
        totalAssets,
        totalLogs,
        totalReminders,
        totalProjects,
        totalCost,
        upcomingReminders,
        overdueReminders,
        unreadNotifications,

        // Workspace actions
        selectWorkspace,
        addWorkspace,
        updateWorkspace,
        deleteWorkspace,

        // Member actions
        addMember,
        removeMember,
        updateMemberRole,

        // Asset actions
        addAsset,
        updateAsset,
        deleteAsset,
        getAsset,

        // Log actions
        addLog,
        updateLog,
        deleteLog,
        getLogsForAsset,

        // Reminder actions
        addReminder,
        updateReminder,
        deleteReminder,
        completeReminder,
        getRemindersForAsset,

        // Notification actions
        markNotificationRead,
        markAllNotificationsRead,
        addNotification,
    }
})