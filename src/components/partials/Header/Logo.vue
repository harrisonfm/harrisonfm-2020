<template>
  <router-link to="/" class="logo">
    <img alt="" :src="Bolt" class="logo-bolt rotate-180" />
    <span class="logo-text">HFM</span>
    <img alt="" :src="Bolt" class="logo-bolt" />
  </router-link>
</template>
<style scoped>
.logo {
  @apply flex items-center h-16 z-10 dark:text-gray-100;
}
.logo-text {
  @apply font-bold mx-1 text-[42px];
}
.logo-bolt {
  @apply dark:invert;
}
</style>
<script>
  import Bolt from '~/assets/bolt.svg'
  export default {
    data() {
      return {
        Bolt: Bolt
      };
    }
  }
</script>