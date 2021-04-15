<template>
  <div class="search-form flex" v-on-clickaway="exit"
    @keyup.enter="search"
    @keyup.esc="exit">
    <input ref="input" type="text" class="search-input" placeholder="Search..." v-model="searchInput" />
    <i @click="search" class="fa-icon">
      <font-awesome-icon :icon="['fas', icon]" />
    </i>
  </div>
</template>

<style scoped>
.fa-icon {
  @apply cursor-pointer text-2xl pr-2 ml-2 sm:mx-2 lg:mx-4 sm:p-0 transition-colors duration-150 hover:text-blue-500;
}
.search-form {
  @apply items-center;
}
.search-input {
  @apply p-4 h-full w-full bg-transparent;
}
@screen sm {
  .search-form {
    @apply absolute w-1/2 md:w-1/3 xl:w-1/4 h-16 top-full right-0 border-l-2 border-b-2 border-gray-600 z-neg bg-white bg-opacity-95;
  }
}
</style>

<script>
  import router from '~/router';
  import { mixin as clickaway } from 'vue-clickaway';

  export default {
    mixins: [clickaway],
    props: ['icon'],
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