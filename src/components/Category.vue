<template>
  <div class="page page--category">
    <recent-posts-widget :category="this.$route.params.category" :title="this.pageString" />
  </div>
</template>

<script>
import postsPageMixin from '~/mixins/PostsPage.vue'

export default {
  mixins: [postsPageMixin]
};
</script>