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
	export default {
		props: ['menu'],

		methods: {
			getURLPath(url) {
    		var m = url.match(/^(([^:\/?#]+:)?(?:\/\/((?:([^\/?#:]*):([^\/?#:]*)@)?([^\/?#:]*)(?::([^\/?#:]*))?)))?([^?#]*)(\?[^#]*)?(#.*)?$/),
    		r = {
          hash: m[10] || "",                   // #asd
          host: m[3] || "",                    // localhost:257
          hostname: m[6] || "",                // localhost
          href: m[0] || "",                    // http://username:password@localhost:257/deploy/?asd=asd#asd
          origin: m[1] || "",                  // http://username:password@localhost:257
          pathname: m[8] || (m[1] ? "/" : ""), // /deploy/
          port: m[7] || "",                    // 257
          protocol: m[2] || "",                // http:
          search: m[9] || "",                  // ?asd=asd
          username: m[4] || "",                // username
          password: m[5] || ""                 // password
      	};
			  r.href = r.origin + r.pathname + r.search + r.hash;
				return r.pathname;
			}
		}
	}
</script>