<template>
  <header class="site-header flex justify-between items-center border-b-2 border-gray-600 bg-white px-4 py-2 sticky top-0 z-20">
    <router-link to="/" class="flex items-center">
      <img :src="Bolt" class="inline h-8 transform rotate-180" />
      <span class="font-bold text-3xl tracking-wider mx-1">HFM</span>
      <img :src="Bolt" class="inline h-8" />
    </router-link>
    <MainMenu :menu="headerMenu" />
  </header>
</template>

<script>
  import MainMenu from './Header/Menu.vue'
  import Bolt from '~/assets/bolt.svg'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    data() {
      return {
        Bolt: '/wp-content/themes/hfm-2020-theme/dist/'+Bolt
      };
    },

    beforeMount() {
      this.getHeader();
    },

    components: {
      MainMenu
    },

    computed: {
      ...mapGetters(['headerMenu'])
    },

    methods: {
      ...mapActions(['getHeader'])
    }
  };
</script>