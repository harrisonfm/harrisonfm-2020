<template>
  <div class="search-form flex items-center bg-white" v-on-clickaway="exit"
    @keyup.enter="search"
    @keyup.esc="exit">
    <input ref="input" type="text" class="p-4 h-full w-full" placeholder="Search..." v-model="searchInput" />
    <i @click="search" class="cursor-pointer text-2xl pr-4 ml-2 sm:mx-4 sm:p-0 transition-colors duration-150 hover:text-blue-500">
      <font-awesome-icon :icon="['fas', 'sign-in-alt']" />
    </i>
  </div>
</template>

<style scoped>
input::placeholder {
  color: black;
}
@screen sm {
  .search-form {
    @apply absolute w-1/2 md:w-1/3 xl:w-1/4 h-16 top-full right-0 border-l-2 border-b-2 border-gray-600 z-neg
  }
}
</style>

<script>
  import router from '~/router';
  import { mixin as clickaway } from 'vue-clickaway';

  export default {
    mixins: [clickaway],
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
        if(this.searchInput) {
          router.push({ name: 'Search', params: { search: this.searchInput } });
          this.$emit('toggle-search');
        }
        else {
          this.$refs.input.focus();
        }
      }
    },
    mounted(){
      this.$refs.input.focus();
    }
  }
</script>