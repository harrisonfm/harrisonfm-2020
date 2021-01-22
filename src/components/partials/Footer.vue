<template>
  <footer class="site-footer bg-black text-white flex items-center justify-between flex-wrap px-6 py-20">
    <div class="max-w-8xl mx-auto">
      <MainMenu :menu = "headerMenu" />
    </div>
  </footer>
</template>
<script>
import MainMenu from './Footer/Menu.vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  beforeMount() {
    this.getHeader();
  },

  components: {
    MainMenu
  },

  computed: {
    ...mapGetters(['headerMenu'])
  },

  methods: {
    ...mapActions(['getHeader'])
  }
};
</script>
