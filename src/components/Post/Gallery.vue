<template>
  <div class="post-gallery">
    <h4 class="gallery-header"><router-link to="Harrigrams" v-if="title" class="gallery-header-link">{{ title }}</router-link></h4>
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
  @apply xs:grid xs:gap-2 lg:gap-4 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4;
}
.post-gallery .gallery-link {
  @apply block relative mb-2 xs:m-0;
}
.gallery-img {
  @apply rounded shadow w-full h-full;
}
.gallery-header {
  @apply font-bold mb-0 uppercase col-span-full;
}
.post-gallery.harrigrams-posts {
  @apply grid-cols-2 md:grid-cols-4 xl:grid-cols-8;
}
</style>
<script>
export default {
  props: ['gallery', 'route', 'title'],
  created() {
    console.log(this.gallery, this.gallery.featured, this.gallery.images);
  }
};
</script>
