<template>
  <div class="page page--stories">
    <hero :title="this.currentStory.term.name" :img="this.currentStory.term.image.url" />
    <div class="xxl:rounded xxl:shadow xxl:-my-16 bg-white p-4" v-if="currentStoryLoaded">
      <article class="grid grid-cols-6 gap-4 bg-gray-100 mb-4 last:mb-0" v-for="post in currentStory.posts" :key="post.id" >
        <router-link class="col-span-2" :to="post.link">
          <img class="w-full" :src="parseBackground(post)" />
        </router-link>
        <div class="col-span-4 p-4">
          <router-link :to="post.link"><h2 class="font-bold text-2xl">{{ post.post_title }}</h2></router-link>
          <p class="text-gray-700 text-base" v-html="post.post_excerpt"></p>
        </div>
      </article>
    </div>
  </div>
</template>
<script>
import postsPageMixin from '~/mixins/PostsPage.vue'
import { mapActions, mapGetters, mapMutations } from "vuex";

export default {
  mixins: [postsPageMixin],
  beforeMount: function() {
    this.getStory({
      slug: this.$route.params.story
    });
  },
  computed: {
    ...mapGetters(['currentStoryLoaded', 'currentStory']),
  },
  methods: {
    ...mapActions(['getStory']),
    parseBackground(post) {
      if(post.featured) {
        return '/wp-content/uploads/'+post.featured.file;  
      }
      return 'https://res.cloudinary.com/evanagee/image/upload/c_scale,h_400/v1580267636/VueWP/Youtube-bg_00240.jpg';
    },
  }
};
</script>