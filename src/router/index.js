import _ from "lodash";
import Vue from "vue";
import Router from "vue-router";

// Components
import Home from "../components/Home.vue";
import Category from "../components/Category.vue";
import Tag from "../components/Tag.vue";
import Search from "../components/Search.vue";
import ErrorPage from "../components/Page/ErrorPage.vue";
import Post from "../components/Post/Post.vue";
import Page from "../components/Page/Page.vue";
import Photo from "../components/Photo/Photo.vue";

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home,
      alias: '/blog',
      children: [
        {
          path: "p/:page"
        }
      ]
    },
    {
      path: "/category/:category",
      name: "Category",
      component: Category,
      children: [
        {
          path: "p/:page"
        }
      ]
    },
    {
      path: "/tag/:tag",
      name: "Tag",
      component: Tag,
      children: [
        {
          path: "p/:page"
        }
      ]
    },
    {
      path: "/search/:search",
      name: "Search",
      component: Search,
      children: [
        {
          path: "p/:page"
        }
      ]
    },
    {
      path: "/photo/:idSlug",
      name: "PhotoViewer",
      component: Photo
    },
    {
      path: "/:year/:postSlug",
      name: "Post",
      component: Post,
      children: [
        {
          path: "photo/:idSlug",
          name: 'Photo',
          component: Photo
        }
      ]
    },
    {
      path: "/:pageSlug",
      name: "Page",
      component: Page
    }
  ],
  mode: "history",
  base: "",

  // Prevents window from scrolling back to top
  // when navigating between components/views
  scrollBehavior(to, from, savedPosition) {
    if(to.name === "Photo" || 
      (to.name === "Post" && from.name === "Photo")) {
      return false;
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

  if(to.name === "Photo") {
    body.classList.add('overflow-hidden');
  }
  else if(from.name === "Photo") {
    body.classList.remove('overflow-hidden'); 
  }

  const slug = _.isEmpty(to.params.postSlug)
    ? to.params.pageSlug
    : to.params.postSlug;
  body.classList.add("vue--page--" + slug);
});

export default router;
