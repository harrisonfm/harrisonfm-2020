<template>
  <div class="page page--home">
    <hero :title="'HarrisonFM was here'" :img="hero" />
    <recent-posts-widget class="xxl:rounded xxl:shadow xxl:-my-16" :title="pageString" />
  </div>
</template>

<script>
import postsPageMixin from '~/mixins/PostsPage.vue'
import api from "~/api";

export default {
  mixins: [postsPageMixin],
  data() {
    return {
      hero: ''
    }
  },
  beforeMount() {
    api.getHome(data => {
      this.hero = data.hero;
    });
  },
};
</script>
