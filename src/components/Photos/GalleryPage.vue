<template>
  <div class="photos-page">
    <h1 class="leading-none mb-2 lg:mb-4">{{ gallery.title ? gallery.title : "Loading..." }}</h1>
    <transition name="fade">
      <div class="post mb-2 lg:mb-4" v-if="gallery.description">
        <p>{{gallery.description}}</p>
      </div>
    </transition>
    <Gallery v-if="gallery" :gallery="gallery" route="PhotosSingle" />
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
    console.log('routeupdate', to, from);
    if(to.name === 'PhotosGallery') {
      this.setGallery();
      this.handleGetPost('photos');
    }
    next();
  },

  beforeRouteLeave: function(to,from,next) {
    console.log('leave photo gallery', to, from);
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
        console.log('page component resolves', response, this.gallery);
        if(!this.gallery.loaded) {
          console.log('getstoryimages');
          this.getStoryImages({
            slug: this.gallerySlug
          }).then(response => {
            console.log('story images resolves', response);
          }, error => {
            console.log('story images errors', this.page, error);
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
      for (const [idx, el] of this.post.genres.entries()) {
        if(this.gallerySlug === el.slug) {
          this.setGallery({
            images: el.gallery,
            featured: el.featured,
            title: el.title,
            description: el.description
          });
        }
      }
    }
  },

  components: {
    Gallery
  },

  metaInfo () {
    return meta.formatMeta(this.post.post_title, this.post.post_excerpt, this.gallery.featured.images)
  },
};
</script>