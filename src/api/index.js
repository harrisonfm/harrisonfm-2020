import axios from "axios";
import SETTINGS from "../settings";

export default {
  getCategories(cb) {
    axios
      .get(SETTINGS.API_BASE_PATH + "categories?sort=name&hide_empty=true&per_page=50")
      .then(response => {
        console.log(response.data);
        cb(response.data.filter(c => c.name !== "Uncategorized"));
      })
      .catch(e => {
        cb(e);
      });
  },

  getPage(slug, cb) {
    axios
      .get(`${SETTINGS.API_BASE_PATH}pages?slug=${slug}`)
      .then(response => {
        cb(response.data);
      })
      .catch(e => {
        cb(e);
      });
  },

  getPosts(params, cb) {
    console.log('api getposts',params);
    axios
      .get(`${SETTINGS.API_CUSTOM}posts`, {
        params: params
      })
      .then(response => {
        cb(response.data);
      })
      .catch(e => {
        cb(e);
      });
  },

  getPost(slug, cb) {
    console.log('api getpost single');
    axios
      .get(`${SETTINGS.API_CUSTOM}post?slug=${slug}`)
      .then(response => {
        cb(response.data);
      })
      .catch(e => {
        cb(e);
      });
  },

  getPhoto(id, cb) {
    axios
      .get(`${SETTINGS.API_BASE_PATH}media/${id}`)
      .then(response => {
        let photo = response.data;
        photo.title = response.data.title.rendered;
        photo.url = response.data.media_details.sizes.full.source_url;
        photo.caption = response.data.caption.rendered;
        cb(photo);
      })
      .catch(e => {
        console.log(e);
      });
  },

  getSitemeta(cb) {
    axios
      .get(`${SETTINGS.API_CUSTOM}sitemeta`)
      .then(response => {
        cb(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  },

  like(photo, likes, cb) {
    console.log('like photo api', photo, likes);
    axios
      .put(`${SETTINGS.API_CUSTOM}media/${photo}/like`, {likes: likes})
      .then(response => {
        cb(response.data);
      })
      .catch(e => {
        cb(e);
      });
  },

  getMenu(menu, cb) {
    axios
      .get('/wp-json/menus/v1/menus/'+menu)
      .then(response => {
        cb(response.data);
      })
      .catch(error => console.log('menu not working'));
  }
};
