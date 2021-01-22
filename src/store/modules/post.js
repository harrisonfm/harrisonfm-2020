import api from "../../api";
import * as types from "../mutation-types";

// initial state
const state = {
  recent: [],
  loaded: false,
  currentPost: {
    title: 'Loading..',
    acf: {},
    categories: [{}]
  }
};

// getters
const getters = {
  recentPosts: state => state.recent,

  recentPostsLoaded: state => state.loaded,

  currentPost: state => state.currentPost
};

// actions
const actions = {
  getPosts({ commit }, params) {
    api.getPosts(params, posts => {
      console.log(posts);

      commit(types.STORE_FETCHED_POSTS, posts);
      commit(types.POSTS_LOADED, true);
      commit(types.INCREMENT_LOADING_PROGRESS);
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
  [types.STORE_FETCHED_POSTS](state, posts) {
    state.recent = posts;
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
