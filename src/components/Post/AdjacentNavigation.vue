<template>
  <div class="adj-nav">
    <h2 class="adj-nav-title" v-html="navName" v-if="navName"></h2>
    <div v-if="post.prev || post.next" class="post-story-container">
      <div v-if="post.prev" class="post-story-item">
        <h3 class="story-dir">Previously</h3>
        <article :id="'post-'+post.prev.ID" class="overlay-article">
          <router-link :to="post.prev.link">
            <div class="title">{{ post.prev.post_title }}</div>
            <div class="overlay "></div>
          </router-link>
          <v-style>{{ parseBackground(post.prev) }}</v-style>
        </article>
      </div>
      <div v-if="post.next" class="post-story-item">
        <h3 class="story-dir" :class="{'md:text-right': post.prev}">Next</h3>
        <article :id="'post-'+post.next.ID" class="overlay-article">
          <router-link :to="post.next.link">
            <div class="title">{{ post.next.post_title }}</div>
            <div class="overlay "></div>
          </router-link>
          <v-style>{{ parseBackground(post.next) }}</v-style>
        </article>
      </div>
    </div>
  </div>
</template>
<style scoped>
.adj-nav {
  @apply dark:text-gray-100 mt-4;
}
.adj-nav-title {
  @apply font-open font-bold text-xl mb-4;
}
.story-dir {
  @apply mb-0 text-base;
}
.post-story-container {
  @apply flex flex-col-reverse md:flex-row;
}
.post-story-item {
  @apply w-full md:w-1/2;
}
.post-story-item .overlay-article {
  @apply bg-cover bg-gray-500;
}
.post-story-item:first-of-type {
  @apply mt-2 md:mr-2 md:mt-0 lg:mr-4;
}
</style>
<script>
import { mapGetters } from "vuex"
export default {
  computed: {
    ...mapGetters({
      post: 'currentPost',
    }),
    navName: function() {
      if(this.post.story) {
        if(!this.post.story.prev) {
          return `This is the beginning of the <a class="title-link" href="/stories/${this.post.story.slug}">${this.post.story.name}</a> story:`;
        }
        if(!this.post.story.next) {
          return `This is the end of the <a class="title-link" href="/stories/${this.post.story.slug}">${this.post.story.name}</a> story:`;
        }
        return `This is part of the <a class="title-link" href="/stories/${this.post.story.slug}">${this.post.story.name}</a> story:`;
      }
      else {
        return false;
      }
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