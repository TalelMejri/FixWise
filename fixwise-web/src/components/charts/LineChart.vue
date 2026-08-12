<template>
  <div class="chart-container">
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import { 
  Chart, 
  LineController, 
  LineElement, 
  PointElement, 
  CategoryScale, 
  LinearScale, 
  Tooltip, 
  Legend, 
  Filler 
} from 'chart.js'

// Register Chart.js components
Chart.register(
  LineController, 
  LineElement, 
  PointElement, 
  CategoryScale, 
  LinearScale, 
  Tooltip, 
  Legend, 
  Filler
)

const props = defineProps<{
  labels: string[]
  datasets: Array<{
    label: string
    data: number[]
    borderColor?: string
    backgroundColor?: string
    fill?: boolean
    tension?: number
    pointRadius?: number
    pointHoverRadius?: number
  }>
  options?: any
}>()

const chartRef = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

// Default colors
const defaultColors = [
  '#e87a00', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444', '#06b6d4'
]

// Create chart
function createChart() {
  if (!chartRef.value) return

  const ctx = chartRef.value.getContext('2d')
  if (!ctx) return

  // Destroy existing chart
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: props.labels,
      datasets: props.datasets.map((dataset, index) => ({
        ...dataset,
        borderColor: dataset.borderColor || defaultColors[index % defaultColors.length],
        backgroundColor: dataset.backgroundColor || defaultColors[index % defaultColors.length] + '20',
        tension: dataset.tension || 0.4,
        pointRadius: dataset.pointRadius || 4,
        pointHoverRadius: dataset.pointHoverRadius || 6,
        fill: dataset.fill !== undefined ? dataset.fill : false,
        borderWidth: 2,
        pointBackgroundColor: dataset.borderColor || defaultColors[index % defaultColors.length],
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2
      }))
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: props.datasets.length > 1,
          position: 'top',
          labels: {
            usePointStyle: true,
            padding: 16,
            color: 'var(--text-muted)',
            font: {
              size: 12,
              family: "'Inter', system-ui, sans-serif"
            }
          }
        },
        tooltip: {
          backgroundColor: 'var(--bg-primary)',
          titleColor: 'var(--text-primary)',
          bodyColor: 'var(--text-muted)',
          borderColor: 'var(--border-color)',
          borderWidth: 1,
          cornerRadius: 8,
          padding: 12,
          callbacks: {
            label: function(context: any) {
              let label = context.dataset.label || ''
              if (label) {
                label += ': '
              }
              if (context.parsed.y !== null) {
                label += '$' + context.parsed.y.toLocaleString()
              }
              return label
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: 'var(--text-muted)',
            font: {
              size: 12,
              family: "'Inter', system-ui, sans-serif"
            }
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0,0,0,0.05)'
          },
          ticks: {
            color: 'var(--text-muted)',
            font: {
              size: 12,
              family: "'Inter', system-ui, sans-serif"
            },
            callback: function(value: any) {
              return '$' + value.toLocaleString()
            }
          }
        }
      },
      interaction: {
        intersect: false,
        mode: 'index'
      },
      ...props.options
    }
  })
}

// Update chart when data changes
function updateChart() {
  if (!chartInstance) return
  
  chartInstance.data.labels = props.labels
  chartInstance.data.datasets = props.datasets.map((dataset, index) => ({
    ...dataset,
    borderColor: dataset.borderColor || defaultColors[index % defaultColors.length],
    backgroundColor: dataset.backgroundColor || defaultColors[index % defaultColors.length] + '20'
  }))
  chartInstance.update()
}

// Watch for changes
watch(() => props.labels, () => {
  updateChart()
}, { deep: true })

watch(() => props.datasets, () => {
  updateChart()
}, { deep: true })

// Recreate chart on theme change
const handleThemeChange = () => {
  setTimeout(() => {
    createChart()
  }, 100)
}

// Lifecycle
onMounted(() => {
  // Create chart after DOM is ready
  nextTick(() => {
    createChart()
  })

  // Watch for theme changes
  const observer = new MutationObserver(handleThemeChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  })

  // Cleanup
  return () => {
    observer.disconnect()
    if (chartInstance) {
      chartInstance.destroy()
      chartInstance = null
    }
  }
})
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>