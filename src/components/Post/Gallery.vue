<template>
  <div class="post-gallery">
    <h4 class="gallery-header"><router-link to="harrigrams" v-if="title" class="gallery-header-link">{{ title }}</router-link></h4>
    <router-link class="gallery-link" v-for="photo in gallery.images" :to="{
        name: route,
        params: { 
          pageSlug: route === 'Harrigram' ? 'harrigrams' : false,
          idSlug: photo.ID + '-' + photo.post_name
        }
      }">
      <img v-lazy="photo.images.square_gallery.src" class="gallery-img" />
      <div class="overlay" />
    </router-link>
  </div>
</template>
<style scoped>
.post-gallery {
  grid-template-rows: auto;
  @apply grid grid-cols-2 gap-2 xs:grid-cols-3 lg:gap-4 lg:grid-cols-4;
}
.post-gallery .gallery-link {
  @apply block relative;
}
.gallery-img {
  @apply rounded shadow w-full h-full dark:bg-gray-700;
}
.gallery-header {
  @apply font-bold mb-0 uppercase col-span-full dark:text-gray-100;
}
.post-gallery.harrigrams-posts {
  @apply grid-cols-2 md:grid-cols-4 xl:grid-cols-8;
}
</style>
<script>
export default {
  props: ['gallery', 'route', 'title']
};
</script>
