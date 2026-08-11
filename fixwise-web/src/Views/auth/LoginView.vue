<template>
  <div class="surface-gradient grid min-h-screen place-items-center px-4 py-10 bg-[var(--bg-primary)]">
    <div class="w-full max-w-md">
      <ThemeToggle />
      <!-- Logo -->
      <div class="mb-6 flex items-center gap-2">
          <a href="/" class="grid  place-items-center rounded-xl bg-white text-white">
            <img src="@/assets/logo.png" alt="FixWise Logo" width="50" height="50" />
          </a>
        <div>
          <p class="text-lg font-semibold tracking-tight text-[var(--text-primary)]">FixWise</p>
          <p class="text-xs text-[var(--text-muted)]">{{ $t('login.subtitle') }}</p>
        </div>
      </div>

      <!-- Card -->
      <div class="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 shadow-lg">
        <h1 class="text-xl font-semibold tracking-tight text-[var(--text-primary)]">{{ $t('login.title') }}</h1>
        <p class="mt-1 text-sm text-[var(--text-muted)]">{{ $t('login.description') }}</p>

        <form class="mt-6 space-y-4" @submit.prevent="submit" novalidate>
          <!-- Email -->
          <div class="space-y-2">
            <label for="email" class="text-sm font-medium text-[var(--text-primary)]">{{ $t('login.email') }}</label>
            <input id="email" type="email" v-model="email" autocomplete="email"
              :placeholder="$t('login.emailPlaceholder')"
              class="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-input)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-offset-2"
              :class="{ 'border-red-500 focus:ring-red-500': error }" />
          </div>

          <!-- Password -->
          <div class="space-y-2">
            <label for="password" class="text-sm font-medium text-[var(--text-primary)]">{{ $t('login.password')
            }}</label>
            <div class="relative">
              <input id="password" :type="showPassword ? 'text' : 'password'" v-model="password"
                autocomplete="current-password" :placeholder="$t('login.passwordPlaceholder')"
                class="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-input)] px-3 py-2 pr-10 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-offset-2"
                :class="{ 'border-red-500 focus:ring-red-500': error }" />
              <button type="button" @click="showPassword = !showPassword"
                :aria-label="showPassword ? $t('login.hidePassword') : $t('login.showPassword')"
                class="absolute inset-y-0 right-2 grid place-items-center text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                <EyeOff v-if="showPassword" class="size-4" />
                <Eye v-else class="size-4" />
              </button>
            </div>
          </div>

          <!-- Remember & Forgot -->
          <div class="flex items-center justify-between">
            <label class="flex items-center gap-2 text-sm text-[var(--text-muted)] cursor-pointer">
              <input type="checkbox" v-model="remember"
                class="rounded border-[var(--border-color)] bg-[var(--bg-input)] text-[var(--accent-primary)] focus:ring-[var(--accent-primary)] focus:ring-offset-2" />
              {{ $t('login.remember') }}
            </label>
            <router-link to="/forget-password"
              class="text-sm text-[var(--text-muted)] cursor-pointer hover:text-[var(--accent-primary)] transition-colors">
              {{ $t('login.forgotPassword') }}
            </router-link>
          </div>

          <!-- Error -->
          <p v-if="error" role="alert" class="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-500">
            {{ error }}
          </p>

          <!-- Submit -->
          <button type="submit" :disabled="loading"
            class="w-full rounded-lg bg-[var(--accent-primary)] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[var(--accent-hover)] hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
            <Loader2 v-if="loading" class="inline size-4 animate-spin mr-2" />
            {{ loading ? $t('login.signingIn') : $t('login.signIn') }}
          </button>
        </form>
        <!-- Demo Credentials -->
        <!-- <div
          class="mt-4 rounded-lg border border-dashed border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2 text-xs text-[var(--text-muted)]">
          {{ $t('login.demoLabel') }}
          <span class="font-medium text-[var(--text-primary)]">demo@fixwise.app</span>
          /
          <span class="font-medium text-[var(--text-primary)]">demo1234</span>
        </div> -->
        <!-- Register Link -->
        <p class="mt-5 text-center text-sm text-[var(--text-muted)]">
          {{ $t('login.noAccount') }}
          <router-link to="/register" class="font-medium text-[var(--accent-primary)] hover:underline">
            {{ $t('login.createOne') }}
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Eye, EyeOff, Loader2, Wrench } from 'lucide-vue-next'
import ThemeToggle from '@/components/common/ThemeToggle.vue'

const { t } = useI18n()
const router = useRouter()

const email = ref('demo@fixwise.app')
const password = ref('demo1234')
const showPassword = ref(false)
const remember = ref(true)
const loading = ref(false)
const error = ref<string | null>(null)

const submit = (e: Event) => {
  e.preventDefault()
  error.value = null

  // Validate email
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value)) {
    error.value = t('login.errorEmail')
    return
  }

  // Validate password
  if (password.value.length < 8) {
    error.value = t('login.errorPassword')
    return
  }

  loading.value = true

  setTimeout(() => {
    loading.value = false
    router.push('/workspaces')
  }, 700)
}

onMounted(() => {
  // Check if user is already authenticated
  // const isAuthenticated = localStorage.getItem('auth_token')
  // if (isAuthenticated) router.push('/dashboard')
})
</script>