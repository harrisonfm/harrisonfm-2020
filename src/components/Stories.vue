<template>
  <div class="page page--stories">
    <div class="" v-if="storiesLoaded">
      <article class="flex" v-for="story in stories" :key="story.term_id" >
        <router-link :to="'/stories/'+story.slug">
          <img class="" :src="story.image.url" />
        </router-link>
        <div>
          <router-link :to="'/stories/'+story.slug"><h2 class="font-bold text-2xl">{{ story.name }}</h2></router-link>
          <p class="text-gray-700 text-base" v-html="story.description"></p>
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
    this.getStories();
  },
  computed: {
    ...mapGetters(['stories', 'storiesLoaded']),
  },
  methods: {
    ...mapActions(['getStories']),
    parseBackground(post) {
      console.log()
      if(post.image) {
        return 'background-image: url('+post.image.url+')';  
      }
    },
  }
};
</script>