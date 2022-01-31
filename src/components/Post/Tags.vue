<template>
  <div class="tags-container">
    <h3 class="tags-title">Tags:</h3>
    <router-link class="post-tag button" 
    v-for="tag in tags" :key="tag.id" :to="{
      name: 'Tag',
      params: {tag: tag.slug}  
    }">{{tag.name}}
    </router-link>
  </div>
</template>
<style scoped>
.tags-container {
  @apply flex flex-wrap items-center mt-4;
}
.tags-container .tags-title {
  @apply mb-2 lg:mb-4 text-base dark:text-gray-100;
}
.post-tag {
  @apply ml-2 mb-2 lg:ml-4 lg:mb-2;
}
</style>
<script>
export default {
  props: ['tags'],
}
</script>