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
  galleryIndex: state => state.galleryIndex
};

// actions
const actions = {
  setSlideshow({ commit }, payload) {
    commit(types.PHOTO_SLIDESHOW, payload);
  },
  setPrevPhoto({ commit }, photo) {
    commit(types.PREV_PHOTO, photo);
  },
  setNextPhoto({ commit }, photo) {
  	console.log('set next photo action');
    commit(types.NEXT_PHOTO, photo);
  },
  setGallery({ commit }, payload) {
  	return new Promise((resolve, reject) => {
	  	commit(types.GALLERY, payload.gallery);
	  	commit(types.GALLERY_INDEX, payload.idx);

	    if(payload.idx > 0) {
	      commit(types.PREV_PHOTO, payload.gallery[payload.idx - 1]);
	    }
	    else {
	      commit(types.PREV_PHOTO, payload.gallery[payload.gallery.length - 1]);
	    }

	    if(payload.idx < payload.gallery.length - 1) {
	      commit(types.NEXT_PHOTO, payload.gallery[payload.idx + 1]);
	    }
	    else {
	      commit(types.NEXT_PHOTO, payload.gallery[0]);
	    }
  	});
  }
};

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

  [types.PREV_PHOTO](state, photo) {
    state.prevPhoto = photo;
  },

  [types.NEXT_PHOTO](state, photo) {
    state.nextPhoto = photo;
  },

  [types.GALLERY](state, gallery) {
    state.gallery = gallery;
  },

  [types.GALLERY_INDEX](state, index) {
  	console.log('mutate gal index', index);
    state.galleryIndex = index;
  },
};

export default {
  state,
  getters,
  actions,
  mutations
};
