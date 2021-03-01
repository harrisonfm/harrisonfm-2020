<template>
  <div class="page page--search">
    <recent-posts-widget :search="this.$route.params.search" :title="this.pageString" />
  </div>
</template>

<script>
import postsPageMixin from '~/mixins/PostsPage.vue'

export default {
  mixins: [postsPageMixin]
};
</script>