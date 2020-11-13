<template>
  <header class="site-header flex justify-between items-center border-b-2 border-gray-600 bg-white px-4 py-2 sticky top-0">
    <router-link to="/" class="font-bold text-xl tracking-wider hover:text-blue-800 focus:text-blue-800 transition-colors duration-200">HFM</router-link>
    <MainMenu :menu = "menu" />
  </header>
</template>
<script>
  import axios from "axios";
  import MainMenu from './Header/Menu.vue';
  export default {
    data() {
      return {
        menu: false
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