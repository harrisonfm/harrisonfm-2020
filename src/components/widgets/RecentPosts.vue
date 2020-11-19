<template>
  <div class="widget recent-posts">
    <div v-if="recentPostsLoaded" class="grid gap-4 auto-rows-fr md:grid-cols-2">
      <article v-for="post in recentPosts(limit)" :key="post.id" >
        <router-link tag="div" :to="post.slug" :style="'background-image: url('+(post.featured_media ? '/wp-content/uploads/'+post._embedded['wp:featuredmedia'][0].media_details.file : 'https://res.cloudinary.com/evanagee/image/upload/c_scale,h_400/v1580267636/VueWP/Youtube-bg_00240.jpg')+')'" class="bg-cover bg-center cursor-pointer h-article md:h-articleMD flex items-center justify-center relative"> 
          <div class="text-white font-bold text-2xl z-10">{{ post.title.rendered }}</div>
          <div class="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-25 transition-opacity duration-150 z-0"></div>
        </router-link>
        <p class="text-gray-700 text-base" v-html="post.excerpt.rendered"></p>
      </article>
    </div>
    <div v-else>Loading...</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: ['limit'],
  computed: {
    ...mapGetters({
      recentPosts: 'recentPosts',
      recentPostsLoaded: 'recentPostsLoaded',
    }),
  },

  methods: {
  },

  mounted() {
    this.$store.dispatch('getPosts', { limit: this.limit });
  },
};
</script>
