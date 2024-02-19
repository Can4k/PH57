<script setup>
import JSZip from "jszip";

import {useScroll, useWindowSize, useElementBounding} from "@vueuse/core";
import {computed, onMounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useStore} from "vuex";

import PhotosFilter from "@/components/PhotosFilter.vue";
import Photo from "@/components/Photo.vue";

import Image from "primevue/image";
import Button from "primevue/button";
import Skeleton from 'primevue/skeleton';
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

const router = useRouter()
const route = useRoute()
const store = useStore()

const {width, height} = useWindowSize()
const {arrivedState} = useScroll(window);

onMounted(() => {
  FindAccess();
})

const FindAccess = () => {
  if (route.hash.length === 0) {
    return CheckStorageAccess();
  }

  // пытаемся найти access_token внутри route.hash
  const hash = route.hash.slice(1, route.hash.length);
  const params = hash.split('&');
  let access_token = null;

  for (const param of params) {
    const tmp = param.split('=');
    if (tmp[0] === 'access_token') {
      access_token = tmp[1];
      break
    }
  }

  if (access_token === null) {
    return CheckStorageAccess();
  }

  store.dispatch('AccessModule/GetGmailDataByAccess', {access_token})
}

const CheckStorageAccess = () => {
  if (localStorage.access_token) {
    return store.dispatch('AccessModule/GetGmailDataByAccess', {
      access_token: localStorage.access_token
    })
  }
}

const PhotoList = ref(null);
const IndexInPhotoListByName = ref({});
const loaded = ref(false);

// флаг на то, что у нас идет дополнительная загрузка
const loading = ref(false);

const GetPickedPhotoUrl = computed(() => {
  return store.state.API + store.state.ImageModule.API_MAP.GetPhoto + `?id=` + store.state.VoteModule.pickedPhotoId;
})

const PhotosTags = ref([]);
const PhotosLimit = computed(() => Math.floor(width.value / 320) * Math.floor(height.value / 180) + 10);
const PhotosOffset = ref(1);
const PhotoRequestParams = computed(() => {
  return {
    tags: PhotosTags.value,
    limit: PhotosLimit.value,
    offset: PhotosOffset.value
  }
})

const AmountOfSkeletons = computed(() => {
  return Math.min(20, Math.floor(width.value / 320) * Math.floor(height.value / 180));
})

const GetAllPhotoTags = () => {
  store.dispatch('ImageModule/GetAllPhotoTags');
}

const GetPhotosTags = () => {
  store.dispatch('ImageModule/GetPhotosTags', PhotoRequestParams.value).then(TagsList => {
    for (const PhotoInfo of TagsList ?? []) {
      const CurrentName = PhotoInfo.Path.slice(PhotoInfo.Path.lastIndexOf('/') + 1);
      PhotoList.value[IndexInPhotoListByName.value[CurrentName]].tags = PhotoInfo.Tags;
    }
    loading.value = false;
    loaded.value = true;
  });
}

const GetAllPhotos = async () => {
  loading.value = true;
  const AllPhotos = await store.dispatch('ImageModule/GetPhotos', PhotoRequestParams.value);
  if (!AllPhotos) {
    return
  }

  await GeneratePhotoList(AllPhotos);
}

const ReGetPhotos = async () => {
  loading.value = true;
  loaded.value = false;

  PhotoList.value = [];
  PhotosOffset.value = 1;

  const AllPhotos = await store.dispatch('ImageModule/GetPhotos', PhotoRequestParams.value);
  if (!AllPhotos) {
    return
  }

  await GeneratePhotoList(AllPhotos);
}

onMounted(() => {
  GetAllPhotoTags();
  GetAllPhotos();
})

async function GeneratePhotoList(response) {
  response = await response.arrayBuffer();
  response = await JSZip.loadAsync(response);
  const imageFiles = Object.keys(response.files).filter(filename => /\.(jpe?g|png|gif)$/i.test(filename));
  await TransformPhotoList(imageFiles, response);
  await GetPhotosTags();
}

async function TransformPhotoList(imageFiles, response) {
  PhotoList.value ??= [];

  for (const filename of imageFiles) {
    const blob = await response.file(filename).async('blob');

    const CurrentId = +filename.slice(0, filename.lastIndexOf('.'));

    PhotoList.value.push({
      name: filename,
      Url: store.state.API + store.state.ImageModule.API_MAP.GetPhoto + `?id=${CurrentId}`,
      CompressedUrl: URL.createObjectURL(blob),
      id: CurrentId
    });

    IndexInPhotoListByName.value[filename] = PhotoList.value.length - 1;
  }

  PhotoList.value = PhotoList.value.sort((photo1, photo2) => {
    return photo1.id < photo2.id ? -1 : photo1.id === photo2.id ? 0 : 1;
  })
}

const updateTagsList = (NewTagsList) => {
  PhotosTags.value = NewTagsList;
  ReGetPhotos();
}

