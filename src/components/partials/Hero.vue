<template>
  <div class="hero bg-cover bg-center h-article md:h-hero bg-gray-500 xxl:w-screen flex" :style="'background-image: url('+img+')'">
    <h2 class="text-center m-auto text-white uppercase" v-if="title">{{ title }}</h2>
  </div>
</template>
<script>
export default {
  props: ['img', 'title']
}
</script>