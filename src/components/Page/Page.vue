<template>
  <div class="">
    <div v-if="post">
      <hero :title="post.title" :img="parseBackground()" />
      <div class="py-2 px-4 bg-white xxl:rounded xxl:shadow xxl:-my-16">
        <div class="flex flex-wrap items-center mb-4">
          <h1 class="leading-none mb-0">{{ post.post_title }}</h1>
        </div>
        <div class="post" v-html="post.post_content"></div>
        <WebProjects v-if="pageSlug === 'web'" :projects="projects" /> 
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
    }),
    projects: function() {
      return this.post.acf && this.post.acf.projects ? this.post.acf.projects : [];
    }
  },

  props: ['pageSlug'],

  beforeMount() {
    this.handleGetPost(this.pageSlug);
  },

  beforeRouteUpdate(to, from, next) {
    if(to.name === 'Page' && from.name === 'Page') {
      this.setCurrentPost({post:null});
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
    },
    parseBackground() {
      if(this.post.featured) {
        return this.post.featured.images.full;
      }
    }
  },

  components: {
    Loader, Hero, WebProjects
  },

  metaInfo () {
    return meta.formatMeta(this.post.post_title, this.post.post_excerpt, this.parseBackground(), window.location.href)
  },
};
</script>
