<template>
  <div class="absolute flex items-center w-1/4 h-16 top-full right-0 bg-white border-l-2 border-b-2 border-gray-600 z-neg"
    @keyup.enter="search"
    @keyup.esc="exit">
    <input ref="input" type="text" class="p-4 h-full w-full" placeholder="Search..." v-model="searchInput" />
    <font-awesome-icon :icon="['fas', 'sign-in-alt']" class="text-2xl mx-8 cursor-pointer" @click="search" />
  </div>
</template>

<style type="postcss" scoped>
input::placeholder {
  color: black;
}
</style>

<script>
  import router from '~/router';

  export default {
    data() {
      return {
        searchInput: ''
      }
    },
    methods: {
      exit: function() {
        this.$emit('toggle-search');
      },
      search() {
        router.push({ name: 'Search', params: { search: this.searchInput } });
        this.$emit('toggle-search');
      }
    },
    mounted(){
      this.$refs.input.focus();
    }
  }
</script>