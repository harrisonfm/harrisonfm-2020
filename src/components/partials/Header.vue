<template>
  <header class="site-header flex justify-between items-center border-b-2 border-gray-600 bg-white px-4 py-2 sticky top-0 z-20">
    <router-link to="/" class="flex items-center">
      <img :src="Bolt" class="inline h-8 transform rotate-180" />
      <span class="font-bold text-3xl tracking-wider mx-1">HFM</span>
      <img :src="Bolt" class="inline h-8" />
    </router-link>
    <MainMenu :menu = "menu" />
  </header>
</template>

<script>
  import axios from "axios";
  import MainMenu from './Header/Menu.vue';
  import Bolt from '~/assets/bolt.svg';

  export default {
    data() {
      return {
        menu: false,
        Bolt: '/wp-content/themes/hfm-2020-theme/dist/'+Bolt
      };
    },

    beforeMount() {
      this.fetchMenu();
    },

    components: {
      MainMenu
    },

    methods: {
      async fetchMenu() {
        axios
          .get('/wp-json/menus/v1/menus/header-menu')
          .then(response => {
            this.menu = response.data;
          })
          .catch(error => console.log('not working'));
      }
    }
  };
</script>