<template>
  <div class="page page--stories">
    stories
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