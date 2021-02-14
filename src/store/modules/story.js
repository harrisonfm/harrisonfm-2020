import api from "~/api";
import * as types from "../mutation-types";

// initial state
const state = {
  stories: [],
  currentStory: {
    title: 'Loading..',
    acf: {},
    posts: []
  },
  loaded: false
};

// getters
const getters = {
  stories: state => state.stories,
  storiesLoaded: state => state.loaded,
  currentStory: state => state.currentStory
};

// actions
const actions = {
  getStories({ commit }) {
    api.getStories(data => {
      console.log(data);

      commit(types.STORE_FETCHED_STORIES, data);
      commit(types.STORIES_LOADED, true);
    });
  },

  getStory({ commit, getters }, payload) {
    return new Promise((resolve, reject) => {
      api.getStory(payload.slug, response => {
        console.log('store getstory', response);
        if(response.length) {
          let story = response[0];
          commit(types.STORY_CURRENT, story);
          resolve(response[0]);
        }
        else {
          console.log(response, 'error 404 story store');
          reject(response);
        }
      });
    });
  }
};

// mutations
const mutations = {
  [types.STORE_FETCHED_STORIES](state, data) {
    state.stories = data.stories;
  },

  [types.STORIES_LOADED](state, val) {
    state.loaded = val;
  },

  [types.STORY_CURRENT](state, story) {
    console.log('current story set', story);
    state.currentStory = story;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
