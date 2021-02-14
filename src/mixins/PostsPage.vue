<script>
import RecentPostsWidget from '~/components/widgets/RecentPosts.vue'
import Hero from '~/components/partials/Hero.vue'
import meta from '~/meta'
import { mapGetters } from 'vuex'
export default {
  components: {
    RecentPostsWidget, Hero
  },
  computed: {
    ...mapGetters(['maxPages']),
    pageString: function() {
      let lead = '';
      const paged = `Page ${this.$route.params.page} of ${this.maxPages}`;

      if(this.$route.params.category) {
        lead = `Category: ${this.$route.params.category }`;
      }
      if(this.$route.params.tag) {
        lead = `Tagged: ${this.$route.params.tag }`;
      }
      if(this.$route.params.search) {
        lead = `Search: ${this.$route.params.search }`;
      }

      if(!lead) {
        return this.$route.params.page && this.maxPages ? paged : ''
      }
      else {
        return this.$route.params.page && this.maxPages ? lead + ' | ' + paged : lead;
      }
    }
  },
  metaInfo () {
    return meta.formatMeta();
  }
}
</script>