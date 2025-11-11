<template>
  <div class="post-container">
    <h3 class="page-title" v-if="title">{{ title }}</h3>
    <Loader v-if="!posts.length" />
    <transition-group name="fade" class="posts-grid" tag="div">
      <article v-for="post in posts" :id="'post-'+post.ID" :key="post.ID" class="overlay-article jiggle-on-hover">
        <router-link :to="post.link" class="" >
          <div class="title">{{ post.post_title }}</div>
          <div class="overlay "></div>
        </router-link>
        <v-style>{{ parseBackground(post) }}</v-style>
      </article>
      <div class="full-grid pagination" v-if="posts.length" :key="page">
        <router-link :to="pageLink.prev" v-if="page > 1" class="mr-auto button">Previous</router-link>
        <router-link :to="pageLink.next" v-if="posts.length >= 8" class="ml-auto button">Next</router-link>
      </div>
      <gallery class="full-grid harrigrams-posts" v-if="gallery.images.length && harrigramsLoaded" :gallery="gallery" title="Recent Harrigrams" route="Harrigram" key="harrigrams" />
    </transition-group>
  </div>
</template>
<style scoped>
.page-title {
  @apply mb-2 lg:mb-4;
}
.posts-grid {
  @apply grid gap-2 lg:gap-4 grid-cols-1 md:grid-cols-2;
}
.full-grid {
  @apply w-full md:col-span-2
}
.pagination {
  @apply flex;
}
</style>
<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import Gallery from '~/components/Post/Gallery.vue'

export default {
  props: {
    limit: {
      default: 8
    },
    type: '',
    slug: '',
    page: {
      default: 1
    },
    harrigramsLoaded: false,
  },

  components: { Gallery },

  computed: {
    ...mapGetters(['posts', 'maxPages', 'gallery']),
    params: function() {
      let params = {
        per_page: this.limit,
        page: this.page,
      };
      if(this.type === 'category') {
        params.category = this.slug;
      }
      else if(this.type === 'tag') {
        params.tag = this.slug;
      }
      else if(this.type === 'search') {
        params.search = this.slug;
      }
      return params;
    },
    pageLink: function() {
      let lead = '';
      if(this.type === 'category') {
        lead = '/category/'+this.slug;
      }
      else if(this.type === 'tag') {
        lead = '/tag/'+this.slug;
      }
      else if(this.type === 'search') {
        lead = '/search/'+this.slug;
      }
      return {
        prev: lead+(this.page <= 2 ? '/' : '/p/'+(this.page - 1)),
        next: lead+'/p/'+(this.page + 1)
      }
    },
    title: function() {
      let lead = '';
      const paged = `Page ${this.page} of ${this.maxPages}`;

      if(this.type === 'category') {
        lead = `Category: ${this.slug }`;
      }
      else if(this.type === 'tag') {
        lead = `Tagged: ${this.slug }`;
      }
      else if(this.type === 'search') {
        lead = `Search: ${this.slug }`;
      }

      if(!lead) {
        return this.page > 1 && this.maxPages > 1 ? paged : ''
      }
      else {
        return this.page && this.maxPages > 1 ? lead + ' | ' + paged : lead;
      }
    },
  },

  methods: {
    ...mapActions(['getPosts', 'getHarrigrams']),
    ...mapMutations({
      setPosts: 'POSTS'
    }),
    handleGetPosts() {
      this.getPosts(this.params).then(response => {
        console.log('post archives resolves');
        // ready for prerender
        this.getHarrigrams().then(response => {
          this.$emit('set-harrigrams-loaded');
        });
      }, error => {
        console.log('post component errors', this.$route.path);
        this.$_error('ErrorPage', {
          route: this.$route.path
        });
      });
    },
    parseBackground(post) {
      if(post.featured) {
        return `
        #post-${post.ID} {
          background-image: url('${post.featured.images.medium_large.src}');
        }
        @media(min-width:${post.featured.images.large.width / 2}px) {
          #post-${post.ID} {
            background-image: url('${post.featured.images.large.src}');
          }
        }
        @media(min-width:768px) and (max-width:${post.featured.images.large.width}px) {
          #post-${post.ID} {
            background-image: url('${post.featured.images.medium_large.src}');
          }
        }`;
      }
    },
    updatePosts(to, from) {
      this.setPosts(false);
      this.handleGetPosts();
    }
  },

  beforeMount() {
    this.setPosts();
    this.handleGetPosts();
  },

  watch: {
    '$route': 'updatePosts'
  }

};
</script>
