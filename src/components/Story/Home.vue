<template>
  <div class="page page--stories">
    <hero :title="'HFM Stories'" :img="storyHero" />
    <div class="post-container" v-if="storiesLoaded">
      <StoryArticle v-for="story in stories" :key="story.term_id" :article="{
        image: story.image,
        title: story.name,
        link: '/stories/'+story.slug,
        desc: story.description
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
  beforeMount: function() {
    this.getStories();
  },
  computed: {
    ...mapGetters(['stories', 'storiesLoaded', 'storyHero'])
  },
  methods: {
    ...mapActions(['getStories'])
  },
  metaInfo () {
    return meta.formatMeta('HarriFM Stories', 'stories are an important part of an HFM approved diet', this.storyHero.images ? this.storyHero.images.large.src : '', window.location.href)
  },
  components: {
    Hero, StoryArticle
  },
};
</script>