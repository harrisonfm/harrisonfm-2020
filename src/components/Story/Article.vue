<template>
  <article class="story-article">
    <router-link class="md:w-1/2" :to="article.link">
      <img sizes="(max-width: 767px) 100w, 50w" :srcset="article.image.images.medium_large.src+' '+article.image.images.medium_large.width+'w, '+article.image.images.large.src+' '+article.image.images.large.width+'w, '+article.image.images['1536x1536'].src+' '+article.image.images['1536x1536'].width+'w'" :src="article.image.images.large.src" />
    </router-link>
    <div class="description">
      <router-link :to="article.link"><h2 class="font-bold text-2xl leading-none">{{ article.title }}</h2></router-link>
      <p class="text-gray-700 text-base" v-html="article.desc"></p>
    </div>
  </article>
</template>
<script>
export default {
  props: ['article']
}
</script>