import api from "../../api";
import _ from "lodash";
import * as types from "../mutation-types";
import router from '../../router';

// slideshow off always / turn on with button click on photo component
// does the state of the gallery need to be here too?

// initial state
const state = {
	gallery: {},
	galleryIndex: 0,
  galleryInfo: false,
  slideshow: false,
  prevPhoto: false,
  nextPhoto: false
};

// getters
const getters = {
  slideshow: state => state.slideshow,
  prevPhoto: state => state.prevPhoto,
  nextPhoto: state => state.nextPhoto,
  gallery: state => state.gallery,
  galleryInfo: state => state.galleryInfo,
  galleryIndex: state => state.galleryIndex
};

// actions
const actions = {};

// mutations
const mutations = {
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
    console.log(state.galleryInfo);
  },
};

export default {
  state,
  getters,
  actions,
  mutations
};
