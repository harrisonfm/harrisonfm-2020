<template>
  <div v-if="genreGallery">
    <div class="mx-auto max-w-8xl py-2 px-4">
      <div class="flex flex-wrap items-center mb-4">
        <h1 class="leading-none mb-0">{{ genreGallery.title }}</h1>
      </div>
      <div class="post" v-html="genreGallery.description"></div>
      <div class="highlighted_genres w-full grid gap-4 grid-cols-1 md:grid-cols-2">
        <article v-for="photo in genreGallery.gallery" :style="parseBackground(photo.images)" class="bg-cover bg-gray-500">
          <router-link :to="{
            name: 'PhotosSingle',
            params: { idSlug: photo.ID + '-' + photo.post_name }
          }" class="" >
            <div class="title">{{ photo.post_title }}</div>
            <div class="overlay "></div>
          </router-link>
        </article>
      </div>
    </div>
    <router-view @back="back" @next="goToNextPhoto" @prev="goToNextPhoto" />
  </div>
  <div v-else-if="storyImages">
    <div class="mx-auto max-w-8xl py-2 px-4">
      <div class="flex flex-wrap items-center mb-4">
        <h1 class="leading-none mb-0">{{ storyImages.term.name }}</h1>
      </div>
      <div class="post" v-html="storyImages.term.description"></div>
      <div class="highlighted_genres w-full grid gap-4 grid-cols-1 md:grid-cols-2">
        <article v-for="photo in storyImages.media" :style="parseBackground(photo.images)" class="bg-cover bg-gray-500">
          <router-link :to="{
            name: 'PhotosSingle',
            params: { idSlug: photo.ID + '-' + photo.post_name }
          }" class="" >
            <div class="title">{{ photo.post_title }}</div>
            <div class="overlay "></div>
          </router-link>
        </article>
      </div>
    </div>
    <router-view @back="back" @next="goToNextPhoto" @prev="goToNextPhoto" />
  </div>
  <Loader v-else />
</template>

<style scoped>
article {
  @apply bg-cover bg-center h-article md:h-articleMD flex items-center justify-center relative bg-gray-500 shadow transform transition-transform duration-200 shadow hover:-translate-y-px;
}
article .title {
  @apply text-white font-bold text-2xl z-10 p-2 text-center
}
article .overlay {
  @apply absolute inset-0 bg-black opacity-5 hover:opacity-15 transition-opacity duration-200 z-0
}
article .placeholder {
  @apply animate-pulse h-article md:h-articleMD bg-gray-500
}
</style>
<script>
import Loader from '~/components/partials/Loader.vue'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import meta from '~/meta';
import router from '~/router';

export default {
  computed: {
    ...mapGetters({
      post: 'currentPost',
      storyImages: 'storyImages',
      gallery: 'gallery'
    }),
    genres: function() {
      return this.post.acf && this.post.acf.highlighted_genres ? this.post.acf.highlighted_genres : [];
    },
    genreGallery: function() {
      let slug = this.gallerySlug;
      console.log(this.genres, this.gallerySlug);
      for (const [idx, el] of this.genres.entries()) {
        if(slug === el.title.toLowerCase().replace(' ','-')) {
          this.setGallery(el);
          console.log(this.gallery);
          return el;
        }
      }
    }
  },
  props: ['gallerySlug'],

  beforeMount() {
    this.handleGetPost('photos');
    if(!this.genreGallery) {
      this.getStoryImages({
        slug: this.gallerySlug
      }).then(response => {
        console.log('story images resolves', response);
      }, error => {
        console.log('story images errors', this.page, error);
      });
    }
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
        console.log('page component resolves', response);
      }, error => {
        console.log('page component errors', this.page, error);
        this.$_error('ErrorPage', {
          route: slug
        });
      });
    },
    parseBackground(image) {
      if(image) {
        return 'background-image: url('+image.full+')';  
      }
    },
    back: function() {
      router.push({
        name: 'PhotosGallery',
        params: { gallery: this.gallerySlug }
      });
    },
    goToNextPhoto: function(idSlug) {
      router.push({
        name: 'PhotosSingle',
        params: { idSlug: idSlug }
      });
    },
    goToPrevPhoto: function(idSlug) {
      router.push({
        name: 'PhotosSingle',
        params: { idSlug: idSlug }
      });
    },
  },

  components: {
    Loader,
  },

  metaInfo () {
    return meta.formatMeta(this.post.post_title, this.post.post_excerpt, '', window.location.href)
  },
};
</script>