<template>
  <div class="post-gallery">
    <router-link class="gallery-link" v-for="photo in gallery.images" :to="{
        name: route,
        params: { idSlug: photo.ID + '-' + photo.post_name }
      }">
      <img v-lazy="photo.images.square_gallery.src" class="gallery-img" />
      <div class="overlay" />
    </router-link>
  </div>
</template>
<style scoped>
.post-gallery {
  @apply xs:grid xs:gap-2 lg:gap-4 xs:auto-rows-fr xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4;
}
.post-gallery .gallery-link {
  @apply block relative mb-2 xs:m-0;
}
.gallery-img {
  @apply rounded shadow w-full h-full;
}
</style>
<script>
export default {
  props: ['gallery', 'route']
};
</script>
