<template>
  <li v-if="item.child_items" @mouseover="!isMobile ? subMenuOn() : ''" @mouseleave="!isMobile ? subMenuOff() : ''" class="flex w-full justify-start sm:justify-center">
    <router-link :to="getURLPath(item.url)" class="hover:text-blue-800 block focus:text-blue-800 transition-colors duration-200 p-4 sm:p-0">
      {{ item.title }}
    </router-link>
    <font-awesome-icon :icon="['fas', 'caret-up']" class="ml-2 text-2xl transition-transform transform inline duration-150 sm:hidden" :class="{'rotate-180' : showSubMenu}" @click="toggleSubMenu" />
    <transition name="story">
      <ul v-if="showSubMenu" :class="isMobile ? 'header-submenu-mobile' : 'header-submenu'">
        <li v-for="childItem in item.child_items" :key="`menu_item_${childItem.ID}`" class="hover:bg-blue-500 focus:bg-blue-500 transition-colors duration-150">
          <router-link :to="getURLPath(childItem.url)" class="block py-4 px-4">
            {{ childItem.title }}
          </router-link>
        </li>
      </ul>
    </transition>
  </li>
  <li v-else class="flex w-max">
    <router-link :to="getURLPath(item.url)" class="hover:text-blue-800 focus:text-blue-800 transition-colors duration-200 p-4 sm:p-0">
      {{ item.title }}
    </router-link>
  </li>
</template>
<style scoped>
  .header-menu-top .router-link-active {
    font-weight: bold;
  }
  .header-submenu {
    @apply absolute top-full -right-1/2 border-2 border-t-0 bg-gray-500 text-white w-max z-neg;
  }
  .header-submenu-mobile {
    @apply border-2 bg-gray-500 text-white w-full
  }
  .story-enter-active {
    animation: story-in .25s;
  }
  .story-leave-active {
    animation: story-in .25s reverse;
  }
  @keyframes story-in {
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
    props: ['item', 'showMobileMenu', 'isMobile'],
    mixins: [menuMixin],
    data() {
      return {
        showSubMenu: true,
      };
    },
    methods: {
      subMenuOff: function() {
        this.showSubMenu = false;
      },
      subMenuOn: function() {
        this.showSubMenu = true;
      },
      toggleSubMenu: function() {
        this.showSubMenu = !this.showSubMenu;
      }
    }
  }
</script>