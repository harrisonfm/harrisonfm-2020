<template>
  <div v-if="post">
    <div class="mx-auto max-w-8xl py-2 px-4">
      <div class="flex flex-wrap items-center mb-4">
        <h1 class="leading-none mb-0">{{ post.post_title }}</h1>
      </div>
      <div class="post" v-html="post.post_content"></div>
      <h1 class="">Highlighted Genres</h1>
      <div class="highlighted_genres w-full grid gap-4 grid-cols-1 md:grid-cols-2">
        <article v-for="genre in post.genres" :style="parseBackground(genre.image)" class="bg-cover bg-gray-500">
          <router-link :to="{
            name: 'PhotosGallery',
            params: { gallerySlug: genre.title.toLowerCase().replace(' ','-') }
          }">
            <div class="title">{{ genre.title }}</div>
            <div class="overlay "></div>
          </router-link>
        </article>
      </div>
      <h1 class="">Stories</h1>
      <div class="highlighted_genres w-full grid gap-4 grid-cols-1 md:grid-cols-2">
        <article v-for="story in stories" :style="parseBackground(story.image)" class="bg-cover bg-gray-500">
          <router-link :to="{
            name: 'PhotosGallery',
            params: { gallerySlug: story.slug }
          }">
            <div class="title">{{ story.name }}</div>
            <div class="overlay "></div>
          </router-link>
        </article>
      </div>
    </div>
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
      post: 'currentPost'
    }),
    stories: function() {
      return this.post.stories ? this.post.stories : [];
    },
  },

  beforeMount() {
    this.handleGetPost('photos');
  },

  methods: {
    ...mapActions(['getPage']),
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
  },

  components: {
    Loader,
  },

  metaInfo () {
    return meta.formatMeta(this.post.post_title, this.post.post_excerpt, '', window.location.href)
  },
};
</script>