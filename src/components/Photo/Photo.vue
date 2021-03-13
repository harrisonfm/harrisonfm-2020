<template>
  <div class="photo-modal"
    tabindex="0"
    @keyup.right="goToNextPhoto"
    @keyup.left="goToPrevPhoto"
    @keyup.up="back"
    @keyup.down="back"
    @keyup.esc="back"
    @keyup.space="toggleSlideshow">
    <template v-if="photo">
      <div class="controls">
        <font-awesome-icon :icon="['fas', 'compress-alt']" @click="back"/>
        <font-awesome-icon :icon="['fas', 'info-circle']" class="hidden mt-4 lg:block" :class="{ 'text-blue-500': galleryInfo }" @click="setGalleryInfo"/>
      </div>
      <div :key="photo.ID" class="photo-box">
        <img v-if="photo.images" :src="photo.images.full" class="max-h-full m-auto" @load="handleImageLoad" />
      </div>
      <div class="w-full text-center px-4 my-4" :class="{'lg:hidden' : !galleryInfo}">
        <h2 class="leading-none">{{ photo.post_title }}</h2>
        <p class="mb-0" v-if="photo.post_excerpt">{{ photo.post_excerpt }}</p>
      </div>
      <nav :class="{'lg:hidden' : !galleryInfo}">
        <font-awesome-icon :icon="['fas', 'chevron-circle-left']" v-if="prevPhoto" @click="goToPrevPhoto"/>
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
        <font-awesome-icon :icon="['fas', 'chevron-circle-right']" v-if="nextPhoto" @click="goToNextPhoto"/>
      </nav>
    </template>
    <Loader v-else/>
  </div>
</template>
<style scoped>
.photo-modal {
  @apply fixed inset-0 bg-white flex flex-col items-center md:px-24 transition-opacity duration-300 bg-white z-30 opacity-0;
}
.controls {
  @apply absolute flex flex-col items-center top-1 right-1 p-1 text-4xl;
}
.controls svg {
  @apply rounded bg-white bg-opacity-25 cursor-pointer;
}
.photo-box {
  @apply overflow-auto mt-auto transition-opacity duration-1000 lg:my-auto opacity-0;
}
nav {
  @apply relative w-full flex items-center mt-auto p-4 bg-gray-100 xs:mb-4 xs:rounded-lg xs:shadow xs:max-w-md
}
nav > svg {
  @apply text-4xl xs:ml-0 cursor-pointer;
}
</style>
<script>
import Loader from "~/components/partials/Loader.vue";
import { mapGetters, mapActions, mapMutations } from "vuex";
import SETTINGS from "~/settings";
import store from '~/store';
import router from '~/router';
import meta from '~/meta';

export default {
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
      liked: 'liked',
    })
  },

  beforeMount() {
  	this.ID = this.parseIDSlug(this.$route.params.idSlug);
    this.getPhoto();
  },

  mounted() {
    this.$el.focus();
    this.$el.style.opacity = 1;
  },

  watch: {
  	'$route': 'refreshPhoto',
    'currentPost': function() {
      this.getPhoto();
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
      if(this.currentPost.loading) {
        return;
      }
      
      if(this.currentPost.gallery) {
        let gallery = this.currentPost.gallery;
        for (const [idx, el] of gallery.entries()) {
          if(this.ID === el.ID) {
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
          ID: this.ID, 
          liked: this.$cookies.isKey("hfm-liked-"+this.$route.params.idSlug)
        });
      }
    },
    refreshPhoto: function() {
	  	this.ID = this.parseIDSlug(this.$route.params.idSlug); 
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
        params: { idSlug: this.nextPhoto.ID + '-' + this.nextPhoto.post_name }
      });
    },
    goToPrevPhoto: function() {
      router.push({
        name: 'Photo',
        params: { idSlug: this.prevPhoto.ID + '-' + this.prevPhoto.post_name }
      });
    },
    back: function() {
      router.push({
        name: 'Post',
        params: { slug: this.currentPost.slug }
      });
    },
    handleImageLoad: function() {
      let photoBox = document.getElementsByClassName('photo-box')[0];
      photoBox.style.opacity = 1;
    }
  },

  metaInfo () {
    return meta.formatMeta(this.photo.post_title, this.photo.post_excerpt, this.photo.images ? this.photo.images.full : '', window.location.href)
  },

  components: { Loader }
};
</script>
