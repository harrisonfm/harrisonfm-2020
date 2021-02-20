<template>
  <header class="site-header relative flex justify-between items-center border-b-2 border-gray-600 bg-white px-4 py-2 sticky top-0 z-20">
    <Logo />
    <MainMenu :menu="headerMenu" @toggle-search="toggleSearch" />
    <transition name="search-slide">
      <SearchForm v-if="showSearch" :showSearch="showSearch" @toggle-search="toggleSearch" />
    </transition>
  </header>
</template>
<style>
.search-slide-enter-active {
  animation: search-slide-in .25s;
}
.search-slide-leave-active {
  animation: search-slide-in .25s reverse;
}
@keyframes search-slide-in {
  0% {
    top: 0;
  }
  100% {
    top: 100%;
  }
}
</style>

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