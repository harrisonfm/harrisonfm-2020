<template>
  <div v-if="gallery">
    <div class="mx-auto max-w-8xl py-2 px-4">
      <div class="flex flex-wrap items-center mb-4">
        <h1 class="leading-none mb-0">{{ gallery.title }}</h1>
      </div>
      <div class="post" v-html="gallery.description"></div>
      <div class="highlighted_genres w-full grid gap-4 grid-cols-1 md:grid-cols-2">
        <article v-for="photo in gallery.gallery" :style="parseBackground(photo)" class="bg-cover bg-gray-500">
          <router-link :to="{
            name: 'Photos',
            params: { idSlug: photo.ID + '-' + photo.name }
          }" class="" >
            <div class="title">{{ photo.title }}</div>
            <div class="overlay "></div>
          </router-link>
        </article>
      </div>
    </div>
    <router-view />
  </div>
  <div v-else-if="storyImages">
    <div class="mx-auto max-w-8xl py-2 px-4">
      <div class="flex flex-wrap items-center mb-4">
        <h1 class="leading-none mb-0">{{ storyImages.term.name }}</h1>
      </div>
      <div class="post" v-html="storyImages.term.description"></div>
      <div class="highlighted_genres w-full grid gap-4 grid-cols-1 md:grid-cols-2">
        <article v-for="photo in storyImages.media" :style="parseStoryBackground(photo.images)" class="bg-cover bg-gray-500">
          <router-link :to="{
            name: 'Photos',
            params: { idSlug: photo.ID + '-' + photo.post_name }
          }" class="" >
            <div class="title">{{ photo.post_title }}</div>
            <div class="overlay "></div>
          </router-link>
        </article>
      </div>
    </div>
    <router-view />
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

export default {
  computed: {
    ...mapGetters({
      post: 'currentPost',
      storyImages: 'storyImages'
    }),
    genres: function() {
      return this.post.acf && this.post.acf.highlighted_genres ? this.post.acf.highlighted_genres : [];
    },
    gallery: function() {
      let slug = this.gallerySlug;
      for (const [idx, el] of this.genres.entries()) {
        if(slug === el.title.toLowerCase().replace(' ','-')) {
          return el;
        }
      }
    }
  },
  props: ['gallerySlug'],

  beforeMount() {
    this.handleGetPost('photos');
    this.getStoryImages({
      slug: this.gallerySlug
    }).then(response => {
      console.log('story images resolves', response);
    }, error => {
      console.log('story images errors', this.page, error);
    });
  },

  methods: {
    ...mapActions(['getPage', 'getStoryImages']),
    ...mapMutations({
      'setCurrentPost': 'POST_CURRENT',
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
        return 'background-image: url('+image.url+')';  
      }
    },
    parseStoryBackground(image) {
      if(image) {
        return 'background-image: url('+image.full+')';  
      }
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