<template>
  <div class="grid gap-4 lg:grid-cols-2">
    <!-- Input Card -->
    <div class="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-4 sm:p-6">
      <h3 class="text-sm font-semibold text-[var(--text-primary)] mb-4">Describe the problem</h3>
      
      <div class="space-y-4">
        <div class="form-group">
          <label class="form-label">What's happening?</label>
          <textarea
            v-model="text"
            class="form-input"
            rows="6"
            placeholder="The boiler loses pressure overnight and makes a knocking sound when heating…"
            maxlength="1000"
          ></textarea>
          <p class="text-xs text-[var(--text-muted)]">{{ text.length }}/1000</p>
        </div>

        <div class="form-group">
          <label class="form-label">Asset (optional)</label>
          <select v-model="assetId" class="form-input">
            <option value="none">Not specific</option>
            <option v-for="asset in assets" :key="asset.id" :value="asset.id">
              {{ asset.name }}
            </option>
          </select>
        </div>

        <button
          class="btn-analyze"
          @click="analyze"
          :disabled="isLoading || !text.trim() || !canUseAi"
        >
          <Loader2 v-if="isLoading" class="w-4 h-4 animate-spin" />
          <Sparkles v-else class="w-4 h-4" />
          {{ isLoading ? 'Analyzing…' : 'Analyze Issue' }}
        </button>
      </div>
    </div>

    <!-- Results Card -->
    <div class="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-4 sm:p-6">
      <h3 class="text-sm font-semibold text-[var(--text-primary)] mb-4">Analysis</h3>
      
      <div v-if="!result" class="text-center py-8">
        <p class="text-sm text-[var(--text-muted)]">Run an analysis to see results here.</p>
      </div>

      <div v-else class="space-y-4">
        <div class="flex items-center gap-2">
          <span class="text-sm font-medium text-[var(--text-primary)]">{{ result.category }}</span>
          <span class="text-xs font-semibold px-2 py-0.5 rounded-full" :class="getUrgencyBadgeClass(result.urgency)">
            {{ result.urgency }}
          </span>
        </div>

        <Section title="Possible causes" :items="result.causes" />
        <Section title="Safe checks you can do" :items="result.checks" />

        <div v-if="result.requiresProfessional" class="bg-red-500/10 rounded-lg px-3 py-2 text-sm text-red-500">
          ⚠️ This looks serious. Contact a qualified professional before attempting repairs yourself.
        </div>

        <div class="flex flex-wrap gap-2">
          <button class="btn-outline-sm" @click="convertToLog">
            Convert to maintenance log
          </button>
          <button class="btn-outline-sm" @click="convertToReminder">
            Convert to reminder
          </button>
        </div>

        <p class="text-xs text-[var(--text-muted)]">AI-generated, informational only. Always verify before acting.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Loader2, Sparkles } from 'lucide-vue-next'
import { useWorkspaceStore } from '@/stores/workspace'
import Section from './Section.vue'

const workspaceStore = useWorkspaceStore()

// State
const text = ref('')
const assetId = ref('none')
const isLoading = ref(false)
const result = ref<any>(null)

// Computed
const assets = computed(() => workspaceStore.workspaceAssets)
const canUseAi = computed(() => workspaceStore.canWrite)

// Methods
const getUrgencyBadgeClass = (urgency: string) => {
  const classes: Record<string, string> = {
    Low: 'bg-green-500/10 text-green-500',
    Medium: 'bg-yellow-500/10 text-yellow-500',
    High: 'bg-orange-500/10 text-orange-500',
    Critical: 'bg-red-500/10 text-red-500'
  }
  return classes[urgency] || 'bg-gray-500/10 text-gray-500'
}

const analyze = () => {
  if (text.value.trim().length < 10) {
    alert('Describe the issue in a bit more detail')
    return
  }

  isLoading.value = true

  setTimeout(() => {
    const lower = text.value.toLowerCase()
    const critical = /gas|smoke|burn|spark|electric|leak of gas|carbon/.test(lower)
    const high = /leak|water|overheat|smell|noise loud|brake/.test(lower)

    result.value = {
      category: critical ? 'Safety / utilities' : high ? 'Mechanical' : 'General maintenance',
      urgency: critical ? 'Critical' : high ? 'High' : 'Medium',
      causes: [
        'Worn or degraded component reaching end of service life',
        'Blocked filter, vent or drainage path',
        'Loose connection or fitting after vibration'
      ],
      checks: [
        'Power down or isolate the appliance before inspecting',
        'Visually inspect for obvious wear, corrosion or debris',
        'Check the maintenance history for recurring symptoms'
      ],
      requiresProfessional: critical || high
    }

    isLoading.value = false
  }, 900)
}

const convertToLog = () => {
  // Implementation
  console.log('Converting to log')
}

const convertToReminder = () => {
  // Implementation
  console.log('Converting to reminder')
}
</script>

<style scoped>
.btn-analyze {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1.5rem;
  border-radius: 0.75rem;
  background: var(--accent-primary);
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
}

.btn-analyze:hover:not(:disabled) {
  background: var(--accent-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(232, 122, 0, 0.3);
}

.btn-analyze:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-outline-sm {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 0.375rem 0.875rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
  background: transparent;
  color: var(--text-primary);
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-outline-sm:hover {
  background: var(--bg-secondary);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
}

.form-input {
  padding: 0.625rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid var(--border-color);
  background: var(--bg-input);
  color: var(--text-primary);
  font-size: 0.875rem;
  transition: all 0.2s ease;
  width: 100%;
}

.form-input:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(232, 122, 0, 0.1);
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>