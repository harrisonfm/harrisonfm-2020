import axios from "axios";
import SETTINGS from "../settings";

export default {
  getHome(cb) {
    axios
      .get(`${SETTINGS.HFM_THEME}home`)
      .then(response => {
        cb(response.data);
      })
      .catch(e => {
        cb(e);
      });
  },

  getPage(slug, cb) {
    axios
      .get(`${SETTINGS.HFM_THEME}page?slug=${slug}`)
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
      .get(`${SETTINGS.HFM_THEME}posts`, {
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
      .get(`${SETTINGS.HFM_THEME}post?slug=${slug}`)
      .then(response => {
        cb(response.data);
      })
      .catch(e => {
        cb(e);
      });
  },

  // getPhoto(id, cb) {
  //   axios
  //     .get(`${SETTINGS.CORE}media/${id}`)
  //     .then(response => {
  //       let photo = response.data;
  //       photo.title = response.data.title.rendered;
  //       photo.url = response.data.media_details.sizes.full.source_url;
  //       photo.caption = response.data.caption.rendered;
  //       cb(photo);
  //     })
  //     .catch(e => {
  //       console.log(e);
  //     });
  // },

  getSitemeta(cb) {
    axios
      .get(`${SETTINGS.HFM_THEME}sitemeta`)
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
      .put(`${SETTINGS.HFM_THEME}media/${photo}/like`, {likes: likes})
      .then(response => {
        cb(response.data);
      })
      .catch(e => {
        cb(e);
      });
  },

  getMenu(menu, cb) {
    axios
      .get(`${SETTINGS.MENUS}menus/${menu}`)
      .then(response => {
        cb(response.data);
      })
      .catch(error => console.log(error, 'menu not working'));
  },

  getStories(cb) {
    console.log('api getstories');
    axios
      .get(`${SETTINGS.HFM_THEME}stories`)
      .then(response => {
        cb(response.data);
      })
      .catch(e => {
        cb(e);
      });
  },

  getStory(params, cb) {
    console.log('api getstory single', params);
    axios
      .get(`${SETTINGS.HFM_THEME}story`, {
        params: params
      })
      .then(response => {
        cb(response.data);
      })
      .catch(e => {
        cb(e);
      });
  },

  getStoryMedia(params, cb) {
    console.log('api getstorymedia', params);
    axios
      .get(`${SETTINGS.HFM_THEME}storymedia`, {
        params: params
      })
      .then(response => {
        cb(response.data);
      })
      .catch(e => {
        cb(e);
      });
  },

  subscribe(email, cb) {
    console.log('email subscribe', email);
    axios
      .post(`${SETTINGS.MAILCHIMP}subscribe`, {
        email: email.toLowerCase()
      })
      .then(response => {
        cb(response.data);
      })
      .catch(e => {
        cb(e);
      });
  },

  getHarrigrams(params, cb) {
    console.log('api harrigrams', params);
    axios
      .get(`${SETTINGS.HFM_THEME}harrigrams`, {
        params: params
      })
      .then(response => {
        cb(response.data);
      })
      .catch(e => {
        cb(e);
      });
  }
};