onMounted(() => {
  window.scrollTo({top: 0, behavior: 'smooth'});
});

onMounted(() => {
  watch(() => arrivedState.bottom, (val) => {
    if (loading.value || !loaded.value) {
      return
    }

    if (val) {
      PhotosOffset.value += PhotosLimit.value;
      GetAllPhotos();
    }
  })
});

const GaleryLabel = ref(null);
const {top} = useElementBounding(GaleryLabel);

const ShowFilter = computed(() => top.value <= 130);
const ResetFilter = () => {
  PhotosTags.value = [];
  ReGetPhotos();
}

const GotoResult = () => {
  router.push('/result');
}
</script>

<template>
  <div class="home-view">
    <div class="header">
      <div class="vote-verdict"
           :class="store.state.AccessModule.Account === null
            ? 'to-enter'
            : (store.state.VoteModule.pickedPhotoId === -1
            ? 'no-vote'
            : '')">
        {{
          store.state.AccessModule.Account === null
              ? 'войди через школьную почту!'
              : (store.state.VoteModule.pickedPhotoId === -1
                  ? 'голосуй за понравившуюся фотку!'
                  : ``)
        }}
      </div>
    </div>

    <Button
        id="goto-result-button"
        size="large"
        severity="success"
        label="Результаты"

        @click="GotoResult"
    />

    <transition>
      <div ref="bottomOfPick" v-show="store.state.VoteModule.pickedPhotoId >= 1" class="out-vote">
        <h1 style="margin-bottom: 24px">ваш выбор</h1>
        <div class="picked-label">#{{ store.state.VoteModule.pickedPhotoId }}</div>
        <Image preview>
          <template #image>
            <img :src="GetPickedPhotoUrl" class="vote-image" alt="Выбранное фото"/>
          </template>
          <template #preview>
            <img :src="GetPickedPhotoUrl" class="full-image" alt="Загрузка"/>
          </template>
        </Image>
<!--        <img alt="фото" :src="GetPickedPhotoUrl">-->
      </div>
    </transition>

    <div class="galery">
      <div class="photos-filter-wrapper">
        <PhotosFilter v-show="loaded && ShowFilter" @initNewTags="updateTagsList" :picked-tags="PhotosTags"/>
      </div>

      <h1 ref="GaleryLabel">галерея</h1>

      <transition mode="out-in">
        <div v-show="loaded" class="images-container">
          <Photo
              :key="photo.name"
              v-for="photo in PhotoList"
              :photo="photo"
          />
          <div class="empty-photolist" v-show="loaded && PhotoList?.length === 0">
            <div class="empty-label">
              Фотографии не найдены
            </div>
            <Button @click="ResetFilter" size="small" v-show="PhotosTags.length" label="Сбросить фильтр"/>
          </div>
        </div>
      </transition>

      <PulseLoader color="#007bff" v-show="loading && loaded" class="pulse-loader"/>
    </div>

    <div v-show="!loaded" class="skeleton-container">
      <Skeleton
          v-for="sklt in AmountOfSkeletons"
          width="320px"
          height="180px">
      </Skeleton>
    </div>
  </div>
</template>

<style scoped>
.skeleton-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 24px;
}

.skeleton-container > * {
  margin: 10px;
}

.images-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.images-container > * {
  margin: 10px;
}

.home-view {
  padding: 20px;
}

.pulse-loader {
  margin: 20px 0 24px;
}

.vote-verdict {
  box-shadow: 0 0 10px -4px black;
}

.no-vote {
  display: inline-flex;
  color: white;
  background-color: rgba(185, 66, 157, 0.5);
  padding: 8px;
  border-radius: 6px;
}

.have-vote {
  display: inline-flex;
  color: white;
  background-color: rgba(66, 185, 131, 0.5);
  padding: 8px;
  border-radius: 6px;
}

.to-enter {
  display: inline-flex;
  color: white;
  background-color: rgba(0, 123, 255, 50%);
  padding: 8px;
  border-radius: 4px;
}

.photos-filter-wrapper {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  z-index: 1000;
  position: fixed;
  top: 130px;
}

.header {
  z-index: 1001;
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translate(-50%);
  width: 100%;
}

.empty-photolist {
  margin-top: 0px;
}

.picked-image-wrapper {
  justify-content: center;
  display: flex;
}

.picked-image {
  max-height: 50vh;
}

h1 {
  margin: 12px 0 12px;
}

.vote-image {
  max-width: 80vw;
  max-height: 50vh;
  margin-bottom: 12px;
}

.full-image {
  max-height: 80vh;
  max-width: 80vw;
}


.galery {
  position: relative;
}

.picked-label {
  font-size: 18px;
  margin-bottom: 8px;
  font-weight: 700;
}

.empty-label {
  margin-bottom: 12px;
}

#goto-result-button {
  margin: 16px 0;
}
</style>
