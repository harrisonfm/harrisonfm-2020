<template>
  <section>
    <h1 class="page-title mb-2 lg:mb-4"><slot /></h1>
    <div class="photos-grid">
      <article v-for="el in section" :id="'article-'+el.slug" class="overlay-article jiggle-on-hover">
        <router-link :to="{
          name: 'PhotosGallery',
          params: { gallerySlug: el.slug }
        }">
          <div class="title">{{ el.title }}</div>
          <div class="overlay" />
        </router-link>
        <v-style>{{ parseBackground(el.featured, el.slug) }}</v-style>
      </article>
    </div>
  </section>
</template>
<style scoped>
.photos-grid {
  @apply w-full grid gap-2 lg:gap-4 grid-cols-1 md:grid-cols-2;
}
</style>
<script>
export default {
  props: ['section'],
  methods: {   
    parseBackground(image, slug) {
      return `
      #article-${slug} {
        background-image: url('${image.images.medium_large.src}');
      }
      @media(min-width:${image.images.large.width / 2}px) {
        #article-${slug} {
          background-image: url('${image.images.large.src}');
        }
      }
      @media(min-width:768px) and (max-width:${image.images.large.width}px) {
        #article-${slug} {
          background-image: url('${image.images.medium_large.src}');
        }
      }`;
    },
  }
}
</script>