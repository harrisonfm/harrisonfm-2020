<template>
  <footer class="site-footer" :class="{'overlaid-content': overlaysFooter}">
    <div class="footer-content">
      <FooterMenu :menu="menus['writing']" />
      <FooterMenu :menu="menus['sitemap']" />
      <NewsletterForm />
      <p class="footer-end">&copy; Harrison June {{ year }} | <a @click="scrollToTop" class="text-link cursor-pointer">Top</a> | <a href="mailto:june@harrisonfm.com" class="text-link" @click="contactMe()">Contact Me</a></p>
    </div>
  </footer>
</template>
<style scoped>
.site-footer {
  @apply bg-black text-white flex items-center justify-between flex-wrap px-6 py-4;
}
.site-footer.overlaid-content {
  @apply xxl:pt-20;
}
.footer-content {
  @apply max-w-8xl mx-auto flex flex-wrap lg:justify-center;
}
.text-link {
  @apply hover:text-blue-500 focus:text-blue-500 text-white transition-colors duration-200 no-underline;
}
.footer-end {
  @apply text-center w-full mt-2;
}
</style>
<script>
import NewsletterForm from './Footer/NewsletterForm.vue'
import FooterMenu from './Footer/Menu.vue'
import { mapGetters, mapActions } from 'vuex'
import analytics from '~/analytics'

export default {
  props: ['overlaysFooter'],
  computed: {
    ...mapGetters(['menus']),
    year: function() {
      let date = new Date();
      return date.getFullYear();
    }
  },
  beforeMount() {
    this.getMenu('writing');
    this.getMenu('sitemap');
  },
  methods: {
    ...mapActions(['getMenu']),
    scrollToTop() {
      analytics.trackEvent('Footer', 'Top');
      document.getElementById('app').scrollIntoView();
    },
    contactMe() {
      analytics.trackEvent('Footer', 'Contact Me');
    }
  },
  components: { NewsletterForm, FooterMenu }
};
</script>
