<template>
  <div class="widget recent-posts p-4 bg-white">
    <h3 class="leading-none mb-4" v-if="title">{{ title }}</h3>
    <div class="grid gap-4 grid-cols-1 md:grid-cols-2" v-if="recentPostsLoaded">
      <article v-for="post in recentPosts" :key="post.id" :style="parseBackground(post)">
        <router-link :to="post.link" class="" >
          <div class="title">{{ post.post_title }}</div>
          <div class="overlay "></div>
        </router-link>
      </article>
      <div class="pagination">
        <router-link :to="pageLink.prev" v-if="page > 1" class="mr-auto">Previous</router-link>
        <router-link :to="pageLink.next" v-if="recentPosts.length >= 8" class="ml-auto">Next</router-link>
      </div>
    </div>
    <div v-else>
      <div class="grid gap-4 md:grid-cols-2 mb-4">
        <article class="placeholder" v-for="n in limit" />
      </div>
    </div>
  </div>
</template>
<style scoped>
article {
  @apply bg-cover bg-center h-article md:h-articleMD flex items-center justify-center relative bg-gray-500 shadow transform transition-transform duration-200 shadow hover:-translate-y-px;
}
article .title {
  @apply text-white font-bold text-2xl z-10 p-2 text-center
}
article .overlay {
  @apply absolute inset-0 bg-black opacity-5 hover:opacity-15 transition-opacity duration-200 z-0
}
article .placeholder {
  @apply animate-pulse h-article md:h-articleMD bg-gray-500
}
.pagination {
  @apply w-full flex md:col-span-2
}
.pagination a {
  @apply font-semibold bg-gray-500 text-white px-4 py-2 transition-colors duration-150 ring ring-inset ring-gray-300 hover:bg-blue-500 hover:ring-blue-300
}
</style>
<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';

export default {
  props: {
    limit: {
      default: 8
    },
    category: {
      default: ''
    },
    tag: {
      default: ''
    },
    search: {
      default: ''
    },
    title: ''
  },

  computed: {
    ...mapGetters(['recentPosts', 'recentPostsLoaded']),
    page: function() {
      return this.$route.params.page ? parseInt(this.$route.params.page) : 1;
    },
    params: function() {
      let params = {
        per_page: this.limit,
        page: this.page ? this.page : 1,
      };
      if(this.category) {
        params.category = this.category;
      }
      else if(this.tag) {
        params.tag = this.tag;
      }
      else if(this.search) {
        params.search = this.search;
      }
      return params;
    },
    pageLink: function() {
      let lead = '';
      if(this.category) {
        lead = '/category/'+this.category;
      }
      if(this.tag) {
        lead = '/tag/'+this.tag;
      }
      return {
        prev: lead+(this.page <= 2 ? '/' : '/p/'+(this.page - 1)),
        next: lead+'/p/'+(this.page + 1)
      }
    }
  },

  methods: {
    ...mapActions([
      'getPosts'
    ]),
    ...mapMutations({
      setLoaded: 'POSTS_LOADED'
    }),
    parseBackground(post) {
      if(post.featured) {
        return 'background-image: url(/wp-content/uploads/'+post.featured.file+')';  
      }
      return 'background-image: url(https://res.cloudinary.com/evanagee/image/upload/c_scale,h_400/v1580267636/VueWP/Youtube-bg_00240.jpg)';      
    },

    updatePosts(to, from) {
      this.setLoaded(false);
      this.getPosts(this.params);
    }
  },

  beforeMount() {
    this.getPosts(this.params);
  },

  watch: {
    '$route': 'updatePosts'
  }

};
</script>
