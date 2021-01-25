<template>
  <div class="widget recent-posts p-4 bg-white">
    <h3>
      <slot></slot>
    </h3>
    <div class="grid gap-4 grid-cols-1 md:grid-cols-2 mb-4" v-if="recentPostsLoaded">
      <article v-for="post in recentPosts" :key="post.id" >
        <router-link :to="post.link">
          <div class="bg-cover bg-center h-article md:h-articleMD flex items-center justify-center relative bg-gray-500" :style="parseBackground(post)">
            <div class="text-white font-bold text-2xl z-10 p-2 text-center">{{ post.post_title }}</div>
            <div class="absolute inset-0 bg-black opacity-25 hover:opacity-50 transition-opacity duration-150 z-0"></div>
          </div>
        </router-link>
        <p class="text-gray-700 text-base" v-html="post.excerpt"></p>
      </article>
      <div class="w-full flex uppercase md:col-span-2">
        <router-link :to="this.pageLink.prev" v-if="page > 1" class="border-solid border-2 border-black bg-gray-500 text-white px-4 py-2 mr-auto transition-colors duration-150 hover:bg-blue-500">Previous</router-link>
        <router-link :to="this.pageLink.next" v-if="recentPosts.length >= 8" class="border-solid border-2 border-black bg-gray-500 text-white px-4 py-2 ml-auto transition-colors duration-150 hover:bg-blue-500">Next</router-link>
      </div>
    </div>
    <div v-else>
      <div class="grid gap-4 md:grid-cols-2 mb-4">
        <div class="animate-pulse bg-cover bg-center h-article md:h-articleMD flex items-center justify-center relative bg-gray-500" v-for="n in this.limit"></div>
      </div>
    </div>
  </div>
  
</template>

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
    }
  },

  computed: {
    ...mapGetters({
      recentPosts: 'recentPosts',
      recentPostsLoaded: 'recentPostsLoaded'
    }),
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
      lead = this.category ? '/category/'+this.category : '';
      lead = this.tag ? '/tag/'+this.tag : '';
      return {
        prev: lead+(this.page <= 2 ? '/' : '/p/'+(this.page - 1)),
        next: lead+'/p/'+(this.page + 1)
      }
    },
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
