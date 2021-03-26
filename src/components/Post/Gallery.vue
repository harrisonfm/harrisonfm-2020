<template>
  <div class="post-gallery">
    <router-link v-for="photo in gallery.images" :to="{
        name: 'PostPhoto',
        params: { idSlug: photo.ID + '-' + photo.post_name }
      }">
      <img :src="photo.images.square_gallery" class="rounded shadow" />
      <div class="overlay"></div>
    </router-link>
  </div>
</template>
<script>
export default {
  props: ['gallery']
};
</script>
