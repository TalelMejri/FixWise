<template>
  <div>
    <p class="text-sm font-medium text-[var(--text-primary)]">{{ title }}</p>
    <ul class="mt-1 list-disc space-y-1 pl-5 text-sm text-[var(--text-muted)]">
      <li v-for="item in items" :key="item">{{ item }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  items: string[]
}>()
</script>