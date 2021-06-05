<template>
  <transition name="fade">
    <div class="photo-modal" tabindex="0"
      @keyup.right="goToNextPhoto"
      @keyup.left="goToPrevPhoto"
      @keyup.up="back"
      @keyup.down="back"
      @keyup.esc="back"
      @keyup.space="toggleSlideshow"
      @keyup.enter="setGalleryInfo">
      <template v-if="photo">
        <transition name="slide-right">
          <div class="controls controls-full" v-if="galleryInfo">
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
        </transition>
        <transition name="slide-right">
          <div class="controls controls-mini" v-if="!galleryInfo" @click="setGalleryInfo">
            <font-awesome-icon :icon="['fas', 'chevron-circle-left']" />
          </div>
        </transition>
        <transition name="fade">
          <div class="photo-box" :class="{'pb-4': galleryInfo, 'my-auto': !galleryInfo}" v-if="loaded">
            <img sizes="100vw" :srcset="parseSrcset(photo)" :src="photo.images['2048x2048'].src" class="max-h-full m-auto" />
          </div>
        </transition>
        <div class="w-full text-center px-4 my-4 sm:hidden" :class="{'hidden' : !galleryInfo}">
          <h2 class="leading-none text-2xl mb-0">{{ loaded ? photo.post_title : 'Loading..' }}</h2>
          <transition name="fade">
            <p class="mb-0 mt-2" v-if="loaded && photo.post_excerpt">{{ photo.post_excerpt }}</p>
          </transition>
        </div>
        <transition name="slide-up">
          <nav class="photo-infonav" v-if="galleryInfo">
            <transition-group name="fade-delay">
              <Loader key="spinner" v-if="loaded && prevPhoto && !prevLoaded" classes="photo-thumb prev" />
              <img key="thumb" width="75" height="75" class="thumb" :src="prevPhoto.images.thumbnail.src" v-if="prevPhoto" :class="{'invisible': !prevLoaded}" @click="goToPrevPhoto" alt="previous photo" />
            </transition-group>
            <div class="infonav-text">
              <h2 class="infonav-title mb-0">{{ loaded ? photo.post_title : 'Loading...' }}</h2>
              <transition name="fade">
                <p class="mb-0 mt-2 lg:mt-4" v-if="loaded && photo.post_excerpt">{{ photo.post_excerpt }}</p>
              </transition>
            </div>
            <transition-group name="fade-delay">
              <Loader key="spinner" v-if="loaded && nextPhoto && !nextLoaded" classes="photo-thumb next" />
              <img key="thumb" width="75" height="75" class="thumb" :src="nextPhoto.images.thumbnail.src" v-if="nextPhoto" :class="{'invisible': !nextLoaded}" @click="goToNextPhoto" alt="next photo" />
            </transition-group>
          </nav>
        </transition>
      </template>
    </div>
  </transition>
</template>
<style scoped>
.photo-modal {
  @apply fixed inset-0 bg-white flex flex-col items-center md:px-24 transition-opacity duration-300 bg-white z-30 font-open;
}
.controls {
  @apply absolute flex items-center right-0 top-0 z-10;
}
.controls-full {
  @apply flex-col py-3 px-2 text-xl rounded-bl-lg bg-white bg-opacity-25 md:text-3xl;
}
.controls-full > * {
  @apply cursor-pointer py-1 px-2 leading-none;
}
.controls-full i:not(:first-of-type) {
  @apply mt-3;
}
.controls-mini {
  @apply bg-gray-300 opacity-50 w-6 h-8 px-1 cursor-pointer border-4 border-t-0 border-r-0 border-gray-600 rounded-bl-lg;
}
.photo-box {
  @apply overflow-auto mt-auto lg:my-auto;
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
.infonav-text {
  @apply text-center px-4 hidden m-auto sm:flex sm:flex-col sm:justify-center;
  min-height: 75px;
}
.infonav-title {
  @apply leading-none text-2xl lg:text-4xl;
}
</style>
<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import store from '~/store';
import meta from '~/meta';
import router from '~/router';
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

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
      else {
        return {
          parent: 'Page',
          parentSlug: 'harrigrams',
          photo: 'Harrigram'
        }
      }
    },
    metaDescription: function() {
      let meta = '';
      let caption = this.photo.post_excerpt;
      let postTitle = '';

      if(this.currentPost.post_title === 'Photos' && this.gallery.title) {
        postTitle = this.gallery.title; 
      }
      else if(this.currentPost) {
        postTitle = this.currentPost.post_title;
      }

      if(!caption && postTitle) {
        meta = 'From '+postTitle;
      }
      else if(caption && postTitle) {
        meta = postTitle+': '+caption;
      }

      return meta;
    }
  },

  data() {
    return {
      loaded: false,
      prevLoaded: false,
      nextLoaded: false,
      mounted: true,
      transition: 'fade'
    }
  },

  props: ['idSlug', 'postSlug', 'gallerySlug'],

  beforeMount() {
    console.log('photo before mounted');
    this.ID = this.parseIDSlug(this.idSlug);
    this.getPhoto();
  },

  beforeRouteLeave: function(to,from,next) {
    if(this.slideshow) {
      this.toggleSlideshow();
    }
    clearAllBodyScrollLocks();
    next();
  },

  mounted() {
    console.log('photo mounted');
    if(this.$el.focus) {
      this.$el.focus();
    }
    disableBodyScroll(document.getElementsByClassName('photo-modal')[0]);
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
      'setLiked': 'LIKED'
    }),
    parseIDSlug: function(idSlug) {
      return parseInt(idSlug.substr(0, idSlug.indexOf('-'), 10));
    },
    getPhoto: function() {
      console.log('getphoto '+this.ID, this.gallery.images, this.gallery.loaded);
      if(!this.gallery.loaded) {
        return false;
      }
      if(this.gallery.images && this.ID) {
        for (const [idx, el] of this.gallery.images.entries()) {
          if(this.ID === el.ID) {
            console.log('getphoto from gallery', el);
            this.setPhoto(el);
            this.setLiked({liked: this.$cookies.isKey("hfm-liked-"+this.idSlug)});
            this.setGalleryIndex({ idx });
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
      console.log(this.routes);
      router.replace({
        name: this.routes.photo,
        params: { idSlug: photo.ID + '-' + photo.post_name }
      });
    },
    handleImageLoad: function(photo, identifier) {
      if(identifier === 'main') {
        this.loaded = true;
        this.handleSlideShow();
        if(this.prevPhoto.images) {
          this.preload(this.prevPhoto, 'prev');
        }
        if(this.nextPhoto.images) {
          this.preload(this.nextPhoto, 'next');
        }
        window.prerenderReady = true;
      }
      else if(identifier === 'prev') {
        this.prevLoaded = true;
      }
      else if(identifier === 'next') {
        this.nextLoaded = true;
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
    return meta.formatMeta(this.photo.post_title, this.metaDescription, this.photo.images, 'author')
  }
};
</script>
