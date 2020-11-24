<template>
	<div class="pt-10">
		<template>
			<div class="page-content">
				<h1 class="text-3xl mb-5">Error 404</h1>
				<p class="text-xl mb-5">{{ payload.route }} doesn't exist. <router-link to="/">Go back home?</router-link></p>
			</div>
		</template>
	</div>
</template>
<script>
	export default {
		props: ['payload']
	};
</script>
