<template>
	<nav v-if="menu">
    <transition name="slide-down">
  		<ul class="header-menu-top" v-if="(showMobileMenu && isMobile) || !isMobile">
  			<MenuItem v-for="item in menu.items" :key="`menu_item_${item.ID}`" :item="item" :showMobileMenu="showMobileMenu" :isMobile="isMobile" class="header-menu-item" />
        <li class="flex items-center bg-white sm:h-16">
          <font-awesome-icon :icon="['fas', 'search']" class="hidden sm:flex" :class="{'text-blue-500' : showSearch}" @click="$emit('toggle-search')" />
          <SearchForm class="sm:hidden" />
        </li>
  		</ul>
    </transition>
    <i class="py-5 pl-5 sm:hidden" @click="toggleMobileMenu" >
      <font-awesome-icon :icon="['fas', showMobileMenu ? 'times' : 'bars']" />
    </i>
	</nav>
</template>
<style scoped>
  nav {
    @apply flex justify-end items-center bg-white w-full uppercase font-bold;
  }
  .header-menu-top {
    @apply flex flex-col items-end absolute bg-white top-full right-0 border-l-2 border-b-2 border-gray-600 z-neg sm:flex-row sm:static sm:border-0 sm:z-0 sm:items-center;
  }
  .header-menu-item {
    @apply relative w-full justify-end flex-wrap sm:justify-center sm:items-center sm:border-solid sm:border-white sm:border-r-16 sm:h-16 sm:flex-nowrap bg-white;
  }
  svg {
    @apply text-2xl cursor-pointer transition-colors duration-150 hover:text-blue-500;
  }
</style>
<script>
  import MenuItem from './MenuItem.vue'
  import SearchForm from './SearchForm.vue'
  
	export default {
		props: ['menu', 'showSearch'],
    data() {
      return {
        showMobileMenu: false,
        isMobile: true
      }
    },
    watch: {
      '$route': function() {
        this.showMobileMenu = false;
      }
    },
    methods: {
      toggleMobileMenu: function() {
        this.showMobileMenu = !this.showMobileMenu;
      },
      handleMobile: function() {
        console.log(window.innerWidth);
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