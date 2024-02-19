<script setup>
const props = defineProps({
  height: {default: "24"},
  width: {default: "24"},
  stroke: {default: '#333'}
})
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="width" :height="height" viewBox="0 0 24 24" fill="none" :stroke="stroke"
       stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="X">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
</template>

<style scoped>
.X {
  cursor: pointer;
}
</style>