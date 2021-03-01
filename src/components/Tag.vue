<template>
  <div class="page page--tag">
    <recent-posts-widget :tag="this.$route.params.tag" :title="this.pageString" />
  </div>
</template>

<script>
import postsPageMixin from '~/mixins/PostsPage.vue'

export default {
  mixins: [postsPageMixin]
};
</script>