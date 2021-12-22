<template>
  <div class="project-container">
    <article v-for="(project, idx) in projects" :id="'proj-'+idx" :key="project.title" class="project" @click="togglePortfolioItem(project, $event)">
      <div class="title" @click="togglePortfolioItemTitle(project, $event)">{{ project.title }}</div>
      <div class="project-description">
        <p class="p-2 lg:p-4"><a target="_blank" :href="project.link">Link</a> &mdash; {{ project.description }}</p>
      </div>
      <v-style>{{ parseBackground(project, idx) }}</v-style>
    </article>
  </div>
</template>

<style scoped>
  .project-container {
    @apply w-full lg:w-3/4 border-black border-l-2 border-r-2 sm:border-l-4 sm:border-r-4;
  }
  .project {
    transition: height .5s;
    height: 40px;
    max-height: 500px;
    @apply relative bg-cover bg-gray-500 flex flex-col justify-between cursor-pointer border-black border-t-2 sm:border-t-4;
  }
  .project:last-of-type {
    height: 44px;
    @apply border-b-2 sm:border-b-4;
  }
  .project .title {
    line-height: 40px;
    @apply bg-white font-bold inline-flex items-center px-4 self-start relative border-black border-b-2 border-r-2 sm:border-r-0 sm:border-b-4 sm:text-3xl text-black ml-0 mt-0;
  }
  .project-description {
    @apply bg-white opacity-0 transition-opacity duration-500 z-neg absolute bottom-0 cursor-auto text-sm xs:text-base;
  }
  .project.on {
    height: 100vw;
  }
  .project.on .project-description {
    opacity: 1;
    z-index: 1;
  }
  @screen sm {
    .project {
      height: 70px;
    }
    .project:last-of-type {
      height: 74px;
    }
    .project .title {
      line-height: 66px;
    }
    .project .title::after {
      content: '';
      transform: skew(-5deg);
      background: black;
      border-right: 4px solid black;
      position: absolute;
      width: 6px;
      height: 66px;
      right: -3px;
      top: 0;
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