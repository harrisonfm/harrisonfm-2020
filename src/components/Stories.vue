<template>
  <div class="page page--stories">
    <hero :title="'HFM Stories'" :img="storyHero" />
    <div class="post-container" v-if="storiesLoaded">
      <article class="story-article" v-for="story in stories" :key="story.term_id" >
        <router-link class="md:w-1/3" :to="'/stories/'+story.slug">
          <img sizes="(max-width: 767px) 100w, 33.33w" :srcset="`${story.image.images.medium_large} 384w, ${story.image.images.large} 512w, ${story.image.images['1536x1536']} 768w`" :src="story.image.images.large" />
        </router-link>
        <div class="description">
          <router-link :to="'/stories/'+story.slug"><h2 class="font-bold text-2xl leading-none">{{ story.name }}</h2></router-link>
          <p class="text-gray-700 text-base" v-html="story.description"></p>
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
    return meta.formatMeta('HarriFM Stories', 'stories are an important part of an HFM approved diet', this.storyHero.images.large, window.location.href)
  },
  components: {
    Hero
  },
};
</script>