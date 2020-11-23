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
      page: 'page'
    })
  },

  beforeMount() {
    console.log(this.$route.params.pageSlug);
    this.getPage({
      pageSlug: this.$route.params.pageSlug
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
