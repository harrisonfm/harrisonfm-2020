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
export default {
  props: ['fullScreen'],
  beforeMount() {
    console.log(this.fullScreen);
  },
  computed: {
    ...mapGetters(['pageError']),
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
