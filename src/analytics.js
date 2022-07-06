//Matomo Analytics
//https://developer.matomo.org/guides/tracking-javascript-guide
//https://developer.matomo.org/guides/spa-tracking

export default {
  trackPageView: function(title = document.title) {         
    if(!_paq) return;
    console.log('analytics - pageview - ' + title, location.href);
    _paq.push(['setCustomUrl', location.href]);
    _paq.push(['setDocumentTitle', title]);
    _paq.push(['trackPageView']);
    _paq.push(['enableLinkTracking']);
  },

  trackEvent: function(category, action, name = '', value = '') {
    console.log('analytics - event - ', category, action, name, value);
    if(!_paq) return;
    let trackingArray = ['trackEvent', category, action];
    if(name) {
      trackingArray.push(name);
    }
    if(value) {
      trackingArray.push(value);
    }
    _paq.push(trackingArray);
  },

  optOut: function() {
    if(!_paq) return;
    _paq.push(['optUserOut']);
  }
};
