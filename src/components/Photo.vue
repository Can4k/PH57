<script setup>
import Tag from 'primevue/tag';
import Image from "primevue/image";
import Love from "@/components/icons/love.vue";
import {useStore} from "vuex";
import {computed, ref} from "vue";

const store = useStore()

const props = defineProps({
  photo: {type: Object, default: {}},
});

const GetPhoto = async () => {
  if (props.photo.Url) {
    return
  }

  await store.dispatch('ImageModule/GetPhoto', {
    id: props.photo.id,
  })
}

const loaded = computed(() => {
  if (!props.photo.tags) {
    return false
  }
  return true;
});

const IsMakingVote = ref(false);

const MakeVote = async () => {
  if (IsMakingVote.value) {
    return
  }

  IsMakingVote.value = true;
  await store.dispatch('VoteModule/MakeVote', {
    id: props.photo.id
  })
  IsMakingVote.value = false;
}

const isPhotoPicked = computed(() => store.state.VoteModule.pickedPhotoId === props.photo.id);


const normalize_count_form = (number, words_arr) => {
  number = Math.abs(number);
  if (Number.isInteger(number)) {
    let options = [2, 0, 1, 1, 1, 2];
    return words_arr[(number % 100 > 4 && number % 100 < 20) ? 2 : options[(number % 10 < 5) ? number % 10 : 5]];
  }
  return words_arr[1];
}
</script>

<template>
  <div :class="{'picked-photo' : isPhotoPicked}" v-show="loaded" @click="GetPhoto" class="photo">
    <div class="number">
      #<b>{{ props.photo.id }}</b>
      <span class="result" v-if="photo.Votes !== undefined">
        - <b>{{ photo.Votes }}</b> {{ normalize_count_form(photo.Votes, ['голос', 'голоса', 'голосов']) }}
      </span>
    </div>
    <Image alt="Image" preview>
      <template #image>
        <img :src="photo.CompressedUrl" alt="image"/>
      </template>
      <template #preview="slotProps">
        <img class="full-image" :src="photo.Url" alt="Загрузка" :style="slotProps.style" @click="slotProps.onClick"/>
      </template>
    </Image>

    <div class="place" v-if="photo.Place">
      <b>{{photo.Place}} место</b>
    </div>

    <div class="tags">
      <Tag v-for="tag in photo.tags" :key="tag" :value="tag"></Tag>
      <Love :picked="isPhotoPicked" v-show="store.state.AccessModule.Account" @click="MakeVote" class="right-pos"/>
    </div>
  </div>
</template>

<style scoped>
.photo {
  width: 320px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  border-radius: 8px;
  transition-duration: .35s;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-left: 0px;
  margin-right: 0px;
  padding-right: 34px;
  position: relative;
}

.tags > * {
  margin: 4px;
}

.right-pos {
  position: absolute;
  right: 0;
  align-self: flex-start;
}

.full-image {
  max-height: 80vh;
  max-width: 80vw;
}

.number {
  font-size: 16px;
  padding-top: 8px;
  padding-bottom: 8px;
}

.picked-photo {
  background-color: #333;
  box-shadow: 0 0 20px -8px #333;
  color: white;
}

.result {
  color: green;
}

.place {
  margin-top: 8px;
  color: #333;
  font-style: italic;
}
</style>