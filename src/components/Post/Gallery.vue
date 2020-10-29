<template>
  <div class="grid gap-4 auto-rows-fr md:grid-cols-2 xl:grid-cols-3">
    <div v-for="photo in this.gallery" class="flex items-center justify-center" >
      <router-link :to="{
          name: 'Photo',
          params: { idSlug: photo.id + '-' + photo.name }
        }">
        <img :src="photo.url" class="rounded shadow md:max-h-col2 xl:max-h-col3 xxl:max-h-col3xxl" />
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
