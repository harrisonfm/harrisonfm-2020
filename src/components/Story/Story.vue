<template>
  <div class="page page--stories">
    <hero :title="currentStory.term.name" :img="currentStory.term.featured" />
    <div class="post-container" v-if="currentStoryLoaded">
      <div class="mb-4">
        <p>{{currentStory.term.description}}</p>
      </div>
      <StoryArticle v-for="post in currentStory.posts" :key="post.id" :article="{
        image: post.featured,
        title: post.post_title,
        link: post.link,
        desc: post.post_excerpt
      }" />
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import meta from '~/meta';
import Hero from '~/components/partials/Hero.vue'
import StoryArticle from './Article.vue'

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
      this.setCurrentStory();
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
    })
  },
  metaInfo () {
    return meta.formatMeta(this.currentStory.term.name, this.currentStory.term.description, this.currentStory.term.featured.images, window.location.href);
  },
  components: {
    Hero, StoryArticle
  },
};
</script>