import api from "~/api";
import * as types from "../mutation-types";
import router from '~/router';

// initial state
const state = {
  page: null
};

// getters
const getters = {
  currentPage: state => state.page
};

// actions
const actions = {
  getPage: function({ commit }, payload) {
    console.log(payload);
    return new Promise((resolve, reject) => {
      api.getPage(payload.pageSlug, response => {
        if(response.length) {
          commit(types.PAGE_CURRENT, { 
            page: response[0]
          });
          resolve(response[0]);
        }
        else {
          reject(response);
        }
      });
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
