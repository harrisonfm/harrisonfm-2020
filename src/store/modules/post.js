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
  currentPost: {},
  paginationIndex: 1
};

// getters
const getters = {
  recentPosts: state => limit => {
    if (!limit || !_.isNumber(limit) || _.isNull(limit) || typeof limit == "undefined") {
      return state.recent;
    }
    let recent = state.recent;
    return recent.slice(0, limit);
  },

  recentPostsLoaded: state => state.loaded,

  currentPost: state => state.currentPost,

  paginationIndex: state => state.paginationIndex
};

// actions
const actions = {
  getPosts({ commit }, { limit, page }) {
    console.log(limit, page);
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

  setCurrentPost({ commit }, {post}) {
    commit(types.POST_CURRENT, { post });
  }
};

// mutations
const mutations = {
  [types.STORE_FETCHED_POSTS](state, { posts }) {
    state.recent = posts;
  },

  [types.POSTS_LOADED](state, val) {
    state.loaded = val;
  },

  [types.POST_CURRENT](state, { post }) {
    state.currentPost = post;
  },

  [types.PAGINATION_INDEX](state, { page }) {
    state.paginationIndex = page;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
