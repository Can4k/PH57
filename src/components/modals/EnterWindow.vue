<script setup>
import {defineAsyncComponent} from "vue";

import Button from "primevue/button";

const X = defineAsyncComponent(() => import('@/components/icons/x.vue'))
</script>

<template>
  <div class="enter-window modal-window">
    <X class="modal-X"/>
    <div class="enter-text">
      <b>Вход</b> по школьной почте
    </div>
    <Button label="Войти"></Button>
  </div>
</template>

<style scoped>
.enter-window {
  display: flex;
  flex-direction: column;
}
.enter-text {
  margin-bottom: 8px;
}
</style>