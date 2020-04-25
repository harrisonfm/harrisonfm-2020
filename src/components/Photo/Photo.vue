<template>
  <div class="bv-example-row pt-4">
    <template v-if="photo">
      <h1>{{ photo.title.rendered }}</h1>
      <img :src="photo.media_details.sizes.full.source_url" />
    </template>
    <Loader v-else/>
  </div>
</template>

<script>
import axios from "axios";
import Loader from "../partials/Loader.vue";
import { mapGetters } from "vuex";
import SETTINGS from "../../settings";

export default {
  data() {
    return {
      photo: false
    };
  },

  computed: {},

  beforeMount() {
  	this.id = this.parseIDSlug(this.$route.params.idSlug); 
    this.getPhoto();
  },

  methods: {
  	parseIDSlug: function(idSlug) {
  		return idSlug.substr(0, idSlug.indexOf('-'));
  	},
    getPhoto: function() {
      axios
        .get(
          SETTINGS.API_BASE_PATH + "media/" + this.id
        )
        .then(response => {
          this.photo = response.data;
          console.log(this.photo);
        })
        .catch(e => {
          console.log(e);
        });
    }
  },

  components: { Loader }
};
</script>
