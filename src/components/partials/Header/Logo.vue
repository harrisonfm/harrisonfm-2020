<template>
  <router-link to="/" class="flex items-center h-16 z-10">
    <img :src="Bolt" class="inline h-8 transform rotate-180" />
    <span class="font-bold text-3xl tracking-wider mx-1">HFM</span>
    <img :src="Bolt" class="inline h-8" />
  </router-link>
</template>
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