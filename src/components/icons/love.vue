<script setup>
import {ref, watch} from "vue";

const props = defineProps({
  height: {default: "24"},
  width: {default: "24"},
  picked: {type: Boolean}
})

const love = ref(null);

const PlayAnimation = () => {
  love.value.classList.add("heart-animation");
  setTimeout(() => love.value.classList.remove("heart-animation"), 350);
}
</script>

<template>
  <svg ref="love" @click="PlayAnimation" xmlns="http://www.w3.org/2000/svg" :width="width" :height="height" viewBox="0 0 24 24"
       :fill="[picked ? 'gold' : 'white']"
       :stroke="[picked ? '#333' : '#333']"
       stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="heart">
    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
  </svg>
</template>

<style scoped>
.heart {
  cursor: pointer;
}
.heart-animation {
  animation: .35s animation ease-in-out;
}

@keyframes animation {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(2);
  }
}
</style>