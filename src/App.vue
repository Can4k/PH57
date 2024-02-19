<script setup>
import oauthModule from "@/modules/oauth.module";
import { defineAsyncComponent, onMounted, ref } from "vue";
import { useStore } from "vuex";

const SiteHeader = defineAsyncComponent(() =>
  import("@/components/SiteHeader.vue")
);

const WarnPanel = defineAsyncComponent(() =>
  import("@/components/modals/WarnPanel.vue")
);

const store = useStore();

const ShowApp = ref(false);
async function SighOut() {
  const SighOut = await store.dispatch("AccessModule/SignOut");
  if (SighOut) {
    location.href = store.state.domain;
  }
}

function initEnter() {
  oauthModule.oauthSignIn();
}

onMounted(() => {
  setTimeout(() => (ShowApp.value = true), 1000);
});
</script>

<template>
  <div id="app">
    <WarnPanel />
    <transition>
      <SiteHeader v-show="ShowApp" @sighOut="SighOut" @initEnter="initEnter" />
    </transition>

    <router-view
      v-show="ShowApp"
      class="router-container"
      v-slot="{ Component }"
    >
      <transition mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<style>
#app {
  font-family: "Montserrat", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #333;
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
}

*::-webkit-scrollbar {
  width: 0;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

.router-container {
  margin-top: 120px;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.25s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

root {
  color: rgba(255, 215, 0, 0.33);
}
</style>
