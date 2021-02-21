<template>
  <div class="hero bg-cover bg-center h-article md:h-hero bg-gray-500 xxl:w-screen flex" :style="'background-image: url('+img+')'">
    <h2 class="text-center m-auto text-white uppercase" v-if="title">{{ title }}</h2>
  </div>
</template>
<style>
@screen xxl {
  .hero {
    margin-left: calc((100vw - theme('screens.xxl')) / -2);
  }
}
</style>
<script>
export default {
  props: ['img', 'title']
}
</script>