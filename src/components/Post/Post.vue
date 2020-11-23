<template>
  <div class="bv-example-row pt-4">
    <div v-if="post" class="post">
      <h1>{{ post.title.rendered }}</h1>
      <div v-html="post.content.rendered"></div>
      <Gallery :gallery="post.acf.gallery"></Gallery>
    </div>
    <Loader v-else/>
    <router-view></router-view>
  </div>
</template>

<script>
import axios from "axios";
import Loader from "../partials/Loader.vue";
import Gallery from "./Gallery.vue";
import { mapGetters } from "vuex";
import SETTINGS from "../../settings";
import router from '../../router';

export default {
  data() {
    return {
      post: false
    };
  },
  computed: {
    ...mapGetters({
      currentPost: 'currentPost'
    })
  },

  beforeMount() {
    this.getPost();
  },

  mounted: function() {
    console.log('post mounted');
  },

  methods: {
    getPost: function() {
      axios
        .get(
          SETTINGS.API_BASE_PATH + "posts?slug=" + this.$route.params.postSlug
        )
        .then(response => {
          console.log(response);
          if(response.data.length) {
            this.post = response.data[0];
            this.$store.dispatch('setCurrentPost', { post: this.post });
          }
          else {
            router.push({
              name: '404'
            });
          }
        })
        .catch(e => {
          console.log(e);
        });
    }
  },

  components: { Loader, Gallery }
};
</script>
