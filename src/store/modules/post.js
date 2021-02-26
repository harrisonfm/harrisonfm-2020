import api from "~/api";
import * as types from "../mutation-types";

// initial state
const state = {
  recent: [],
  maxPages: 0,
  loaded: false,
  currentPost: {
    title: 'Loading..',
    acf: {},
    categories: [{}],
    loading: true
  }
};

// getters
const getters = {
  recentPosts: state => state.recent,

  maxPages: state => state.maxPages,

  recentPostsLoaded: state => state.loaded,

  currentPost: state => state.currentPost
};

// actions
const actions = {
  getPosts({ commit }, params) {
    api.getPosts(params, data => {
      console.log(data);

      commit(types.STORE_FETCHED_POSTS, data);
      commit(types.POSTS_LOADED, true);
      commit(types.INCREMENT_LOADING_PROGRESS);
    });
  },

  getPage({ commit, getters }, payload) {
    return new Promise((resolve, reject) => {
      api.getPage(payload.slug, response => {
        console.log('store getpage', response);
        if(response.length) {
          let post = response[0];
          commit(types.POST_CURRENT, post);
          resolve(response[0]);
        }
        else {
          console.log(response, 'error 404 post store - page');
          reject(response);
        }
      });
    });
  },

  getPost({ commit, getters }, payload) {
    return new Promise((resolve, reject) => {
      for (const [idx, el] of getters.recentPosts.entries()) {
        if(payload.slug === el.post_name) {
          console.log('getpost from memory', el);
          commit(types.POST_CURRENT, el);
          return resolve(el);
        }
      }
      api.getPost(payload.slug, response => {
        console.log('store getpost', response);
        if(response.length) {
          let post = response[0];
          commit(types.POST_CURRENT, post);
          resolve(response[0]);
        }
        else {
          console.log(response, 'error 404 post store');
          reject(response);
        }
      });
    });
  }
};

// mutations
const mutations = {
  [types.STORE_FETCHED_POSTS](state, data) {
    state.recent = data.posts;
    state.maxPages = data.max_num_pages;
  },

  [types.POSTS_LOADED](state, val) {
    state.loaded = val;
  },

  [types.POST_CURRENT](state, post) {
    console.log('current post set', post);
    state.currentPost = post;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
