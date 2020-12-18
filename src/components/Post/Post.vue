<template>
  <div class="bv-example-row pt-4" v-if="post">
    <div class="post">
      <h1>{{ post.post_title }}</h1>
      <div v-html="post.post_content"></div>
      <Gallery :gallery="post.acf.gallery"></Gallery>
    </div>
    <router-view></router-view>
  </div>
  <Loader v-else/>
</template>

<script>
import axios from "axios";
import Loader from "../partials/Loader.vue";
import Gallery from "./Gallery.vue";
import { mapActions, mapGetters, mapMutations } from "vuex";
import SETTINGS from "../../settings";
import router from '../../router';
import meta from '../../meta';

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
    })
  },

  metaInfo () {
    console.log('metainfo post');
    return meta.formatMeta(this.post.post_title, this.post.post_excerpt, this.post.link)
  },

  components: { Loader, Gallery }
};
</script>
