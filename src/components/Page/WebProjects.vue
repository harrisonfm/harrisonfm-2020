<template>
  <div class="project-container">
    <article v-for="(project, idx) in projects" :id="'proj-'+idx" :key="project.title" class="project" @click="togglePortfolioItem(project, $event)">
      <div class="title" @click="togglePortfolioItemTitle(project, $event)">{{ project.title }}</div>
      <div class="project-description">
        <p class="p-2 lg:p-4"><a target="_blank" :href="project.link" class="text-link">Link</a> &mdash; {{ project.description }}</p>
      </div>
      <v-style>{{ parseBackground(project, idx) }}</v-style>
    </article>
  </div>
</template>

<style scoped>
  .project-container {
    @apply w-full mx-auto max-w-4xl border-black dark:border-gray-700 border-l-2 border-r-2 sm:border-l-4 sm:border-r-4;
  }
  .project {
    @apply relative bg-cover bg-gray-500 dark:bg-gray-600 flex flex-col justify-between cursor-pointer border-black dark:border-gray-700 border-t-2 sm:border-t-4 h-[40px] max-h-[500px] transition-all duration-500 sm:h-[70px]
  }
  .project:last-of-type {
    @apply border-b-2 h-[44px] sm:border-b-4 sm:h-[74px];
  }
  .project .title {
    @apply bg-white dark:bg-gray-800 dark:text-gray-100 font-bold inline-flex items-center px-4 self-start relative border-black dark:border-gray-700 border-b-2 border-r-2 sm:border-r-0 sm:border-b-4 sm:text-3xl text-black ml-0 mt-0 dark:font-normal leading-[40px] sm:leading-[66px]
  }
  .project-description {
    @apply bg-white dark:bg-gray-800 dark:text-gray-100 opacity-0 transition-opacity duration-500 z-neg absolute bottom-0 cursor-auto text-sm xs:text-base;
  }
  .project.on {
    @apply h-screen;
  }
  .project.on .project-description {
    @apply opacity-100 z-[1];
  }
  @screen sm {
    .project .title::after {
      content: '';
      @apply bg-black border-r-[4px] border-black absolute w-[6px] h-[66px] -right-[3px] top-0 -skew-x-5 dark:border-gray-700 dark:bg-gray-700;
    }
    .project.on {
      height: calc(100vw / 2);
    }
  }
</style>

<script>
import analytics from '~/analytics'

export default {
  props: ['projects'],
  methods: {
    parseBackground(project, idx) {
      if(project) {
        return `
        #proj-${idx} {
          background-image: url('${project.image.images.medium_large.src}');
        }
        @media(min-width:${project.image.images.large.width / 2}px) {
          #proj-${idx} {
            background-image: url('${project.image.images.large.src}');
          }
        }
        @media(min-width:${project.image.images['1536x1536'].width / 2}px) {
          #proj-${idx} {
            background-image: url('${project.image.images['1536x1536'].src}');
          }
        }
        @media(min-width:${project.image.images['2048x2048'].width / 2}px) {
          #proj-${idx} {
            background-image: url('${project.image.images['2048x2048'].src}');
          }
        }`;
      }
    },
    togglePortfolioItem(project, e) {
      analytics.trackEvent('Web Project', 'Toggle Display', project.title);
      e.target.classList.toggle('on');
    },
    togglePortfolioItemTitle(project, e) {
      analytics.trackEvent('Web Project', 'Toggle Display', project.title);
      e.target.parentNode.classList.toggle('on');
    }
  }
};
</script>