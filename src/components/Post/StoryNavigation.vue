<template>
  <div class="mt-4">
    <h2 class="font-open font-bold text-xl mb-4">{{ storyName }}</h2>
    <div v-if="story.prev || story.next" class="post-story-container">
      <div v-if="story.prev" class="post-story-item">
        <h3 class="story-dir">Previously</h3>
        <article :id="'post-'+story.prev.ID" class="overlay-article bg-cover bg-gray-500">
          <router-link :to="story.prev.link">
            <div class="title">{{ story.prev.post_title }}</div>
            <div class="overlay "></div>
          </router-link>
          <v-style>{{ parseBackground(story.prev) }}</v-style>
        </article>
      </div>
      <div v-if="story.next" class="post-story-item">
        <h3 class="story-dir" :class="{'md:text-right': story.prev}">Next</h3>
        <article :id="'post-'+story.next.ID" class="overlay-article bg-cover bg-gray-500">
          <router-link :to="story.next.link">
            <div class="title">{{ story.next.post_title }}</div>
            <div class="overlay "></div>
          </router-link>
          <v-style>{{ parseBackground(story.next) }}</v-style>
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
    parseBackground(post) {
      if(post.featured) {
        return `
        #post-${post.ID} {
          background-image: url('${post.featured.images.medium_large.src}');
        }
        @media(min-width:${post.featured.images.large.width / 2}px) {
          #post-${post.ID} {
            background-image: url('${post.featured.images.large.src}');
          }
        }
        @media(min-width:768px) and (max-width:${post.featured.images.large.width}px) {
          #post-${post.ID} {
            background-image: url('${post.featured.images.medium_large.src}');
          }
        }`;
      }
    }
  }
}
</script>