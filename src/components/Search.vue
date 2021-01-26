<template>
  <div class="page page--search">
    <recent-posts-widget :search="this.$route.params.search" class="">{{ this.pageString }}</recent-posts-widget>
  </div>
</template>

<script>
import postsPageMixin from '~/mixins/PostsPage.vue'

export default {
  mixins: [postsPageMixin]
};
</script>