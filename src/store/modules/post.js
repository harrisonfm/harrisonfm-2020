import api from "~/api";
import * as types from "../mutation-types";

// initial state
const defaultPost = {
  title: 'Loading..',
  acf: {},
  featured: {
    images: false
  },
  categories: [{}],
  loading: true
};
const defaultGallery = {
  featured: {
    images: false
  }
};
const state = {
  posts: [],
  maxPages: 0,
  loaded: false,
  currentPost: defaultPost,
  gallery: defaultGallery
};

// getters
const getters = {
  posts: state => state.posts,
  maxPages: state => state.maxPages,
  postsLoaded: state => state.loaded,
  currentPost: state => state.currentPost,
  gallery: state => state.gallery
};

// actions
const actions = {
  getPosts({ commit }, params) {
    return new Promise((resolve, reject) => {
      api.getPosts(params, response => {
        console.log(response);
        if(response.posts.length) {
          commit(types.STORE_FETCHED_POSTS, response);
          commit(types.POSTS_LOADED, true);
          commit(types.INCREMENT_LOADING_PROGRESS);
          resolve(response);
        }
        else {
          reject(response);
        }
      });
    });
  },

  getPage({ commit, getters }, payload) {
    console.log('store getpage', payload.slug);
    return new Promise((resolve, reject) => {
      api.getPage(payload.slug, response => {
        if(response) {
          commit(types.POST_CURRENT, response);
          resolve(response);
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
      for (const [idx, el] of getters.posts.entries()) {
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
    state.posts = data.posts;
    state.maxPages = data.max_num_pages;
  },

  [types.POSTS_LOADED](state, val) {
    state.loaded = val;
  },

  [types.POST_CURRENT](state, post) {
    console.log('current post set', post);
    if(post) {
      state.currentPost = post;
      state.gallery.images = post.gallery;
    } else {
      state.currentPost = defaultPost;
    }
  },

  [types.GALLERY](state, gallery) {
    console.log('genre gallery set', gallery);
    if(gallery) {
      state.gallery = gallery;
    }
    else {
      state.gallery = defaultGallery;
    }
  },


};

export default {
  state,
  getters,
  actions,
  mutations
};
