import api from "~/api";
import * as types from "../mutation-types";
import store from '~/store';

// initial state
const defaultStory = {
  term: {
    title: false,
    featured: {
      images: false
    }
  },
  posts: []
};
const state = {
  stories: [],
  storyHero: {
    images: false
  },
  currentStory: defaultStory,
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

      commit(types.STORIES, data);
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
          resolve(response);
        }
        else {
          console.log('error 404 story store');
          reject(response);
        }
      });
    });
  },

  getStoryImages({ commit }, payload) {
    console.log(payload);
    return new Promise((resolve, reject) => {
      api.getStoryMedia({
        slug: payload.slug
      }, response => {
        console.log('store getstory images', response);
        if(response.media) {
          response.slug = payload.slug;
          commit(types.STORY_IMAGES, response);
          resolve(response);
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
  [types.STORIES](state, data) {
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
    if(data) {
      state.currentStory = {
        posts: data.posts,
        term: data.term
      };
    }
    else {
      state.currentStory = defaultStory;
    }
  },

  [types.STORY_IMAGES](state, data) {
    console.log('story images set as gallery', data);
    store.state.post.gallery = {
      images: data.media,
      gallerySlug: data.slug,
      title: data.term.title,
      description: data.term.description,
      featured: data.term.featured,
      loaded: true
    };
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
