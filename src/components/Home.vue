<template>
  <div class="page page--home">
    <recent-posts-widget class="mb-10"></recent-posts-widget>
  </div>
</template>

<script>
import RecentPostsWidget from './widgets/RecentPosts.vue';
import meta from '../meta';

export default {
  components: {
    RecentPostsWidget,
  },
  metaInfo () {
  	return meta.formatMeta();
	}
};
</script>

<style type="postcss"></style>
