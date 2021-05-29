<template>
  <div id="app">
    <app-header />
    <div class="site-content" :class="{'fullscreen' : fullScreen}">
      <app-view />
    </div>
    <app-footer :overlaysFooter="overlaysFooter" />
  </div>
</template>
<style scoped>
.site-content {
  @apply relative mx-auto max-w-8xl;
}
.site-content.fullscreen {
  @apply max-w-none;
}
</style>
<script>
import Header from './components/partials/Header.vue';
import Footer from './components/partials/Footer.vue';
import { mapGetters } from "vuex";
import utils from './utils';

export default {
  computed: {
    ...mapGetters(['pageError']),
    fullScreen: function() {
      return utils.fullScreen(this.$route.name)
    },
    overlaysFooter: function() {
      return !this.fullScreen && !this.pageError && !utils.nonHeroPage(this.$route.params.pageSlug);
    },
  },
  components: {
    appHeader: Header,
    appFooter: Footer,
  },
};
</script>
