<template>
  <div class="fixed inset-0 ph-5 pb-1 bg-white flex flex-col items-center">
    <template v-if="photo">
      <div class="overflow-auto flex-1">
        <img :src="photo.url" class="max-h-full" />
      </div>
      <h1>{{ photo.title }}</h1>
      <p v-if="photo.caption">{{ photo.caption }}</p>
      <div v-if="nextPhoto" class="flex align-center">
          <router-link :to="{
            name: 'Photo',
            params: { idSlug: prevPhoto.id + '-' + prevPhoto.name }
          }">
            Previous
          </router-link>
          <span>&nbsp;/&nbsp;</span>
          <router-link :to="{
            name: 'Photo',
            params: { idSlug: nextPhoto.id + '-' + nextPhoto.name }
          }">
            Next
          </router-link>
      </div>
    </template>
    <Loader v-else/>
  </div>
</template>

<script>
import axios from "axios";
import Loader from "../partials/Loader.vue";
import { mapGetters } from "vuex";
import SETTINGS from "../../settings";
import store from '../../store';

export default {
  data() {
    return {
      photo: false
    };
  },

  computed: {},

  beforeMount() {
  	this.id = this.parseIDSlug(this.$route.params.idSlug);
    this.post = store.state.post.currentPost;
    this.prevPhoto = false;
    this.nextPhoto = false;
    this.getPhoto();
  },

  watch: {
  	'$route': 'refreshPhoto',
    post: function (val, oldVal) {
      console.log('watching post:', val, oldVal)
    }
  },

  methods: {
  	parseIDSlug: function(idSlug) {
  		return parseInt(idSlug.substr(0, idSlug.indexOf('-'), 10));
  	},
    getPhoto: function() {
      if(this.post.acf.gallery) {
        for (const [idx, el] of this.post.acf.gallery.entries()) {
          console.log(this.id, el.id);
          if(this.id === el.id) {
            this.photo = el;
            this.setAdjacentPhotos(idx, this.post.acf.gallery);
            console.log('getPhoto gallery', this.photo.title);
            break;
          }
        }
      }
      else {
        axios
          .get(
            SETTINGS.API_BASE_PATH + "media/" + this.id
          )
          .then(response => {
            this.photo = response.data;
            this.photo.title = response.data.title.rendered;
            this.photo.url = response.data.media_details.sizes.full.source_url;
            console.log('getPhoto api');
          })
          .catch(e => {
            console.log(e);
          });
      }
    },
    setAdjacentPhotos: function(i, gallery) {
      if(i > 0) {
        this.prevPhoto = gallery[i - 1];
      }
      else {
        this.prevPhoto = gallery[gallery.length - 1];
      }

      if(i < gallery.length - 1) {
        this.nextPhoto = gallery[i + 1];
      }
      else {
        this.nextPhoto = gallery[0];
      }
    },
    refreshPhoto: function() {
	  	this.id = this.parseIDSlug(this.$route.params.idSlug); 
	    this.getPhoto();
      console.log('refreshPhoto', this.id);
    }
  },

  components: { Loader }
};
</script>
