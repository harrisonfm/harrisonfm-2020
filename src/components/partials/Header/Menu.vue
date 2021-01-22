<template>
	<nav v-if="menu">
		<ul class="header-menu-top flex">
			<li v-for="item in menu.items" :key="`menu_item_${item.ID}`" class="mr-4 last:mr-0">
				<router-link :to="getURLPath(item.url)" class="hover:text-blue-800 focus:text-blue-800 transition-colors duration-200">
					{{ item.title }}
				</router-link>
			</li>
		</ul>
	</nav>
</template>
<style type="postcss" scoped>
	.header-menu-top .router-link-active {
		font-weight: bold;
	}
</style>

<script>
  import menuMixin from '~/mixins/Menu.vue'
  
	export default {
		props: ['menu'],
    mixins: [menuMixin]
	}
</script>