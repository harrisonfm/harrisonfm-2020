import api from "~/api"
import * as types from "../mutation-types"
import store from '~/store'
import analytics from '~/analytics'

const defaultPhoto = {
  images: false
};

// initial state
const state = {
  photo: defaultPhoto,
  liked: false,
  likes: 0,
	galleryIndex: 0,
  galleryInfo: true,
  slideshow: false,
  prevPhoto: defaultPhoto,
  nextPhoto: defaultPhoto
};

// getters
const getters = {
  photo: state => state.photo,
  slideshow: state => state.slideshow,
  prevPhoto: state => state.prevPhoto,
  nextPhoto: state => state.nextPhoto,
  galleryInfo: state => state.galleryInfo,
  galleryIndex: state => state.galleryIndex,
  likes: state => state.likes,
  liked: state => state.liked
};

// actions
const actions = {
  likePhoto: function({ commit }, payload) {
    api.like(state.photo.ID, state.likes + (state.liked ? -1 : 1), response => {
      commit(types.PHOTO_LIKE);
    });
  },
  getSinglePhoto: function({ commit }, payload) {
    console.log('api get single photo');
    api.getPhoto(payload.id, photo => {
      commit(types.PHOTO, photo);
    });
  }
};

// mutations
const mutations = {
  [types.PHOTO](state, photo) {
    console.log('commit photo', photo);
    if(photo) {
      state.photo = photo;
      state.photo.likes = parseInt(photo.likes);
      state.likes = state.photo.likes;
      state.liked = localStorage.getItem('liked-'+state.photo.ID) === 'true' ? true : false;
    }
    else {
      state.photo = defaultPhoto;
      state.likes = 0;
    }
  },
	[types.PHOTO_SLIDESHOW](state) {
    state.slideshow = !state.slideshow;
	},

  [types.GALLERY_INDEX](state, payload) {
    const gallery = store.getters.gallery.images;
    state.galleryIndex = payload.idx;
    
    state.prevPhoto = payload.idx > 0 ? gallery[payload.idx - 1] : gallery[gallery.length - 1];
    state.nextPhoto = payload.idx < gallery.length - 1 ? gallery[payload.idx + 1] : gallery[0];
  },

  [types.GALLERY_INFO](state) {
    state.galleryInfo = !state.galleryInfo;
    if(state.galleryInfo) {
      analytics.trackEvent('Photo', 'Toggle Info On');
    }
    else {
      analytics.trackEvent('Photo', 'Toggle Info Off');
    }
  },

  [types.PHOTO_LIKE](state) {
    state.photo['likes'] = parseInt(state.photo['likes']) + (state.liked ? -1 : 1);
    if(state.photo['likes'] < 0) {
      state.photo['likes'] = 0;
    }
    state.likes = state.photo['likes'];

    state.liked = !state.liked;
    localStorage.setItem('liked-'+state.photo.ID, state.liked);
  },
};

export default {
  state,
  getters,
  actions,
  mutations
};
