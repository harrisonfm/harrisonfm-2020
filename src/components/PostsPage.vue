<template>
  <div :class="`page page--${type}`">
    <hero :title="true" v-if="type === 'home'" :img="hero" />
    <posts :type="type" :slug="slug" :page="page ? parseInt(page) : page" :harrigramsLoaded="harrigramsLoaded" @set-harrigrams-loaded="setHarrigramsLoaded" />
  </div>
</template>
<script>
import Posts from '~/components/partials/Posts.vue'
import Hero from '~/components/partials/Hero.vue'
import meta from '~/meta'
import analytics from '~/analytics'
import api from "~/api"
import { mapGetters, mapMutations } from 'vuex'
export default {
  components: {
    Posts, Hero
  },
  data() {
    return {
      hero: '',
      harrigramsLoaded: false
    }
  },
  beforeMount() {
    this.handleGetHome();
  },
  beforeRouteUpdate(to, from, next) {
    this.harrigramsLoaded = false;
    next();
  },
  beforeRouteLeave(to, from, next) {
    console.log('leave posts page');
    if(to.name === 'Page' || to.name === 'PhotosGallery') {
      console.log('null post');
      this.setCurrentPost();
    }
    next();
  },
  props: ['page', 'type', 'slug'],
  computed: {
    ...mapGetters(['posts']),
  },
  metaInfo () {
    let title = '';
    let desc = '';
    let img = '';
    if(this.type !== 'home') { //category, tag, or search
      const slug = this.slug.replace('-',' ').replace(/\b\w/g, l => l.toUpperCase());
      title = this.type.replace(/\b\w/g, l => l.toUpperCase())+': '+slug;
      desc = 'Posts about '+slug;
      img = this.posts.length ? this.posts[0].featured.images : '';
    }
    analytics.trackPageView(this.page ? title + ' - Page ' + this.page : title);
    return meta.formatMeta(title, desc, img);
  },
  methods: {
    ...mapMutations({
      'setCurrentPost': 'POST_CURRENT',
    }),
    handleGetHome() {
      if(this.type === 'home') {
        meta.setDefaults();
        api.getHome(data => {
          this.hero = data.hero;
          window.prerenderReady = true;
        });
      }
    },
    setHarrigramsLoaded() {
      this.harrigramsLoaded = true;
    }
  },
  watch: {
    '$route': 'handleGetHome'
  }
}
</script>