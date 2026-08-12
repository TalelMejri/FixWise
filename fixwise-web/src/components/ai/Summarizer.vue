<template>
    <div class="grid gap-4 lg:grid-cols-2">
        <!-- Input Card -->
        <div class="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-4 sm:p-6">
            <h3 class="text-sm font-semibold text-[var(--text-primary)] mb-4">Maintenance notes</h3>

            <div class="space-y-4">
                <div class="form-group">
                    <label class="form-label">Paste your raw notes here</label>
                    <textarea v-model="notes" class="form-input" rows="8"
                        placeholder="Paste your raw notes here…"></textarea>
                </div>

                <button class="btn-summarize" @click="summarize" :disabled="isLoading || !notes.trim() || !canUseAi">
                    <Loader2 v-if="isLoading" class="w-4 h-4 animate-spin" />
                    <Sparkles v-else class="w-4 h-4" />
                    {{ isLoading ? 'Summarizing…' : 'Summarize' }}
                </button>
            </div>
        </div>

        <!-- Results Card -->
        <div class="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-4 sm:p-6">
            <h3 class="text-sm font-semibold text-[var(--text-primary)] mb-4">Summary</h3>

            <div v-if="!result" class="text-center py-8">
                <p class="text-sm text-[var(--text-muted)]">Nothing summarized yet.</p>
            </div>

            <div v-else class="space-y-4">
                <div class="bg-[var(--accent-primary)]/5 rounded-lg px-3 py-2 text-sm text-[var(--text-muted)]">
                    🤖 {{ result.summary }}
                </div>

                <Section title="Detected actions" :items="result.actions" />

                <p class="text-sm">
                    <span class="font-medium text-[var(--text-primary)]">Suggested next reminder: </span>
                    <span class="text-[var(--text-muted)]">{{ result.next }}</span>
                </p>

                <p class="text-xs text-[var(--text-muted)]">AI-generated, informational only. Always verify before
                    acting.</p>
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
const notes = ref('')
const isLoading = ref(false)
const result = ref<any>(null)

// Computed
const canUseAi = computed(() => workspaceStore.canWrite)

// Methods
const summarize = () => {
    if (notes.value.trim().length < 10) {
        alert('Paste some notes first')
        return
    }

    isLoading.value = true

    setTimeout(() => {
        const sentences = notes.value
            .split(/[.\n]/)
            .map((s) => s.trim())
            .filter(Boolean)

        result.value = {
            summary: `${sentences.slice(0, 2).join('. ')}.`,
            actions: sentences.slice(0, 4),
            next: 'Schedule a follow-up check in 3 months.'
        }

        isLoading.value = false
    }, 800)
}
</script>

<style scoped>
.btn-summarize {
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

.btn-summarize:hover:not(:disabled) {
    background: var(--accent-hover);
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(232, 122, 0, 0.3);
}

.btn-summarize:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}
</style>