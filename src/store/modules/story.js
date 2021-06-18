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
  loaded: false,
  posts: []
};
const state = {
  stories: [],
  storyHero: {
    images: false
  },
  storyDescription: '',
  currentStory: defaultStory
};

// getters
const getters = {
  stories: state => state.stories,
  currentStory: state => state.currentStory,
  storyHero: state => state.storyHero
};

// actions
const actions = {
  getStories({ commit }) {
    return new Promise((resolve, reject) => {
      api.getStories(data => {
        console.log(data);

        commit(types.STORIES, data);
        resolve(data);
      })
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
        if(response.posts) {
          if(currentStoryInMemory) {
            response.term = currentStoryInMemory;
          }
          commit(types.STORY_CURRENT, response);
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
    state.storyDescription = data.description;
  },

  [types.STORY_CURRENT](state, data) {
    console.log('current story set', data);
    if(data) {
      state.currentStory = {
        posts: data.posts,
        term: data.term,
        loaded: true
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
