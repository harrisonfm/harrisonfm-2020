export default {
  nonHeroPage: (pageSlug) => {
    return (pageSlug === 'privacy-policy' || pageSlug === 'newsletter') ? true : false
  },
  fullScreen: (routeName) => {
    return (routeName === 'PhotosHome' || routeName === 'PhotosGallery') ? true : false
  }
}