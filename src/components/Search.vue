<template>
  <div class="page page--search">
    <posts :search="search" :title="pageString" :page="page" />
  </div>
</template>

<script>
import postsPageMixin from '~/mixins/PostsPage.vue'

export default {
  mixins: [postsPageMixin]
};
</script>