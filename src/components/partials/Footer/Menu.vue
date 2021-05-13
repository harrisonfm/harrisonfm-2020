<template>
  <nav v-if="menu">
    <ul class="footer-list">
      <li class="footer-header">{{ menu.name }}</li>
      <li v-for="item in menu.items" :key="`menu_item_${item.ID}`" class="mr-4 last:mr-0">
        <router-link :to="getURLPath(item.url)" class="footer-link">
          {{ item.title }}
        </router-link>
      </li>
    </ul>
  </nav>
</template>
<style scoped>
.footer-list {
  @apply mb-2 mr-4 lg:mb-4 lg:mr-8;
}
.footer-header {
  @apply font-bold mb-1 uppercase;
}
.footer-link {
  @apply hover:text-blue-500 focus:text-blue-500 text-white transition-colors duration-200;
}
</style>
<script>
import menuMixin from '~/mixins/Menu.vue'
export default {
  mixins: [menuMixin]
}
</script>