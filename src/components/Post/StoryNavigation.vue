<template>
  <div class="mt-4">
    <h2 class="font-open font-bold text-xl mb-4">{{ storyName }}</h2>
    <div v-if="story.prev || story.next" class="post-story-container">
      <div v-if="story.prev" class="post-story-item">
        <h3 class="story-dir">Previously</h3>
        <article :style="parseBackground(story.prev.featured.images)" class="overlay-article bg-cover bg-gray-500">
          <router-link :to="story.prev.link">
            <div class="title">{{ story.prev.post_title }}</div>
            <div class="overlay "></div>
          </router-link>
        </article>
      </div>
      <div v-if="story.next" class="post-story-item">
        <h3 class="story-dir" :class="{'md:text-right': story.prev}">Next</h3>
        <article :style="parseBackground(story.next.featured.images)" class="overlay-article bg-cover bg-gray-500">
          <router-link :to="story.next.link">
            <div class="title">{{ story.next.post_title }}</div>
            <div class="overlay "></div>
          </router-link>
        </article>
      </div>
    </div>
  </div>
</template>
<style scoped>
.story-dir {
  @apply mb-0 text-base;
}
.post-story-container {
  @apply flex flex-col-reverse md:flex-row;
}
.post-story-item {
  @apply w-full md:w-1/2;
}
.post-story-item:first-of-type {
  @apply mt-2 md:mr-2 md:mt-0 lg:mr-4;
}
</style>
<script>
export default {
  props: ['story'],
  computed: {
    storyName: function() {
      if(!this.story.prev) {
        return 'This is the beginning of the '+this.story.name+' story:'
      }
      if(!this.story.next) {
        return 'This is the end of the '+this.story.name+' story:'
      }
      return 'This is part of the '+this.story.name+' story:'
    }
  },
  methods: {
    parseBackground(image) {
      if(image) {
        return 'background-image: url('+image.full+')';  
      }
    }
  }
}
</script>