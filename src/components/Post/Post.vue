<template>
  <div>
    <hero :img="parseFeatured()" />
    <div class="post-container">
      <div v-if="post.post_content"> 
        <div class="mb-8">
          <h1 class="leading-none">{{ post.post_title }}</h1>
          <p class="text-gray-700">{{ post.post_date }} in <router-link :to="{ name: 'Category', params: { category: post.categories[0].slug }}">{{post.categories[0].name}}</router-link></p>
        </div>
        <div class="post" v-html="post.post_content" />
        <Gallery v-if="gallery" :gallery="gallery" />
        <Tags v-if="post.tags.length" :tags="post.tags" />
        <StoryNavigation v-if="post.story" :story="post.story" />
        <router-view />
      </div>
      <div v-else>
        <h1 class="leading-none mb-4">{{ 'Loading..' }}</h1>
        <div class="post h-40" />
      </div>
    </div>
  </div>
</template>
<script>
import Loader from "../partials/Loader.vue"
import Gallery from "./Gallery.vue"
import { mapActions, mapGetters, mapMutations } from "vuex"
import SETTINGS from "~/settings"
import meta from '~/meta'
import Hero from '../partials/Hero.vue'
import StoryNavigation from './StoryNavigation.vue'
import Tags from './Tags.vue'

export default {
  computed: {
    ...mapGetters({
      post: 'currentPost',
      gallery: 'gallery'
    })
  },

  props: ['postSlug'],

  beforeMount() {
    this.handleGetPost(this.postSlug);
  },

  beforeRouteUpdate(to, from, next) {
    if(to.name === 'Post' && from.name === 'Post') {
      console.log('update post', to, from);
      this.setCurrentPost({post:null});
      this.handleGetPost(to.params.postSlug);
    }
    next();
  },

  beforeRouteLeave: function(to,from,next) {
    console.log('leave post', to, from);
    this.setCurrentPost({post:null});
    next();
  },

  methods: {
    ...mapActions(['getPost']),
    ...mapMutations({
      'setCurrentPost': 'POST_CURRENT',
    }),
    parseFeatured() {
      if(this.post.featured) {
        return this.post.featured.images.full;
      }
      return '';
    },
    handleGetPost(slug) {
      this.getPost({
        slug: slug
      }).then(response => {
        console.log('post component resolves');
      }, error => {
        console.log('post component errors', this.post, error);
        this.$_error('ErrorPage', {
          route: this.postSlug
        });
      });
    },
  },

  metaInfo () {
    return meta.formatMeta(this.post.post_title, this.post.post_excerpt, this.parseFeatured(), this.post.link)
  },

  components: { Loader, Gallery, Hero, StoryNavigation, Tags }
};
</script>
