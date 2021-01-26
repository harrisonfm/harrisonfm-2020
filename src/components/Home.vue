<template>
  <div class="page page--home">
    <recent-posts-widget class="">{{ this.pageString }}</recent-posts-widget>
  </div>
</template>

<script>
import postsPageMixin from '~/mixins/PostsPage.vue'

export default {
  mixins: [postsPageMixin]
};
</script>
