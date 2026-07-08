<template>
  <v-container fluid class="fill-height bg-grey-lighten-4">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12 rounded-lg" :loading="authStore.loading">
          <v-card-item class="text-center pt-8">
            <div class="text-h1 mb-2">🔧</div>
            <v-card-title class="text-h4 font-weight-bold text-primary">
              Créer un compte
            </v-card-title>
            <v-card-subtitle class="mt-2">
              Ou
              <router-link to="/login" class="text-primary text-decoration-none font-weight-medium">
                connectez-vous à votre compte
              </router-link>
            </v-card-subtitle>
          </v-card-item>

          <v-card-text>
            <v-form @submit.prevent="handleRegister" ref="formRef">
              <v-text-field
                v-model="form.fullName"
                :rules="nameRules"
                label="Nom complet"
                prepend-inner-icon="mdi-account"
                variant="outlined"
                class="mb-4"
                placeholder="Jean Dupont"
                color="primary"
              />

              <v-text-field
                v-model="form.email"
                :rules="emailRules"
                label="Email"
                type="email"
                prepend-inner-icon="mdi-email"
                variant="outlined"
                class="mb-4"
                placeholder="vous@exemple.com"
                color="primary"
              />

              <v-text-field
                v-model="form.password"
                :rules="passwordRules"
                label="Mot de passe"
                :type="showPassword ? 'text' : 'password'"
                prepend-inner-icon="mdi-lock"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showPassword = !showPassword"
                variant="outlined"
                class="mb-4"
                placeholder="••••••••"
                color="primary"
                counter
              />

              <v-text-field
                v-model="form.confirmPassword"
                :rules="confirmPasswordRules"
                label="Confirmer le mot de passe"
                :type="showConfirmPassword ? 'text' : 'password'"
                prepend-inner-icon="mdi-lock-check"
                :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showConfirmPassword = !showConfirmPassword"
                variant="outlined"
                class="mb-4"
                placeholder="••••••••"
                color="primary"
              />

              <v-alert
                v-if="authStore.error"
                type="error"
                variant="tonal"
                class="mb-4"
                closable
              >
                {{ authStore.error }}
              </v-alert>

              <v-btn
                type="submit"
                color="primary"
                size="large"
                block
                :loading="authStore.loading"
                class="mt-2"
              >
                S'inscrire
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();
const formRef = ref();
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const form = reactive({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
});

const nameRules = [
  (v: string) => !!v || 'Le nom complet est requis',
  (v: string) => (v && v.length >= 2) || 'Le nom doit faire au moins 2 caractères',
];

const emailRules = [
  (v: string) => !!v || "L'email est requis",
  (v: string) => /.+@.+\..+/.test(v) || "Format d'email invalide",
];

const passwordRules = [
  (v: string) => !!v || 'Le mot de passe est requis',
  (v: string) => (v && v.length >= 8) || 'Le mot de passe doit faire au moins 8 caractères',
  (v: string) => /(?=.*[a-z])/.test(v) || 'Doit contenir une minuscule',
  (v: string) => /(?=.*[A-Z])/.test(v) || 'Doit contenir une majuscule',
  (v: string) => /(?=.*\d)/.test(v) || 'Doit contenir un chiffre',
];

const confirmPasswordRules = [
  (v: string) => !!v || 'La confirmation est requise',
  (v: string) => v === form.password || 'Les mots de passe ne correspondent pas',
];

async function handleRegister(): Promise<void> {
  const { valid } = await formRef.value?.validate();
  if (!valid) return;

  try {
    await authStore.register(form);
    router.push('/dashboard');
  } catch (error) {
    // L'erreur est déjà gérée par le store
  }
}
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
}
</style>