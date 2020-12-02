<template>
  <div class="page page--tag">
    <recent-posts-widget :tag="this.$route.params.tag" class="mb-10">
    	Tag: {{ this.$route.params.tag }}
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
