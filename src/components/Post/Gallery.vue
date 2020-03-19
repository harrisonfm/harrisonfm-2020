<script>
import { mapGetters } from "vuex";
import SETTINGS from "../../settings";

export default {
  el: '.gallery',

  mounted: {
	  function() {
	    console.log('gallery loaded');
	  }
	},

  methods: {
  	test: function () {
			console.log('clicked');
		}
  },
};
</script>
