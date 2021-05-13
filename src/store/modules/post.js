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
  genres: false,
  loading: true
};
const defaultGallery = {
  featured: {
    images: false
  },
  images: [],
  loaded: false
};
const state = {
  posts: [],
  maxPages: 0,
  loaded: false,
  currentPost: defaultPost,
  gallery: defaultGallery,
  pageError: false
};

// getters
const getters = {
  posts: state => state.posts,
  maxPages: state => state.maxPages,
  postsLoaded: state => state.loaded,
  currentPost: state => state.currentPost,
  gallery: state => state.gallery,
  pageError: state => state.pageError
};

// actions
const actions = {
  getPosts({ commit }, params) {
    return new Promise((resolve, reject) => {
      api.getPosts(params, response => {
        console.log(response);
        if(response.posts.length) {
          setTimeout(() => {
            commit(types.POSTS, response);
            commit(types.POSTS_LOADED, true);
            resolve(response);
          }, 1000);
        }
        else {
          reject(response);
        }
      });
    });
  },

  getPage({ commit }, payload) {
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
        if(response) {
          commit(types.POST_CURRENT, response);
          resolve(response);
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
  [types.POSTS](state, data) {
    if(data) {
      state.posts = data.posts;
      state.maxPages = data.max_num_pages;
    }
    else {
      state.posts = [];
    }
  },

  [types.POSTS_LOADED](state, val) {
    state.loaded = val;
  },

  [types.POST_CURRENT](state, post) {
    console.log('current post set', post);
    if(post) {
      state.currentPost = post;
      if(post.gallery) {
        console.log('post gallery set', post.gallery);
        state.gallery = {
          images: post.gallery,
          loaded: true
        }
      }
    } else {
      state.currentPost = defaultPost;
      state.gallery = defaultGallery;
    }
  },

  [types.GALLERY](state, gallery) {
    console.log('genre gallery set', gallery);
    if(gallery) {
      state.gallery = gallery;
      state.gallery.loaded = true;
    }
    else {
      state.gallery = defaultGallery;
    }
  },

  [types.PAGE_ERROR](state, val) {
    console.log('set page error');
    state.pageError = val;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
