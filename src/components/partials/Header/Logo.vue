<template>
  <router-link to="/" class="flex items-center h-16 z-10">
    <img :src="Bolt" class="transform rotate-180" />
    <span class="font-bold mx-1">HFM</span>
    <img :src="Bolt" />
  </router-link>
</template>
<style scoped>
span {
  font-size: 42px;
}
</style>
<script>
  import Bolt from '~/assets/bolt.svg'
  export default {
    data() {
      return {
        Bolt: '/wp-content/themes/hfm-2020-theme/dist/'+Bolt
      };
    }
  }
</script>