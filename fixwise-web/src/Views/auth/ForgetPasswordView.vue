<template>
  <div class="surface-gradient grid min-h-screen place-items-center px-4 py-10 bg-[var(--bg-primary)]">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="mb-6 flex items-center gap-2">
        <a href="/" class="grid  place-items-center rounded-xl bg-white text-white">
          <img src="@/assets/logo.png" alt="FixWise Logo" width="50" height="50" />
        </a>
        <p class="text-lg font-semibold tracking-tight text-[var(--text-primary)]">FixWise</p>
      </div>

      <!-- Card -->
      <div class="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 shadow-lg">
        <!-- Success State -->
        <div v-if="sent" class="py-8 text-center">
          <div class="mx-auto flex size-16 items-center justify-center rounded-full bg-green-500/10">
            <MailCheck class="size-8 text-green-500" />
          </div>
          <h1 class="mt-4 text-lg font-semibold text-[var(--text-primary)]">{{ $t('forgetPassword.successTitle') }}</h1>
          <p class="mt-2 text-sm text-[var(--text-muted)]">
            {{ $t('forgetPassword.successMessage') }}
            <br />
            <span class="font-medium text-[var(--text-primary)]">{{ email }}</span>
          </p>
          <p class="mt-4 text-xs text-[var(--text-muted)]">
            {{ $t('forgetPassword.checkSpam') }}
          </p>
          <router-link to="/login" class="mt-6 inline-block">
            <button
              class="rounded-lg bg-[var(--accent-primary)] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[var(--accent-hover)] hover:scale-[1.02]">
              {{ $t('forgetPassword.backToLogin') }}
            </button>
          </router-link>
        </div>

        <!-- Form -->
        <template v-else>
          <div class="flex items-center gap-3 mb-6">
            <button @click="goBack"
              class="rounded-lg p-2 text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] transition-colors">
              <ArrowLeft class="size-5" />
            </button>
            <div>
              <h1 class="text-xl font-semibold tracking-tight text-[var(--text-primary)]">{{ $t('forgetPassword.title')
              }}</h1>
              <p class="mt-1 text-sm text-[var(--text-muted)]">{{ $t('forgetPassword.description') }}</p>
            </div>
          </div>

          <form class="mt-4 space-y-4" @submit.prevent="submit" novalidate>
            <!-- Email -->
            <div class="space-y-2">
              <label for="email" class="text-sm font-medium text-[var(--text-primary)]">{{ $t('forgetPassword.email')
              }}</label>
              <input id="email" type="email" v-model="email" autocomplete="email"
                :placeholder="$t('forgetPassword.emailPlaceholder')"
                class="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-input)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-offset-2"
                :class="{ 'border-red-500 focus:ring-red-500': error }" />
              <p v-if="error" role="alert" class="text-xs text-red-500">{{ error }}</p>
            </div>

            <!-- Submit -->
            <button type="submit" :disabled="loading || !isValid"
              class="w-full rounded-lg bg-[var(--accent-primary)] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[var(--accent-hover)] hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
              <Loader2 v-if="loading" class="inline size-4 animate-spin mr-2" />
              {{ loading ? $t('forgetPassword.sending') : $t('forgetPassword.sendLink') }}
            </button>
          </form>

          <!-- Back to Login -->
          <p class="mt-6 text-center text-sm text-[var(--text-muted)]">
            {{ $t('forgetPassword.rememberPassword') }}
            <router-link to="/login" class="font-medium text-[var(--accent-primary)] hover:underline">
              {{ $t('forgetPassword.backToLogin') }}
            </router-link>
          </p>

          <!-- Demo Info -->
          <div
            class="mt-4 rounded-lg border border-dashed border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2 text-xs text-[var(--text-muted)]">
            {{ $t('forgetPassword.demoInfo') }}
            <span class="font-medium text-[var(--text-primary)]">demo@fixwise.app</span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ArrowLeft, Loader2, MailCheck, Wrench } from 'lucide-vue-next'

const { t } = useI18n()
const router = useRouter()

const email = ref('')
const loading = ref(false)
const sent = ref(false)
const error = ref('')

const isValid = computed(() => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value))

const submit = (e: Event) => {
  e.preventDefault()
  error.value = ''

  if (!isValid.value) {
    error.value = t('forgetPassword.errorEmail')
    return
  }

  loading.value = true

  // Simulate API call
  setTimeout(() => {
    loading.value = false
    sent.value = true
    // In a real app, you would send the reset link here
  }, 1500)
}

const goBack = () => {
  router.push('/login')
}
</script>

<style scoped>
/* Smooth animations */
.surface-gradient {
  background: var(--bg-primary);
}

.card-elevated {
  transition: all 0.3s ease;
}
</style>