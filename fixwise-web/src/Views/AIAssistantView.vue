<template>
  <DashboardLayout>
    <div class="max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-4">
      <!-- Page Header -->
      <div class="flex flex-wrap items-center justify-between gap-3 mb-4 sm:mb-6">
        <div class="flex-1 min-w-0">
          <h1 class="text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight">
            AI Assistant
          </h1>
          <p class="text-sm text-[var(--text-muted)] mt-1">
            Diagnose issues, plan projects and clean up your notes.
          </p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="mb-4">
        <div class="flex flex-wrap gap-1 border-b border-[var(--border-color)]">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            class="px-4 py-2 text-sm font-medium transition-colors relative"
            :class="[
              activeTab === tab.key
                ? 'text-[var(--accent-primary)] border-b-2 border-[var(--accent-primary)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            ]"
            @click="activeTab = tab.key"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- Content -->
      <div v-if="activeTab === 'issue'">
        <IssueAnalyzer />
      </div>
      <div v-else-if="activeTab === 'diy'">
        <DiyGenerator />
      </div>
      <div v-else-if="activeTab === 'summary'">
        <Summarizer />
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import DashboardLayout from '@/components/dashboard/DashboardLayout.vue'
import IssueAnalyzer from '@/components/ai/IssueAnalyzer.vue'
import DiyGenerator from '@/components/ai/DiyGenerator.vue'
import Summarizer from '@/components/ai/Summarizer.vue'

const { t } = useI18n()

const tabs = [
  { key: 'issue', label: 'Issue Analyzer' },
  { key: 'diy', label: 'DIY Plan Generator' },
  { key: 'summary', label: 'Maintenance Summarizer' }
]

const activeTab = ref('issue')
</script>