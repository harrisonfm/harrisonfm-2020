<template>
  <div class="page page--category">
    <posts :category="category" :title="pageString" :page="page" />
  </div>
</template>

<script>
import postsPageMixin from '~/mixins/PostsPage.vue'

export default {
  mixins: [postsPageMixin]
};
</script>