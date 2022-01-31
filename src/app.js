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

import Loader from './components/partials/Loader.vue';

import { library } from '@fortawesome/fontawesome-svg-core';

import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText } from '@fortawesome/vue-fontawesome';
import { faTimes, faHeart, faPause, faPlay, faCompressAlt, faChevronCircleLeft, faChevronCircleRight, faInfoCircle, faSearch, faSignInAlt, faCaretDown, faBars, faShare, faMoon, faSun, faCloudMoon, faCloudSun} from '@fortawesome/free-solid-svg-icons';

library.add(faTimes, faHeart, faPause, faPlay, faCompressAlt, faChevronCircleLeft, faChevronCircleRight, faInfoCircle, faSearch, faSignInAlt, faBars, faCaretDown, faShare, faMoon, faSun, faCloudMoon, faCloudSun);

Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.component('font-awesome-layers', FontAwesomeLayers);
Vue.component('font-awesome-layers-text', FontAwesomeLayersText);
Vue.component('v-style', {
  render: function (createElement) {
    return createElement('style', this.$slots.default)
  }
});

Vue.component('Loader', Loader);

Vue.use(VueCookies);
Vue.use(VueMeta);
Vue.use(ErrorPage, {
	resolver: (component) => {
    return require('./components/Page/' + component).default;
  }
});
Vue.use(VueLazyload, {
  attempt: 1
});

window.eventBus = new Vue();

if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.remove('dark')
}

new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App),
});
