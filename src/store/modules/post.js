import api from "../../api";
import _ from "lodash";
import * as types from "../mutation-types";

const createPostSlug = post => {
  let slug = post.link.replace("http://" + window.location.hostname, "");
  slug = slug.replace("https://" + window.location.hostname, "");
  post.slug = slug;
  return post;
};

// initial state
const state = {
  recent: [],
  loaded: false,
  currentPost: {}
};

// getters
const getters = {
  recentPosts: state => state.recent,

  recentPostsLoaded: state => state.loaded,

  currentPost: state => state.currentPost
};

// actions
const actions = {
  getPosts({ commit }, { limit, page }) {
    api.getPosts(limit, page, posts => {
      posts.map((post, i) => {
        posts[i] = createPostSlug(post);
      });

      console.log(posts);

      commit(types.STORE_FETCHED_POSTS, { posts });
      commit(types.POSTS_LOADED, true);
      commit(types.INCREMENT_LOADING_PROGRESS);
    });
  },

  getPost({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.getPost(payload.slug, response => {
        console.log(response, 'getpost store');
        if(response.length) {
          let post = response[0];
          commit(types.POST_CURRENT, { post });
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
  [types.STORE_FETCHED_POSTS](state, { posts }) {
    state.recent = posts;
  },

  [types.POSTS_LOADED](state, val) {
    console.log('posts loaded', val);
    state.loaded = val;
  },

  [types.POST_CURRENT](state, { post }) {
    state.currentPost = post;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
