import api from './api';

export default {
	apiCalled: false,
	default: {
		title: 'HarrisonFM',
		tagline: 'Adventure, Photography, and Coding',
		desc: 'Harrison June is an American adventure photographer, writer and coder based in Arizona.',
		img: 'img.png',
	},
	setDefaults: function() {
		if(this.apiCalled) {
			return;
		}

		api.getSitemeta((response) => {
			if(response.title) {
				this.default.title = response.title;
			}
			if(response.tagline) {
				this.default.tagline = response.tagline;
			}
			if(response.img) {
				this.default.img = response.img;
			}
			this.apiCalled = true;
		});
	},
	formatMeta: function(title, desc, img, author) {
		this.setDefaults();

		desc = desc ? desc : this.default.desc;
		img = img ? img['1536x1536'].src : this.default.img;
    const url = window.location.href;

		console.log('formatMeta', title, desc, img, url);

    let metaObj = {
      title: title ? title + ' - ' + this.default.title : this.default.title + ' - ' + this.default.tagline,
      meta: [
        {
          vmid: 'description',
          property: 'description',
          name: 'description',
          content: desc
        },
        {
          vmid: 'image',
          property: 'image',
          name: 'image',
          content: img
        },
        {
          vmid: 'og:title',
          property: 'og:title',
          name: 'og:title',
          content: title ? title : this.default.title + ' - ' + this.default.tagline
        },
        {
          vmid: 'og:description',
          property: 'og:description',
          name: 'og:description',
          content: desc
        },
        {
          vmid: 'og:url',
          property: 'og:url',
          name: 'og:url',
          content: url
        },
        {
          vmid: 'og:image',
          property: 'og:image',
          name: 'og:image',
          content: img
        },
        {
          vmid: 'twitter:title',
          property: 'twitter:title',
          name: 'twitter:title',
          content: title ? title : this.default.title + ' - ' + this.default.tagline
        },
        {
          vmid: 'twitter:description',
          property: 'twitter:description',
          name: 'twitter:description',
          content: desc
        },
        {
          vmid: 'twitter:url',
          property: 'twitter:url',
          name: 'twitter:url',
          content: url
        },
        {
          vmid: 'twitter:image',
          property: 'twitter:image',
          name: 'twitter:image',
          content: img
        },
        {
          vmid: 'fragment',
          name: "fragment",
          content: "!"
        }
      ]
    };

    if(author) {
      metaObj.meta.push({
        vmid: 'author',
        name: 'author',
        content: "Harrison June"
      });
    }

		return metaObj;
	}
};
