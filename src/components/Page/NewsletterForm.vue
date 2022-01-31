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
@screen lg {
  .subscribe-form {
    margin-left: calc((100vw - 56rem) / 2);
    @apply max-w-4xl mx-auto xxl:ml-[256px];
  }
}
.subscribe-desc {
  @apply dark:text-gray-100;
}
</style>
<script>
import newsletterFormMixin from '~/mixins/NewsletterForm.vue'
export default {
  mixins: [newsletterFormMixin]
}
</script>