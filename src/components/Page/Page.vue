<template>
  <div>
    <hero v-if="!nonHeroPage" :img="post.featured" />
    <div class="post-container">
      <h1 class="leading-none mb-4">{{ post.post_title ? post.post_title : 'Loading...' }}</h1>
      <transition name="fade">
        <div class="post" v-html="post.post_content" v-if="post.post_content"></div>
      </transition>
      <webProjects v-if="post.projects" :projects="post.projects" />
      <newsletterForm v-if="post.post_title === 'Newsletter'" />
      <gallery v-if="gallery.images.length" :gallery="gallery" title="All Harrigrams" route="Harrigram" />
      <router-view />
    </div>
  </div>
</template>

<style scoped>
</style>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import Hero from '~/components/partials/Hero.vue'
import WebProjects from './WebProjects.vue'
import NewsletterForm from './NewsletterForm.vue'
import Gallery from "~/components/Post/Gallery.vue"
import meta from '~/meta'
import router from '~/router'
import utils from '~/utils'

export default {
  computed: {
    ...mapGetters({
      post: 'currentPost',
      gallery: 'gallery'
    }),
    nonHeroPage: function() {
      return utils.nonHeroPage(this.$route.params.pageSlug)
    }
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

  beforeRouteLeave(to, from, next) {
    if(!to.params.redirectPost && 
      (to.name === 'Page' || to.name === 'Harrigrams') && 
      (from.name === 'Page' || from.name === 'Harrigrams')) {
      this.setCurrentPost();
      this.handleGetPost(to.params.pageSlug ? to.params.pageSlug : 'harrigrams');
    }
    else {
      this.setCurrentPost();
    }
    next();
  },

  methods: {
    ...mapActions(['getPage', 'getPost', 'getHarrigrams']),
    ...mapMutations({
      'setCurrentPost': 'POST_CURRENT',
    }),
    handleGetPost(slug) {
      this.getPage({
        slug: slug
      }).then(response => {
        console.log('page component resolves', response);
        if(this.$route.name !== 'Harrigram') {
          window.prerenderReady = true;
        }
      }, error => {
        console.log('page component errors', this.page, error);
        this.getPost({ // Instead of an immediate 404, we do a getPost in case it's an old link that didn't have years.
          slug: slug
        }).then(response => {
          console.log('page redirect to post resolves', this.post);
          router.replace({
            name: 'Post',
            params: {
              year: this.post.post_date.substring(this.post.post_date.indexOf(', 2')+2),
              postSlug: slug,
              redirectPost: this.post
            }
          });
        }, error => {
          console.log('post component errors', this.$route.path);
          this.$_error('ErrorPage', {
            route: slug
          });
        });
      });
      if(slug === 'harrigrams') {
        this.getHarrigrams({
          fetchAll: true
        });
      }
    }
  },

  components: {
    Hero, WebProjects, NewsletterForm, Gallery
  },

  metaInfo () {
    return meta.formatMeta(this.post.post_title, this.post.post_excerpt, this.post.featured.images, "author")
  },
};
</script>
