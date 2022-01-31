<template>
  <div class="photos-page" >
    <Loader v-if="!post.post_content" />
    <transition-group name="fade" tag="div">
      <h1 key="0" class="page-title mb-2 lg:mb-4">{{ post.post_title }}</h1>
      <div key="1" class="floating-desc" v-if="post.post_content" v-html="post.post_content" />
      <HomeSection key="2" class="home-section" v-if="post.stories" :section="post.stories">Stories</HomeSection>
      <HomeSection key="3" class="home-section" v-if="post.genres" :section="post.genres">Highlighted Genres</HomeSection>
    </transition-group>
  </div>
</template>
<style scoped>
.floating-desc + .home-section {
  @apply mb-2 lg:mb-4;
}
</style>
<script>
import HomeSection from './HomeSection.vue'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import meta from '~/meta';
import analytics from '~/analytics';

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
        window.prerenderReady = true;
        analytics.trackPageView('Photos');
      }, error => {
        console.log('page component errors', this.page, error);
        this.$_error('ErrorPage', {
          route: slug
        });
      });
    },
  },

  components: {
    HomeSection
  },

  metaInfo () {
    return meta.formatMeta(this.post.post_title, this.post.post_excerpt, this.post.featured.images)
  },
};
</script>