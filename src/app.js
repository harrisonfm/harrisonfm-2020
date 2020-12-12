import Vue from 'vue';
import VueCookies from 'vue-cookies';
require('./bootstrap');
import './assets/css/styles.css';
import ErrorPage from 'vue-error-page';

import router from './router';
import App from './App.vue';
import store from './store';
import * as types from './store/mutation-types';
import meta from './meta';

import { library } from '@fortawesome/fontawesome-svg-core';

import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faPause } from '@fortawesome/free-solid-svg-icons';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { faCompressAlt } from '@fortawesome/free-solid-svg-icons';
import { faChevronCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { faChevronCircleRight } from '@fortawesome/free-solid-svg-icons';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText } from '@fortawesome/vue-fontawesome';

library.add(faTimes, faHeart, faPause, faPlay, faCompressAlt, faChevronCircleLeft, faChevronCircleRight, faInfoCircle);

Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.component('font-awesome-layers', FontAwesomeLayers);
Vue.component('font-awesome-layers-text', FontAwesomeLayersText);
Vue.use(VueCookies);
Vue.use(ErrorPage, {
	resolver: (component) => {
    return require('./components/Page/' + component).default;
  }
});

window.eventBus = new Vue();
meta.setDefaults();
meta.setMeta();

new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App),
  created() {
    this.$store.commit(types.RESET_LOADING_PROGRESS);
  }
});
