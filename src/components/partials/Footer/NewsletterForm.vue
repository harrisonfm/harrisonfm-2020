<template>
  <form class="subscribe-form" v-on:submit.prevent="subscribe">
    <h5 class="subscribe-header">Newsletter</h5>
    <p class="subscribe-desc">{{ message }}</p>
    <div class="subscribe-row" v-if="showInput">
      <input type="email" name="email" placeholder="e-mail" class="subscribe-email" v-model="email" />
      <button id="footer-subscribe" class="subscribe-button button" type="submit">{{ buttonText }}</button>
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
.subscribe-desc {
  @apply mb-2;
}
.subscribe-row {
  @apply xs:flex;
}
.subscribe-header {
  @apply font-bold mb-1 uppercase;
}
.subscribe-email {
  @apply text-white bg-transparent border-solid border-white border-2 p-2 mb-2 xs:mb-0;
}
.subscribe-email::placeholder {
  @apply text-white;
}
.subscribe-button {
  margin-left: 3px;
  width: 108px;
  @apply focus:outline-none text-sm text-center mt-2 xs:ml-2 lg:ml-4 py-2 px-4 font-semibold text-white bg-orange-500 transition-colors duration-150 ring ring-orange-300 hover:bg-blue-500 hover:ring-blue-300 uppercase;
}
@screen xs {
  .subscribe-button {
    margin-top: 3px;
    margin-bottom: 3px;
  }
}
</style>
<script>
import api from "~/api";
export default {
  data() {
    return {
      email: '',
      message: "Check out my newsletter to stay up to date on my essays, photography and life updates. Typically a monthly issue.",
      processingRequest: false,
      showInput: true,
      buttonText: 'Subscribe'
    }
  },
  methods: {
    subscribe: function() {
      if(this.processingRequest) {
        return;
      }
      this.processingRequest = true;
      this.buttonText = '. ';

      let buttonInterval = setInterval(() => {
        this.buttonText = this.buttonText+'. ';
      }, 250);

      api.subscribe(this.email, response => {
        console.log(response);

        clearInterval(buttonInterval);
        this.processingRequest = false;
        if(response.code === 200 || response.code === 202) {
          this.message = "Thanks! You're almost subscribed! Just check your e-mail for the confirmation link.";
          this.showInput = false;
        }
        else {
          this.message = 'Error subscribing! Check your e-mail or let Harrison know.';
          this.showInput = true;
          this.buttonText = 'Subscribe';
        }
      });
    }
  }
}
</script>