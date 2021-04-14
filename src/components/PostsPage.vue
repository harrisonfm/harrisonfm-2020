<template>
  <div :class="`page page--${type}`">
    <hero :title="true" v-if="type === 'home'" :img="hero" />
    <posts :type="type" :slug="slug" :page="page ? parseInt(page) : page" />
  </div>
</template>
<script>
import Posts from '~/components/widgets/Posts.vue'
import Hero from '~/components/partials/Hero.vue'
import meta from '~/meta'
import api from "~/api";
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
  props: ['page', 'type', 'slug'],
  metaInfo () {
    return meta.formatMeta();
  },
  methods: {
    handleGetHome() {
      if(this.type === 'home') {
        api.getHome(data => {
          this.hero = data.hero;
        });
      }
    }
  },
  watch: {
    '$route': 'handleGetHome'
  }
}
</script>