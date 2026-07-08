<template>
  <v-app-bar color="primary" elevation="2" prominent>
    <v-app-bar-nav-icon @click="toggleSidebar" class="d-md-none" />
    
    <v-app-bar-title class="text-white">
      <v-icon icon="mdi-wrench" class="mr-2" />
      FixWise
    </v-app-bar-title>

    <v-spacer />

    <v-btn variant="text" class="text-white" @click="logout">
      <v-icon icon="mdi-logout" class="mr-2" />
      Déconnexion
    </v-btn>
  </v-app-bar>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const toggleSidebar = () => {
  // Logic to toggle sidebar
};

const logout = async () => {
  await authStore.logout();
  router.push('/login');
};
</script>