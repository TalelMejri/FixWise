<template>
  <div class="dashboard-page" :class="{ dark: isDark }">
    <!-- Background Decor -->
    <div class="bg-decor">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
    </div>

    <!-- Sidebar -->
    <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="sidebar-top">
        <div class="logo-wrapper">
          <img :src="logo" alt="FixWise" class="logo-img" />
          <span class="logo-text" v-if="!sidebarCollapsed">FixWise</span>
        </div>
        <button class="sidebar-toggle" @click="sidebarCollapsed = !sidebarCollapsed" title="Toggle sidebar">
          <PanelLeftClose v-if="!sidebarCollapsed" class="w-4 h-4" />
          <PanelLeftOpen v-else class="w-4 h-4" />
        </button>
      </div>

      <!-- Workspace Switcher (reads/writes the store) -->
      <button class="workspace-switcher" @click="workspaceOpen = !workspaceOpen">
        <div class="workspace-avatar">{{ getInitials(workspaceStore.currentWorkspaceName) }}</div>
        <div class="workspace-switcher-info" v-if="!sidebarCollapsed">
          <span class="workspace-switcher-name">{{ workspaceStore.currentWorkspaceName }}</span>
          <span class="workspace-switcher-type">{{ workspaceStore.currentWorkspaceType }}</span>
        </div>
        <ChevronsUpDown v-if="!sidebarCollapsed" class="w-4 h-4 workspace-switcher-icon" />
      </button>

      <!-- Workspace Dropdown -->
      <div v-if="workspaceOpen" class="workspace-dropdown">
        <div class="dropdown-label">Switch Workspace</div>
        <button v-for="ws in workspaceStore.workspaces" :key="ws.id" @click="selectWorkspace(ws.id)"
          class="dropdown-item">
          <span>{{ ws.name }}</span>
          <span v-if="ws.id === workspaceStore.currentWorkspaceId" class="dropdown-current">✓</span>
        </button>
        <div class="dropdown-divider"></div>
        <button @click="handleCreateWorkspace" class="dropdown-create">
          <Plus class="size-4" />
          Create New Workspace
        </button>
      </div>

      <!-- Nav -->
      <nav class="sidebar-nav">
        <router-link v-for="item in navItems" :key="item.path" :to="item.path" class="nav-item" active-class="active"
          @click="mobileMenuOpen = false">
          <component :is="item.icon" class="w-[18px] h-[18px] nav-item-icon" />
          <span class="nav-item-label" v-if="!sidebarCollapsed">{{ item.label }}</span>
        </router-link>
      </nav>

      <div class="sidebar-spacer"></div>

      <!-- Sidebar Footer -->
      <div class="sidebar-footer">
        <div class="sidebar-user" @click="userMenuOpen = !userMenuOpen">
          <div class="member-avatar" :style="{ background: getAvatarColor(workspaceStore.user.name) }">
            {{ getInitials(workspaceStore.user.name) }}
          </div>
          <div class="sidebar-user-info" v-if="!sidebarCollapsed">
            <span class="sidebar-user-name">{{ workspaceStore.user.name }}</span>
            <span class="sidebar-user-role">{{ workspaceStore.userRole }}</span>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main -->
    <div class="dashboard-main">
      <!-- Header -->
      <header class="dashboard-header">
        <div class="header-left">
          <h1 class="page-title">{{ activeNavLabel }}</h1>
          <p class="page-subtitle">{{ workspaceStore.currentWorkspaceName }}</p>
        </div>

        <div class="header-right">
          <!-- Search -->
          <div class="search-bar">
            <Search class="w-4 h-4 search-icon" />
            <input type="text" placeholder="Search..." class="search-input" />
          </div>

          <!-- Theme Toggle -->
          <button class="icon-btn" @click="toggleTheme"
            :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
            <Sun v-if="isDark" class="w-[18px] h-[18px]" />
            <Moon v-else class="w-[18px] h-[18px]" />
          </button>

          <!-- Notifications -->
          <div class="notification-wrapper">
            <button class="icon-btn" @click="notificationsOpen = !notificationsOpen" title="Notifications">
              <Bell class="w-[18px] h-[18px]" />
              <span v-if="unreadCount > 0" class="icon-btn-dot">{{ unreadCount }}</span>
            </button>

            <div v-if="notificationsOpen" class="notifications-dropdown">
              <div class="dropdown-header">
                <span>Notifications</span>
                <button class="mark-read-btn" @click="markAllRead">Mark all read</button>
              </div>
              <div class="dropdown-divider"></div>
              <div v-if="notifications.length === 0" class="empty-state">
                <Bell class="w-8 h-8 empty-icon" />
                <p>No notifications</p>
              </div>
              <div v-for="notif in notifications" :key="notif.id" class="notification-item"
                :class="{ unread: !notif.read }" @click="markRead(notif.id)">
                <div class="notification-content">
                  <p class="notification-title">{{ notif.title }}</p>
                  <p class="notification-body">{{ notif.body }}</p>
                  <span class="notification-time">{{ notif.time }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- User Menu -->
          <div class="user-menu-wrapper">
            <button class="header-user" @click="userMenuHeaderOpen = !userMenuHeaderOpen">
              <div class="member-avatar" :style="{ background: getAvatarColor(workspaceStore.user.name) }">
                {{ getInitials(workspaceStore.user.name) }}
              </div>
              <ChevronDown class="w-4 h-4" :class="{ 'rotate-180': userMenuHeaderOpen }" />
            </button>

            <div v-if="userMenuHeaderOpen" class="user-dropdown">
              <div class="user-info">
                <p class="user-name-text">{{ workspaceStore.user.name }}</p>
                <p class="user-email">{{ workspaceStore.user.email }}</p>
                <p class="user-role">{{ workspaceStore.userRole }}</p>
              </div>
              <div class="dropdown-divider"></div>
              <button class="dropdown-item" @click="navigateTo('/profile')">
                <User class="w-4 h-4" />
                Edit Profile
              </button>
              <button class="dropdown-item" @click="navigateTo('/settings')">
                <Settings class="w-4 h-4" />
                Settings
              </button>
              <div class="dropdown-divider"></div>
              <button class="dropdown-item logout" @click="handleLogout">
                <LogOut class="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Content -->
      <main class="dashboard-content">
        <slot />
      </main>
    </div>

    <!-- Mobile Overlay -->
    <div v-if="mobileMenuOpen" class="mobile-overlay" @click="mobileMenuOpen = false" />

    <!-- Mobile Sidebar -->
    <aside class="mobile-sidebar" :class="{ open: mobileMenuOpen }">
      <div class="mobile-sidebar-header">
        <div class="logo-wrapper">
          <img :src="logo" alt="FixWise" class="logo-img" />
          <span class="logo-text">FixWise</span>
        </div>
        <button class="close-btn" @click="mobileMenuOpen = false">
          <X class="w-5 h-5" />
        </button>
      </div>

      <nav class="mobile-nav">
        <router-link v-for="item in navItems" :key="item.path" :to="item.path" class="mobile-nav-item"
          active-class="active" @click="mobileMenuOpen = false">
          <component :is="item.icon" class="w-[18px] h-[18px]" />
          <span>{{ item.label }}</span>
        </router-link>
      </nav>

      <div class="mobile-sidebar-footer">
        <router-link to="/settings" class="mobile-nav-item" @click="mobileMenuOpen = false">
          <Settings class="w-[18px] h-[18px]" />
          <span>Settings</span>
        </router-link>
        <button class="mobile-nav-item" @click="handleLogout">
          <LogOut class="w-[18px] h-[18px]" />
          <span>Logout</span>
        </button>
      </div>
    </aside>

    <!-- Glass Dock (Mobile) -->
    <div v-if="isMobile" class="dock-container">
      <GlassDock :items="dockItems" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  Search, Bell, ChevronDown, ChevronsUpDown, Settings,
  PanelLeftClose, PanelLeftOpen, LayoutDashboard, Package, Tag,
  Calendar, Sun, Moon, Plus, X, User, LogOut, Home, Wrench, Bot
} from 'lucide-vue-next'
import GlassDock from './GlassDock.vue'
import logo from '@/assets/logo.png'
import { useWorkspaceStore } from '@/stores/workspace'

