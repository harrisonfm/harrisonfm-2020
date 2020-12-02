<?php
// Remove all default WP template redirects/lookups
remove_action( 'template_redirect', 'redirect_canonical' );

// Redirect all requests to index.php so the Vue app is loaded and 404s aren't thrown
function remove_redirects() {
	add_rewrite_rule( '^/(.+)/?', 'index.php', 'top' );
}
add_action( 'init', 'remove_redirects' );
register_nav_menu('header-menu', 'hfm');

// Load scripts
function load_vue_scripts() {
	wp_enqueue_script(
		'hfm-js',
		get_stylesheet_directory_uri() . '/dist/scripts/index.js',
		array( 'jquery' ),
		filemtime( get_stylesheet_directory() . '/dist/scripts/index.js' ),
		true
	);

	wp_enqueue_style(
		'hfm-css',
		get_stylesheet_directory_uri() . '/dist/styles.css',
		null,
		filemtime( get_stylesheet_directory() . '/dist/styles.css' )
	);
}
add_action( 'wp_enqueue_scripts', 'load_vue_scripts', 100 );

add_theme_support('post-thumbnails');
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

function hfm_like_media($request) {
  if($request['likes'] < 0) {
    $request['likes'] = 0;
  }
	if(update_field('likes', $request['likes'], $request['id'])) {
    return true;
  }
  return false;
}

function hfm_get_posts_by_type($request) {
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

  $query = new WP_Query($args);
  foreach($query->posts as $post) {
    $post->acf = get_fields($post->ID);
    $post->link = str_replace(network_site_url(), '', get_permalink($post->ID));

    $post->categories = array();
    $cats = wp_get_post_categories($post->ID);
    foreach($cats as $c){
      $cat = get_category($c);
      $post->categories[] = $cat->slug;
    }

    $post->tags = wp_get_post_terms($post->ID);

    $media = new WP_Query(array(
      'p' => get_post_thumbnail_id($post->ID),
      'post_type' => 'attachment'
    ));

    if($media->posts) {
      $post->featured = array_merge((array) $media->posts[0], wp_get_attachment_metadata(get_post_thumbnail_id($post->ID)));
    }
  }
  return new WP_REST_Response($query->posts);
}

add_action( 'rest_api_init', function () {
  register_rest_route( 'hfm/v1', '/media/(?P<id>\d+)/like', array(
    'methods' => 'PUT',
    'callback' => 'hfm_like_media',
  ) );

  register_rest_route( 'hfm/v1', '/posts', array(
    'methods' => 'GET',
    'callback' => 'hfm_get_posts_by_type',
  ) );
} );