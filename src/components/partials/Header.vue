<template>
  <header class="site-header relative flex justify-between items-center border-b-2 border-gray-600 bg-white px-4 py-2 sticky top-0 z-20 xxl:w-screen">
    <Logo />
    <MainMenu :menu="headerMenu" @toggle-search="toggleSearch" />
    <SearchForm v-if="showSearch" :showSearch="showSearch" @toggle-search="toggleSearch" />
  </header>
</template>

<script>
  import MainMenu from './Header/Menu.vue'
  import Logo from './Header/Logo.vue'
  import SearchForm from './Header/SearchForm.vue'

  import { mapGetters, mapActions } from 'vuex'

  export default {
    data() {
      return {
        showSearch: false
      };
    },

    beforeMount() {
      this.getHeader();
    },

    components: {
      MainMenu, Logo, SearchForm
    },

    computed: {
      ...mapGetters(['headerMenu'])
    },

    methods: {
      ...mapActions(['getHeader']),
      toggleSearch: function(e) {
        this.showSearch = !this.showSearch;
      }
    }
  };
</script>