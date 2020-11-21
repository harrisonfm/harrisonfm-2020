import axios from "axios";
import SETTINGS from "../settings";

export default {
  getCategories(cb) {
    axios
      .get(
        SETTINGS.API_BASE_PATH +
          "categories?sort=name&hide_empty=true&per_page=50"
      )
      .then(response => {
        cb(response.data.filter(c => c.name !== "Uncategorized"));
      })
      .catch(e => {
        cb(e);
      });
  },

  getPages(cb) {
    axios
      .get(SETTINGS.API_BASE_PATH + "pages?per_page=10")
      .then(response => {
        cb(response.data);
      })
      .catch(e => {
        cb(e);
      });
  },

  getPage(id, cb) {
    axios
      .get(SETTINGS.API_BASE_PATH + "pages/" + id)
      .then(response => {
        cb(response.data);
      })
      .catch(e => {
        cb(e);
      });
  },

  getPosts(limit = 8, page = 1, cb) {
    axios
      .get(`${SETTINGS.API_BASE_PATH}posts?_embed&page=${page}&per_page=${limit}`)
      .then(response => {
        cb(response.data);
      })
      .catch(e => {
        cb(e);
      });
  },

  getPhoto(id, cb) {
    console.log('getPhoto API', id);
    axios
      .get(
        SETTINGS.API_BASE_PATH + "media/" + id
      )
      .then(response => {
        let photo = response.data;
        photo.title = response.data.title.rendered;
        photo.url = response.data.media_details.sizes.full.source_url;
        cb(photo);
      })
      .catch(e => {
        console.log(e);
      });
  },

  like(photo, likes, cb) {
    console.log('api', photo, likes);
    axios
      .put(
        SETTINGS.API_CUSTOM + 'media/'+photo+'/like', {likes: likes}
      )
      .then(response => {
        cb(response.data);
      })
      .catch(e => {
        cb(e);
      });
  }
};
