<template>
    <div v-if="mounted" class="fixed inset-0 z-[9999] pointer-events-auto bg-white" :aria-hidden="opening" role="status"
        aria-live="polite">
        <!-- Ambient brand glow -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
            <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
            <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
        </div>

        <!-- Split screen rows - stair wipe -->
        <div class="absolute top-0 left-0 right-0 h-1/2 flex flex-col">
            <div v-for="i in rowsPerHalf" :key="`top-${i}`" class="relative w-full flex-1 bg-white shadow-sm"
                :style="getRowStyle(i - 1, 'top')">
                <div class="absolute inset-0 border-b border-purple-500/10" />
            </div>
        </div>

        <div class="absolute bottom-0 left-0 right-0 h-1/2 flex flex-col">
            <div v-for="i in rowsPerHalf" :key="`bottom-${i}`" class="relative w-full flex-1 bg-white shadow-sm"
                :style="getRowStyle(i - 1, 'bottom')">
                <div class="absolute inset-0 border-b border-purple-500/10" />
            </div>
        </div>

        <!-- Center content -->
        <div class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-4" :style="{
            opacity: opening ? 0 : 1,
            transition: 'opacity 0.5s ease-out'
        }">
            <!-- Logo with brand-gradient glow -->
            <div class="relative">
                <!-- Subtle glow -->
                <div class="absolute -inset-8 rounded-full bg-gradient-to-br from-orange-500/20 to-orange-500/20 blur-2xl"
                    :style="{
                        animation: 'pulseGlow 2s ease-in-out infinite'
                    }" />

                <!-- Logo container -->
                <div
                    class="relative w-24 h-24 rounded-2xl bg-white/60 backdrop-blur-sm flex items-center justify-center border border-gray-200 shadow-lg overflow-hidden">
                    <img :src="logo" alt="FixWise Logo" class="w-16 h-16 object-contain" loading="eager" />
                </div>
            </div>

            <!-- Simple text -->
            <div class="space-y-3 text-center">
                <div class="flex flex-col items-center gap-1">
                    <span class="text-xs uppercase tracking-[0.4em] text-gray-500 font-light">
                        FixWise
                    </span>
                    <span class="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-light">
                        Smart Maintenance Management
                    </span>
                </div>

                <!-- Progress bar -->
                <div class="w-48 h-[3px] bg-gray-200 rounded-full overflow-hidden mt-4">
                    <div class="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-300"
                        :style="{ width: `${progress}%` }" />
                </div>

                <!-- Percentage -->
                <span class="text-[10px] font-mono text-gray-400 tracking-wider"
                    :style="{ opacity: progress < 100 ? 1 : 0 }">
                    {{ Math.floor(progress).toString().padStart(2, '0') }}%
                </span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// Import logo - you can use require or import
import logo from '@/assets/logo.png'

// If you don't have a logo, use emoji instead
// const logo = null // or use a data URL

interface Props {
    onComplete?: () => void
    rowsPerHalf?: number
    duration?: number
}

const props = withDefaults(defineProps<Props>(), {
    onComplete: () => { },
    rowsPerHalf: 4,
    duration: 1200,
})

// State
const opening = ref(false)
const mounted = ref(true)
const progress = ref(0)

let timeoutId: number | null = null
let intervalId: number | null = null
let exitTimeoutId: number | null = null

onMounted(() => {
    startPreloader()
})

onUnmounted(() => {
    if (timeoutId) clearTimeout(timeoutId)
    if (intervalId) clearInterval(intervalId)
    if (exitTimeoutId) clearTimeout(exitTimeoutId)
})

function startPreloader() {
    const holdDuration = props.duration || 1200

    timeoutId = setTimeout(() => {
        opening.value = true
    }, holdDuration) as unknown as number

    intervalId = setInterval(() => {
        progress.value = Math.min(progress.value + Math.random() * 12 + 3, 95)
    }, 150) as unknown as number

    const stepDelay = 110
    const transition = 900
    const total = stepDelay * (props.rowsPerHalf - 1) + transition + 200

    exitTimeoutId = setTimeout(() => {
        mounted.value = false
        progress.value = 100
        props.onComplete()
    }, total) as unknown as number
}

function getRowStyle(index: number, half: 'top' | 'bottom') {
    const order = half === 'top' ? index : props.rowsPerHalf - 1 - index
    const delay = opening.value ? order * 110 : 0
    const xDir = index % 2 === 0 ? '100%' : '-100%'
    const yDir = half === 'top' ? '-100%' : '100%'

    return {
        transform: opening.value ? `translate(${xDir}, ${yDir})` : 'translate(0, 0)',
        transition: `transform 0.8s ${delay}ms cubic-bezier(0.76, 0, 0.24, 1)`,
        willChange: 'transform',
    }
}
</script>

<style scoped>
/* Keyframe animations */
@keyframes pulseGlow {

    0%,
    100% {
        transform: scale(1);
        opacity: 0.4;
    }

    50% {
        transform: scale(1.05);
        opacity: 0.7;
    }
}

/* Fix for background */
.bg-background {
    background-color: #ffffff;
}

.border-border {
    border-color: rgba(0, 0, 0, 0.1);
}

.text-muted-foreground {
    color: rgba(0, 0, 0, 0.6);
}
</style>