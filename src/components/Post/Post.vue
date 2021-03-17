<template>
  <div>
    <hero :img="parseFeatured()" />
    <div class="pt-2 px-4 pb-4 bg-white xxl:rounded xxl:shadow xxl:-my-16">
      <div v-if="post.post_content"> 
        <div class="flex flex-wrap items-center mb-4">
          <h1 class="leading-none mb-0">{{ post.post_title }}</h1>
          <p class="my-0 ml-4 lg:ml-auto">{{ post.post_date }} in <router-link :to="{ name: 'Category', params: { category: post.categories[0].slug }}">{{post.categories[0].name}}</router-link></p>
        </div>
        <div class="post" v-html="post.post_content"></div>
        <Gallery v-if="gallery" :gallery="gallery"></Gallery>
        <div class="flex items-center mt-4" v-if="post.tags.length">
          <span>Tags:</span>
          <router-link class="focus:outline-none text-sm text-center ml-4 py-2 px-4 font-semibold text-white bg-gray-500 transition-colors duration-150 ring ring-gray-300 hover:bg-blue-500 hover:ring-blue-300" 
          v-for="tag in post.tags" :key="tag.id" :to="{
            name: 'Tag',
            params: {tag: tag.slug}  
          }">{{tag.name}}
          </router-link>
        </div>
        <div v-if="post.story">
          <h2 class="text-gray-700 text-base">{{ post.story.name }}</h2>
          <p class="text-gray-700 text-base" v-html="post.story.description"></p>
          <div v-if="post.storyPrev || post.storyNext">
            <article class="grid grid-cols-6 gap-4 bg-gray-100 mb-4 last:mb-0" v-if="post.storyNext" >
              <router-link class="col-span-2" :to="post.storyNext.link">
                <img class="w-full" :src="post.storyNext.featured.images.full" />
              </router-link>
              <div class="col-span-4 p-4">
                <router-link :to="post.storyNext.link"><h2 class="font-bold text-2xl">{{ 'Next: '+post.storyNext.post_title }}</h2></router-link>
                <p class="text-gray-700 text-base" v-html="post.storyNext.post_excerpt"></p>
              </div>
            </article>
            <article class="grid grid-cols-6 gap-4 bg-gray-100 mb-4 last:mb-0" v-if="post.storyPrev" >
              <router-link class="col-span-2" :to="post.storyPrev.link">
                <img class="w-full" :src="post.storyPrev.featured.images.full" />
              </router-link>
              <div class="col-span-4 p-4">
                <router-link :to="post.storyPrev.link"><h2 class="font-bold text-2xl">{{ 'Prev: '+post.storyPrev.post_title }}</h2></router-link>
                <p class="text-gray-700 text-base" v-html="post.storyPrev.post_excerpt"></p>
              </div>
            </article>
          </div>
        </div>
        <router-view />
      </div>
      <div v-else>
        <div class="flex flex-wrap items-center mb-4">
          <h1 class="leading-none mb-0">{{ 'Loading..' }}</h1>
        </div>
        <div class="post h-40"></div>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from "../partials/Loader.vue";
import Gallery from "./Gallery.vue";
import { mapActions, mapGetters, mapMutations } from "vuex";
import SETTINGS from "~/settings";
import meta from '~/meta';
import Hero from '../partials/Hero.vue'

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

  components: { Loader, Gallery, Hero }
};
</script>
