<template>
  <footer class="site-footer">
    <div class="max-w-8xl mx-auto">
      <p>&copy; Harrison June {{ year }}| <a @click="scrollToTop" class="text-link cursor-pointer">Top</a> | <a href="mailto:june@harrisonfm.com" class="text-link">Contact Me</a></p>
    </div>
  </footer>
</template>
<style scoped>
.site-footer {
  @apply bg-black text-white flex items-center justify-between flex-wrap px-6 pt-20 pb-4;
}
.fullscreen + .site-footer {
  @apply pt-4;
}
.text-link {
  text-decoration: none;
}
</style>
<script>
export default {
  computed: {
    year: function() {
      let date = new Date();
      return date.getFullYear();
    }
  },
   methods: { 
    scrollToTop() {
      document.getElementById('app').scrollIntoView();
    }
  }
};
</script>
