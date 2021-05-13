<template>
  <div id="app">
    <app-header />
    <div class="site-content relative" :class="{'mx-auto max-w-8xl' : !fullScreen, 'fullscreen' : fullScreen}">
      <app-view />
    </div>
    <app-footer :overlaysFooter="overlaysFooter" />
  </div>
</template>

<script>
import Header from './components/partials/Header.vue';
import Footer from './components/partials/Footer.vue';
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(['pageError']),
    fullScreen: function() {
      return (this.$route.name === 'PhotosHome' || this.$route.name === 'PhotosGallery' || this.$route.path.indexOf('/privacy-policy')) !== -1 ? true : false;
    },
    overlaysFooter: function() {
      return !this.fullscreen && !this.pageError;
    }
  },

  components: {
    appHeader: Header,
    appFooter: Footer,
  },
};
</script>
