<?php
namespace hfm\Api;

function setup() {
  global $n;
  $n = function( $function ) {
    return __NAMESPACE__ . "\\$function";
  };

  add_action('rest_api_init', $n('register_rest_routes'));

  add_filter('acf/rest_api/post/get_fields', function ($data) {
    if (!isset($data) || !isset($data["acf"])) {
      return $data;
    }

    // Here add the possible field names that might be a type of an attachment, needs to be tested
    $fieldNames = ["background", "image"];
    // Loop through them and add key acf with the custom fields
    foreach ($fieldNames as $fieldName) {
      if (isset($data->acf) && isset($data->acf[$fieldName]) && is_array($data->acf[$fieldName])) {
        $data->acf[$fieldName]['acf'] = get_fields($data->acf[$fieldName]["id"]);
        $data->acf[$fieldName]['acf']['likes'] = $data->acf[$fieldName]['acf']['likes'] ? $data->acf[$fieldName]['acf']['likes'] : 0;
      }
    };

    //gallery override, not sure if the first foreach loop is needed
    if (isset($data['acf']) && isset($data['acf']['gallery'])) {
      foreach($data['acf']['gallery'] as &$galleryItem) {
        $galleryItem['acf'] = get_fields($galleryItem["id"]);
        $galleryItem['acf']['likes'] = $galleryItem['acf']['likes'] ? $galleryItem['acf']['likes'] : 0;
      }
    }

    return $data;
  }, 10, 3);

  function likeMedia($request) {
    if($request['likes'] < 0) {
      $request['likes'] = 0;
    }
    if(update_field('likes', $request['likes'], $request['id'])) {
      return true;
    }
    return false;
  }

  function getPostsByType($request) {
    $args = array(
      'posts_per_page' => $request['per_page'] ? $request['per_page'] : 8,
      'paged' => $request['page'] ? $request['page'] : 1,
      'ignore_sticky_posts' => 1
    );

    if($request['category']) {
      $args['category_name'] = $request['category'];
    }
    elseif($request['tag']) {
      $args['tag'] = $request['tag'];
    }
    elseif($request['search']) {
      $args['s'] = $request['search'];
    }


    $query = new \WP_Query($args);
    formatPostsForApi($query->posts);

    return new \WP_REST_Response($query);
  }

  function getPost($request) {
    $args = array(
      'name' => $request['slug']
    );

    $query = new \WP_Query($args);
    formatPostsForApi($query->posts);
    
    return new \WP_REST_Response($query->posts);
  }

  function getPage($request) {
    $args = array(
      'pagename' => $request['slug']
    );

    $query = new \WP_Query($args);
    formatPostsForApi($query->posts);
    
    return new \WP_REST_Response($query->posts);
  }

  function getHome() {
    $return = array(
      'hero' => get_header_image()
    );
    
    return new \WP_REST_Response($return);
  }

  function formatPostsForApi(&$posts) {
    foreach($posts as $post) {
      $post->acf = get_fields($post->ID);
      if(isset($post->acf['gallery'])) {
        foreach($post->acf['gallery'] as &$galleryItem) {
          $galleryItem['acf'] = array();
          $likes = get_field('likes', $galleryItem['id']);
          $galleryItem['acf']['likes'] = $likes ? $likes : 0;
        }
      }
      $post->link = str_replace(network_site_url(), '', get_permalink($post->ID));

      $post->categories = array();
      $cats = wp_get_post_categories($post->ID);
      foreach($cats as $c){
        $post->categories[] = get_category($c);
      }

      $post->post_date = date_format(date_create($post->post_date), 'M jS, Y');

      $post->post_content = apply_filters('the_content', $post->post_content);

      $post->tags = wp_get_post_terms($post->ID);

      $media = new \WP_Query(array(
        'p' => get_post_thumbnail_id($post->ID),
        'post_type' => 'attachment'
      ));

      if($media->posts) {
        $post->featured = array_merge((array) $media->posts[0], wp_get_attachment_metadata(get_post_thumbnail_id($post->ID)));
      }
    }
  }

  function getMedia() {
    //todo get media item with custom call.. may be less buggy
  }

  function getSiteMeta() {
    $custom_logo_id = get_theme_mod('custom_logo');
    $logo = wp_get_attachment_image_src($custom_logo_id , 'full');
    return new \WP_REST_Response(array(
      'title' => get_bloginfo('name'),
      'tagline' => get_bloginfo('description'),
      'url' => get_bloginfo('url'),
      'img' => $logo
    ));
  }

  function getStories() {
    $args = array(
      'taxonomy' => 'story',
      'orderby' => 'name',
      'order' => 'ASC'
    );
    $query = new \WP_Term_Query($args);
    $terms = $query->get_terms();

    foreach($terms as &$term) {
      $term->image = get_field('banner_image', 'story_'.$term->term_id);
    }

    return new \WP_REST_Response(array(
      'stories' => $terms
    ));
  }

  function getStory($request) {

  }

  function register_rest_routes() {
    global $n;
    register_rest_route('hfm/v1', '/media/(?P<id>\d+)/like', array(
      'methods' => 'PUT',
      'callback' => $n('likeMedia'),
      'permission_callback' => '__return_true'
    ));

    register_rest_route('hfm/v1', '/posts', array(
      'methods' => 'GET',
      'callback' => $n('getPostsByType'),
      'permission_callback' => '__return_true'
    ));

    register_rest_route('hfm/v1', '/post', array(
      'methods' => 'GET',
      'callback' => $n('getPost'),
      'permission_callback' => '__return_true'
    ));

    register_rest_route('hfm/v1', '/page', array(
      'methods' => 'GET',
      'callback' => $n('getPage'),
      'permission_callback' => '__return_true'
    ));

    register_rest_route('hfm/v1', '/media', array(
      'methods' => 'GET',
      'callback' => $n('getMedia'),
      'permission_callback' => '__return_true'
    ));

    register_rest_route('hfm/v1', '/sitemeta', array(
      'methods' => 'GET',
      'callback' => $n('getSiteMeta'),
      'permission_callback' => '__return_true'
    ));

    register_rest_route('hfm/v1', '/home', array(
      'methods' => 'GET',
      'callback' => $n('getHome'),
      'permission_callback' => '__return_true'
    ));

    register_rest_route('hfm/v1', '/stories', array(
      'methods' => 'GET',
      'callback' => $n('getStories'),
      'permission_callback' => '__return_true'
    ));

    register_rest_route('hfm/v1', '/story', array(
      'methods' => 'GET',
      'callback' => $n('getStory'),
      'permission_callback' => '__return_true'
    ));    
  }
}