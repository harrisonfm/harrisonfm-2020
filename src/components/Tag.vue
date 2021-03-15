<template>
  <div class="page page--tag">
    <recent-posts-widget :tag="tag" :title="pageString" />
  </div>
</template>

<script>
import postsPageMixin from '~/mixins/PostsPage.vue'

export default {
  mixins: [postsPageMixin]
};
</script>