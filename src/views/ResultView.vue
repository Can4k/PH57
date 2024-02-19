<script setup>
import Button from "primevue/button";
import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import {useStore} from "vuex";
import JSZip from "jszip";
import Photo from "@/components/Photo.vue";

const router = useRouter();
const store = useStore()

// state
const loaded = ref(false);


// utility
const GotoVote = () => {
  router.push('/vote');
}


// Результаты
const WiningStats = ref(null);
const GetWiningStats = async () => {
  WiningStats.value = await store.dispatch('ImageModule/GetWiningStats');
}
onMounted(async () => {
  await GetWiningStats();
})


// Фотографии
const PhotoList = ref([]);

async function GeneratePhotoList(response) {
  response = await response.arrayBuffer();
  response = await JSZip.loadAsync(response);
  const imageFiles = Object.keys(response.files).filter(filename => /\.(jpe?g|png|gif)$/i.test(filename));
  await TransformPhotoList(imageFiles, response);
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
      id: CurrentId,
      Votes: WiningStats.value[CurrentId].Votes,
      tags: [],
    });
  }

  PhotoList.value = PhotoList.value.sort((photo1, photo2) => {
    return photo1.Votes < photo2.Votes ? 1 : photo1.Votes === photo2.Votes ? 0 : -1;
  });

  PhotoList.value.forEach((photo, index) => {
    photo.Place = index + 1;
  });

  loaded.value = true;
}

onMounted(async () => {
  const response = await store.dispatch('ImageModule/GetPhotos', {
    offset: 0,
    limit: Number.MAX_SAFE_INTEGER
  });

  return GeneratePhotoList(response);
})

</script>

<template>
  <div id="ResultView">
    <Button
        id="goto-vote-button"
        size="large"
        label="На главную"

        @click="GotoVote"
    />

    <div id="images">
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
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
#ResultView {
  padding: 20px;
}

#goto-vote-button {
  margin: 16px 0;
}

.empty-photolist {
  margin-top: 0;
}

.empty-label {
  margin-bottom: 12px;
}

.images-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.images-container > * {
  margin-bottom: 64px;
}
</style>