const router = useRouter()
const route = useRoute()

// ---------------------------------------------------------------------
// Workspace — everything workspace-related now comes straight from the
// store. Selecting a workspace here updates the store, which every other
// page (Assets, Dashboard) reads from, so the whole app stays in sync.
// ---------------------------------------------------------------------
const workspaceStore = useWorkspaceStore()
const workspaceOpen = ref(false)

const selectWorkspace = (id: string) => {
  workspaceStore.selectWorkspace(id)
  workspaceOpen.value = false
}

// Theme
const isDark = ref(false)

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

// Navigation
const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'assets', label: 'Assets', icon: Package, path: '/assets' },
  { id: 'maintenance', label: 'Maintenance', icon: Wrench, path: '/maintenance' },
  { id: 'reminders', label: 'Reminders', icon: Calendar, path: '/reminders' },
  { id: 'diy', label: 'DIY Projects', icon: Home, path: '/diy' },
  { id: 'ai', label: 'AI Assistant', icon: Bot, path: '/ai' },
]

const activeNav = ref('dashboard')
const activeNavLabel = computed(() => navItems.find(n => n.id === activeNav.value)?.label || 'Dashboard')

// Notifications
const notifications = ref([
  { id: '1', title: 'Reminder Due', body: 'Oil change is due for Renault Clio', read: false, time: '2 min ago' },
  { id: '2', title: 'Maintenance Log', body: 'New maintenance log added for Samsung Washing Machine', read: true, time: '1 hour ago' },
  { id: '3', title: 'AI Recommendation', body: 'Your AC filter needs replacement', read: false, time: '3 hours ago' }
])
const notificationsOpen = ref(false)
const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

