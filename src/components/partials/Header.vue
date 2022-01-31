<template>
  <header class="main-nav">
    <Logo />
    <MainMenu :menu="menus['header']" @toggle-search="toggleSearch" :showSearch="showSearch" />
    <transition name="slide-down">
      <SearchForm v-if="showSearch" @toggle-search="toggleSearch" :icon="'sign-in-alt'" :showSearch="showSearch" />
    </transition>
  </header>
</template>
<style scoped>
.main-nav {
  @apply font-open relative flex justify-between items-center border-b-2 border-gray-600 bg-white bg-opacity-95 dark:bg-gray-800 dark:border-gray-700 px-2 lg:px-4 sticky -top-1 z-20;
}
</style>
<script>
import MainMenu from './Header/Menu.vue'
import Logo from './Header/Logo.vue'
import SearchForm from './Header/SearchForm.vue'
import analytics from '~/analytics'

import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      showSearch: false
    };
  },

  beforeMount() {
    this.getMenu('header');
  },

  computed: {
    ...mapGetters(['menus'])
  },

  watch: {
    '$route': function() {
      if(this.showSearch) {
        this.showSearch = false;
      }
    }
  },

  methods: {
    ...mapActions(['getMenu']),
    toggleSearch: function(setSearch) {
      analytics.trackEvent('Menu', 'Toggle Search');
      if(typeof setSearch === 'undefined') {
        this.showSearch = !this.showSearch;
      }
      else {
        this.showSearch = setSearch;
      }
    }
  },

  components: {
    MainMenu, Logo, SearchForm
  },
};
</script>