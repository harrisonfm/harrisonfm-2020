<template>
  <div class="">
    <div v-if="post">
      <hero :title="post.title" :img="parseBackground()" />
      <div class="py-2 px-4 bg-white xxl:rounded xxl:shadow xxl:-my-16">
        <div class="flex flex-wrap items-center mb-4">
          <h1 class="leading-none mb-0">{{ post.post_title }}</h1>
        </div>
        <div class="post" v-html="post.post_content"></div>
        <div v-if="post.post_name == 'web'" v-for="project in post.acf.projects" :key="project.title">
          {{ project.title }}
        </div>
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
import Loader from '../partials/Loader.vue';
import { mapActions, mapGetters } from 'vuex';
import Hero from '../partials/Hero.vue'

export default {
  computed: {
    ...mapGetters({
      post: 'currentPost'
    })
  },

  beforeMount() {
    console.log(this.$route.params);
    this.getPage({
      slug: this.$route.params.pageSlug
    }).then(response => {
      console.log('page component resolves', response);
    }, error => {
      console.log('page component errors', this.page, error);
      this.$_error('ErrorPage', {
        route: this.$route.params.pageSlug
      });
    });
  },

  methods: {
    ...mapActions(['getPage']),
    parseBackground() {
      if(this.post.featured) {
        return '/wp-content/uploads/'+this.post.featured.file;
      }
    }
  },

  components: {
    Loader, Hero
  },
};
</script>
