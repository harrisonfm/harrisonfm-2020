<template>
	<nav v-if="menu" class="flex justify-end items-center bg-white w-full">
		<ul class="header-menu-top sm:flex sm:flex-row" 
    :class="(showMobileMenu && isMobile) ? 'flex flex-col absolute bg-white top-full right-0 border-l-2 border-b-2 border-gray-600 z-neg' : 'hidden'">
			<MenuItem v-for="item in menu.items" :key="`menu_item_${item.ID}`" :item="item" :showMobileMenu="showMobileMenu" :isMobile="isMobile" class="relative items-center flex-wrap sm:mr-4 sm:h-16 sm:flex-nowrap" 
      ></MenuItem>
      <li class="items-center hidden sm:flex">
        <font-awesome-icon :icon="['fas', 'search']" class="text-2xl cursor-pointer transition-colors duration-150 hover:text-blue-500" :class="{'text-blue-500' : showSearch}" @click="$emit('toggle-search')" />
      </li>
		</ul>
    <i>
      <font-awesome-icon :icon="showMobileMenu ? ['fas', 'times'] : ['fas', 'bars']" class="block sm:hidden text-2xl cursor-pointer transition-colors duration-150 hover:text-blue-500 flex items-center" @click="toggleMobileMenu" />
    </i>
	</nav>
</template>
<style scoped>

</style>
<script>
  import MenuItem from './MenuItem.vue'
  
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
        }
      }
    },
    mounted() {
      window.addEventListener("resize", this.handleMobile);
      this.handleMobile();
    },
    components: { MenuItem }
	}
</script>