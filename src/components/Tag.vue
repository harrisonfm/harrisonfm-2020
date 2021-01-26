<template>
  <div class="page page--tag">
    <recent-posts-widget :tag="this.$route.params.tag" class="">{{ this.pageString }}</recent-posts-widget>
  </div>
</template>

<script>
import postsPageMixin from '~/mixins/PostsPage.vue'

export default {
  mixins: [postsPageMixin]
};
</script>