<template>
  <div class="pt-10">
    <template v-if="page">
      <h1 class="text-3xl mb-5">{{ page.title.rendered }}</h1>
      <div class="page-content" v-html="page.content.rendered"></div>
    </template>
    <Loader v-else />
  </div>
</template>

<script>
import Loader from '../partials/Loader.vue';
import { mapActions, mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters({
      page: 'currentPage'
    })
  },

  beforeMount() {
    this.getPage({
      pageSlug: this.$route.params.pageSlug
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
    ...mapActions(['getPage'])
  },

  components: {
    Loader,
  },
};
</script>

<style type="postcss" scoped>
.page-content {
  & >>> p {
    margin-bottom: 1rem;
  }
}
</style>
