<template>
	<ul>
		<li v-for="photo in photos" :key="photo.id">
			<img :src="photo.image.thumbnail" />
		</li>
	</ul>
</template>

<script>
import { mapGetters } from "vuex";
import SETTINGS from "../../settings";

export default {
  data() {
  },
  props: ['photos'],

  computed: {},

  methods: {},
};
</script>
