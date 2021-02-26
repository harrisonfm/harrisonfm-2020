<template>
  <div class="page page--stories">
    <hero :title="'HFM Stories'" :img="this.storyHero.url" />
    <div class="xxl:rounded xxl:shadow xxl:-my-16 bg-white p-4" v-if="storiesLoaded">
      <article class="grid grid-cols-6 gap-4 bg-gray-100 mb-4 last:mb-0" v-for="story in stories" :key="story.term_id" >
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
import postsPageMixin from '~/mixins/PostsPage.vue'
import { mapActions, mapGetters, mapMutations } from "vuex";
import meta from '~/meta';

export default {
  mixins: [postsPageMixin],
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
};
</script>