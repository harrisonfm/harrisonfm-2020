<template>
  <form class="subscribe-form" v-on:submit.prevent="subscribe">
    <h5 class="subscribe-header">Newsletter</h5>
    <p class="subscribe-desc">{{ message }}</p>
    <div class="subscribe-row" v-if="showInput">
      <input required type="email" name="email" placeholder="e-mail" class="subscribe-email" v-model="email" />
      <button class="subscribe-button button" type="submit">{{ buttonText }}</button>
    </div>
  </form>
</template>
<style scoped>
.subscribe-form {
  @apply max-w-md;
}
.subscribe-form-title {
  @apply mb-2 lg:mb-4 uppercase;
}
.subscribe-row {
  @apply xs:flex;
}
.subscribe-header {
  @apply font-bold mb-1 uppercase;
}
.subscribe-email {
  @apply text-gray-100 bg-transparent border-gray-100 border-2 placeholder-gray-600;
}
</style>
<script>
import newsletterFormMixin from '~/mixins/NewsletterForm.vue'
export default {
  mixins: [newsletterFormMixin],
  data() {
    return {
      message: 'Check out my newsletter to stay up to date on my essays, photography and life updates. Typically a monthly issue.'
    }
  }
}
</script>