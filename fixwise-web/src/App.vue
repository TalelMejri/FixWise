<!-- src/App.vue -->
<template>
  <div id="app">
    <Preloader v-if="showPreloader" :rows-per-half="4" :duration="1200" @complete="handlePreloaderComplete" />
    <div :style="{ opacity: showPreloader ? 0 : 1, transition: 'opacity 0.5s' }">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Preloader from './components/common/Preloader.vue'
const showPreloader = ref(true)
function handlePreloaderComplete() {
  showPreloader.value = false
}
onMounted(() => {
  setTimeout(() => {
    if (showPreloader.value) {
      showPreloader.value = false
    }
  }, 5000)
})
</script>

<style>


</style>