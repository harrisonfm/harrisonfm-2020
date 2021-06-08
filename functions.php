<?php
// Useful global constants
define( 'HFM_VERSION',      '2.0' );
define( 'HFM_URL',          get_stylesheet_directory_uri() );
define( 'HFM_TEMPLATE_URL', get_template_directory_uri() );
define( 'HFM_PATH',         get_template_directory() . '/' );
define( 'HFM_INC',          HFM_PATH . 'includes/' );

// Include compartmentalized functions
require_once HFM_INC . 'core.php';
require_once HFM_INC . 'api.php';
require_once HFM_INC . 'taxonomies.php';

hfm\Core\setup();
hfm\Api\setup();
hfm\Taxonomies\setup();

//add_feed cannot handle namespaces
function add_custom_feed() {
  add_feed( 'feed/harrigrams', 'render_harrigrams_feed');
}
 
function render_harrigrams_feed() {
  // Set right headers for RSS Feed
  header( 'Content-Type: application/rss+xml' );

  // Get main WP Query
  global $wp_query;

  // Overwrite main WP Query with yours
  $wp_query = new WP_Query(
    array(
      'post_type' => 'attachment',
      'post_status' => 'any',
      'meta_query' => array(
        array(
          'key'     => 'harrigram',
          'value'   => 1
        ),
      )
    )
  );

  // Use the basic template to load your custom RSS Feed
  get_template_part( 'rss', 'harrigrams' );
}
add_action( 'init', 'add_custom_feed' );