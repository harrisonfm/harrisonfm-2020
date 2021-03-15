<template>
  <div class="page page--tag">
    <posts :tag="tag" :title="pageString" :page="page" />
  </div>
</template>

<script>
import postsPageMixin from '~/mixins/PostsPage.vue'

export default {
  mixins: [postsPageMixin]
};
</script>