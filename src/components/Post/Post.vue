<template>
  <div v-if="post.post_content">
    <hero :img="parseBackground()" />
    <div class="py-2 px-4 bg-white xxl:rounded xxl:shadow xxl:-my-16">
      <div class="flex flex-wrap items-center mb-4">
        <h1 class="leading-none mb-0">{{ post.post_title }}</h1>
        <p class="my-0 ml-4 lg:ml-auto">{{ post.post_date }} in <router-link :to="{ name: 'Category', params: { category: post.categories[0].slug }}">{{post.categories[0].name}}</router-link></p>
      </div>
      <div class="post" v-html="post.post_content"></div>
      <Gallery :gallery="post.acf.gallery"></Gallery>
      <div class="flex">
        <span>Tags:</span>
        <router-link v-for="tag in this.post.tags" :key="tag.id" :to="{
          name: 'Tag',
          params: {tag: tag.slug}  
        }">{{tag.name}}
        </router-link>
      </div>
    </div>
    <router-view></router-view>
  </div>
  <Loader v-else/>
</template>

<script>
import Loader from "../partials/Loader.vue";
import Gallery from "./Gallery.vue";
import { mapActions, mapGetters, mapMutations } from "vuex";
import SETTINGS from "~/settings";
import router from '~/router';
import meta from '~/meta';
import Hero from '../partials/Hero.vue'

export default {
  computed: {
    ...mapGetters({
      post: 'currentPost'
    })
  },

  beforeMount() {
    this.getPost({
      slug: this.$route.params.postSlug
    }).then(response => {
      console.log('post component resolves');
    }, error => {
      console.log('post component errors', this.post, error);
      this.$_error('ErrorPage', {
        route: this.$route.params.postSlug
      });
    });
  },

  mounted: function() {
    console.log('post mounted');
  },

  beforeRouteLeave: function(to,from,next) {
    this.setCurrentPost({post:null});
    next();
  },

  methods: {
    ...mapActions(['getPost']),
    ...mapMutations({
      'setCurrentPost': 'POST_CURRENT',
    }),
    parseBackground() {
      if(this.post.featured) {
        return '/wp-content/uploads/'+this.post.featured.file;
      }
      return 'https://res.cloudinary.com/evanagee/image/upload/c_scale,h_400/v1580267636/VueWP/Youtube-bg_00240.jpg';
    }
  },

  metaInfo () {
    return meta.formatMeta(this.post.post_title, this.post.post_excerpt, this.parseBackground(this.post.img), this.post.link)
  },

  components: { Loader, Gallery, Hero }
};
</script>
