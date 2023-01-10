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
            <i class="controls-icon" @click="back" @mouseover="controls.back.hover = true" @mouseleave="controls.back.hover = false">
              <font-awesome-icon :icon="['fas', 'compress-alt']" />
              <transition name="fade">
                <div class="controls-msg" v-if="controls.back.hover">Back to {{currentPost.post_title}}</div>
              </transition>
            </i>
            <i class="controls-icon" @click="handleSetGalleryInfo" @mouseover="galleryInfo ? controls.info.hover = true : controls.info.hover = false" @mouseleave="controls.info.hover = false">
              <font-awesome-icon :icon="['fas', 'info-circle']" />
              <transition name="fade">
                <div class="controls-msg" v-if="controls.info.hover">Hide photo info</div>
              </transition>
            </i>
            <i class="controls-icon" @click="toggleSlideshow" @mouseover="controls.slideshow.hover = true" @mouseleave="controls.slideshow.hover = false">
              <font-awesome-icon :icon="['fas', slideshow ? 'pause' : 'play']" v-if="nextPhoto" />
              <transition name="fade">
                <div class="controls-msg" v-if="controls.slideshow.hover">Toggle slideshow (5s)</div>
              </transition>
            </i>
            <i class="controls-icon" @click="like" @mouseover="controls.like.hover = true" @mouseleave="controls.like.hover = false">
              <font-awesome-layers full-width class="cursor-pointer not-italic" :class="{'text-red-600': liked}" >
                <font-awesome-icon :icon="['fas', 'heart']" />
                <font-awesome-layers-text v-if="likes" class="text-white" transform="shrink-8" :value="likes" />
              </font-awesome-layers>
              <transition name="fade">
                <div class="controls-msg" v-if="controls.like.hover">Give some love</div>
              </transition>
            </i>
            <i class="controls-icon" @click="share" @mouseover="controls.share.hover = true" @mouseleave="controls.share.hover = false">
              <font-awesome-icon :icon="['fas', 'share']" />
              <transition name="fade">
                <div class="controls-msg" v-if="controls.share.hover">Share photo</div>
              </transition>
              <transition name="fade">
                <div class="controls-msg" v-if="controls.share.clickAlt">Copied to clipboard!</div>
              </transition>
            </i>
          </div>
        </transition>
        <transition name="slide-right">
          <div class="controls controls-mini" v-if="!galleryInfo" @click="setGalleryInfo">
            <font-awesome-icon :icon="['fas', 'chevron-circle-left']" />
          </div>
        </transition>
        <transition name="fade">
          <div class="photo-box" :class="{'pb-2 lg:pb-4': galleryInfo, 'my-auto': !galleryInfo}" v-if="loaded">
            <img :sizes="sizes" :srcset="parseSrcset(photo)" :src="photo.images['2048x2048'].src" class="max-h-full m-auto" />
          </div>
        </transition>
        <div class="w-full text-center px-2 my-2 dark:text-gray-100 lg:px-4 lg:my-4 sm:hidden" :class="{'hidden' : !galleryInfo}">
          <h2 class="leading-none text-2xl mb-0">{{ loaded ? photo.post_title : 'Loading..' }}</h2>
          <transition name="fade">
            <p class="mb-0 mt-2" v-if="loaded && photo.post_excerpt">{{ photo.post_excerpt }}</p>
          </transition>
        </div>
        <transition name="slide-up">
          <nav class="photo-infonav" v-if="galleryInfo">
            <Loader v-if="loaded && prevPhoto && !prevLoaded" classes="photo-thumb prev" />
            <transition name="fade-delay">
              <img width="75" height="75" class="thumb" :src="prevPhoto.images.thumbnail.src" v-if="prevPhoto" :class="{'invisible': !prevLoaded}" @click="goToPrevPhoto" alt="previous photo" :title="prevPhoto.post_title" />
            </transition>
            <div class="infonav-text">
              <h2 class="infonav-title mb-0">{{ loaded ? photo.post_title : 'Loading...' }}</h2>
              <transition name="fade">
                <p class="leading-none mb-0 mt-2 lg:mt-4" v-if="loaded && ((photo.post_excerpt || locDate))">
                  <span>{{ photo.post_excerpt }}</span>
                  <span class="infonav-locdate" v-if="locDate">{{ photo.post_excerpt ? '&mdash;' : '' }} {{ locDate }}</span>
                </p>
              </transition>
            </div>
            <Loader key="spinner" v-if="loaded && nextPhoto && !nextLoaded" classes="photo-thumb next" />
            <transition name="fade-delay">
              <img width="75" height="75" class="thumb" :src="nextPhoto.images.thumbnail.src" v-if="nextPhoto" :class="{'invisible': !nextLoaded}" @click="goToNextPhoto" alt="next photo" :title="nextPhoto.post_title" />
            </transition>
          </nav>
        </transition>
      </template>
    </div>
  </transition>
