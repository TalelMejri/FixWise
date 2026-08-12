<template>
  <DashboardLayout>
    <div class="max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-4">
      <!-- Page Header -->
      <div class="flex flex-wrap items-center justify-between gap-3 mb-4 sm:mb-6">
        <div class="flex-1 min-w-0">
          <h1 class="text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight">
            Assets
          </h1>
          <p class="text-sm text-[var(--text-muted)] mt-1">
            Everything you own, track and maintain.
          </p>
        </div>
        <button class="btn-primary-assets" @click="showCreateModal = true">
          <Plus class="w-4 h-4" />
          <span>Add Asset</span>
        </button>
      </div>

      <!-- Filters -->
      <div class="flex flex-col sm:flex-row gap-3 mb-4 sm:mb-5">
        <div class="relative flex-1">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name, brand or model"
            class="w-full pl-9 pr-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-input)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
          />
        </div>
        <select
          v-model="categoryFilter"
          class="px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-input)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] sm:w-44"
        >
          <option value="all">All Categories</option>
          <option v-for="cat in categories" :key="cat.name" :value="cat.name">
            {{ cat.name }}
          </option>
        </select>
        <select
          v-model="statusFilter"
          class="px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-input)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] sm:w-40"
        >
          <option value="all">All Statuses</option>
          <option value="Active">Active</option>
          <option value="UnderRepair">Under Repair</option>
          <option value="Archived">Archived</option>
          <option value="Disposed">Disposed</option>
        </select>
      </div>

      <!-- Assets Grid -->
      <div v-if="filteredAssets.length === 0" class="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-8 text-center">
        <p class="text-sm text-[var(--text-muted)]">No assets match your filters.</p>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
        <router-link
          v-for="asset in filteredAssets"
          :key="asset.id"
          :to="`/assets/${asset.id}`"
          class="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-4 hover:border-[var(--accent-primary)] transition-all hover:shadow-md group"
        >
          <div class="flex items-start justify-between gap-2">
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-[var(--text-primary)] truncate">{{ asset.name }}</p>
              <p class="text-sm text-[var(--text-muted)] truncate">
                {{ asset.brand }} · {{ asset.model }}
              </p>
            </div>
            <span class="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0" :class="getStatusBadgeClass(asset.status)">
              {{ asset.status }}
            </span>
          </div>
          <div class="mt-3 flex flex-wrap items-center gap-2">
            <span class="text-xs font-medium px-2 py-0.5 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]">
              {{ asset.category }}
            </span>
            <span class="flex items-center gap-1 text-xs text-[var(--text-muted)]">
              <MapPin class="w-3 h-3" />
              {{ asset.location }}
            </span>
          </div>
          <p class="mt-2 text-xs text-[var(--text-muted)]">
            Purchased {{ formatDate(asset.purchaseDate) }} · Warranty to {{ formatDate(asset.warrantyEnd) }}
          </p>
        </router-link>
      </div>

      <!-- Create Asset Modal -->
      <AssetFormModal
        :open="showCreateModal"
        @update:open="showCreateModal = $event"
        @save="handleAssetSaved"
      />
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Plus, Search, MapPin } from 'lucide-vue-next'
import DashboardLayout from '@/components/dashboard/DashboardLayout.vue'
import AssetFormModal from '@/components/assets/AssetFormModal.vue'
import { useWorkspaceStore } from '@/stores/workspace'
import { CATEGORIES } from '@/types/index'
import { format } from 'date-fns'

const { t } = useI18n()
const workspaceStore = useWorkspaceStore()

// State
const showCreateModal = ref(false)
const searchQuery = ref('')
const categoryFilter = ref('all')
const statusFilter = ref('all')

// Use store data
const categories = CATEGORIES
const assets = computed(() => workspaceStore.workspaceAssets)

// Computed
const filteredAssets = computed(() => {
  let result = assets.value

  // Search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter((a:any) =>
      a.name.toLowerCase().includes(query) ||
      a.brand.toLowerCase().includes(query) ||
      a.model.toLowerCase().includes(query)
    )
  }

  // Category filter
  if (categoryFilter.value !== 'all') {
    result = result.filter((a:any) => a.category === categoryFilter.value)
  }

  // Status filter
  if (statusFilter.value !== 'all') {
    result = result.filter((a:any) => a.status === statusFilter.value)
  }

  return result
})

// Methods
const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    Active: 'bg-green-500/10 text-green-500',
    UnderRepair: 'bg-yellow-500/10 text-yellow-500',
    Archived: 'bg-gray-500/10 text-gray-500',
    Disposed: 'bg-red-500/10 text-red-500'
  }
  return classes[status] || 'bg-gray-500/10 text-gray-500'
}

const formatDate = (date: string) => {
  if (!date) return 'N/A'
  try {
    return format(new Date(date), 'MMM d, yyyy')
  } catch {
    return date
  }
}

const handleAssetSaved = (newAsset: any) => {
  workspaceStore.addAsset({
    ...newAsset,
    workspaceId: workspaceStore.currentWorkspaceId
  })
}
</script>

<style scoped>
.btn-primary-assets {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1.25rem;
  border-radius: 0.75rem;
  background: var(--accent-primary);
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.btn-primary-assets:hover {
  background: var(--accent-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(232, 122, 0, 0.3);
}
</style>