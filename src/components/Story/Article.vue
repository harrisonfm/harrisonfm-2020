<template>
  <article class="story-article">
    <router-link class="md:w-1/3" :to="article.link">
      <img sizes="(max-width: 767px) 100w, 33.33w" :srcset="`${article.image.images.medium_large} 768w, ${article.image.images.large} 1024w, ${article.image.images['1536x1536']} 1536w`" :src="article.image.images.large" />
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