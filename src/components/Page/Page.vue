<template>
  <div class="">
    <div v-if="post">
      <hero :title="post.title" :img="post.featured" />
      <div class="post-container">
        <h1 class="leading-none mb-4">{{ post.post_title }}</h1>
        <div class="post" v-html="post.post_content"></div>
        <WebProjects v-if="post.projects" :projects="post.projects" /> 
      </div>
    </div>
    <Loader v-else />
  </div>
</template>

<style scoped>
.page-content {
  & >>> p {
    margin-bottom: 1rem;
  }
}
</style>

<script>
import Loader from '../partials/Loader.vue'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import Hero from '../partials/Hero.vue'
import WebProjects from './WebProjects.vue'
import meta from '~/meta';

export default {
  computed: {
    ...mapGetters({
      post: 'currentPost'
    })
  },

  props: ['pageSlug'],

  beforeMount() {
    this.handleGetPost(this.pageSlug);
  },

  beforeRouteUpdate(to, from, next) {
    if(to.name === 'Page' && from.name === 'Page') {
      this.setCurrentPost();
      this.handleGetPost(to.params.pageSlug);
    }
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
    }
  },

  components: {
    Loader, Hero, WebProjects
  },

  metaInfo () {
    console.log(this.post.featured, 'meta');
    return meta.formatMeta(this.post.post_title, this.post.post_excerpt, this.post.featured.images, window.location.href)
  },
};
</script>
