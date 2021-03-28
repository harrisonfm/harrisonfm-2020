<template>
  <div class="page page--stories">
    <hero :title="currentStory.term.name" :img="currentStory.term.image" />
    <div class="post-container" v-if="currentStoryLoaded">
      <div class="mb-4">
        <p>{{currentStory.term.description}}</p>
      </div>
      <article class="story-article" v-for="post in currentStory.posts" :key="post.id" >
        <router-link class="md:w-1/3" :to="post.link">
          <img sizes="(max-width: 767px) 100w, 33.33w" :srcset="`${post.featured.images.medium_large} 384w, ${post.featured.images.large} 512w, ${post.featured.images['1536x1536']} 768w`" :src="post.featured.images.large" />
        </router-link>
        <div class="description">
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
        slug: to.params.storySlug
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
    return meta.formatMeta(this.currentStory.term.name, this.currentStory.term.description, this.currentStory.term.images.large, window.location.href);
  },
  components: {
    Hero
  },
};
</script>