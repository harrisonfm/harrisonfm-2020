<template>
  <div v-if="gallery">
    <div class="photos-page">
      <h1 class="leading-none mb-2 lg:mb-4">{{ gallery.name }}</h1>
      <div class="post mb-2 lg:mb-4">
        <p>{{gallery.description}}</p>
      </div>
      <div class="post-gallery">
        <router-link v-for="photo in gallery.images" :to="{
          name: 'PhotosSingle',
          params: { idSlug: photo.ID + '-' + photo.post_name }
        }">
          <img :src="photo.images.square_gallery" class="rounded shadow" />
          <div class="overlay" />
        </router-link>
        </article>
      </div>
    </div>
    <router-view />
  </div>
  <Loader v-else />
</template>

<script>
import Loader from '~/components/partials/Loader.vue'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import meta from '~/meta';

export default {
  computed: {
    ...mapGetters({
      post: 'currentPost',
      gallery: 'gallery'
    })
  },
  props: ['gallerySlug'],

  beforeMount() {
    this.handleGetPost('photos');
  },

  beforeRouteLeave: function(to,from,next) {
    console.log('leave photo gallery', to, from);
    this.setGallery({gallery: null});
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
        if(!this.gallery.images) {
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
            name: el.name,
            description: el.description
          });
        }
      }
    }
  },

  components: {
    Loader,
  },

  metaInfo () {
    return meta.formatMeta(this.post.post_title, this.post.post_excerpt, '', window.location.href)
  },
};
</script>