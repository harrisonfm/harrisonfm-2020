import api from "../../api";
import _ from "lodash";
import * as types from "../mutation-types";
import router from '../../router';

// slideshow off always / turn on with button click on photo component
// does the state of the gallery need to be here too?

// initial state
const state = {
  photo: false,
  liked: false,
  likes: 0,
	gallery: {},
	galleryIndex: 0,
  galleryInfo: false,
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
  gallery: state => state.gallery,
  galleryInfo: state => state.galleryInfo,
  galleryIndex: state => state.galleryIndex,
  likes: state => state.likes,
  liked: state => state.liked
};

// actions
const actions = {
  like: function({ commit }, payload) {
    console.log(payload.photo);
    api.like(payload.photo.id, payload.likes, response => {
      commit(types.PHOTO_LIKE);
    });
  }
};

// mutations
const mutations = {
  [types.PHOTO](state, payload) {
    state.photo = payload.photo;

    let acf = state.photo.acf ? state.photo.acf : {};
    state.photo.likes = acf.likes ? parseInt(acf.likes, 10) : 0;
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

  [types.GALLERY](state, payload) {
    state.gallery = payload.gallery;
    state.galleryIndex = payload.idx;
    
    state.prevPhoto = payload.idx > 0 ? payload.gallery[payload.idx - 1] : payload.gallery[payload.gallery.length - 1];
    state.nextPhoto = payload.idx < payload.gallery.length - 1 ? payload.gallery[payload.idx + 1] : payload.gallery[0];
  },

  [types.GALLERY_INFO](state) {
    state.galleryInfo = !state.galleryInfo;
  },

  [types.PHOTO_LIKE](state) {
    //fallbacks for media w/o ACF default
    if(!state.photo['acf']) {
      state.photo['acf'] = [];
    }
    if(typeof state.photo['acf']['likes'] === 'undefined') {
      state.photo['acf']['likes'] = 0;
    }

    state.photo['acf']['likes'] = parseInt(state.photo['acf']['likes'], 10) + (state.liked ? 1 : -1);
    state.photo['acf']['likes'] = state.photo['acf']['likes'] < 0 ? 0 : state.photo['acf']['likes'];
    state.likes = state.photo['acf']['likes'];
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
