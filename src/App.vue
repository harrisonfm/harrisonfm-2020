<template>
  <div id="app" class="">
    <app-header />

    <transition name="page-transition" mode="out-in" appear>
      <div class="site-content relative" :class="{'mx-auto max-w-8xl' : !fullScreen, 'fullscreen' : fullScreen}">
        <app-view />
      </div>
    </transition>

    <app-footer />
  </div>
</template>

<script>
import Header from './components/partials/Header.vue';
import Footer from './components/partials/Footer.vue';

export default {
  computed: {
    fullScreen: function() {
      return (this.$route.name === 'PhotosHome' || this.$route.name === 'PhotosGallery') ? true : false;
    },
  },

  components: {
    appHeader: Header,
    appFooter: Footer,
  },
};
</script>
