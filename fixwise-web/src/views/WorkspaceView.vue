<template>
  <div class="p-6">
    <div v-if="workspaceStore.currentWorkspace" class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">
        {{ workspaceStore.currentWorkspace.name }}
      </h1>
      <p class="text-sm text-gray-600">
        Type : {{ workspaceStore.currentWorkspace.type }} · 
        Rôle : {{ workspaceStore.currentWorkspace.role }}
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="card">
        <h3 class="font-semibold text-gray-900 mb-2">📦 Actifs</h3>
        <p class="text-3xl font-bold text-primary-600">0</p>
        <router-link to="/assets" class="text-sm text-primary-600 hover:text-primary-800 mt-2 inline-block">
          Voir tous →
        </router-link>
      </div>

      <div class="card">
        <h3 class="font-semibold text-gray-900 mb-2">📋 Maintenances</h3>
        <p class="text-3xl font-bold text-green-600">0</p>
        <router-link to="/maintenance" class="text-sm text-primary-600 hover:text-primary-800 mt-2 inline-block">
          Voir toutes →
        </router-link>
      </div>

      <div class="card">
        <h3 class="font-semibold text-gray-900 mb-2">🔨 Projets DIY</h3>
        <p class="text-3xl font-bold text-purple-600">0</p>
        <router-link to="/diy" class="text-sm text-primary-600 hover:text-primary-800 mt-2 inline-block">
          Voir tous →
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWorkspaceStore } from '@/stores/workspace';

const workspaceStore = useWorkspaceStore();
</script>