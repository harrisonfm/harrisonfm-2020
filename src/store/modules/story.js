import api from "~/api";
import * as types from "../mutation-types";

// initial state
const state = {
  stories: [],
  storyHero: {},
  currentStory: {
    term: {
      name: 'Loading',
      image: {}
    },
    posts: []
  },
  loaded: false,
  currentStoryLoaded: false
};

// getters
const getters = {
  stories: state => state.stories,
  storiesLoaded: state => state.loaded,
  currentStoryLoaded: state => state.currentStoryLoaded,
  currentStory: state => state.currentStory,
  storyHero: state => state.storyHero
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
    let currentStoryInMemory = false;
    for (const [idx, el] of getters.stories.entries()) {
      if(payload.slug === el.term_name) {
        currentStoryInMemory = el;
        break;
      }
    }
    return new Promise((resolve, reject) => {
      api.getStory({
        slug: payload.slug,
        queryForTerm: currentStoryInMemory ? true : false
      }, response => {
        console.log('store getstory');
        if(response.posts) {
          if(currentStoryInMemory) {
            response.term = currentStoryInMemory;
          }
          commit(types.STORY_CURRENT, response);
          commit(types.STORY_CURRENT_LOADED, true);
        }
        else {
          console.log('error 404 story store');
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
    state.storyHero = data.hero;
  },

  [types.STORIES_LOADED](state, val) {
    state.loaded = val;
  },

  [types.STORY_CURRENT_LOADED](state, val) {
    state.currentStoryLoaded = val;
  },

  [types.STORY_CURRENT](state, data) {
    console.log('current story set', data);
    state.currentStory = {
      posts: data.posts,
      term: data.term
    };
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
