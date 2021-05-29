<script>
import api from "~/api";
export default {
  data() {
    return {
      email: '',
      message: "Enter your email below to subscribe:",
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