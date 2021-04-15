<template>
  <div>
    <hero :img="post.featured" />
    <div class="post-container">
      <div class="mb-8">
        <h1 class="leading-none">{{ post.post_title ? post.post_title : 'Loading...' }}</h1>
        <transition name="fade">
          <p class="text-gray-700" v-if="post.post_content">{{ post.post_date }} in <router-link :to="{ name: 'Category', params: { category: post.categories[0].slug }}">{{post.categories[0].name}}</router-link></p>
        </transition>
      </div>
      <transition name="fade">
        <div class="post" v-if="post.post_content" v-html="post.post_content" />
      </transition>
      <Gallery v-if="gallery" :gallery="gallery" route="PostPhoto" />
      <Tags v-if="post.tags" :tags="post.tags" />
      <StoryNavigation v-if="post.story" :story="post.story" />
      <router-view />
    </div>
  </div>
</template>
<script>
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
      this.setCurrentPost();
      this.handleGetPost(to.params.postSlug);
    }
    next();
  },

  beforeRouteLeave: function(to,from,next) {
    console.log('leave post', to, from);
    this.setCurrentPost();
    next();
  },

  methods: {
    ...mapActions(['getPost']),
    ...mapMutations({
      'setCurrentPost': 'POST_CURRENT',
    }),
    handleGetPost(slug) {
      this.getPost({
        slug: slug
      }).then(response => {
        console.log('post component resolves', this.gallery);
        window.prerenderReady = true;
      }, error => {
        console.log('post component errors', this.$route.path);
        this.$_error('ErrorPage', {
          route: this.$route.path
        });
      });
    },
  },

  metaInfo () {
    return meta.formatMeta(this.post.post_title, this.post.post_excerpt, this.post.featured.images, 'author')
  },

  components: { Gallery, Hero, StoryNavigation, Tags }
};
</script>
