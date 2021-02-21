<template>
	<nav v-if="menu">
		<ul class="header-menu-top flex items-center bg-white pl-40">
			<MenuItem v-for="item in menu.items" :key="`menu_item_${item.ID}`" :item="item"></MenuItem>
      <li>
        <font-awesome-icon :icon="['fas', 'search']" class="text-2xl cursor-pointer transition-colors duration-150 hover:text-blue-500" :class="{'text-blue-500' : showSearch}" @click="$emit('toggle-search')" />
      </li>
		</ul>
	</nav>
</template>
<script>
  import MenuItem from './MenuItem.vue';
  
	export default {
		props: ['menu', 'showSearch'],
    components: { MenuItem }
	}
</script>