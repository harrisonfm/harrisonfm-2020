<template>
  <div class="page page--stories">
    <hero :title="'HFM Stories'" :img="storyHero.url" />
    <div class="post-container" v-if="storiesLoaded">
      <article class="story-article" v-for="story in stories" :key="story.term_id" >
        <router-link class="col-span-2" :to="'/stories/'+story.slug">
          <img class="w-full" :src="story.image.url" />
        </router-link>
        <div class="col-span-4 p-4">
          <router-link :to="'/stories/'+story.slug"><h2 class="font-bold text-2xl">{{ story.name }}</h2></router-link>
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
    ...mapGetters(['stories', 'storiesLoaded', 'storyHero']),
  },
  methods: {
    ...mapActions(['getStories'])
  },
  metaInfo () {
    return meta.formatMeta('HarriFM Stories', 'stories are an important part of an HFM approved diet', this.storyHero.url, window.location.href)
  },
  components: {
    Hero
  },
};
</script>