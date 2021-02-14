import api from "~/api";
import * as types from "../mutation-types";

// initial state
const state = {
  headerMenu: false
};

// getters
const getters = {
  headerMenu: state => state.headerMenu
};

// actions
const actions = {
  getHeader({ commit }, params) {
    api.getMenu('header-menu', menu => {
      console.log('menu', menu);

      commit(types.HEADER_MENU, menu);
    });
  }
};

// mutations
const mutations = {
  [types.HEADER_MENU](state, menu) {
    state.headerMenu = menu;
  },
};

export default {
  state,
  getters,
  actions,
  mutations
};
