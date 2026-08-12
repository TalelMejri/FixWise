import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'LandingPage',
      component: () => import('../Views/LandingPageView.vue'),
      meta: {
        title: 'FixWise - Smart Maintenance Management',
        showPreloader: true
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/Views/auth/LoginView.vue'),
      meta: { title: 'Login - FixWise', guest: true }
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/Views/auth/RegisterView.vue'),
      meta: { title: 'Register - FixWise', guest: true }
    },
    {
      path: '/forget-password',
      name: 'ForgetPassword',
      component: () => import('@/Views/auth/ForgetPasswordView.vue'),
      meta: { title: 'Forgot Password - FixWise', guest: true }
    },
    {
      path: '/workspaces',
      name: 'WorkspaceSelection',
      component: () => import('@/Views/WorkspaceSelectionView.vue'),
      meta: { title: 'Select Workspace - FixWise', requiresAuth: true }
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('@/Views/Dashboard/DashboardView.vue'),
      meta: { title: 'Dashboard - FixWise', requiresAuth: true }
    },
    {
      path: '/assets',
      name: 'Assets',
      component: () => import('@/Views/AssetsView.vue'),
      meta: { title: 'Assets - FixWise' }
    },
    {
      path: '/assets/:id',
      name: 'AssetsDetails',
      component: () => import('@/components/assets/AssetDetailView.vue'),
      meta: { title: 'Assets Details - FixWise' }
    },
    {
      path: '/maintenance',
      name: 'Maintenance',
      component: () => import('@/Views/MaintenanceView.vue'),
      meta: { title: 'Maintenance - FixWise' }
    },
    {
      path: '/reminders',
      name: 'Reminders',
      component: () => import('@/Views/RemindersView.vue'),
      meta: { title: 'Reminders - FixWise' }
    },
    {
      path: '/diy',
      name: 'DIY Projects',
      component: () => import('@/Views/DiyProjectsView.vue'),
      meta: { title: 'DIY Projects - FixWise' }
    },
    {
      path: '/ai',
      name: 'AI Assistant',
      component: () => import('@/Views/AIAssistantView.vue'),
      meta: { title: 'AI Assistant - FixWise' }
    },
    {
      path: '/settings',
      name: 'Settings',
      component: () => import('@/Views/SettingsView.vue'),
      meta: { title: 'Settings - FixWise' }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})


export default router