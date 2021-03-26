<template>
  <header>
    <Logo />
    <MainMenu :menu="headerMenu" @toggle-search="toggleSearch" :showSearch="showSearch" />
    <transition name="slide-down">
      <SearchForm v-if="showSearch" @toggle-search="toggleSearch" :showSearch="showSearch" />
    </transition>
  </header>
</template>
<style scoped>
header {
  @apply font-open relative flex justify-between items-center border-b-2 border-gray-600 bg-white px-2 md:px-4 sticky -top-1 z-20;
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

    watch: {
      '$route': function() {
        if(this.showSearch) {
          this.showSearch = false;
        }
      }
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