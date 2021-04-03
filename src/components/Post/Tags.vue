<template>
  <div class="flex flex-wrap items-center mt-4">
    <h3 class="mb-0 text-base">Tags:</h3>
    <router-link class="post-tag" 
    v-for="tag in tags" :key="tag.id" :to="{
      name: 'Tag',
      params: {tag: tag.slug}  
    }">{{tag.name}}
    </router-link>
  </div>
</template>
<style scoped>
.post-tag {
  @apply focus:outline-none text-sm text-center ml-4 mb-4 py-2 px-4 font-semibold text-white bg-gray-500 transition-colors duration-150 ring ring-gray-300 hover:bg-blue-500 hover:ring-blue-300;
}
</style>
<script>
export default {
  props: ['tags'],
}
</script>