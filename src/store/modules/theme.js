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
    const cachedTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : false;
    const userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    commit('PREFERS_DARK', userPrefersDark);

    let theme = cachedTheme || (userPrefersDark ? 'dark' : 'light');
    commit('SET_THEME', theme);
    
    document.querySelector("html").classList.toggle("dark", theme === "dark");
  },
  toggleTheme: function({ commit }) {
    switch (localStorage.getItem('theme')) {
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
    localStorage.setItem('theme', theme);
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