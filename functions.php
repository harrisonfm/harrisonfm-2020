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

  // Here add the possible field names that might be a type of an attachment
  $fieldNames = ["background", "image"];
  // Loop through them and add key acf with the custom fields
  foreach ($fieldNames as $fieldName) {
    if (isset($data->acf) && isset($data->acf[$fieldName]) && is_array($data->acf[$fieldName])) {
      $data->acf[$fieldName]['acf'] = get_fields($data->acf[$fieldName]["id"]);
    }
  };

  if (isset($data['acf']) && isset($data['acf']['gallery'])) {
  	foreach($data['acf']['gallery'] as &$galleryItem) {
  		$galleryItem['acf'] = get_fields($galleryItem["id"]);
  	}
	}

  return $data;
}, 10, 3);

function like_media($request) {
  if($request['likes'] < 0) {
    $request['likes'] = 0;
  }
	if(update_field('likes', $request['likes'], $request['id'])) {
    return true;
  }
  return false;
}

add_action( 'rest_api_init', function () {
  register_rest_route( 'hfm/v1', '/media/(?P<id>\d+)/like', array(
    'methods' => 'PUT',
    'callback' => 'like_media',
  ) );
} );