<template>
  <div class="page page--stories">
    <hero :title="currentStory.term.name" :img="currentStory.term.featured" />
    <div class="post-container">
      <transition-group name="fade" tag="div" v-if="currentStory.loaded">
        <div class="mb-2 lg:mb-4" key="desc">
          <p>{{currentStory.term.description}}</p>
        </div>
        <StoryArticle v-for="post in currentStory.posts" :key="post.ID" :article="{
          image: post.featured,
          title: post.post_title,
          link: post.link,
          desc: post.post_excerpt
        }" />
      </transition-group>
      <Loader v-else />
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
    this.handleGetStory(this.storySlug);
  },
  beforeRouteUpdate(to, from, next) {
    if(to.name === 'Story' && from.name === 'Story') {
      this.setCurrentStory();
      this.handleGetStory(to.params.storySlug);
    }
    next();
  },
  beforeRouteLeave(to, from, next) {
    this.setCurrentStory();
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
    handleGetStory(slug) {
      this.getStory({
        slug: slug
      }).then(response => {
        console.log('story archives resolves');
        window.prerenderReady = true;
      }, error => {
        console.log('story component errors', this.$route.path);
        this.$_error('ErrorPage', {
          route: this.$route.path
        });
      });
    }
  },
  metaInfo () {
    return meta.formatMeta(this.currentStory.term.name, this.currentStory.term.description, this.currentStory.term.featured.images);
  },
  components: {
    Hero, StoryArticle
  },
};
</script>