<template>
  <div class="page page--stories">
    <hero :img="storyHero" />
    <div class="post-container">
      <h3 class="page-title">{{ stories.length ? 'HarrisonFM Stories' : 'Loading...' }}</h3>
      <transition-group name="fade" tag="div">
        <StoryArticle v-for="story in stories" :key="story.term_id" :article="{
          image: story.featured,
          title: story.name,
          link: '/stories/'+story.slug,
          desc: story.description
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
  beforeMount: function() {
    this.getStories().then(response => {
      analytics.trackPageView('Stories');
      window.prerenderReady = true;
    });
  },
  computed: {
    ...mapGetters(['stories', 'storyHero'])
  },
  methods: {
    ...mapActions(['getStories'])
  },
  metaInfo () {
    return meta.formatMeta('HarrisonFM - Stories', this.storyDescription, this.storyHero.images)
  },
  components: {
    Hero, StoryArticle
  },
};
</script>