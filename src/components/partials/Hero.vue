<template>
  <div class="hero">
    <v-style>{{ parseBackground(img) }}</v-style>
    <transition name="fade">
      <h2 class="title text-7xl" v-if="title === true && img">
        <span class="hidden sm:inline">Harrison </span><img :src="Bolt" class="icon icon-1" /><span class="font-bold"><span class="sm:hidden">H</span>FM</span><img class="icon" :src="Bolt" />
      </h2>
      <h2 class="title text-3xl sm:text-6xl" v-else-if="title && img">{{ title }}</h2>
    </transition>
    <div class="overlay" v-if="title" />
  </div>
</template>
<style>
.hero {
  @apply bg-cover bg-center h-article md:h-hero bg-gray-500 dark:bg-gray-700 xxl:w-screen xxl:h-heroDesktop flex relative z-neg p-2 lg:p-4;
}
.title {
  @apply text-center m-auto text-white uppercase flex items-center;
}
.icon {
  @apply invert mx-1 h-16;
}
.icon-1 {
  @apply rotate-180 ml-4
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