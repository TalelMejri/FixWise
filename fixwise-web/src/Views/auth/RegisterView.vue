<template>
  <div class="surface-gradient grid min-h-screen place-items-center px-4 py-10 bg-[var(--bg-primary)]">
    <div class="w-full max-w-md">
      <ThemeToggle />
      <!-- Logo -->
      <div class="mb-2 flex items-center gap-2">
        <a href="/" class="grid  place-items-center rounded-xl bg-white text-white">
          <img src="@/assets/logo.png" alt="FixWise Logo" width="50" height="50" />
        </a>
        <p class="text-lg font-semibold tracking-tight text-[var(--text-primary)]">FixWise</p>
      </div>

      <!-- Card -->
      <div class="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 shadow-lg">
        <!-- Success State -->
        <div v-if="done" class="py-8 text-center">
          <CheckCircle2 class="mx-auto size-10 text-green-500" />
          <h1 class="mt-3 text-lg font-semibold text-[var(--text-primary)]">{{ $t('register.successTitle') }}</h1>
          <p class="mt-1 text-sm text-[var(--text-muted)]">{{ $t('register.successMessage') }}</p>
        </div>

        <!-- Form -->
        <template v-else>
          <h1 class="text-xl font-semibold tracking-tight text-[var(--text-primary)]">{{ $t('register.title') }}</h1>
          <p class="mt-1 text-sm text-[var(--text-muted)]">{{ $t('register.description') }}</p>

          <form class="mt-6 space-y-4" @submit.prevent="submit" novalidate>
            <!-- Full Name -->
            <div class="space-y-2">
              <label for="name" class="text-sm font-medium text-[var(--text-primary)]">{{ $t('register.fullName')
              }}</label>
              <input id="name" type="text" v-model="form.name" :placeholder="$t('register.namePlaceholder')"
                class="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-input)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-offset-2"
                :class="{ 'border-red-500 focus:ring-red-500': errors.name }" />
              <p v-if="errors.name" role="alert" class="text-xs text-red-500">{{ errors.name }}</p>
            </div>

            <!-- Email -->
            <div class="space-y-2">
              <label for="email" class="text-sm font-medium text-[var(--text-primary)]">{{ $t('register.email')
              }}</label>
              <input id="email" type="email" v-model="form.email" :placeholder="$t('register.emailPlaceholder')"
                class="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-input)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-offset-2"
                :class="{ 'border-red-500 focus:ring-red-500': errors.email }" />
              <p v-if="errors.email" role="alert" class="text-xs text-red-500">{{ errors.email }}</p>
            </div>

            <!-- Password -->
            <div class="space-y-2">
              <label for="password" class="text-sm font-medium text-[var(--text-primary)]">{{ $t('register.password')
              }}</label>
              <input id="password" type="password" v-model="form.password"
                class="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-input)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-offset-2"
                :class="{ 'border-red-500 focus:ring-red-500': errors.password }" />
              <p v-if="errors.password" role="alert" class="text-xs text-red-500">{{ errors.password }}</p>

              <!-- Password Strength -->
              <div v-if="form.password" class="mt-2">
                <div class="flex gap-1" aria-hidden>
                  <span v-for="i in 4" :key="i" class="h-1.5 flex-1 rounded-full"
                    :class="i < score ? bars[score] : 'bg-[var(--border-color)]'" />
                </div>
                <p class="mt-1 text-xs text-[var(--text-muted)]">
                  {{ $t('register.strength') }}: {{ labels[score] }}
                </p>
              </div>
            </div>

            <!-- Confirm Password -->
            <div class="space-y-2">
              <label for="confirm" class="text-sm font-medium text-[var(--text-primary)]">{{
                $t('register.confirmPassword') }}</label>
              <input id="confirm" type="password" v-model="form.confirm"
                class="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-input)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-offset-2"
                :class="{ 'border-red-500 focus:ring-red-500': errors.confirm }" />
              <p v-if="errors.confirm" role="alert" class="text-xs text-red-500">{{ errors.confirm }}</p>
            </div>

            <!-- Terms -->
            <label class="flex items-start gap-2 text-sm text-[var(--text-muted)] cursor-pointer">
              <input type="checkbox" v-model="terms"
                class="mt-0.5 rounded border-[var(--border-color)] bg-[var(--bg-input)] text-[var(--accent-primary)] focus:ring-[var(--accent-primary)] focus:ring-offset-2" />
              {{ $t('register.terms') }}
            </label>

            <!-- Submit -->
            <button type="submit" :disabled="!isValid || loading"
              class="w-full rounded-lg bg-[var(--accent-primary)] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[var(--accent-hover)] hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
              <Loader2 v-if="loading" class="inline size-4 animate-spin mr-2" />
              {{ loading ? $t('register.creating') : $t('register.createAccount') }}
            </button>
          </form>
        </template>

        <!-- Login Link -->
        <p class="mt-5 text-center text-sm text-[var(--text-muted)]">
          {{ $t('register.hasAccount') }}
          <router-link to="/login" class="font-medium text-[var(--accent-primary)] hover:underline">
            {{ $t('register.signIn') }}
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { CheckCircle2, Loader2, Wrench } from 'lucide-vue-next'
import ThemeToggle from '@/components/common/ThemeToggle.vue'

const { t } = useI18n()
const router = useRouter()

const form = ref({
  name: '',
  email: '',
  password: '',
  confirm: '',
})
const terms = ref(false)
const loading = ref(false)
const done = ref(false)

// Password strength
const strength = (pw: string): number => {
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  return score
}

const labels = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong']
const bars = ['bg-red-500', 'bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500']

const score = computed(() => strength(form.value.password))

// Validation
const errors = computed(() => ({
  name: form.value.name && form.value.name.trim().length < 3 ? t('register.errorName') : '',
  email: form.value.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.value.email) ? t('register.errorEmail') : '',
  password: form.value.password && form.value.password.length < 8 ? t('register.errorPassword') : '',
  confirm: form.value.confirm && form.value.confirm !== form.value.password ? t('register.errorConfirm') : '',
}))

const isValid = computed(() =>
  form.value.name.trim().length >= 3 &&
  /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.value.email) &&
  form.value.password.length >= 8 &&
  form.value.confirm === form.value.password &&
  terms.value
)

const submit = (e: Event) => {
  e.preventDefault()
  if (!isValid.value) return

  loading.value = true

  setTimeout(() => {
    loading.value = false
    done.value = true
    // In a real app, you would register here
    setTimeout(() => router.push('/login'), 1200)
  }, 700)
}
</script>