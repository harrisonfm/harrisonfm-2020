<template>
  <div class="widget recent-posts">
    <div v-if="recentPostsLoaded" class="grid gap-4 auto-rows-fr md:grid-cols-2">
      <article v-for="post in recentPosts(limit)" :key="post.id" >
        <router-link :to="post.slug">
          <div class="bg-cover bg-center h-article md:h-articleMD flex items-center justify-center relative bg-gray-500" :style="parseBackground(post)">
            <div class="text-white font-bold text-2xl z-10">{{ post.title.rendered }}</div>
            <div class="absolute inset-0 bg-black opacity-25 hover:opacity-50 transition-opacity duration-150 z-0"></div>
          </div>
        </router-link>
        <p class="text-gray-700 text-base" v-html="post.excerpt.rendered"></p>
      </article>
    </div>
    <div v-else>Loading...</div>
    <router-link :to="'/p/1'">Prevous</router-link>
    <router-link :to="'/p/2'">Next</router-link>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';

export default {
  props: ['limit'],
  computed: {
    ...mapGetters({
      recentPosts: 'recentPosts',
      recentPostsLoaded: 'recentPostsLoaded',
      page: 'paginationIndex'
    })
  },

  methods: {
    ...mapActions([
      'getPosts'
    ]),
    ...mapMutations({
      'setPage': 'PAGINATION_INDEX'
    }),
    parseBackground(post) {
      if(post.featured_media) {
        return 'background-image: url(/wp-content/uploads/'+post._embedded['wp:featuredmedia'][0].media_details.file+')';  
      }
      return 'background-image: url(https://res.cloudinary.com/evanagee/image/upload/c_scale,h_400/v1580267636/VueWP/Youtube-bg_00240.jpg)';      
    },

    updatePosts(to, from) {
      this.setPage({ page: this.$route.params.page });
      this.getPosts({ limit: this.limit, page: this.page });
    }
  },

  beforeMount() {
    this.setPage({ page: this.$route.params.page });
  },

  mounted() {
    this.getPosts({ limit: this.limit, page: this.page });
  },

  watch: {
    '$route': 'updatePosts'
  }

};
</script>
