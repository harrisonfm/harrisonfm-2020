<template>
	<nav class="nav-menu" v-if="menu">
    <transition name="slide-down">
  		<ul class="header-menu-top" v-if="(showMobileMenu && isMobile) || !isMobile">
  			<MenuItem v-for="item in menu.items" :key="`menu_item_${item.ID}`" :item="item" :showMobileMenu="showMobileMenu" :isMobile="isMobile" class="header-menu-item" />
        <li class="header-menu-search">
          <font-awesome-icon :icon="['fas', 'search']" class="hidden sm:flex fa-icon" :class="{'text-blue-500' : showSearch}" @click="$emit('toggle-search')" />
          <SearchForm class="sm:hidden" :icon="isMobile ? 'search' : 'sign-in-alt'" />
        </li>
  		</ul>
    </transition>
    <i class="header-icon sm:hidden" @click="toggleMobileMenu" >
      <font-awesome-icon class="fa-icon" :icon="['fas', showMobileMenu ? 'times' : 'bars']" />
    </i>
    <i class="header-icon" @click="toggleTheme" >
      <font-awesome-icon class="fa-icon" :icon="['fas', theme !== 'system' ? (theme === 'dark' ? 'moon' : 'sun') : (prefersDark ? 'cloud-moon' : 'cloud-sun')]" />
    </i>
	</nav>
</template>
<style scoped>
  .nav-menu {
    @apply flex justify-end items-center w-full uppercase font-bold dark:text-gray-100;
  }
  .header-menu-top {
    @apply flex flex-col items-end absolute top-full right-0 border-l-2 border-b-2 border-gray-600 z-neg bg-white bg-opacity-95 dark:bg-gray-900 sm:bg-transparent dark:sm:bg-transparent sm:flex-row sm:static sm:border-0 sm:z-0 sm:items-center;
  }
  .header-menu-item {
    @apply relative w-full justify-end flex-wrap sm:justify-center sm:items-center sm:border-solid sm:border-r-16 sm:border-transparent sm:h-16 sm:flex-nowrap;
  }
  .header-menu-search {
    @apply flex items-center sm:h-16;
  }
  .header-icon {
    @apply py-5 pl-5;
  }
  .fa-icon {
    @apply text-2xl cursor-pointer transition-colors duration-150 hover:text-blue-500;
  }
</style>
<script>
  import MenuItem from './MenuItem.vue'
  import SearchForm from './SearchForm.vue'
  import { mapActions, mapGetters } from "vuex";
  
	export default {
		props: ['menu', 'showSearch'],
    data() {
      return {
        showMobileMenu: false,
        isMobile: true
      }
    },
    computed: {
      ...mapGetters(['theme', 'prefersDark'])
    },
    watch: {
      '$route': function() {
        this.showMobileMenu = false;
      }
    },
    methods: {
      ...mapActions(['toggleTheme']),
      toggleMobileMenu: function() {
        this.showMobileMenu = !this.showMobileMenu;
      },
      handleMobile: function() {;
        if(window.innerWidth < 640) {
          this.isMobile = true;
        }
        else {
          this.isMobile = false;
          this.showMobileMenu = false;
          this.$emit('toggle-search', false);
        }
        
        for(let i = 0; i < this.$children.length; i++) {
          if(this.$children[i].item && this.$children[i].item.child_items) {
            this.$children[i].subMenuOff();
          }
        }
      }
    },
    mounted() {
      window.addEventListener("resize", this.handleMobile);
      this.handleMobile();
    },
    components: { MenuItem, SearchForm }
	}
</script>