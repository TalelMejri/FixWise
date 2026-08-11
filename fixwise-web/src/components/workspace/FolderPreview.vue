<template>
  <div
    ref="containerRef"
    class="inline-flex flex-col items-center overflow-visible cursor-pointer transition-transform hover:scale-105"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @click="emit('click')"
  >
    <!-- Folder Content -->
    <div class="relative w-full aspect-[20/16]" style="perspective: 800px;">
      <!-- Back -->
      <div class="absolute inset-0" :class="colors.back">
        <FolderBackIcon />
      </div>

      <!-- Paper Sheet (for some variants) -->
      <div
        v-if="showPaperSheet"
        class="absolute bottom-0.5 left-0.5 right-0.5 h-3/4 bg-white dark:bg-gray-200 rounded-lg"
      />

      <!-- Previews / Floating Images -->
      <div
        v-if="showPreviews"
        class="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
      >
        <img
          v-for="(img, i) in previewImages"
          :key="i"
          :src="img"
          alt=""
          class="absolute w-12 h-12 object-cover rounded-full border-2 border-white shadow-md"
          :style="getPreviewStyle(i)"
        />
      </div>

      <!-- Cover -->
      <div class="relative" :class="colors.cover">
        <FolderCoverIcon />
        <div
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          :class="[colors.deco]"
        >
          <component :is="iconComponent" />
        </div>
      </div>
    </div>

    <!-- Label -->
    <h3 v-if="label" class="mt-3 font-medium text-center" :class="[colors.caption]">
      {{ label }}
    </h3>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Users, Globe, Lock, Cloud } from 'lucide-vue-next'

// Types
type Variant = 'devi' | 'rudras' | 'ardra' | 'shakti' | 'kubera' | 'hari' | 'ravi' | 'durga' | 'nandi'
type Size = 'sm' | 'md' | 'lg'

interface ColorScheme {
  back: string
  cover: string
  deco: string
  caption: string
  bg: string
  icon: any
}

// Props
interface Props {
  variant?: Variant
  images?: string[]
  label?: string
  size?: Size
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'devi',
  images: () => [],
  label: '',
  size: 'md'
})

const emit = defineEmits<{
  (e: 'click'): void
}>()

// State
const isHovered = ref(false)

// Color schemes
const variantColors: Record<Variant, ColorScheme> = {
  devi: {
    back: 'text-gray-500',
    cover: 'text-gray-400',
    deco: 'text-gray-400 brightness-125',
    caption: 'text-gray-800 dark:text-gray-200',
    bg: 'bg-gray-100 dark:bg-gray-900',
    icon: Users
  },
  rudras: {
    back: 'text-gray-700 dark:text-gray-600',
    cover: 'text-gray-600 dark:text-gray-500',
    deco: 'text-gray-400',
    caption: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-slate-200 dark:bg-slate-800',
    icon: Users
  },
  ardra: {
    back: 'text-blue-800 dark:text-blue-700',
    cover: 'text-blue-600 dark:text-blue-500',
    deco: 'text-blue-700 dark:text-blue-600',
    caption: 'text-blue-500 dark:text-blue-400',
    bg: 'bg-gray-800 dark:bg-gray-950',
    icon: Globe
  },
  shakti: {
    back: 'text-indigo-800',
    cover: 'text-indigo-700',
    deco: 'text-indigo-800',
    caption: 'text-green-400',
    bg: 'bg-blue-600 dark:bg-blue-800',
    icon: Lock
  },
  kubera: {
    back: 'text-gray-900',
    cover: 'text-gray-700',
    deco: 'text-gray-600',
    caption: 'text-gray-900 dark:text-gray-100',
    bg: 'bg-emerald-400 dark:bg-emerald-600',
    icon: Cloud
  },
  hari: {
    back: 'text-blue-800',
    cover: 'text-blue-700',
    deco: 'text-blue-800',
    caption: 'text-yellow-400',
    bg: 'bg-sky-500 dark:bg-sky-700',
    icon: Globe
  },
  ravi: {
    back: 'text-gray-900',
    cover: 'text-gray-700',
    deco: 'text-black dark:text-white',
    caption: 'text-gray-900 dark:text-gray-100',
    bg: 'bg-gray-200 dark:bg-gray-800',
    icon: Lock
  },
  durga: {
    back: 'text-green-600',
    cover: 'text-green-500',
    deco: 'text-green-600',
    caption: 'text-green-400 font-mono',
    bg: 'bg-gray-900 dark:bg-black',
    icon: Globe
  },
  nandi: {
    back: 'text-amber-500',
    cover: 'text-amber-400',
    deco: 'text-amber-500',
    caption: 'text-gray-900 dark:text-gray-100',
    bg: 'bg-green-100 dark:bg-green-950',
    icon: Cloud
  }
}

// Computed
const colors = computed(() => variantColors[props.variant])
const iconComponent = computed(() => colors.value.icon)

const showPaperSheet = computed(() => {
  const paperVariants: Variant[] = ['rudras', 'kubera', 'hari', 'ravi', 'durga', 'nandi']
  return paperVariants.includes(props.variant)
})

const showPreviews = computed(() => {
  const previewVariants: Variant[] = ['devi', 'rudras', 'ardra', 'shakti', 'kubera', 'hari', 'ravi']
  return previewVariants.includes(props.variant)
})

const previewImages = computed(() => {
  if (props.images.length > 0) return props.images
  return [
    '/folder-preview/user1.svg',
    '/folder-preview/user2.svg',
    '/folder-preview/user3.svg',
    '/folder-preview/user4.svg',
    '/folder-preview/user5.svg'
  ]
})

// Preview styles with proper type safety
const getPreviewStyle = (index: number) => {
  const positions: Array<{ x: number; y: number }> = [
    { x: 0, y: -40 },
    { x: -30, y: -20 },
    { x: 30, y: -20 },
    { x: -40, y: 10 },
    { x: 40, y: 10 }
  ]
  
  const safeIndex = ((index % positions.length) + positions.length) % positions.length
  const pos = positions[safeIndex]!
  
  return {
    opacity: isHovered.value ? 1 : 0,
    transform: isHovered.value 
      ? `translate(${pos.x}px, ${pos.y}px) scale(1)` 
      : 'translate(0, 0) scale(0.7)',
    transition: `all 0.3s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.05}s`
  }
}
</script>

<!-- SVG Icons -->
<script lang="ts">
// FolderBackIcon
const FolderBackIcon = {
  template: `
    <svg viewBox="0 0 20 16" class="w-full h-full fill-current">
      <path d="M7.5,0C7.4,0,2,0,2,0C0.9,0,0,0.9,0,2l0,12c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V4c0-1.1-0.9-2-2-2c0,0-7.5,0-8,0C9,2,9.9,0,7.5,0z" />
    </svg>
  `
}

// FolderCoverIcon
const FolderCoverIcon = {
  template: `
    <svg viewBox="0 0 20 16" class="w-full h-full fill-current">
      <path d="M2,2h16c1.1,0,2,0.9,2,2v10c0,1.1-0.9,2-2,2H2c-1.1,0-2-0.9-2-2V4C0,2.9,0.9,2,2,2z" />
    </svg>
  `
}
</script>