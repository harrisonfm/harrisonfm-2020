<template>
  <div v-if="projects" class="border-black border-4 w-full lg:w-3/4">
    <div v-for="project in projects" :key="project.title" :style="parseBackground(project)" class="project h-16 bg-cover bg-gray-500 flex flex-col justify-between cursor-pointer" @click="$event.target.classList.toggle('on')">
      <div class="title bg-white font-bold inline-flex items-center text-3xl h-16 px-4 self-start relative" @click="$event.target.parentNode.classList.toggle('on')">{{ project.title }}</div>
      <div class="project-description bg-white hidden">
        <p class="p-4"><a target="_blank" :href="project.link">Link</a> &mdash; {{ project.description }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .project {
    transition: height .5s;
  }
  .project .title::after {
    content: '';
    transform: skew(-5deg);
    height: 4rem;
    width: 5px;
    background: #fff;
    border-right: 5px solid #000;
    position: absolute;
    right: -3px;
    top: 0;
  }
  .project.on {
    height: calc(100vw / 2);
  }
  @screen lg {
    .project.on {
      height: 500px;
    }    
  }
  .project.on .project-description {
    display: block;
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