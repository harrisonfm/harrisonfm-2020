import Vue from 'vue'
import Vuex from 'vuex'
import createPersist from 'vuex-localstorage'
import * as actions from './actions'
import * as getters from './getters'
import hub from './modules/hub'
import user from './modules/user'
import post from './modules/post'
import photo from './modules/photo'
import menus from './modules/menus'
import story from './modules/story'

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
  actions,
  getters,
  modules: {
    hub,
    user,
    post,
    photo,
    menus,
    story
  },
  strict: debug,
  plugins: plugins
})