const markRead = (id: string) => {
  const notif = notifications.value.find(n => n.id === id)
  if (notif) notif.read = true
}

const markAllRead = () => {
  notifications.value.forEach(n => n.read = true)
}

// User Menu
const userMenuOpen = ref(false)
const userMenuHeaderOpen = ref(false)

// Mobile
const isMobile = ref(false)
const mobileMenuOpen = ref(false)

// Sidebar
const sidebarCollapsed = ref(false)

// Dock Items
const dockItems = computed(() => [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, action: () => navigateTo('/dashboard'), active: activeNav.value === 'dashboard' },
  { id: 'assets', label: 'Assets', icon: Package, action: () => navigateTo('/assets'), active: activeNav.value === 'assets' },
  { id: 'maintenance', label: 'Maintenance', icon: Wrench, action: () => navigateTo('/maintenance'), active: activeNav.value === 'maintenance' },
  { id: 'reminders', label: 'Reminders', icon: Calendar, action: () => navigateTo('/reminders'), active: activeNav.value === 'reminders' },
  {id: 'diy', label: 'DIY Projects', icon: Home, action: () => navigateTo('/diy'), active: activeNav.value === 'diy' },
  { id: 'ai', label: 'AI Assistant', icon: Bot, action: () => navigateTo('/ai'), active: activeNav.value === 'ai' },
])

// Helpers
const getAvatarColor = (name: string) => {
  const colors = ['#e87a00', '#8b5cf6', '#10b981', '#3b82f6', '#ef4444', '#f59e0b', '#ec4899', '#06b6d4']
  const index = name.length % colors.length
  return colors[index]
}

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const navigateTo = (path: string) => {
  router.push(path)
}

const handleLogout = () => {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('selectedWorkspace')
  router.push('/login')
}

const handleCreateWorkspace = () => {
  workspaceOpen.value = false
  router.push('/workspaces')
}

// Mobile detection
const checkMobile = () => {
  isMobile.value = window.innerWidth < 1024
}

