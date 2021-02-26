<template>
  <div class="search-form flex items-center bg-white"
    @keyup.enter="search"
    @keyup.esc="exit">
    <input ref="input" type="text" class="p-4 h-full w-full" placeholder="Search..." v-model="searchInput" />
    <font-awesome-icon :icon="['fas', 'sign-in-alt']" class="text-2xl mx-8 cursor-pointer transition-colors duration-150 hover:text-blue-500"
      @click="search" />
  </div>
</template>

<style scoped>
input::placeholder {
  color: black;
}
@screen sm {
  .search-form {
    @apply absolute w-1/2 xl:w-1/4 h-16 top-full right-0 border-l-2 border-b-2 border-gray-600 z-neg
  }
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