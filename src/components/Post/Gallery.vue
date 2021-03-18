<template>
  <div class="post-gallery">
    <div v-for="photo in gallery.images" class="flex items-center justify-center" >
      <router-link replace :to="{
          name: 'PostPhoto',
          params: { idSlug: photo.ID + '-' + photo.post_name }
        }">
        <img :src="photo.images.full" class="rounded shadow md:max-h-col2 xl:max-h-col3 xxl:max-h-col3xxl" />
      </router-link>
    </div>
  </div>
</template>
<style scoped>
.post-gallery {
  @apply md:grid gap-4 auto-rows-fr md:grid-cols-2 xl:grid-cols-3;
}
.post-gallery > div {
  @apply mb-4 md:m-0;
}
</style>
<script>
export default {
  props: ['gallery']
};
</script>
