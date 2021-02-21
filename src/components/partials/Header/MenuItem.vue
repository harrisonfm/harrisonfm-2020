<template>
  <li class="mr-4 relative h-16 flex items-center" 
    @mouseover="showSubMenu = true"
    @mouseleave="showSubMenu = false">
    <router-link :to="getURLPath(item.url)" class="hover:text-blue-800 focus:text-blue-800 transition-colors duration-200">
      {{ item.title }}
    </router-link>
    <transition name="search-slide">
      <ul v-if="item.child_items && showSubMenu"
      class="header-submenu absolute top-full -left-1/2 border-2 border-t-0 bg-gray-500 text-white w-max z-neg -m-0.5">
        <li v-for="childItem in item.child_items" :key="`menu_item_${childItem.ID}`" class="hover:bg-blue-500 focus:bg-blue-500 transition-colors duration-150">
          <router-link :to="getURLPath(childItem.url)" class="block py-4 px-4">
            {{ childItem.title }}
          </router-link>
        </li>
      </ul>
    </transition>
  </li>
</template>
<style type="postcss" scoped>
  .header-menu-top .router-link-active {
    font-weight: bold;
  }
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
      top: 90%;
      opacity: 1;
    }
  }
</style>
<script>
  import menuMixin from '~/mixins/Menu.vue'
  
  export default {
    props: ['item'],
    mixins: [menuMixin],
    data() {
      return {
        showSubMenu: false,
      };
    },
    methods: {
    }
  }
</script>