<template>
  <div class="page page--search">
    <recent-posts-widget :search="$route.params.search" :title="pageString" />
  </div>
</template>

<script>
import postsPageMixin from '~/mixins/PostsPage.vue'

export default {
  mixins: [postsPageMixin]
};
</script>