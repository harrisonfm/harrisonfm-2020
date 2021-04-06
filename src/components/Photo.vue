<template>
  <div class="photo-modal" tabindex="0"
    @keyup.right="goToNextPhoto"
    @keyup.left="goToPrevPhoto"
    @keyup.up="back"
    @keyup.down="back"
    @keyup.esc="back"
    @keyup.space="toggleSlideshow"
    @keyup.enter="setGalleryInfo">
    <template v-if="photo">
      <div class="controls" v-if="galleryInfo">
        <i @click="back">
          <font-awesome-icon :icon="['fas', 'compress-alt']" />
        </i>
        <i @click="setGalleryInfo">
          <font-awesome-icon :icon="['fas', 'info-circle']" :class="{'text-blue-500': galleryInfo}" />
        </i>
        <i @click="toggleSlideshow">
          <font-awesome-icon :icon="['fas', slideshow ? 'pause' : 'play']" v-if="nextPhoto" class="cursor-pointer" />
        </i>
        <i @click="like">
          <font-awesome-layers full-width class="cursor-pointer not-italic" :class="{'text-red-600': liked}" >
            <font-awesome-icon :icon="['fas', 'heart']" />
            <font-awesome-layers-text v-if="likes" class="text-white" transform="shrink-8" :value="likes" />
          </font-awesome-layers>
        </i>
      </div>
      <div class="controls-mini" v-else @click="setGalleryInfo">
        <font-awesome-icon :icon="['fas', 'chevron-circle-left']" />
      </div>
      <transition name="fade">
        <div class="photo-box" :class="{'pb-4': galleryInfo, 'my-auto': !galleryInfo}" v-if="loaded">
          <img sizes="100vw" :srcset="parseSrcset(photo)" :src="photo.images['2048x2048'].src" class="max-h-full m-auto" />
        </div>
      </transition>
      <div class="w-full text-center px-4 my-4 sm:hidden" :class="{'hidden' : !galleryInfo}">
        <h2 class="leading-none text-2xl">{{ photo.post_title }}</h2>
        <p class="mb-0" v-if="photo.post_excerpt">{{ photo.post_excerpt }}</p>
      </div>
      <nav class="photo-infonav" v-if="galleryInfo">
        <transition name="fade-delay">
          <img :src="prevPhoto.images.thumbnail.src" v-if="prevPhoto && loaded" @click="goToPrevPhoto" alt="previous photo" />
        </transition>
        <transition name="fade">
          <div class="infonav-text" v-if="loaded">
            <h2 class="infonav-title">{{ photo.post_title }}</h2>
            <p class="mb-0" v-if="photo.post_excerpt">{{ photo.post_excerpt }}</p>
          </div>
        </transition>
        <transition name="fade-delay">
          <img :src="nextPhoto.images.thumbnail.src" v-if="nextPhoto && loaded" @click="goToNextPhoto" alt="next photo" />
        </transition>
      </nav>
    </template>
    <Loader v-else/>
  </div>
