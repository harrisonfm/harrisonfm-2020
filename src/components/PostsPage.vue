<template>
  <div :class="`page page--${type}`">
    <hero :title="'HarrisonFM was here'" v-if="type === 'home'" :img="hero" />
    <posts :class="{'xxl:rounded xxl:shadow xxl:-my-16': type === 'home'}" :type="type" :slug="slug" :page="page" />
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
      });
    }
  },
  props: ['page', 'type', 'slug'],
  computed: {
    ...mapGetters(['maxPages'])
  },
  metaInfo () {
    return meta.formatMeta();
  }
}
</script>