// Close dropdowns on click outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.workspace-switcher') && !target.closest('.workspace-dropdown')) {
    workspaceOpen.value = false
  }
  if (!target.closest('.user-menu-wrapper') && !target.closest('.user-dropdown')) {
    userMenuHeaderOpen.value = false
  }
  if (!target.closest('.notification-wrapper') && !target.closest('.notifications-dropdown')) {
    notificationsOpen.value = false
  }
}

// Initialize
onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark') {
    isDark.value = true
    document.documentElement.classList.add('dark')
  } else if (savedTheme === 'light') {
    isDark.value = false
    document.documentElement.classList.remove('dark')
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }

  // Workspace persistence is handled by the store itself (it reads
  // localStorage on init) — nothing to sync here anymore.

  checkMobile()
  window.addEventListener('resize', checkMobile)
  document.addEventListener('click', handleClickOutside)

  const currentPath = route.path
  const navItem = navItems.find(n => currentPath.startsWith(n.path))
  if (navItem) activeNav.value = navItem.id
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
  document.removeEventListener('click', handleClickOutside)
})

watch(() => route.path, (newPath) => {
  const navItem = navItems.find(n => newPath.startsWith(n.path))
  if (navItem) activeNav.value = navItem.id
})
</script>

<style scoped>
/* ========================================
   DASHBOARD PAGE
   ======================================== */
.dashboard-page {
  min-height: 100vh;
  display: flex;
  background: var(--bg-secondary);
  position: relative;
  overflow: hidden;
  transition: background 0.3s ease;
}

.bg-decor {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.12;
  transition: opacity 0.3s ease;
}

.dark .orb {
  opacity: 0.08;
}

.orb-1 {
  width: 400px;
  height: 400px;
  top: -100px;
  right: -100px;
  background: var(--accent-primary);
}

.orb-2 {
  width: 300px;
  height: 300px;
  bottom: -50px;
  left: 200px;
  background: #8b5cf6;
}

.sidebar {
  position: relative;
  z-index: 1;
  width: 240px;
  flex-shrink: 0;
  background: var(--bg-card);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.sidebar.collapsed {
  width: 76px;
}

.sidebar-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.25rem 0.25rem 0.75rem;
}

.logo-wrapper {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  overflow: hidden;
}

.logo-img {
  width: 30px;
  height: 30px;
  object-fit: contain;
  flex-shrink: 0;
}

.logo-text {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  white-space: nowrap;
}

.sidebar-toggle {
  width: 28px;
  height: 28px;
  border-radius: 0.5rem;
  border: none;
  background: transparent;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.sidebar-toggle:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.workspace-switcher {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem;
  border-radius: 0.75rem;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 0.5rem;
  width: 100%;
  position: relative;
}

.workspace-switcher:hover {
  border-color: var(--accent-primary);
}

.workspace-avatar {
  width: 32px;
  height: 32px;
  border-radius: 0.6rem;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-hover));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 700;
  flex-shrink: 0;
}

