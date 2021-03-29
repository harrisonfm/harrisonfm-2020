<template>
  <div class="hero">
    <v-style>{{ parseBackground(img) }}</v-style>
    <h2 class="text-center m-auto text-white uppercase" v-if="title">{{ title }}</h2>
  </div>
</template>
<style>
.hero {
  @apply bg-cover bg-center h-article md:h-hero bg-gray-500 xxl:w-screen flex;
}
@screen xxl {
  .hero {
    margin-left: calc((100vw - theme('screens.xxl')) / -2);
  }
}
</style>
<script>
export default {
  props: ['img', 'title'],
  methods: {
    parseBackground(img) {
      if(img.images) {
        return `
        .hero {
          background-image: url('${img.images.medium_large}');
        }
        @media(min-width:512px) {
          .hero {
            background-image: url('${img.images.large}');
          }
        }
        @media(min-width:768px) {
          .hero {
            background-image: url('${img.images['1536x1536']}');
          }
        }
        @media(min-width:1024px) {
          .hero {
            background-image: url('${img.images['2048x2048']}');
          }
        }`;
      }
    }
  }
}
</script>