<template>
  <div class="page page--home">
    <recent-posts-widget limit="5" class="mb-10"></recent-posts-widget>
  </div>
</template>

<script>
import RecentPostsWidget from './widgets/RecentPosts.vue';

export default {
  components: {
    RecentPostsWidget,
  }
};
</script>

<style type="postcss"></style>
