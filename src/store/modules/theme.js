import * as types from "../mutation-types"

const state = {
  theme: '',
  prefersDark: ''
};
const getters = {
  theme: (state) => state.theme,
  prefersDark: (state) => state.prefersDark
};
const actions = {
  initTheme: function({ commit }) {
    const cachedTheme = localStorage.theme ? localStorage.theme : false;
    const userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    commit('PREFERS_DARK', userPrefersDark);

    if (cachedTheme)
      commit('SET_THEME', cachedTheme)
    else if (userPrefersDark)
      commit('SET_THEME', 'dark')
    else
      commit('SET_THEME', 'light')
  },
  toggleTheme: function({ commit }) {
    switch (localStorage.theme) {
      case 'light':
        commit('SET_THEME', 'dark')
        break;
      case 'dark':
        commit('SET_THEME', 'system')
        break;
      case 'system':
        commit('SET_THEME', 'light')
        break;
    }
  }
};
const mutations = {
  [types.SET_THEME](state, theme) {
    state.theme = theme;
    localStorage.theme = theme;
  },
  [types.PREFERS_DARK](state, prefersDark) {
    console.log(prefersDark);
    state.prefersDark = prefersDark;
  },
};

export default {  
  state,
  getters,
  actions,
  mutations
}