<template>
	<div class="post-container">
		<template>
			<div class="page-content">
				<h1 class="text-3xl mb-5">Content not found!</h1>
				<p class="text-xl mb-5">{{ payload.route }} doesn't exist or has no results. Go back <router-link class="underline" to="/">home</router-link>?</p>
			</div>
		</template>
	</div>
</template>
<script>
  import { mapMutations } from "vuex"

	export default {
		props: ['payload'],
    methods: {
      ...mapMutations({
        'setErrorPage': 'PAGE_ERROR'
      })
    },
    beforeMount() {
      this.setErrorPage(true);
    },
    beforeDestroy() {
      this.setErrorPage(false);
      console.log('left error page');
    },
    metaInfo () {
      return {
        title: 'Not Found - HarrisonFM',
        meta: [{
          name: "prerender-status-code",
          content: "404"
        }]
      }
    },
	};
</script>