.workspace-switcher-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.workspace-switcher-name {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.workspace-switcher-type {
  font-size: 0.65rem;
  color: var(--text-muted);
}

.workspace-switcher-icon {
  color: var(--text-muted);
  flex-shrink: 0;
}

.workspace-dropdown {
  position: absolute;
  left: 1rem;
  top: 100px;
  width: calc(100% - 2rem);
  max-width: 220px;
  padding: 0.5rem;
  border-radius: 0.75rem;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  z-index: 50;
}

.sidebar.collapsed .workspace-dropdown {
  left: 0.5rem;
  width: calc(100% - 1rem);
}

.dropdown-label {
  padding: 0.25rem 0.75rem;
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
}

.dropdown-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: none;
  background: transparent;
  color: var(--text-primary);
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.dropdown-item:hover {
  background: var(--bg-secondary);
}

.dropdown-current {
  color: var(--accent-primary);
  font-weight: 600;
}

.dropdown-divider {
  height: 1px;
  margin: 0.25rem 0.5rem;
  background: var(--border-color);
}

.dropdown-create {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: none;
  background: transparent;
  color: var(--accent-primary);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
}

.dropdown-create:hover {
  background: rgba(232, 122, 0, 0.05);
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.55rem 0.6rem;
  border-radius: 0.65rem;
  border: none;
  background: transparent;
  color: var(--text-muted);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  position: relative;
  width: 100%;
  text-align: left;
}

.nav-item:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.nav-item.active {
  background: rgba(232, 122, 0, 0.08);
  color: var(--accent-primary);
}

.nav-item.active::before {
  content: '';
  position: absolute;
  left: -1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 60%;
  border-radius: 0 3px 3px 0;
  background: var(--accent-primary);
}

.nav-item-icon {
  flex-shrink: 0;
}

.nav-item-label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-spacer {
  flex: 1;
}

.sidebar-footer {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  border-top: 1px solid var(--border-color);
  padding-top: 0.75rem;
  position: relative;
}

.sidebar-user {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.4rem 0.6rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.sidebar-user:hover {
  background: var(--bg-secondary);
}

.member-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  font-weight: 600;
  flex-shrink: 0;
}

.sidebar-user-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.sidebar-user-name {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-user-role {
  font-size: 0.65rem;
  color: var(--text-muted);
}

.sidebar-user-chevron {
  color: var(--text-muted);
  margin-left: auto;
}

.sidebar-user-dropdown {
  position: absolute;
  bottom: 60px;
  left: 0;
  right: 0;
  padding: 0.5rem;
  border-radius: 0.75rem;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.1);
  z-index: 50;
}

.sidebar-user-dropdown .dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: none;
  background: transparent;
  color: var(--text-primary);
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 0.2s ease;
  width: 100%;
}

.sidebar-user-dropdown .dropdown-item:hover {
  background: var(--bg-secondary);
}

.sidebar-user-dropdown .dropdown-item.logout {
  color: #ef4444;
}

.sidebar-user-dropdown .dropdown-item.logout:hover {
  background: rgba(239, 68, 68, 0.05);
}

.dashboard-main {
  position: relative;
  z-index: 1;
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.dashboard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 2rem;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-card);
  gap: 1rem;
  flex-wrap: wrap;
}

.header-left {
  flex: 1;
}

