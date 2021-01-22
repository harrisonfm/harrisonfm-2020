<template>
  <footer class="site-footer bg-black text-white flex items-center justify-between flex-wrap px-6 py-20">
    <div class="max-w-8xl mx-auto">
      <MainMenu :menu = "menu" />
    </div>
  </footer>
</template>
<script>
import MainMenu from './Footer/Menu.vue'
import axios from "axios";

export default {
  data() {
    return {
      menu: false,
    }
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
