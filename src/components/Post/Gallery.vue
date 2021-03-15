<template>
  <div class="grid gap-4 auto-rows-fr md:grid-cols-2 xl:grid-cols-3">
    <div v-for="photo in gallery" class="flex items-center justify-center" >
      <router-link :to="{
          name: 'PostPhoto',
          params: { idSlug: photo.ID + '-' + photo.post_name }
        }">
        <img :src="photo.images.full" class="rounded shadow md:max-h-col2 xl:max-h-col3 xxl:max-h-col3xxl" />
      </router-link>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    gallery: Array
  }
};
</script>
