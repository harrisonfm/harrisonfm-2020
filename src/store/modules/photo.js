import api from "~/api";
import * as types from "../mutation-types";
import router from '~/router';
import store from '~/store';

// slideshow off always / turn on with button click on photo component
// does the state of the gallery need to be here too?

// initial state
const state = {
  photo: false,
  liked: false,
  likes: 0,
	galleryIndex: 0,
  galleryInfo: true,
  slideshow: false,
  prevPhoto: false,
  nextPhoto: false
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
  like: function({ commit }, payload) {
    console.log(payload.photo);
    api.like(payload.photo.ID, payload.likes, response => {
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
    state.photo = photo;
    state.photo.likes = parseInt(photo.likes);
    state.likes = state.photo.likes;
  },
	[types.PHOTO_SLIDESHOW](state, payload) {
		if(payload.toggleSlideshow) {
			if(state.slideshow) {
				clearTimeout(state.slideshow);
				state.slideshow = false;
				return;
			}
			else {
				state.slideshow = true;
			}
		}
		if(state.slideshow) {
	    state.slideshow = setTimeout(function(nextPhoto) {
	      router.push({
	        name: 'Photo',
	        params: { idSlug: nextPhoto.id + '-' + nextPhoto.name }
	      });
	    }, 1000, state.nextPhoto);
		}
	},

  [types.GALLERY_INDEX](state, payload) {
    const gallery = store.getters.gallery;
    state.galleryIndex = payload.idx;
    
    state.prevPhoto = payload.idx > 0 ? gallery[payload.idx - 1] : gallery[gallery.length - 1];
    state.nextPhoto = payload.idx < gallery.length - 1 ? gallery[payload.idx + 1] : gallery[0];
  },

  [types.GALLERY_INFO](state) {
    state.galleryInfo = !state.galleryInfo;
  },

  [types.PHOTO_LIKE](state) {
    state.photo['likes'] = parseInt(state.photo['likes'], 10) + (state.liked ? 1 : -1);
    state.photo['likes'] = state.photo['likes'] < 0 ? 0 : state.photo['likes'];
    state.likes = state.photo['likes'];
  },
  [types.LIKED](state, payload) {
    state.liked = payload.liked;
  },
};

export default {
  state,
  getters,
  actions,
  mutations
};
