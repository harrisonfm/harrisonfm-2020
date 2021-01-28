import api from './api';

export default {
	apiCalled: false,
	default: {
		title: 'HarrisonFM',
		tagline: 'Adventure, Photography, and Coding',
		desc: 'Harrison June is an American adventure photographer, writer and coder based in Arizona.',
		img: 'img.png',
		url: 'https://harrisonfm.com'
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
				this.default.img = response.img[0];
			}
			if(response.url) {
				this.default.url = response.url;
			}
			this.apiCalled = true;
		});
	},
	formatMeta: function(title, desc, img, url) {
		this.setDefaults();

		desc = desc ? desc : this.default.desc;
		img = img ? img : this.default.img;
		url = url ? url : this.default.url;

		console.log('formatMeta', title, desc);

		return {
			title: title ? title + ' - ' + this.default.title : this.default.title + ' - ' + this.default.tagline,
			meta: [
				{
					vmid: 'description',
					name: 'description',
					content: desc
				},
				{
					vmid: 'image',
					name: 'image',
					content: img
				},
				{
					vmid: 'og:title',
					name: 'og:title',
					content: title ? title : this.default.title + ' - ' + this.default.tagline
				},
				{
					vmid: 'og:description',
					name: 'og:description',
					content: desc
				},
				{
					vmid: 'og:url',
					name: 'og:url',
					content: url
				},
				{
					vmid: 'og:image',
					name: 'og:image',
					content: img
				},
				{
					vmid: 'twitter:title',
					name: 'twitter:title',
					content: title ? title : this.default.title + ' - ' + this.default.tagline
				},
				{
					vmid: 'twitter:description',
					name: 'twitter:description',
					content: desc
				},
				{
					vmid: 'twitter:url',
					name: 'twitter:url',
					content: url
				},
				{
					vmid: 'twitter:image',
					name: 'twitter:image',
					content: img
				},
			]
		};
	}
};
