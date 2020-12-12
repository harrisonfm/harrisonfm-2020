<template>
  <div class="bv-example-row pt-4">
    <div v-if="post" class="post">
      <h1>{{ post.title.rendered }}</h1>
      <div v-html="post.content.rendered"></div>
      <Gallery :gallery="post.acf.gallery"></Gallery>
    </div>
    <Loader v-else/>
    <router-view v-if="post"></router-view>
  </div>
</template>

<script>
import axios from "axios";
import Loader from "../partials/Loader.vue";
import Gallery from "./Gallery.vue";
import { mapActions, mapGetters, mapMutations } from "vuex";
import SETTINGS from "../../settings";
import router from '../../router';

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
      console.log('post component resolves', response);
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

  components: { Loader, Gallery }
};
</script>
