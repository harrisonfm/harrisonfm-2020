//Matomo Analytics
//https://developer.matomo.org/guides/tracking-javascript-guide
//https://developer.matomo.org/guides/spa-tracking

export default {
  trackPageView: function(title = document.title) {
    console.log('analytics - ' + title, location.href);
    _paq.push(['setCustomUrl', location.href]);
    _paq.push(['setDocumentTitle', title]);
    _paq.push(['trackPageView']);
  }
};
