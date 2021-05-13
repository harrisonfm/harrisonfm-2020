import Vue from 'vue';
import api from "~/api";
import * as types from "../mutation-types";

// initial state
const state = {};

// getters
const getters = {
  menus: state => state
};

// actions
const actions = {
  getMenu({ commit }, menu) {
    api.getMenu(menu, menu => {
      commit(types.MENUS, menu);
    });
  }
};

// mutations
const mutations = {
  [types.MENUS](state, menu) {
    Vue.set(state, menu.slug, menu);
  },
};

export default {
  state,
  getters,
  actions,
  mutations
};
