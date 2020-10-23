<template>
  <div class="fixed inset-0 ph-5 bg-white flex flex-col items-center md:px-24 transition-opacity duration-300 opacity-0"
    tabindex="0"
    @keyup.right="goToNextPhoto"
    @keyup.left="goToPrevPhoto"
    @keyup.up="back"
    @keyup.esc="back"
    @keyup.space="toggleSlideshow">
    <template v-if="photo">
      <div class="absolute flex flex-col items-center top-1 right-1 p-1 text-4xl">
        <font-awesome-icon :icon="['fas', 'compress-alt']" class="rounded bg-white bg-opacity-25 cursor-pointer" @click="back"/>
        <font-awesome-icon :icon="['fas', 'info-circle']" class="hidden mt-4 rounded bg-white bg-opacity-25 cursor-pointer lg:block" :class="{ 'text-blue-600': galleryInfo }" @click="setGalleryInfo"/>
      </div>
      <div :key="photo.id" class="photoBox overflow-auto mt-auto transition-opacity duration-1000 opacity-0 lg:my-auto">
        <img :src="photo.url" class="max-h-full m-auto" @load="handleImageLoad" />
      </div>
      <div class="w-full text-center px-4 my-4" :class="{'lg:hidden' : !galleryInfo}">
        <h2 class="leading-none">{{ photo.title }}</h2>
        <p class="mb-0" v-if="photo.caption">{{ photo.caption }}</p>
      </div>
      <div class="relative w-full flex items-center mt-auto p-4 bg-gray-100 xs:flex-start xs:mb-4 xs:rounded-lg xs:shadow xs:max-w-md"
      :class="{'lg:hidden' : !galleryInfo}">
        <font-awesome-icon :icon="['fas', 'chevron-circle-left']" v-if="prevPhoto" class="flex mr-auto text-4xl xs:ml-0 cursor-pointer" @click="goToPrevPhoto"/>
        <div class="text-4xl mx-auto" >
          <div v-if="nextPhoto" class="inline">
            <font-awesome-icon :icon="['fas', 'play']" v-if="!slideshow" class="cursor-pointer" @click="toggleSlideshow"/>
            <font-awesome-icon :icon="['fas', 'pause']" v-if="slideshow" class="cursor-pointer" @click="toggleSlideshow"/>
          </div>
          <font-awesome-layers full-width class="cursor-pointer" :class="{ 'text-red-600': liked }" @click="like">
            <font-awesome-icon :icon="['fas', 'heart']" />
            <font-awesome-layers-text v-if="likes" class="text-white" transform="shrink-8" :value="likes" />
          </font-awesome-layers>
        </div>
        <font-awesome-icon :icon="['fas', 'chevron-circle-right']" v-if="nextPhoto" class="flex ml-auto text-4xl xs:mr-0 cursor-pointer" @click="goToNextPhoto"/>
      </div>
    </template>
    <Loader v-else/>
  </div>
</template>

<script>
import axios from "axios";
import Loader from "../partials/Loader.vue";
import { mapGetters, mapActions, mapMutations } from "vuex";
import SETTINGS from "../../settings";
import store from '../../store';
import router from '../../router';

export default {
  data() {
    return {
      photo: false,
      liked: false,
      likes: 0,
    };
  },

  computed: {
    ...mapGetters({
      currentPost: 'currentPost',
      slideshow: 'slideshow',
      prevPhoto: 'prevPhoto',
      nextPhoto: 'nextPhoto',
      gallery: 'gallery',
      galleryInfo: 'galleryInfo',
      galleryIndex: 'galleryIndex'
    })
  },

  beforeMount() {
  	this.id = this.parseIDSlug(this.$route.params.idSlug);
    this.getPhoto();
  },

  mounted() {
    this.$el.focus();
    this.$el.classList.remove("opacity-0");
  },

  watch: {
  	'$route': 'refreshPhoto',
    post: function (val, oldVal) {
      console.log('watching post:', val, oldVal);
    },
    liked: function() {
      return this.liked;
    },
    likes: function() {
      return this.likes;
    }
  },

  methods: {
    ...mapActions([
    ]),
    ...mapMutations({
      'setSlideshow': 'PHOTO_SLIDESHOW',
      'setGalleryInfo': 'GALLERY_INFO',
      'setGallery' : 'GALLERY'
    }),
  	parseIDSlug: function(idSlug) {
  		return parseInt(idSlug.substr(0, idSlug.indexOf('-'), 10));
  	},
    getPhoto: function() {
      if(this.currentPost.acf.gallery) {
        let gallery = this.currentPost.acf.gallery;
        for (const [idx, el] of gallery.entries()) {
          if(this.id === el.id) {
            this.photo = el;

            this.photo.likes = this.photo.likes ? this.photo.likes : 0;
            this.photo.liked = this.photo.liked ? this.photo.liked : false;

            this.setGallery({ gallery, idx });
            this.setSlideshow({ toggleSlideshow: false });
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

      this.liked = this.photo.liked;
      this.likes = this.photo.likes;
    },
    refreshPhoto: function() {
	  	this.id = this.parseIDSlug(this.$route.params.idSlug); 
	    this.getPhoto();
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
    },
    toggleSlideshow: function() {
      this.setSlideshow({toggleSlideshow: true});
    },
    goToNextPhoto: function() {
      router.push({
        name: 'Photo',
        params: { idSlug: this.nextPhoto.id + '-' + this.nextPhoto.name }
      });
    },
    goToPrevPhoto: function() {
      router.push({
        name: 'Photo',
        params: { idSlug: this.prevPhoto.id + '-' + this.prevPhoto.name }
      });
    },
    back: function() {
      router.push({
        name: 'Post',
        params: { slug: this.currentPost.slug }
      });
    },
    handleImageLoad: function() {
      let photoBox = document.getElementsByClassName('photoBox')[0];
      photoBox.classList.remove("opacity-0");
    }
  },

  components: { Loader }
};
</script>
