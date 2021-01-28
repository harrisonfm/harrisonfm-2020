<template>
  <div class="page page--home">
    <hero :title="'HarrisonFM was here'" :img="this.hero"></hero>
    <recent-posts-widget class="xxl:rounded xxl:shadow xxl:-my-16">{{ this.pageString }}</recent-posts-widget>
  </div>
</template>

<script>
import postsPageMixin from '~/mixins/PostsPage.vue'
import Hero from '~/components/partials/Hero.vue'
import api from "~/api";

export default {
  mixins: [postsPageMixin],
  components: {
    Hero,
  },
  beforeMount() {
    api.getHome(data => {
      this.hero = data.hero;
    });
  }
};
</script>
