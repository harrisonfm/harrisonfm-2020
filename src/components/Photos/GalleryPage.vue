<template>
  <div class="photos-page">
    <h1 class="page-title mb-2 lg:mb-4 mx-auto max-w-4xl">{{ gallery.title }}</h1>
    <Loader v-if="!gallery.loaded" />
    <div class="floating-desc opacity-0" :class="{'opacity-100': gallery.loaded}">
      <p v-if="gallery.loaded">{{gallery.description}}</p>
    </div>
    <transition name="fade">
      <Gallery v-if="gallery.loaded" :gallery="gallery" route="PhotosSingle" />
    </transition>
    <router-view />
  </div>
</template>

<script>
import Gallery from '~/components/Post/Gallery.vue'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import meta from '~/meta'
import analytics from '~/analytics'

export default {
  computed: {
    ...mapGetters({
      post: 'currentPost',
      gallery: 'gallery'
    }),
  },
  props: ['gallerySlug'],

  beforeMount() {
    this.handleGetPost('photos');
  },

  beforeRouteUpdate(to, from, next) {
    if(to.name === 'PhotosGallery' && from.name === 'PhotosGallery') {
      this.setGallery();
      this.handleGetPost('photos');
    }
    next();
  },

  beforeRouteLeave: function(to,from,next) {
    this.setCurrentPost();
    this.setGallery();
    next();
  },

  methods: {
    ...mapActions(['getPage', 'getStoryImages']),
    ...mapMutations({
      'setCurrentPost': 'POST_CURRENT',
      'setGallery' : 'GALLERY',
    }),
    handleGetPost(slug) {
      this.getPage({
        slug: slug
      }).then(response => {
        this.setGenreGallery();
        console.log('page component resolves', response);
        if(!this.gallery.loaded) {
          console.log('getstoryimages');
          this.getStoryImages({
            slug: this.gallerySlug
          }).then(response => {
            if(this.$route.name === 'PhotosGallery') {
              window.prerenderReady = true;
              analytics.trackPageView(this.gallery.title + ' - Photos');
            }
            console.log('story images resolves', response, this.$route.name);
          }, error => {
            console.log('story images errors', this.page, error);
            this.$_error('ErrorPage', {
              route: this.gallerySlug
            });
          });
        }
      }, error => {
        console.log('page component errors', this.page, error);
        this.$_error('ErrorPage', {
          route: slug
        });
      });
    },
    setGenreGallery: function() {
      if(!this.post.genres) {
        return false;
      }
      for (const [idx, el] of this.post.genres.entries()) {
        if(this.gallerySlug === el.slug) {
          this.setGallery({
            images: el.gallery,
            featured: el.featured,
            title: el.title,
            description: el.description
          });
          if(this.$route.name === 'PhotosGallery') {
            window.prerenderReady = true;
            analytics.trackPageView(this.gallery.title);
          }
        }
      }
    }
  },

  components: {
    Gallery
  },

  metaInfo () {
    return meta.formatMeta(this.gallery.title ? this.gallery.title + ' - Photos' : '', this.gallery.description, this.gallery.featured ? this.gallery.featured.images : '')
  },
};
</script>