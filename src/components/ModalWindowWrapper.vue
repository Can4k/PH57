<script setup>
import {defineAsyncComponent, watch} from "vue";

const props = defineProps({
  active: {type: Boolean, default: false, required: true}
})

watch(() => props.active, (val) => {
  if (val) {
    document.body.style.overflowY = 'hidden';
  } else {
    document.body.style.overflowY = 'revert';
  }
})

</script>

<template>
  <transition>
    <div v-show="active" class="modal-window-wrapper">
      <slot>

      </slot>
    </div>
  </transition>
</template>

<style scoped>
.modal-window-wrapper {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 6;

  display: flex;
  align-items: center;
  justify-content: center;
}

</style>

<style>
.modal-window {
  position: relative;
  max-width: 80%;
  border-radius: 16px;
  padding: 40px;
  background-color: white;
}
.modal-X {
  position: absolute;
  right: 10px;
  top: 10px;
}
</style>