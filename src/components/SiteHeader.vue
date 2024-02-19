<script setup>
import Button from "primevue/button";
import {useStore} from "vuex";

const store = useStore()

const emit = defineEmits([
    'initEnter',
    'sighOut'
])

function initEnter() {
  emit('initEnter');
}

function initSighOut() {
  emit('sighOut');
}

function getAvatarImg() {
  return store.state.AccessModule.Account.picture;
}
</script>

<template>
  <div class="site-header">
    <Button v-if="!store.state.AccessModule.Account" @click="initEnter" class="enter-vote">Войти</Button>
    <img @click="initSighOut" class="header-avatar" v-if="store.state.AccessModule.Account" :src="getAvatarImg()" alt="Аватар">
    <span style="color: #FAAF3B">фото</span>конкурс
    <img class="header-icon" alt="57" src="@/assets/icons/57logo.svg">
  </div>
</template>

<style>
.site-header {
  z-index: 5;
  background-color: white;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  border-bottom: 1px solid rgba(51, 51, 51, 0.1);
  height: 120px;
  font-weight: 900;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 30px;
}

.header-icon {
  height: 18px;
  margin-left: 9px;
}

.enter-vote {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 30px;
}

.header-avatar {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 30px;
  height: 48px;
  border-radius: 50%;
  cursor: pointer;
}

@media screen and (min-width: 800px) {
  .site-header {

  }
}
</style>