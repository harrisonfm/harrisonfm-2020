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
		'vuejs-wordpress-theme-starter-js',
		get_stylesheet_directory_uri() . '/dist/scripts/index.js',
		array( 'jquery' ),
		filemtime( get_stylesheet_directory() . '/dist/scripts/index.js' ),
		true
	);

	wp_enqueue_style(
		'vuejs-wordpress-theme-starter-css',
		get_stylesheet_directory_uri() . '/dist/styles.css',
		null,
		filemtime( get_stylesheet_directory() . '/dist/styles.css' )
	);
}
add_action( 'wp_enqueue_scripts', 'load_vue_scripts', 100 );

add_theme_support('post-thumbnails');
add_filter('post_gallery', 'hfmGallery', 10, 2);
function hfmGallery($string, $attr){

    $posts = get_posts(array('include' => $attr['ids'], 'post_type' => 'attachment'));
    //$photos = array();
    $output = "<gallery class=\"gallery\">";

    foreach($posts as $image) {
        $photo = array(
        	'id' => $image->ID,
        	'title' => $image->post_title,
        	'caption' => $image->post_excerpt,
            'description' => $image->post_content,
            'href' => get_permalink($image->ID),
        	'alt' => get_post_meta($image->ID, '_wp_attachment_image_alt', true ),
        	'image' => array(
        		'thumbnail' => wp_get_attachment_image_src($image->ID)[0],
        		'small' => wp_get_attachment_image_src($image->ID, 'small')[0],
		        'medium' => wp_get_attachment_image_src($image->ID, 'medium')[0],
		        'large' => wp_get_attachment_image_src($image->ID, 'large')[0],
		        'full' => wp_get_attachment_image_src($image->ID, 'full')[0]
		    )
	    );
	    $output .= "<img src=".$photo['image']['thumbnail']." v-on:click='test' />";
    }
    $output .= "</gallery>";

    return $output;
}