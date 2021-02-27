<template>
	<nav v-if="menu" class="flex justify-end items-center bg-white w-full uppercase font-bold">
    <transition name="mobile-menu-slide">
  		<ul class="header-menu-top" v-if="(showMobileMenu && isMobile) || !isMobile">
  			<MenuItem v-for="item in menu.items" :key="`menu_item_${item.ID}`" :item="item" :showMobileMenu="showMobileMenu" :isMobile="isMobile" class="relative items-center flex-wrap sm:mr-4 sm:h-16 sm:flex-nowrap" 
        ></MenuItem>
        <li class="flex items-center">
          <font-awesome-icon :icon="['fas', 'search']" class="text-2xl cursor-pointer transition-colors duration-150 hover:text-blue-500 hidden sm:flex" :class="{'text-blue-500' : showSearch}" @click="$emit('toggle-search')" />
          <SearchForm class="sm:hidden" />
        </li>
  		</ul>
    </transition>
    <i class="py-5 pl-5 text-2xl cursor-pointer transition-colors duration-150 hover:text-blue-500 sm:hidden">
      <font-awesome-icon :icon="showMobileMenu ? ['fas', 'times'] : ['fas', 'bars']" class="" @click="toggleMobileMenu" />
    </i>
	</nav>
</template>
<style scoped>
  .header-menu-top {
    @apply flex flex-col absolute bg-white top-full right-0 border-l-2 border-b-2 border-gray-600 z-neg sm:flex-row sm:static sm:border-0 sm:z-0
  }
  .mobile-menu-slide-enter-active {
    animation: mobile-menu-slide-in .25s;
  }
  .mobile-menu-slide-leave-active {
    animation: mobile-menu-slide-in .25s reverse;
  }
  @keyframes mobile-menu-slide-in {
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