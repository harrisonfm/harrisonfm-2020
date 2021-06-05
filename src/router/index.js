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
      props: true,
      children: [
        {
          path: ":idSlug",
          name: 'Harrigram',
          component: Photo,
          props: true
        }
      ]
    }
  ],
  mode: "history",
  base: "",

  // Prevents window from scrolling back to top
  // when navigating between components/views
  scrollBehavior(to, from, savedPosition) {
    if(to.name === "PostPhoto" || 
      to.name === "PhotosSingle" || 
      to.name === "Harrigram" || 
      (to.name === "Post" && from.name === "PostPhoto") || 
      (to.name === "PhotosGallery" && from.name === "PhotosSingle") ||
      (to.name === "Page" && from.name === "Harrigram")) {
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
  // Add a body class specific to the route we're viewing
  let body = document.querySelector("body");
  let bodyClasses = body.className.split(" ");

  if (bodyClasses.length > 0) {
    const newBodyClasses = bodyClasses.filter(theClass =>
      theClass.startsWith("vue--page--")
    );
  }

  console.log(to);

  const slug = _.isEmpty(to.params.postSlug)
    ? to.params.pageSlug
    : to.params.postSlug;
  body.classList.add("vue--page--" + slug);
});

export default router;
