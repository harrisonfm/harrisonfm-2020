<template>
  <div class="hero">
    <v-style>{{ parseBackground(img) }}</v-style>
    <transition name="fade">
      <h2 class="title" v-if="title === true && img">
        Harrison <img :src="Bolt" class="icon icon-1" /><span class="font-bold"> FM </span><img class="icon" :src="Bolt" />
      </h2>
      <h2 class="title" v-else-if="title && img">{{ title }}</h2>
    </transition>
    <div class="overlay" v-if="title" />
  </div>
</template>
<style>
.hero {
  @apply bg-cover bg-center h-article md:h-hero bg-gray-500 xxl:w-screen flex relative z-neg;
}
.title {
  @apply text-center m-auto text-white uppercase flex text-6xl items-center;
}
.icon {
  @apply filter invert mx-1 h-16;
}
.icon-1 {
  @apply transform rotate-180 ml-4
}
@screen xxl {
  .hero {
    margin-left: calc((100vw - theme('screens.xxl')) / -2);
  }
}
</style>
<script>
import Bolt from '~/assets/bolt.svg'
export default {
  props: ['img', 'title'],
  data() {
    return {
      Bolt: Bolt
    };
  },
  methods: {
    parseBackground(img) {
      if(img.images) {
        return `
        .hero {
          background-image: url('${img.images.medium_large.src}');
        }
        @media(min-width:${img.images.large.width / 2}px) {
          .hero {
            background-image: url('${img.images.large.src}');
          }
        }
        @media(min-width:${img.images['1536x1536'].width / 2}px) {
          .hero {
            background-image: url('${img.images['1536x1536'].src}');
          }
        }
        @media(min-width:${img.images['2048x2048'].width / 2}px) {
          .hero {
            background-image: url('${img.images['2048x2048'].src}');
          }
        }`;
      }
    }
  }
}
</script>