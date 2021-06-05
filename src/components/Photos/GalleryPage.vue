<template>
  <div class="photos-page">
    <Loader v-if="!gallery.loaded" />
    <transition-group tag="div" name="fade">
      <h1 key="0" class="leading-none mb-2 lg:mb-4">{{ gallery.title }}</h1>
      <div key="1" class="post mb-2 lg:mb-4" v-if="gallery.description">
        <p>{{gallery.description}}</p>
      </div>
      <Gallery key="2" :gallery="gallery" route="PhotosSingle" />
    </transition-group>
    <router-view />
  </div>
</template>

<script>
import Gallery from '~/components/Post/Gallery.vue'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import meta from '~/meta';

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
            }
            console.log('story images resolves', response);
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
          }
        }
      }
    }
  },

  components: {
    Gallery
  },

  metaInfo () {
    return meta.formatMeta(this.gallery.title ? this.gallery.title : '', this.gallery.description, this.gallery.featured.images)
  },
};
</script>