</template>
<style scoped>
.photo-modal {
  @apply fixed inset-0 bg-white flex flex-col items-center md:px-24 transition-opacity duration-300 bg-white z-30 opacity-0 font-open;
}
.controls {
  @apply absolute flex flex-col items-center py-3 px-2 right-0 top-0 text-xl rounded-bl-lg bg-white bg-opacity-25 transition-none z-10 md:text-3xl;
}
.controls > * {
  @apply cursor-pointer py-1 px-2 leading-none;
}
.controls i:not(:first-of-type) {
  @apply mt-3;
}
.controls-mini {
  @apply absolute right-0 top-0 bg-gray-300 opacity-50 w-6 h-8 px-1 flex items-center text-black cursor-pointer border-4 border-t-0 border-r-0 border-gray-600 rounded-bl-lg;
}
.photo-box {
  @apply w-screen overflow-auto mt-auto lg:my-auto;
}
.photo-infonav {
  @apply relative w-full flex items-center justify-between mt-auto mx-auto p-4 bg-gray-100 sm:mb-4 sm:rounded-lg sm:shadow xxl:w-4/5;
  @media(max-height: 500px) {
    margin-bottom: 0;
    border-radius: 0;
    box-shadow: none;
  }
}
.photo-infonav.infoOff {
  @apply hidden;
}
.photo-infonav > svg {
  @apply text-4xl xs:ml-0 cursor-pointer;
}
.photo-infonav img {
  height: 75px;
}
.infonav-text {
  @apply text-center px-4 hidden m-auto sm:block
}
.infonav-title {
  @apply leading-none text-2xl lg:text-4xl
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 1s;
}
.fade-delay-enter-active, .fade-delay-leave-active {
  transition: opacity .5s;
  transition-delay: 1s;
}
.fade-enter, .fade-leave-to, 
.fade-delay-enter, .fade-delay-leave-to {
  opacity: 0;
}
</style>
<script>
import Loader from "~/components/partials/Loader.vue";
import { mapGetters, mapActions, mapMutations } from "vuex";
import store from '~/store';
import meta from '~/meta';
import router from '~/router';

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
      liked: 'liked'
    }),
    routes: function() {
      if(this.postSlug) {
        return {
          parent: 'Post',
          parentSlug: this.postSlug,
          photo: 'PostPhoto'
        }
      }
      else if(this.gallerySlug) {
        return {
          parent: 'PhotosGallery',
          parentSlug: this.gallerySlug,
          photo: 'PhotosSingle'
        }
      }
    }
  },

  data() {
    return {
      loaded: false
    }
  },

  props: ['idSlug', 'postSlug', 'gallerySlug'],

  beforeMount() {
    console.log(this.postSlug);
    this.ID = this.parseIDSlug(this.idSlug);
    this.getPhoto();
  },

  beforeRouteLeave: function(to,from,next) {
    if(this.slideshow) {
      this.toggleSlideshow();
    }
    next();
  },

  mounted() {
    if(this.$el.focus) {
      this.$el.focus();
      this.$el.style.opacity = 1;
    }
  },

  watch: {
    '$route': 'refreshPhoto',
    'gallery': 'getPhoto'
  },

  methods: {
    ...mapActions([
      'getSinglePhoto'
    ]),
    ...mapMutations({
      'setPhoto': 'PHOTO',
      'setSlideshow': 'PHOTO_SLIDESHOW',
      'setGalleryInfo': 'GALLERY_INFO',
      'setGalleryIndex' : 'GALLERY_INDEX',
      'setLiked': 'LIKED',
      'setLoaded': 'PHOTO_LOADED'
    }),
    parseIDSlug: function(idSlug) {
      return parseInt(idSlug.substr(0, idSlug.indexOf('-'), 10));
    },
    getPhoto: function() {
      console.log('getphoto', this.ID, this.gallery);
      if(this.gallery.images && this.ID) {
        for (const [idx, el] of this.gallery.images.entries()) {
          if(this.ID === el.ID) {
            console.log('getphoto from gallery', el);
            this.setPhoto(el);
            this.setLiked({liked: this.$cookies.isKey("hfm-liked-"+this.idSlug)});
            this.setGalleryIndex({ idx });
            window.prerenderReady = true;
            break;
          }
        }
        if(!this.photo.images) {
          this.$_error('ErrorPage', {
            route: this.idSlug
          });
        }
        this.preload(this.photo);
      }
      else {
        this.$_error('ErrorPage', {
          route: this.idSlug
        });
      }
      // else {
      //   this.getSinglePhoto({
      //     ID: this.ID, 
      //     liked: this.$cookies.isKey("hfm-liked-"+this.idSlug)
      //   });
      // }
    },
    refreshPhoto: function() {
      this.setPhoto();
      this.loaded = false;
      this.ID = this.parseIDSlug(this.idSlug);
      this.getPhoto();
    },
    like: function() {
      if(this.liked) {
        this.$cookies.remove("hfm-liked-"+this.idSlug);
      }
      else {
        this.$cookies.set("hfm-liked-"+this.idSlug,'',"7d");
      }
      store.dispatch('like', {
        photo: this.photo, 
        likes: this.likes + (this.liked ? -1 : 1)
      });
      this.setLiked({liked: !this.liked});
    },
    toggleSlideshow: function() {
      this.setSlideshow();
      this.handleSlideShow();
    },
    back: function() {
      router.replace({
        name: this.routes.parent,
        params: { slug: this.routes.parentSlug }
      });
    },
    goToNextPhoto: function() {
      if(this.slideshow) {
        this.toggleSlideshow();
      }
      this.routeToPhoto(this.nextPhoto);
    },
    goToPrevPhoto: function() {
      if(this.slideshow) {
        this.toggleSlideshow();
      }
      this.routeToPhoto(this.prevPhoto);
    },
    routeToPhoto: function(photo) {
      router.replace({
        name: this.routes.photo,
        params: { idSlug: photo.ID + '-' + photo.post_name }
      });
    },
    handleImageLoad: function(photo, identifier) {
      console.log(photo.post_title+' loaded');
      if(identifier === 'main') {
        this.loaded = true;
        this.handleSlideShow();
        this.preload(this.nextPhoto, 'next');
        this.preload(this.prevPhoto, 'prev');
      }
    },
    preload(photo = this.photo, identifier = 'main') {
      let image = new Image();
      image.onload = function() {
        this.handleImageLoad(photo, identifier);
      }.bind(this);
      image.sizes = '100vw';
      image.srcset = this.parseSrcset(photo);
    },
    handleSlideShow: function() {
      if(this.slideshow) {
        this.activeSlide = setTimeout(() => {
          this.routeToPhoto(this.nextPhoto);
        }, 5000);
      }
      else {
        clearTimeout(this.activeSlide);
      }
    },
    parseSrcset(photo) {
      if(photo.images) {
        const img = photo.images;
        return img.medium_large.src+' '+img.medium_large.width+'w, '+img.large.src+' '+img.large.width+'w, '+img['1536x1536'].src+' '+img['1536x1536'].width+'w, '+img['2048x2048'].src+' '+img['2048x2048'].width+'w, '+img['full'].src+' '+img['full'].width+'w';
      }
    }
  },

  metaInfo () {
    return meta.formatMeta(this.photo.post_title, this.photo.post_excerpt, this.photo.images, 'author')
  },

  components: { Loader }
};
</script>
