<template>
  <div>
    <div v-for="photo in this.gallery">
      <router-link :to="{
          name: 'Photo',
          params: { idSlug: photo.id + '-' + photo.name }
        }">
        <img :src="photo.url" />
      </router-link>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import SETTINGS from "../../settings";

export default {

  props: {
    gallery: Array
  },

  mounted: function() {
    console.log('gallery mounted');
	},

  created: function() {
    console.log('gallery loaded');
  },

  methods: {
  	test: function () {
  		console.log('clicked');
  	}
  },
};
</script>
