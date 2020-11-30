<template>
  <div class="page page--category">
    <recent-posts-widget type="category" :category="this.currentCategory" class="mb-10">
    	Category: {{ this.currentCategory.name }}
    </recent-posts-widget>
  </div>
</template>

<script>
import RecentPostsWidget from './widgets/RecentPosts.vue';
import { mapGetters, mapActions, mapMutations } from 'vuex';

export default {
	computed: {
    ...mapGetters({
      currentCategory: 'currentCategory'
    })
  },
  beforeMount() {
  	console.log(this.currentCategory.name);
  },
  components: {
    RecentPostsWidget,
  }
};
</script>

<style type="postcss"></style>
