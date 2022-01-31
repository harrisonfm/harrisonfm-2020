import Vue from 'vue'
import Vuex from 'vuex'
import createPersist from 'vuex-localstorage'
import post from './modules/post'
import photo from './modules/photo'
import menus from './modules/menus'
import story from './modules/story'
import theme from './modules/theme'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

let localStorage = createPersist({
    namespace: 'hfm',
    initialState: {},
    expires: 1.21e+9 // Two Weeks
})

let plugins = [];

if(!debug) {
  plugins.push(localStorage);
}

export default new Vuex.Store({
  modules: {
    post,
    photo,
    menus,
    story,
    theme
  },
  strict: debug,
  plugins: plugins
})
