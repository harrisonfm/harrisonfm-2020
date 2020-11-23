import api from "../../api";
import * as types from "../mutation-types";
import router from '../../router';

// initial state
const state = {
  page: null
};

// getters
const getters = {
  page: state => state.page
};

// actions
const actions = {
  getPage: function({ commit }, payload) {
    console.log(payload);
    api.getPage(payload.pageSlug, response => {
      if(response.length) {
        console.log(response);
        commit(types.PAGE_CURRENT, { 
          page: response[0]
        });
      }
      else {
        router.push({
          name: '404'
        });
      }
    });
  }
};

// mutations
const mutations = {
  [types.PAGE_CURRENT](state, { page }) {
    state.page = page;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
