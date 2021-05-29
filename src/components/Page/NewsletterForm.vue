<template>
  <form class="subscribe-form" v-on:submit.prevent="subscribe">
    <p class="subscribe-desc">{{ message }}</p>
    <div class="subscribe-row" v-if="showInput">
      <input required type="email" name="email" placeholder="email" class="subscribe-email" v-model="email" />
      <button class="subscribe-button button" type="submit">{{ buttonText }}</button>
    </div>
  </form>
</template>
<style scoped>
.subscribe-desc {
  @apply mb-2;
}
.subscribe-email {
  @apply border-solid border-black border-b-2 p-2 mb-2 xs:mb-0;
}
.subscribe-button {
  margin-left: 3px;
  width: 108px;
  @apply focus:outline-none text-sm text-center mt-2 xs:ml-2 lg:ml-4 py-2 px-4 font-semibold text-white bg-orange-500 transition-colors duration-150 ring ring-orange-300 hover:bg-blue-500 hover:ring-blue-300 uppercase;
}
</style>
<script>
import newsletterFormMixin from '~/mixins/NewsletterForm.vue'
export default {
  mixins: [newsletterFormMixin]
}
</script>