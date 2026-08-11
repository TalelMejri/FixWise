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
      name: 'forgetPassword',
      component: () => import('@/Views/auth/ForgetPasswordView.vue'),
      meta: { title: 'Forgot Password - FixWise', guest: true }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

export default router