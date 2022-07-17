import _ from "lodash";
import Vue from "vue";
import Router from "vue-router";

// Components
import ErrorPage from "~/components/Page/ErrorPage.vue";
import Post from "~/components/Post/Post.vue";
import Page from "~/components/Page/Page.vue";
import Photo from "~/components/Photo.vue";
import Photos from "~/components/Photos.vue";
import PhotosHome from "~/components/Photos/Home.vue";
import PhotosGallery from "~/components/Photos/GalleryPage.vue";
import PostsPage from "~/components/PostsPage.vue";

import Stories from "~/components/Story/Home.vue";
import Story from "~/components/Story/Story.vue";

Vue.use(Router);

const paged = [{ path: "p/:page" }];

const router = new Router({
  routes: [
    {
      path: "/",
      name: 'Home',
      component: PostsPage,
      alias: '/blog',
      props: route => ({
        page: route.params.page,
        type: 'home',
      }),
      children: paged
    },
    {
      path: "/category/:category",
      name: "Category",
      component: PostsPage,
      props: route => ({
        page: route.params.page,
        type: 'category',
        slug: route.params.category
      }),
      children: paged
    },
    {
      path: "/tag/:tag",
      name: "Tag",
      component: PostsPage,
      props: route => ({
        page: route.params.page,
        type: 'tag',
        slug: route.params.tag
      }),
      children: paged
    },
    {
      path: "/search/:search",
      name: "Search",
      component: PostsPage,
      props: route => ({
        page: route.params.page,
        type: 'search',
        slug: route.params.search
      }),
      children: paged
    },
    {
      path: "/stories",
      name: "Stories",
      component: Stories,
    },
    {
      path: '/stories/:storySlug',
      name: "Story",
      component: Story,
      props: true
    },
    {
      path: "/photos",
      component: Photos,
      children: [
        {
          path: "/",
          name: 'PhotosHome',
          component: PhotosHome
        },
        {
          path: ":gallerySlug",
          name: 'PhotosGallery',
          component: PhotosGallery,
          props: true,
          children: [
            {
              path: ":idSlug",
              name: "PhotosSingle",
              component: Photo,
              props: true
            }
          ]
        }
      ]
    },
    {
      path: "/harrigrams",
      name: "Harrigrams",
      component: Page,
      props: route => ({
        pageSlug: 'harrigrams',
      }),
      children: [
        {
          path: ":idSlug",
          name: 'Harrigram',
          component: Photo,
          props: true
        }
      ]
    },
    {
      path: "/:year/:postSlug",
      name: "Post",
      component: Post,
      props: true,
      children: [
        {
          path: ":idSlug",
          name: 'PostPhoto',
          component: Photo,
          props: true
        }
      ]
    },
    {
      path: "/:pageSlug",
      name: "Page",
      component: Page,
      props: true
    }
  ],
  mode: "history",
  base: "",

  // Prevents window from scrolling back to top
  // when navigating between components/views
  scrollBehavior(to, from, savedPosition) {
    if(to.name === "PostPhoto" || (to.name === "Post" && from.name === "PostPhoto") ||
      to.name === "PhotosSingle" || (to.name === "PhotosGallery" && from.name === "PhotosSingle") ||
      to.name === "Harrigram" || (to.name === "Harrigrams" && from.name === "Harrigram")) {
      return null;
    }
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  }
});

router.afterEach((to, from) => {
  console.log(to.params[0]);
});

function getRoutesList(routes, pre) {
  return routes.reduce((array, route) => {
    const path = `${pre}${route.path}`;

    if (route.path !== '*' && route.path.indexOf(':') === -1 && route.name !== 'PhotosHome') {
      array.push(path);
    }

    if (route.children) {
      array.push(...getRoutesList(route.children, `${path}/`));
    }

    return array;
  }, []);
}

function getRoutesXML() {
  const list = getRoutesList(router.options.routes, 'https://harrisonfm.com')
    .map(route => `<url><loc>${route}</loc></url>`)
    .join('\r\n');
  return `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
    ${list}
  </urlset>`;
}

export default router;