.page-title {
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.page-subtitle {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin: 0.1rem 0 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.85rem;
  border-radius: 0.75rem;
  border: 1px solid var(--border-color);
  background: var(--bg-input);
  width: 220px;
}

.search-icon {
  color: var(--text-muted);
  flex-shrink: 0;
}

.search-input {
  border: none;
  background: transparent;
  outline: none;
  color: var(--text-primary);
  font-size: 0.85rem;
  width: 100%;
}

.search-input::placeholder {
  color: var(--text-muted);
}

.icon-btn {
  position: relative;
  width: 38px;
  height: 38px;
  border-radius: 0.75rem;
  border: 1px solid var(--border-color);
  background: transparent;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.icon-btn:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.icon-btn-dot {
  position: absolute;
  top: -2px;
  right: -2px;
  min-width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #ef4444;
  color: white;
  font-size: 0.6rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}

.notification-wrapper {
  position: relative;
}

.notifications-dropdown {
  position: absolute;
  right: 0;
  top: calc(100% + 0.5rem);
  width: 340px;
  max-height: 420px;
  overflow-y: auto;
  padding: 0.5rem;
  border-radius: 0.75rem;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  z-index: 50;
}

.notifications-dropdown .dropdown-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.25rem 0.75rem;
}

.notifications-dropdown .dropdown-header span {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}

.mark-read-btn {
  font-size: 0.7rem;
  color: var(--accent-primary);
  background: none;
  border: none;
  cursor: pointer;
}

.mark-read-btn:hover {
  text-decoration: underline;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
  gap: 0.5rem;
}

.empty-icon {
  color: var(--text-muted);
  opacity: 0.4;
}

.empty-state p {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.notification-item {
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.notification-item:hover {
  background: var(--bg-secondary);
}

.notification-item.unread {
  background: rgba(232, 122, 0, 0.03);
  border-left: 3px solid var(--accent-primary);
}

.notification-content {
  flex: 1;
}

.notification-title {
  font-size: 0.813rem;
  font-weight: 500;
  color: var(--text-primary);
  margin: 0;
}

.notification-item.unread .notification-title {
  font-weight: 600;
}

.notification-body {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin: 0.125rem 0 0;
}

.notification-time {
  font-size: 0.65rem;
  color: var(--text-muted);
  opacity: 0.7;
}

.user-menu-wrapper {
  position: relative;
}

.header-user {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.3rem 0.5rem 0.3rem 0.3rem;
  border-radius: 0.75rem;
  border: 1px solid var(--border-color);
  background: transparent;
  cursor: pointer;
  color: var(--text-muted);
  transition: all 0.2s ease;
}

.header-user:hover {
  background: var(--bg-secondary);
}

.user-dropdown {
  position: absolute;
  right: 0;
  top: calc(100% + 0.5rem);
  width: 220px;
  padding: 0.5rem;
  border-radius: 0.75rem;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  z-index: 50;
}

.user-info {
  padding: 0.25rem 0.75rem;
}

.user-name-text {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.user-email {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin: 0;
}

.user-role {
  font-size: 0.65rem;
  font-weight: 500;
  color: var(--accent-primary);
  margin: 0.125rem 0 0;
}

.user-dropdown .dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: none;
  background: transparent;
  color: var(--text-primary);
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 0.2s ease;
  width: 100%;
}

.user-dropdown .dropdown-item:hover {
  background: var(--bg-secondary);
}

.user-dropdown .dropdown-item.logout {
  color: #ef4444;
}

.user-dropdown .dropdown-item.logout:hover {
  background: rgba(239, 68, 68, 0.05);
}

.mobile-overlay {
  position: fixed;
  inset: 0;
  z-index: 35;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  animation: fadeIn 0.2s ease;
}

.mobile-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 280px;
  z-index: 40;
  background: var(--bg-primary);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  box-shadow: 4px 0 30px rgba(0, 0, 0, 0.1);
}

.mobile-sidebar.open {
  transform: translateX(0);
}

.mobile-sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.close-btn {
  width: 36px;
  height: 36px;
  border-radius: 0.5rem;
  border: none;
  background: var(--bg-secondary);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: var(--border-color);
}

.mobile-nav {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.mobile-nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: none;
  background: transparent;
  color: var(--text-muted);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  text-align: left;
}

.mobile-nav-item:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.mobile-nav-item.active {
  background: rgba(232, 122, 0, 0.08);
  color: var(--accent-primary);
}

.mobile-sidebar-footer {
  border-top: 1px solid var(--border-color);
  padding-top: 0.75rem;
}

.dock-container {
  position: fixed;
  bottom: 1.5rem;
  left: 0;
  right: 0;
  z-index: 50;
  display: flex;
  justify-content: center;
  pointer-events: none;
}

.dock-container>* {
  pointer-events: auto;
}

@media (min-width: 1024px) {
  .dock-container {
    display: none;
  }
}

@media (max-width: 1024px) {
  .sidebar {
    display: none;
  }
}

@media (max-width: 768px) {
  .dashboard-header {
    padding: 1rem;
  }

  .search-bar {
    display: none;
  }

  .dashboard-content {
    padding: 1.25rem 1rem 2rem;
  }

  .page-title {
    font-size: 1.15rem;
  }

  .dock-container {
    bottom: 1rem;
  }
}

@media (max-width: 480px) {
  .header-right {
    gap: 0.4rem;
  }

  .icon-btn {
    width: 34px;
    height: 34px;
  }

  .notifications-dropdown {
    width: 300px;
    right: -0.5rem;
  }

  .user-dropdown {
    right: -0.5rem;
  }

  .mobile-sidebar {
    width: 260px;
    padding: 1rem;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: var(--bg-secondary);
}

::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--text-muted);
}
</style>