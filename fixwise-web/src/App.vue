<template>
  <v-app>
    <div v-if="authStore.isAuthenticated" class="min-h-screen bg-grey-lighten-4">
      <AppHeader />
      <div class="d-flex">
        <AppSidebar />
        <main class="flex-1 pa-4">
          <router-view />
        </main>
      </div>
    </div>
    <div v-else>
      <router-view />
    </div>
  </v-app>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import AppHeader from '@/components/layout/AppHeader.vue';
import AppSidebar from '@/components/layout/AppSidebar.vue';

const authStore = useAuthStore();

onMounted(async () => {
  if (authStore.token && !authStore.user) {
    try {
      await authStore.fetchCurrentUser();
    } catch {
      authStore.clearAuthData();
    }
  }
});
</script>

<style scoped>
.flex-1 {
  flex: 1;
}
</style>