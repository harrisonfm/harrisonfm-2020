import Vue from 'vue';
import VueCookies from 'vue-cookies';
import VueMeta from 'vue-meta'
import VueLazyload from 'vue-lazyload'

require('./bootstrap');
import './assets/css/styles.css';
import ErrorPage from 'vue-error-page';

import router from './router';
import App from './App.vue';
import store from './store';
import * as types from './store/mutation-types';

import { library } from '@fortawesome/fontawesome-svg-core';

import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faPause } from '@fortawesome/free-solid-svg-icons';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { faCompressAlt } from '@fortawesome/free-solid-svg-icons';
import { faChevronCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { faChevronCircleRight } from '@fortawesome/free-solid-svg-icons';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText } from '@fortawesome/vue-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

library.add(faTimes, faHeart, faPause, faPlay, faCompressAlt, faChevronCircleLeft, faChevronCircleRight, faInfoCircle, faSearch, faSignInAlt, faBars, faCaretDown);

Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.component('font-awesome-layers', FontAwesomeLayers);
Vue.component('font-awesome-layers-text', FontAwesomeLayersText);
Vue.component('v-style', {
  render: function (createElement) {
    return createElement('style', this.$slots.default)
  }
});

Vue.use(VueCookies);
Vue.use(VueMeta);
Vue.use(ErrorPage, {
	resolver: (component) => {
    return require('./components/Page/' + component).default;
  }
});
Vue.use(VueLazyload);

window.eventBus = new Vue();

new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App),
  created() {
    this.$store.commit(types.RESET_LOADING_PROGRESS);
  }
});
