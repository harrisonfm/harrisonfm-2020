<?php
namespace hfm\Taxonomies;

function setup() {
  $n = function($function) {
    return __NAMESPACE__ . "\\$function";
  };

  add_action('init', $n('register_stories'));
}

function register_stories() {
  $singular = 'Story';
  $plural = 'Stories';

  $labels = array (
    "name"              => __("$plural"),
    "singular_name"     => __("$singular"),
    "search_items"      => __("Search $plural"),
    "all_items"         => __("All $plural"),
    "parent_item"       => __("Parent $singular"),
    "edit_item"         => __("Edit $singular"),
    "update_item"       => __("Update $singular"),
    "add_new_item"      => __("Add New $singular"),
    "new_item_name"     => __("New $singular Name"),
    "menu_name"         => __("$plural"),
  );

  $args = array (
    'hierarchical'      => true,
    'labels'            => $labels,
    'show_admin_column' => true,
    'query_var'         => true,
    'show_in_rest'      => true,
    'rewrite'           => array( 'slug' => 'stories' ),
    'public'            => true
  );

  register_taxonomy('story', array('post'), $args);
}