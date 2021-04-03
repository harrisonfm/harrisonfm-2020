<template>
  <div :class="`page page--${type}`">
    <hero :title="'HarrisonFM was here'" v-if="type === 'home'" :img="hero" />
    <posts :type="type" :slug="slug" :page="page ? parseInt(page) : page" />
  </div>
</template>
<script>
import Posts from '~/components/widgets/Posts.vue'
import Hero from '~/components/partials/Hero.vue'
import meta from '~/meta'
import api from "~/api";
import { mapGetters } from 'vuex'
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
    if(this.type === 'home') {
      api.getHome(data => {
        this.hero = data.hero;
        document.dispatchEvent(new Event('render-event'));
      });
    }
  },
  props: ['page', 'type', 'slug'],
  metaInfo () {
    return meta.formatMeta();
  }
}
</script>