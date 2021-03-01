<template>
  <div class="page page--category">
    <recent-posts-widget :category="$route.params.category" :title="pageString" />
  </div>
</template>

<script>
import postsPageMixin from '~/mixins/PostsPage.vue'

export default {
  mixins: [postsPageMixin]
};
</script>