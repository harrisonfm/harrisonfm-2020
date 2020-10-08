<template>
  <div class="fixed inset-0 ph-5 bg-white flex flex-col items-center md:px-24">
    <template v-if="photo">
      <router-link :to="{
        name: 'Post',
        params: { slug: this.post.slug }
      }" class="absolute flex top-1 right-1 p-1 rounded bg-white bg-opacity-25 text-4xl">
        <font-awesome-icon :icon="['fas', 'compress-alt']" />
      </router-link>  
      <div class="overflow-auto mt-auto">
        <img :src="photo.url" class="max-h-full m-auto" />
      </div>
      <div class="w-full text-center px-4 my-4">
        <h2 class="leading-none">{{ photo.title }}</h2>
        <p class="mb-0" v-if="photo.caption">{{ photo.caption }}</p>
      </div>
      <div class="relative w-full flex items-center mt-auto p-4 bg-gray-100 xs:flex-start xs:items-start xs:mb-4 xs:rounded-lg xs:shadow xs:max-w-md">
        <div v-if="prevPhoto" class="flex mr-auto text-4xl xs:ml-0">
          <router-link :to="{
            name: 'Photo',
            params: { idSlug: prevPhoto.id + '-' + prevPhoto.name }
          }">
            <font-awesome-icon :icon="['fas', 'chevron-circle-left']" />
          </router-link>
        </div>
        <div class="text-4xl mx-auto" >
          <font-awesome-icon :icon="['fas', 'heart']" class="cursor-pointer" :class="{ liked: liked }" @click="like" />
          <span v-if="likes">- {{ likes }}</span>
          <font-awesome-icon :icon="['fas', 'pause']" class="cursor-pointer"/>
        </div>
        <div v-if="nextPhoto" class="flex ml-auto text-4xl xs:mr-0">
          <router-link :to="{
            name: 'Photo',
            params: { idSlug: nextPhoto.id + '-' + nextPhoto.name }
          }">
            <font-awesome-icon :icon="['fas', 'chevron-circle-right']" />
          </router-link>
        </div>
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
      photo: false,
      liked: false,
      likes: 0
    };
  },

  computed: {
  },

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
    },
    liked: function() {
      return this.liked;
    },
    likes: function() {
      return this.likes;
    }
  },

  methods: {
  	parseIDSlug: function(idSlug) {
  		return parseInt(idSlug.substr(0, idSlug.indexOf('-'), 10));
  	},
    getPhoto: function() {
      if(this.post.acf.gallery) {
        for (const [idx, el] of this.post.acf.gallery.entries()) {
          if(this.id === el.id) {
            this.photo = el;

            this.photo.likes = this.photo.likes ? this.photo.likes : 0;
            this.photo.liked = this.photo.liked ? this.photo.liked : false;

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

            this.photo.likes = this.photo.likes ? this.photo.likes : 0;
            this.photo.liked = this.photo.liked ? this.photo.liked : false;

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
    },
    like: function() {
      if(this.photo.liked) {
        this.photo.likes--;
      }
      else {
        this.photo.likes++;
      }
      this.photo.liked = !this.photo.liked;
      this.liked = this.photo.liked;
      this.likes = this.photo.likes;

      console.log('like ', this.photo.liked);
      console.log('likes', this.photo.likes);
    }
  },

  components: { Loader }
};
</script>
