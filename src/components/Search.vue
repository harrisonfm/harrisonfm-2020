<template>
  <div class="page page--search">
    <recent-posts-widget :search="this.$route.params.search" class="mb-10">
    	Search: {{ this.$route.params.search }}
    </recent-posts-widget>
  </div>
</template>

<script>
import RecentPostsWidget from './widgets/RecentPosts.vue';
import { mapGetters, mapActions, mapMutations } from 'vuex';

export default {
  components: {
    RecentPostsWidget,
  }
};
</script>

<style type="postcss"></style>
