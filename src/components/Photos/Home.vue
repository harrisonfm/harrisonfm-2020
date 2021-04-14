<template>
  <div v-if="post">
    <div class="photos-page">
      <h1 class="leading-none mb-2 lg:mb-4">{{ post.post_title ? post.post_title : "Loading..." }}</h1>
      <transition name="fade">
        <div class="post" v-if="post.post_content" v-html="post.post_content" />
      </transition>
      <transition name="fade">
        <HomeSection v-if="post.stories" :section="post.stories">Stories</HomeSection>
      </transition>
      <transition name="fade">
        <HomeSection v-if="post.genres" :section="post.genres">Highlighted Genres</HomeSection>
      </transition>
    </div>
  </div>
  <Loader v-else />
</template>
<style scoped>
.post + section {
  @apply mb-2 lg:mb-4;
}
</style>
<script>
import Loader from '~/components/partials/Loader.vue'
import HomeSection from './HomeSection.vue'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import meta from '~/meta';

export default {
  computed: {
    ...mapGetters({
      post: 'currentPost'
    }),
  },

  beforeMount() {
    this.handleGetPost('photos');
  },

  beforeRouteLeave: function(to,from,next) {
    this.setCurrentPost();
    next();
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
  },

  components: {
    Loader, HomeSection
  },

  metaInfo () {
    return meta.formatMeta(this.post.post_title, this.post.post_excerpt, false)
  },
};
</script>