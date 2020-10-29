<template>
  <div class="bv-example-row pt-4">
    <div v-if="post" class="post px-4">
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

  methods: {
    getPost: function() {
      axios
        .get(
          SETTINGS.API_BASE_PATH + "posts?slug=" + this.$route.params.postSlug
        )
        .then(response => {
          this.post = response.data[0];
          this.$store.dispatch('setCurrentPost', { post: this.post });
        })
        .catch(e => {
          console.log(e);
        });
    }
  },

  components: { Loader, Gallery }
};
</script>
