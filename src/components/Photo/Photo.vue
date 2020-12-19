<template>
  <div class="photo-modal fixed inset-0 ph-5 bg-white flex flex-col items-center md:px-24 transition-opacity duration-300 opacity-0 bg-white z-30"
    tabindex="0"
    @keyup.right="goToNextPhoto"
    @keyup.left="goToPrevPhoto"
    @keyup.up="back"
    @keyup.down="back"
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
import Loader from "../partials/Loader.vue";
import { mapGetters, mapActions, mapMutations } from "vuex";
import SETTINGS from "../../settings";
import store from '../../store';
import router from '../../router';
import meta from '../../meta';

export default {
  data() {
    return {
    };
  },

  computed: {
    ...mapGetters({
      photo: 'photo',
      currentPost: 'currentPost',
      slideshow: 'slideshow',
      prevPhoto: 'prevPhoto',
      nextPhoto: 'nextPhoto',
      gallery: 'gallery',
      galleryInfo: 'galleryInfo',
      galleryIndex: 'galleryIndex',
      likes: 'likes',
      liked: 'liked'
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
    }
  },

  methods: {
    ...mapActions([
      'getSinglePhoto'
    ]),
    ...mapMutations({
      'setPhoto': 'PHOTO',
      'setSlideshow': 'PHOTO_SLIDESHOW',
      'setGalleryInfo': 'GALLERY_INFO',
      'setGallery' : 'GALLERY',
      'setLiked': 'LIKED'
    }),
  	parseIDSlug: function(idSlug) {
  		return parseInt(idSlug.substr(0, idSlug.indexOf('-'), 10));
  	},
    getPhoto: function() {
      if(this.currentPost.acf.gallery) {
        let gallery = this.currentPost.acf.gallery;
        for (const [idx, el] of gallery.entries()) {
          if(this.id === el.id) {
            console.log('getphoto from gallery', el);
            this.setPhoto(el);
            this.setLiked({liked: this.$cookies.isKey("hfm-liked-"+this.$route.params.idSlug)});
            this.setGallery({ gallery, idx });
            this.setSlideshow({ toggleSlideshow: false });
            break;
          }
        }
      }
      else {
        this.getSinglePhoto({
          id: this.id, 
          liked: this.$cookies.isKey("hfm-liked-"+this.$route.params.idSlug)
        });
      }
    },
    refreshPhoto: function() {
	  	this.id = this.parseIDSlug(this.$route.params.idSlug); 
	    this.getPhoto();
    },
    like: function() {
      if(this.liked) {
        this.$cookies.remove("hfm-liked-"+this.$route.params.idSlug);
      }
      else {
        this.$cookies.set("hfm-liked-"+this.$route.params.idSlug,'',"7d");
      }
      store.dispatch('like', {
        photo: this.photo, 
        likes: this.likes + (this.liked ? -1 : 1)
      });
      this.setLiked({liked: !this.liked});
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

  metaInfo () {
    return meta.formatMeta(this.photo.title, this.photo.caption, this.photo.url)
  },

  components: { Loader }
};
</script>
