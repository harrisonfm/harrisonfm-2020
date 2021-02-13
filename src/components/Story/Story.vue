<template>
  <div class="page page--story">
    story
  </div>
</template>
<script>
import postsPageMixin from '~/mixins/PostsPage.vue'

export default {
  mixins: [postsPageMixin],
  beforeMount: function() {
    console.log(this.$route.params);
  }
};
</script>