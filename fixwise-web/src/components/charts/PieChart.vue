<template>
    <div class="chart-container">
        <canvas ref="chartRef"></canvas>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js'

Chart.register(DoughnutController, ArcElement, Tooltip, Legend)

const props = defineProps<{
    labels: string[]
    data: number[]
    colors?: string[]
}>()

const chartRef = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

const defaultColors = ['#e87a00', '#f58a1a', '#ff9a2a', '#ffb347', '#ffcc66']

onMounted(() => {
    createChart()
})

watch(() => props.data, () => {
    updateChart()
})

function createChart() {
    if (!chartRef.value) return

    chartInstance = new Chart(chartRef.value, {
        type: 'doughnut',
        data: {
            labels: props.labels,
            datasets: [{
                data: props.data,
                backgroundColor: props.colors || defaultColors.slice(0, props.data.length),
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 16,
                        color: 'var(--text-muted)',
                        font: { size: 11 }
                    }
                },
                tooltip: {
                    backgroundColor: 'var(--bg-primary)',
                    titleColor: 'var(--text-primary)',
                    bodyColor: 'var(--text-muted)',
                    borderColor: 'var(--border-color)',
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 12
                }
            },
            cutout: '65%'
        }
    })
}

function updateChart() {
    if (!chartInstance) return
    chartInstance.data.labels = props.labels
    chartInstance.update()
}
</script>

<style scoped>
.chart-container {
    width: 100%;
    height: 100%;
}
</style>