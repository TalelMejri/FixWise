import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Workspace } from '@/types';
import { useAuthStore } from './auth';

export const useWorkspaceStore = defineStore('workspace', () => {
  const currentWorkspace = ref<Workspace | null>(null);
  const workspaces = ref<Workspace[]>([]);

  const hasWorkspace = computed(() => !!currentWorkspace.value);

  function setCurrentWorkspace(workspace: Workspace): void {
    currentWorkspace.value = workspace;
    localStorage.setItem('currentWorkspaceId', workspace.id);
  }

  function loadWorkspacesFromUser(): void {
    const authStore = useAuthStore();
    if (authStore.user) {
      workspaces.value = authStore.user.workspaces || [];
      
      // Restaurer le dernier workspace sélectionné
      const savedWorkspaceId = localStorage.getItem('currentWorkspaceId');
      if (savedWorkspaceId) {
        const saved = workspaces.value.find(w => w.id === savedWorkspaceId);
        if (saved) {
          currentWorkspace.value = saved;
        } else if (workspaces.value.length > 0) {
          const workspace = workspaces.value[0];
          if (workspace) {
            currentWorkspace.value = workspace;
          }
        }
      } else if (workspaces.value.length > 0) {
        const workspace = workspaces.value[0];
        if (workspace) {
          currentWorkspace.value = workspace;
        }
      }
    }
  }

  function switchWorkspace(workspaceId: string): void {
    const workspace = workspaces.value.find(w => w.id === workspaceId);
    if (workspace) {
      setCurrentWorkspace(workspace);
    }
  }

  return {
    currentWorkspace,
    workspaces,
    hasWorkspace,
    setCurrentWorkspace,
    loadWorkspacesFromUser,
    switchWorkspace,
  };
});