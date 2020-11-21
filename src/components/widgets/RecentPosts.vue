<template>
  <div class="widget recent-posts" v-if="recentPostsLoaded">
    <div class="grid gap-4 auto-rows-fr md:grid-cols-2 mb-4">
      <article v-for="post in recentPosts" :key="post.id" >
        <router-link :to="post.slug">
          <div class="bg-cover bg-center h-article md:h-articleMD flex items-center justify-center relative bg-gray-500" :style="parseBackground(post)">
            <div class="text-white font-bold text-2xl z-10">{{ post.title.rendered }}</div>
            <div class="absolute inset-0 bg-black opacity-25 hover:opacity-50 transition-opacity duration-150 z-0"></div>
          </div>
        </router-link>
        <p class="text-gray-700 text-base" v-html="post.excerpt.rendered"></p>
      </article>
    </div>
    <div class="w-full flex uppercase">
      <router-link :to="'/p/'+(page - 1)" v-if="page > 1" class="border-solid border-2 border-black bg-gray-500 text-white px-4 py-2 mr-auto transition-colors duration-150 hover:bg-blue-500">Previous</router-link>
      <router-link :to="'/p/'+(page ? page + 1 : 2)" v-if="recentPosts.length >= 8" class="border-solid border-2 border-black bg-gray-500 text-white px-4 py-2 ml-auto transition-colors duration-150 hover:bg-blue-500">Next</router-link>
    </div>
  </div>
  <div v-else>Loading...</div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';

export default {
  props: {
    limit: {
      default: 8
    }
  },
  computed: {
    ...mapGetters({
      recentPosts: 'recentPosts',
      recentPostsLoaded: 'recentPostsLoaded'
    }),
    page: function(){
      return parseInt(this.$route.params.page);
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
      if(post.featured_media) {
        return 'background-image: url(/wp-content/uploads/'+post._embedded['wp:featuredmedia'][0].media_details.file+')';  
      }
      return 'background-image: url(https://res.cloudinary.com/evanagee/image/upload/c_scale,h_400/v1580267636/VueWP/Youtube-bg_00240.jpg)';      
    },

    updatePosts(to, from) {
      this.setLoaded(false);
      this.getPosts({ limit: this.limit, page: this.$route.params.page });
    }
  },

  beforeMount() {
    console.log(this.page);
  },

  mounted() {
    this.getPosts({ limit: this.limit, page: this.$route.params.page });
    console.log(this.page);
  },

  watch: {
    '$route': 'updatePosts'
  }

};
</script>
