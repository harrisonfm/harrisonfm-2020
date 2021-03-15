<script>
import RecentPostsWidget from '~/components/widgets/RecentPosts.vue'
import Hero from '~/components/partials/Hero.vue'
import meta from '~/meta'
import { mapGetters } from 'vuex'
export default {
  components: {
    RecentPostsWidget, Hero
  },
  props: ['page', 'category', 'tag', 'search'],
  computed: {
    ...mapGetters(['maxPages']),
    pageString: function() {
      let lead = '';
      const paged = `Page ${this.page} of ${this.maxPages}`;

      if(this.category) {
        lead = `Category: ${this.category }`;
      }
      if(this.tag) {
        lead = `Tagged: ${this.tag }`;
      }
      if(this.search) {
        lead = `Search: ${this.search }`;
      }

      if(!lead) {
        return this.page && this.maxPages ? paged : ''
      }
      else {
        return this.page && this.maxPages ? lead + ' | ' + paged : lead;
      }
    }
  },
  metaInfo () {
    return meta.formatMeta();
  }
}
</script>