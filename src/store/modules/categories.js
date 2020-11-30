import api from '../../api'
import * as types from '../mutation-types'

// initial state
const state = {
  all: [],
  loaded: false,
  currentCategory: false
}

// getters
const getters = {
  // Returns an array all categories
  allCategories: state => state.all,
  allCategoriesLoaded: state => state.loaded,
  currentCategory: state => state.currentCategory
}

// actions
const actions = {
  getAllCategories ({ commit }, payload) {
    api.getCategories(categories => {
      console.log(payload);
      commit(types.STORE_FETCHED_CATEGORIES, { categories })
      commit(types.CATEGORIES_LOADED, true)
      commit(types.INCREMENT_LOADING_PROGRESS)
      console.log(payload.route.slug);
      if(payload.route.slug) {
        for (const [idx, el] of categories.entries()) {
          if(payload.route.slug === el.slug) {
            console.log('cats matched', el);
            commit(types.CURRENT_CATEGORY, el);
            break;
          }
        }
      }
    })
  }
}

// mutations
const mutations = {
  [types.STORE_FETCHED_CATEGORIES] (state, { categories }) {
    state.all = categories
  },

  [types.CATEGORIES_LOADED] (state, bool) {
    state.loaded = bool
  },

  [types.CURRENT_CATEGORY] (state, category) {
    console.log('set current cat', category);
    state.currentCategory = category;
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}
