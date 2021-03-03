<template>
  <div class="project-container">
    <div v-for="project in projects" :key="project.title" :style="parseBackground(project)" class="project" @click="$event.target.classList.toggle('on')">
      <div class="title" @click="$event.target.parentNode.classList.toggle('on')">{{ project.title }}</div>
      <div class="project-description">
        <p class="p-4"><a target="_blank" :href="project.link">Link</a> &mdash; {{ project.description }}</p>
      </div>
    </div>
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
    @apply bg-white font-bold inline-flex items-center px-4 self-start relative border-black border-b-2 border-r-2 sm:border-r-0 sm:border-b-4 sm:text-3xl;
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
export default {
  props: ['projects'],
  methods: {
    parseBackground(project) {
      console.log(project);
      return 'background-image: url('+project.image.url+')';
    }
  }
};
</script>