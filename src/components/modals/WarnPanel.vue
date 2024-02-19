<script setup>
import Toast from 'primevue/toast';
import {useToast} from 'primevue/usetoast';
import {onMounted} from "vue";
import emitter from "@/plagins/emitter";

const toast = useToast();

onMounted(() => {
  emitter.on('add_message', (params) => {
    toast.add({severity: params.severity, summary: params.summary, detail: params.detail, life: params.life});
  })
})
</script>

<template>
  <Toast position="top-center"/>
</template>

<style scoped>
</style>

<style>
.p-toast {
  z-index: 10;
  max-width: 80vw;
}

.p-toast-icon-close {
  box-shadow: none;
}

.p-toast-message {
  font-family: 'Montserrat', sans-serif;
}
</style>