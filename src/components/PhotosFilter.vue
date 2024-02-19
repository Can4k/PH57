<script setup>
import Tag from "primevue/tag";
import Button from "primevue/button";
import {computed, defineAsyncComponent, ref, watch} from "vue";
import {useStore} from "vuex";
import ObjectUtil from "@/plagins/object.util";
import {useWindowSize} from "@vueuse/core";

const X = defineAsyncComponent(() => import('@/components/icons/x.vue'))

const store = useStore()

const props = defineProps({
  pickedTags: {type: Object}
});

const {width} = useWindowSize()

const emit = defineEmits([
  'initNewTags'
])

const newPickedTags = ref([]);

const LabelColor = computed(() => props.pickedTags?.length ? '#333' : '#33333354');
const TagsList = computed(() => store.state.ImageModule.TagsList);
const hidden = ref(true);

const openFilter = () => {
  newPickedTags.value = ObjectUtil.deep_copy(props.pickedTags);
  hidden.value = false;
}

const TagPicked = (tag) => {
  const index = newPickedTags.value.indexOf(tag);
  if (index === -1) {
    newPickedTags.value.push(tag);
  } else {
    newPickedTags.value.splice(index, 1);
  }
}

const initNewTags = () => {
  emit('initNewTags', newPickedTags.value);
  hidden.value = true;
}
</script>

<template>
  <div class="photos-filter">
    <div :style="{'color' : LabelColor}" @click="openFilter" class="preview">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" :stroke="LabelColor"
           stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="filter">
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
      </svg>
      <div style="margin-left: 4px" v-show="width >= 800 || !hidden">фильтр</div>
    </div>

    <X @click="hidden = true" width="22" class="close-button" v-show="!hidden"/>

    <div v-show="!hidden" class="tags">
      <Tag @click="TagPicked(tag)" :class="{'not-picked' : !newPickedTags?.includes(tag)}" :value="tag"
           v-for="tag in TagsList"/>
    </div>

    <Button @click="initNewTags" v-show="!hidden" class="accept" label="Применить" type="submit" size="small"/>
  </div>
</template>

<style scoped>
.photos-filter {
  position: relative;
  background-color: white;
  border-radius: 4px;
  padding: 8px;
  border: 1px solid rgba(51, 51, 51, 0.33);
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  max-width: 200px;
}

.preview {
  display: flex;
  color: rgba(51, 51, 51, 0.33);
  cursor: pointer;
  font-size: 16px;
  flex: 1;
}

.tags {
  margin-top: 6px;
  min-width: 150px;
  display: flex;
  flex-wrap: wrap;
}

.tags > * {
  margin: 4px;
  cursor: pointer;
}

.close-button {
  right: 4px;
  top: 4px;
  position: absolute;
}

.not-picked {
  background-color: rgba(13, 110, 253, 0.33);
}

.accept {
  margin-top: 8px;
}
</style>