<template>
  <div :class="`page page--${type}`">
    <hero :title="true" v-if="type === 'home'" :img="hero" />
    <posts :type="type" :slug="slug" :page="page ? parseInt(page) : page" />
  </div>
</template>
<script>
import Posts from '~/components/partials/Posts.vue'
import Hero from '~/components/partials/Hero.vue'
import meta from '~/meta'
import api from "~/api";
import { mapMutations } from 'vuex'
export default {
  components: {
    Posts, Hero
  },
  data() {
    return {
      hero: ''
    }
  },
  beforeMount() {
    this.handleGetHome();
  },
  beforeRouteLeave(to, from, next) {
    console.log('leave posts page');
    if(to.name === 'Page') {
      console.log('null post');
      this.setCurrentPost();
    }
    next();
  },
  props: ['page', 'type', 'slug'],
  metaInfo () {
    if(this.type === 'home') {
      return meta.formatMeta();
    }
    else{
      let slug = this.slug ? this.slug.replace('-',' ').replace(/\b\w/g, l => l.toUpperCase()) : '';
      let desc = this.slug ? 'HarrisonFM content for '+slug : '';
      let title = this.type ? this.type.replace(/\b\w/g, l => l.toUpperCase())+': '+slug : '';
      return meta.formatMeta(title, desc);
    }
  },
  methods: {
    ...mapMutations({
      'setCurrentPost': 'POST_CURRENT',
    }),
    handleGetHome() {
      if(this.type === 'home') {
        api.getHome(data => {
          this.hero = data.hero;
          window.prerenderReady = true;
        });
      }
      else {
        window.prerenderReady = true;
      }
    }
  },
  watch: {
    '$route': 'handleGetHome'
  }
}
</script>