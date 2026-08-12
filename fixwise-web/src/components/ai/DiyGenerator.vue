<template>
  <div class="grid gap-4 lg:grid-cols-2">
    <!-- Input Card -->
    <div class="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-4 sm:p-6">
      <h3 class="text-sm font-semibold text-[var(--text-primary)] mb-4">Project brief</h3>

      <div class="space-y-4">
        <div class="form-group">
          <label class="form-label">Project goal</label>
          <textarea
            v-model="goal"
            class="form-input"
            rows="5"
            placeholder="Build a wall-mounted rack for garden tools in the shed"
          ></textarea>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <div class="form-group">
            <label class="form-label">Experience level</label>
            <select v-model="experience" class="form-input">
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Budget</label>
            <input
              v-model.number="budget"
              type="number"
              placeholder="150"
              class="form-input"
              min="0"
            />
          </div>
        </div>

        <button
          class="btn-generate"
          @click="generate"
          :disabled="isLoading || !goal.trim() || !canUseAi"
        >
          <Loader2 v-if="isLoading" class="w-4 h-4 animate-spin" />
          <Sparkles v-else class="w-4 h-4" />
          {{ isLoading ? 'Generating…' : 'Generate Plan' }}
        </button>
      </div>
    </div>

    <!-- Results Card -->
    <div class="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-4 sm:p-6">
      <h3 class="text-sm font-semibold text-[var(--text-primary)] mb-4">Generated plan</h3>

      <div v-if="!plan" class="text-center py-8">
        <p class="text-sm text-[var(--text-muted)]">Your plan will appear here.</p>
      </div>

      <div v-else class="space-y-4">
        <p class="font-medium text-[var(--text-primary)]">{{ plan.title }}</p>
        <p class="text-sm text-[var(--text-muted)]">
          Estimated duration: {{ plan.duration }} · Budget estimate: ${{ budget }}
        </p>

        <Section title="Tools" :items="plan.tools" />
        <Section title="Materials" :items="plan.materials" />

        <div>
          <p class="text-sm font-medium text-[var(--text-primary)]">Steps</p>
          <ol class="mt-1 list-decimal space-y-1 pl-5 text-sm text-[var(--text-muted)]">
            <li v-for="step in plan.steps" :key="step">{{ step }}</li>
          </ol>
        </div>

        <Section title="Safety notes" :items="plan.safety" />

        <button class="btn-create-project" @click="createProject">
          Create DIY Project
        </button>

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
const goal = ref('')
const experience = ref('Beginner')
const budget = ref(150)
const isLoading = ref(false)
const plan = ref<any>(null)

// Computed
const canUseAi = computed(() => workspaceStore.canWrite)

// Methods
const generate = () => {
  if (goal.value.trim().length < 8) {
    alert('Describe your project goal')
    return
  }

  isLoading.value = true

  setTimeout(() => {
    plan.value = {
      title: goal.value.trim().replace(/^./, (c) => c.toUpperCase()),
      duration: experience.value === 'Beginner' ? '1 weekend (6–8 hours)' : '4–6 hours',
      tools: ['Tape measure', 'Cordless drill', 'Utility knife', 'Spirit level', 'Safety glasses'],
      materials: ['Fixings and screws', 'Primary panel/board material', 'Sealant or tape'],
      steps: [
        'Measure the work area and note the dimensions.',
        'Buy materials, keeping 10% spare for mistakes.',
        'Prepare and protect the surrounding surfaces.',
        'Cut components to size and dry-fit before fixing.',
        'Fix in place, checking level as you go.',
        'Finish edges, clean up and inspect the result.'
      ],
      safety: [
        'Wear eye and hand protection when cutting.',
        'Stop and call a professional for any gas, electrical or structural work.'
      ]
    }
    isLoading.value = false
  }, 900)
}

const createProject = () => {
  // Implementation
  console.log('Creating project from plan')
}
</script>

<style scoped>
.btn-generate {
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

.btn-generate:hover:not(:disabled) {
  background: var(--accent-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(232, 122, 0, 0.3);
}

.btn-generate:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-create-project {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  background: var(--accent-primary);
  color: white;
  font-weight: 500;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
}

.btn-create-project:hover {
  background: var(--accent-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(232, 122, 0, 0.3);
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