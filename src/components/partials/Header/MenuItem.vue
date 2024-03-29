<template>
  <li v-if="item.child_items" class="menu-parent">
    <div class="flex items-center justify-end" @click="toggleSubMenu" v-on-clickaway="subMenuOff">
      <span class="menu-link cursor-pointer">{{ item.title }}</span>
      <i class="menu-link-icon">
        <font-awesome-icon class="transform duration-150 transition-transform" :class="{'rotate-180' : showSubMenu}" :icon="['fas', 'caret-down']" />
      </i>
    </div>
    <transition name="slide-down">
      <ul v-if="showSubMenu" class="header-submenu" :class="isMobile ? 'header-submenu-mobile' : 'header-submenu-desktop'">
        <li v-for="childItem in item.child_items" :key="`menu_item_${childItem.ID}`" class="submenu-item">
          <router-link :to="getURLPath(childItem.url)" class="submenu-link">{{ childItem.title }}</router-link>
        </li>
      </ul>
    </transition>
  </li>
  <li v-else class="flex w-max">
    <router-link :to="getURLPath(item.url)" class="menu-link">{{ item.title }}</router-link>
  </li>
</template>
<style scoped>
  .router-link-active {
    font-weight: bolder;
  }
  .menu-link {
    @apply block hover:text-blue-800 focus:text-blue-800 dark:hover:text-blue-600 dark:focus:text-blue-600 transition-colors duration-200 p-2 sm:p-0;
  }
  .menu-link-icon {
    @apply ml-2 text-3xl inline pr-2 sm:hidden;
  }
  .menu-parent {
    @apply flex flex-col justify-end sm:justify-center sm:flex-row;
  }
  .header-submenu {
    @apply border-2 bg-gray-500 text-gray-100 dark:bg-gray-900 dark:border-gray-600
  }
  .header-submenu-desktop {
    @apply absolute top-full -right-1/2 border-t-0 w-max z-neg sm:shadow;
  }
  .header-submenu-mobile {
    @apply w-full flex flex-col items-end;
  }
  .submenu-item {
    @apply hover:bg-blue-500 focus:bg-blue-500 dark:hover:bg-blue-600 dark:focus:bg-blue-600 transition-colors duration-200 w-full text-right sm:text-left;
  }
  .submenu-link {
    @apply block p-2 md:p-4
  }
</style>
<script>
  import menuMixin from '~/mixins/Menu.vue'
  import { mixin as clickaway } from 'vue-clickaway'
  import analytics from '~/analytics'
  
  export default {
    props: ['item', 'showMobileMenu', 'isMobile'],
    mixins: [menuMixin, clickaway],
    data() {
      return {
        showSubMenu: false,
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
        analytics.trackEvent('Menu', 'Toggle Submenu', this.item.title);
        this.showSubMenu = !this.showSubMenu;
      }
    }
  }
</script>