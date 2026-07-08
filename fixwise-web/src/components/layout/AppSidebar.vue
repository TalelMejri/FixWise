<template>
  <v-navigation-drawer
    v-model="drawer"
    color="grey-darken-4"
    theme="dark"
    width="280"
    permanent
  >
    <v-list>
      <v-list-item>
        <template #prepend>
          <v-icon icon="mdi-wrench" color="primary" />
        </template>
        <v-list-item-title class="text-h6 font-weight-bold text-white">
          FixWise
        </v-list-item-title>
        <template #append>
          <v-badge color="success" dot />
        </template>
      </v-list-item>
    </v-list>

    <v-divider class="my-4" />

    <v-list density="compact" nav>
      <v-list-item
        v-for="item in menuItems"
        :key="item.title"
        :prepend-icon="item.icon"
        :title="item.title"
        :to="item.to"
        :active="route.path === item.to"
        color="primary"
        class="mb-1"
      />
    </v-list>

    <template #append>
      <v-divider />
      <v-list-item class="mt-2" @click="logout">
        <template #prepend>
          <v-icon icon="mdi-logout" />
        </template>
        <v-list-item-title>Déconnexion</v-list-item-title>
      </v-list-item>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const authStore = useAuthStore();
const drawer = ref(true);

const menuItems = [
  { title: 'Tableau de bord', icon: 'mdi-view-dashboard', to: '/dashboard' },
  { title: 'Tickets', icon: 'mdi-ticket', to: '/tickets' },
  { title: 'Clients', icon: 'mdi-account-group', to: '/clients' },
  { title: 'Statistiques', icon: 'mdi-chart-bar', to: '/stats' },
  { title: 'Paramètres', icon: 'mdi-cog', to: '/settings' },
];

const logout = async () => {
  await authStore.logout();
};
</script>