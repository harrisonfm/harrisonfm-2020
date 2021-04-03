<?php status_header(200); ?>
<!DOCTYPE html>
<html <?php language_attributes(); ?> class="no-js no-svg">

  <head>
    <script> window.prerenderReady = false; </script>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta property="twitter:card" content="summary_large_image">
    <link rel="profile" href="http://gmpg.org/xfn/11">
    <link rel="shortcut icon" href="<?php echo get_stylesheet_directory_uri(); ?>/dist/img/bolt.svg" />
    <?php wp_head(); ?>
  </head>

  <body <?php body_class('bg-gray-200 overflow-x-hidden'); ?>>