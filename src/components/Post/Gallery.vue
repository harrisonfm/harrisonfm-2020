<template>
  <div class="post-gallery">
    <router-link class="flex" v-for="photo in gallery.images" :to="{
        name: route,
        params: { idSlug: photo.ID + '-' + photo.post_name }
      }">
      <img v-lazy="photo.images.square_gallery.src" class="rounded shadow" />
      <div class="overlay" />
    </router-link>
  </div>
</template>
<script>
export default {
  props: ['gallery', 'route']
};
</script>