</template>
<style scoped>
.photo-modal {
  @apply fixed inset-0 bg-white flex flex-col items-center transition-opacity duration-300 bg-white z-30 font-open dark:bg-gray-800;
}
.controls {
  @apply absolute flex items-center right-0 top-0 z-10;
}
.controls-full {
  @apply flex-col py-3 px-2 text-lg rounded-bl-lg bg-white bg-opacity-25 md:text-xl;
}
.controls-icon {
  @apply cursor-pointer p-1 leading-none relative shadow rounded-full md:p-2 shadow bg-opacity-10 bg-black;
}
.controls-icon:not(:first-of-type) {
  @apply mt-3;
}
.controls-mini {
  @apply bg-gray-300 opacity-50 w-6 h-8 px-1 cursor-pointer border-4 border-t-0 border-r-0 border-gray-600 rounded-bl-lg;
}
.controls-msg {
  @apply absolute text-base not-italic right-3/2 bg-gray-800 rounded-lg border-gray-900 border-solid p-2 top-0 text-gray-500 whitespace-nowrap;
}
.photo-box {
  @apply overflow-auto mt-auto lg:my-auto;
}
.photo-infonav {
  @apply relative w-full flex items-center justify-between mt-auto mx-auto p-2 bg-gray-100 lg:p-4 xxl:rounded-lg xxl:shadow xxl:w-4/5 dark:bg-gray-700 dark:text-gray-100;
}
@media(max-height: 500px) {
  .photo-infonav {
    @apply mb-0 rounded-none shadow-none;
  }
}
.photo-infonav.infoOff {
  @apply hidden;
}
.photo-infonav > svg {
  @apply text-4xl xs:ml-0 cursor-pointer;
}
.infonav-text {
  @apply text-center px-4 hidden m-auto sm:flex sm:flex-col sm:justify-center min-h-[75px];
}
.infonav-title {
  @apply leading-none text-2xl lg:text-4xl;
}
.infonav-locdate {
  @apply text-gray-700 dark:text-gray-400;
}
</style>
<script>
import { mapGetters, mapActions, mapMutations } from "vuex"
import meta from '~/meta'
import router from '~/router'
import analytics from '~/analytics'
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'

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
    routes() {
      if(this.postSlug) {
        return {
          parent: 'Post',
          parentSlug: this.postSlug,
          name: 'PostPhoto'
        }
      }
      else if(this.gallerySlug) {
        return {
          parent: 'PhotosGallery',
          parentSlug: this.gallerySlug,
          name: 'PhotosSingle'
        }
      }
      else {
        return {
          parent: 'Harrigrams',
          parentSlug: 'harrigrams',
          name: 'Harrigram'
        }
      }
    },
    metaDescription() {
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
    },
    locDate() {
      return this.photo.date && this.photo.location ? this.photo.location + ' - ' + this.photo.date : 
        (this.photo.date ? this.photo.date : (this.photo.location ? this.photo.location : ''))
    }
  },

  data() {
    return {
      loaded: false,
      prevLoaded: false,
      nextLoaded: false,
      mounted: true,
      transition: 'fade',
      controls: {
        back: {
          hover: false
        },
        info: {
          hover: false
        },
        slideshow: {
          hover: false
        },
        like: {
          hover: false
        },
        share: {
          hover: false,
          clickAlt: false
        },
      },
      sizes: '',
      viewport: {}
    }
  },

  props: ['idSlug', 'postSlug', 'gallerySlug'],

  beforeMount() {
    this.ID = this.parseIDSlug(this.idSlug);
    this.getPhoto();
  },

  beforeRouteLeave(to,from,next) {
    if(this.slideshow) {
      this.toggleSlideshow();
    }
    clearAllBodyScrollLocks();
    next();
  },

  mounted() {
    if(this.$el.focus) {
      this.$el.focus();
    }
    window.addEventListener('resize', this.handleResize);
    disableBodyScroll(this.$el);
    this.setViewport();
  },

  unmounted() {
    window.removeEventListener('resize', this.handleResize);
  },

  watch: {
    '$route': 'refreshPhoto',
    'gallery': 'getPhoto'
  },

  methods: {
    ...mapActions(['getSinglePhoto', 'likePhoto']),
    ...mapMutations({
      'setPhoto': 'PHOTO',
      'setSlideshow': 'PHOTO_SLIDESHOW',
      'setGalleryInfo': 'GALLERY_INFO',
      'setGalleryIndex' : 'GALLERY_INDEX',
      'setLiked': 'LIKED'
    }),
    parseIDSlug(idSlug) {
      return parseInt(idSlug.substr(0, idSlug.indexOf('-')));
    },
    getPhoto() {
      console.log('getphoto '+this.ID, this.gallery.images, this.gallery.loaded);
      if(!this.gallery.loaded) {
        return false;
      }
      if(this.gallery.images && this.ID) {
        for (const [idx, el] of this.gallery.images.entries()) {
          if(this.ID === el.ID) {
            console.log('getphoto from gallery', el);
            this.setPhoto(el);
            this.setGalleryIndex({ idx });
            analytics.trackPageView((this.gallery.title ? this.gallery.title + ' Photos - ' : (this.currentPost.post_title === 'Harrigrams' ? this.currentPost.post_title : this.currentPost.post_title + ' Photos - ')) + this.photo.post_title);
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
      //   });
      // }
    },
    refreshPhoto() {
      this.setPhoto();
      this.loaded = false;
      this.ID = this.parseIDSlug(this.idSlug);
      this.getPhoto();
    },
    like() {
      this.controls.like.hover = false;
      if(this.liked) {
        analytics.trackEvent('Photo', 'unLike');
      }
      else {
        analytics.trackEvent('Photo', 'Like');
      }
      this.likePhoto();
    },
    toggleSlideshow() {
      if(this.slideshow) {
        analytics.trackEvent('Photo', 'Slideshow Off');
      }
      else {
        analytics.trackEvent('Photo', 'Slideshow On');
      }
      this.setSlideshow();
      this.handleSlideShow();
    },
    back() {
      router.replace({
        name: this.routes.parent,
        params: { 
          slug: this.routes.parentSlug,
          pageSlug: this.routes.parentSlug
        }
      });
      analytics.trackEvent('Photo', 'Back');
    },
    goToNextPhoto() {
      if(this.slideshow) {
        this.toggleSlideshow();
      }
      this.routeToPhoto(this.nextPhoto);
      analytics.trackEvent('Photo', 'Next');
    },
    goToPrevPhoto() {
      if(this.slideshow) {
        this.toggleSlideshow();
      }
      this.routeToPhoto(this.prevPhoto);
      analytics.trackEvent('Photo', 'Previous');
    },
    routeToPhoto(photo) {
      router.replace({
        name: this.routes.name,
        params: { idSlug: photo.ID + '-' + photo.post_name }
      });
    },
    handleImageLoad(photo, identifier) {
      if(identifier === 'main') {
        this.loaded = true;
        this.handleSlideShow();
        if(this.prevPhoto.images) {
          this.preload(this.prevPhoto, 'prev');
        }
        if(this.nextPhoto.images) {
          this.preload(this.nextPhoto, 'next');
        }
        // window.prerenderReady = true;
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
      image.srcset = this.parseSrcset(photo);
      image.sizes = this.parseSizes(photo);
      if(identifier === 'main') {
        this.sizes = image.sizes;
      }
    },
    handleSlideShow() {
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
        return img.medium_large.src+' '+img.medium_large.width+'w, '+img.large.src+' '+img.large.width+'w, '+img['1536x1536'].src+' '+img['1536x1536'].width+'w, '+img['2048x2048'].src+' '+img['2048x2048'].width+'w';
      }
    },
    parseSizes(photo) {
      if(photo.images) {
        let sizes = '100vw';
        let imgAspectRatio = photo.images.full.width / photo.images.full.height;
        let windowAspectRatio = this.viewport.width / this.viewport.height;

        console.log('viewport ', this.viewport, imgAspectRatio, windowAspectRatio);
        if (windowAspectRatio >= imgAspectRatio) {
          //if window aspect ratio less, math it up to find the void and serve a better image to user.
          sizes = Math.round((this.viewport.height * imgAspectRatio / this.viewport.width) * 100)+'vw';
          console.log(sizes + ' image');
        }
        else {
          console.log('100vw image');
        }

        return sizes;
      }
    },
    share() {
      this.controls.share.hover = false;
      if(navigator.share) {
        navigator.share({
          url: document.location.href,
          title: this.photo.post_title,
          text: this.photo.post_excerpt+' '+this.locDate
        })
      }
      else {
        this.controls.share.clickAlt = true;
        setTimeout(() => {
          this.controls.share.clickAlt = false;
        }, 1000);
        navigator.clipboard.writeText(document.location.href);
      }
      analytics.trackEvent('Photo', 'Share');
    },
    handleSetGalleryInfo() {
      this.controls.info.hover = false;
      this.setGalleryInfo();
      this.handleResize();
    },
    handleResize() {
      this.sizes = this.parseSizes(this.photo);
      this.setViewport();
    },
    setViewport() {
      this.viewport = {
        height: this.galleryInfo ? window.innerHeight - 125 : window.innerHeight,
        width: window.innerWidth
      }
    }
  },

  metaInfo () {
    return meta.formatMeta(this.photo.post_title, this.metaDescription, this.photo.images, 'author')
  }
};
</script>
