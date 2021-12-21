<template>
  <div class="page page--stories">
    <hero :title="currentStory.term.name" :img="currentStory.term.featured" />
    <div class="post-container">
      <Loader v-if="!currentStory.loaded" />
      <transition-group name="fade" tag="div">
        <div class="mb-2 lg:mb-4" key="desc" v-if="currentStory.term.description">
          <p>{{currentStory.term.description}}</p>
        </div>
        <StoryArticle v-for="post in currentStory.posts" :key="post.ID" :article="{
          image: post.featured,
          title: post.post_title,
          link: post.link,
          desc: post.post_excerpt
        }" />
      </transition-group>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import meta from '~/meta';
import analytics from '~/analytics';
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
  computed: {
    ...mapGetters(['currentStory']),
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
        analytics.trackPageView(this.currentStory.term.name);
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