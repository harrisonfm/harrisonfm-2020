<template>
  <div class="page page--stories">
    <hero :title="currentStory.term.name" :img="currentStory.term.image.url" />
    <div class="xxl:rounded xxl:shadow xxl:-my-16 bg-white p-4" v-if="currentStoryLoaded">
      <div class="mb-4">
        <p>currentStory.description</p>
      </div>
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
import { mapActions, mapGetters, mapMutations } from "vuex";
import meta from '~/meta';
import Hero from '~/components/partials/Hero.vue'

export default {
  props: ['storySlug'],
  beforeMount: function() {
    this.getStory({
      slug: this.storySlug
    });
  },
  beforeRouteUpdate(to, from, next) {
    if(to.name === 'Story' && from.name === 'Story') {
      console.log('update story', to, from);
      this.setCurrentStory({
        term: {image: {}},
        posts: {}
      });
      this.getStory({
        slug: to.params.story
      });
    }
    next();
  },
  computed: {
    ...mapGetters(['currentStoryLoaded', 'currentStory']),
  },
  methods: {
    ...mapActions(['getStory']),
    ...mapMutations({
      'setCurrentStory': 'STORY_CURRENT',
    }),
    parseBackground(post) {
      if(post.featured) {
        return post.featured.images.full;
      }
    },
  },
  metaInfo () {
    return meta.formatMeta(this.currentStory.term.name, this.currentStory.term.description, this.currentStory.term.image.url, window.location.href);
  },
  components: {
    Hero
  },
};
</script>