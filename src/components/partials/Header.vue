<template>
  <header class="site-header relative flex justify-between items-center border-b-2 border-gray-600 bg-white px-4 sticky -top-1 z-20">
    <Logo />
    <MainMenu :menu="headerMenu" @toggle-search="toggleSearch" :showSearch="showSearch" />
    <transition name="search-slide">
      <SearchForm v-if="showSearch" @toggle-search="toggleSearch" :showSearch="showSearch" />
    </transition>
  </header>
</template>
<style scoped>
.search-slide-enter-active {
  animation: search-slide-in .25s;
}
.search-slide-leave-active {
  animation: search-slide-in .25s reverse;
}
@keyframes search-slide-in {
  0% {
    top: 0;
    opacity: 0;
  }
  100% {
    top: 100%;
    opacity: 1;
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
      toggleSearch: function(setSearch) {
        if(typeof setSearch === 'undefined') {
          this.showSearch = !this.showSearch;
        }
        else {
          this.showSearch = setSearch;
        }
      }
    }
  };
</script>