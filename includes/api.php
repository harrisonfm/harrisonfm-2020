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
      'post_type' => 'post',
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
      'name' => $request['slug'],
      'post_type' => 'post',
      'post_status' => 'publish'
    );

    $query = new \WP_Query($args);
    formatPostForApi($query->posts[0]);
    
    return new \WP_REST_Response($query->posts);
  }

  function getPage($request) {
    $args = array(
      'pagename' => $request['slug'],
      'post_type' => 'page'
    );

    $query = new \WP_Query($args);

    if(!empty($query->posts)) {
      $page = $query->posts[0];
      formatPostForApi($page);
      if($page->post_name === 'photos') {
        $page->stories = getStories(false, true);
      }
    }
    else {
      $page = false;
    }
    
    return new \WP_REST_Response($page);
  }

  function getHome() {
    $data = get_object_vars(get_theme_mod('header_image_data'));

    return new \WP_REST_Response(array(
      'hero' => getAttachment($data['attachment_id'])
    ));
  }

  function formatPostsForApi(&$posts) {
    foreach($posts as $post) {
      formatPostForApi($post);
    }
  }

  function formatPostForApi(&$post, $ignoreStories = false) {
    $post->acf = get_fields($post->ID);

    if(isset($post->acf['gallery'])) {
      $gallery = new \WP_Query(array(
        'post_type' => 'attachment',
        'post_status' => 'any',
        'order' => 'ASC',
        'orderby'   => 'meta_value_num',
        'meta_key'  => 'wpmf_order',
        'posts_per_page' => -1,
        'tax_query' => array(
          array(
            'taxonomy' => 'wpmf-category',
            'terms'    => $post->acf['gallery'][0],
            'include_children' => false
          ),
        ),
      ));
      formatGalleryImages($gallery->posts);
      $post->gallery = $gallery->posts;
      unset($post->acf['gallery']);
    }

    if(isset($post->acf['genres'])) {
      foreach($post->acf['genres'] as &$genre) {
        $genre['image'] = getAttachment($genre['image']);
        formatGalleryImages($genre['gallery'], true);
        $genre['slug'] = strtolower(str_replace(' ', '-', $genre['name']));
      }

      $post->genres = $post->acf['genres'];
    }

    if(isset($post->acf['projects'])) {
      foreach($post->acf['projects'] as &$project) {
        $project['image'] = getAttachment($project['image']);
      }

      $post->projects = $post->acf['projects'];
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

    if($featuredMediaID = get_post_thumbnail_id($post->ID)) {
      $featuredMedia = new \WP_Query(array(
        'p' => $featuredMediaID,
        'post_type' => 'attachment',
        'post_status' => 'any'
      ));

      if($featuredMedia->posts) {
        formatGalleryImages($featuredMedia->posts);
        $post->featured = $featuredMedia->posts[0];
      }
    }

    if(!$ignoreStories) { //recursive to get next/prev navigation on story posts
      $postStories = wp_get_object_terms($post->ID, 'story');
      if($postStories) {
        $post->story = $postStories[0];

        $args = array(
          'post_type' => 'post',
          'order' => 'DESC',
          'posts_per_page' => -1,

          'tax_query' => array(
            array(
              'taxonomy' => 'story',
              'field'    => 'slug',
              'terms'    => $post->story->slug,
            ),
          ),
        );
        $query = new \WP_Query($args);
        $postsInStory = $query->posts;

        for($i = 0; $i < count($postsInStory); $i++) {
          if($postsInStory[$i]->ID === $post->ID) {
            if($i !== 0) {
              $post->story->prev = $postsInStory[$i - 1];
              formatPostForApi($post->story->prev, true);
            }
            if($i !== count($postsInStory) - 1) {
              $post->story->next = $postsInStory[$i + 1];
              formatPostForApi($post->story->next, true);
            }
            break;
          }
        }
      }
    }
  }

  function formatGalleryImages(&$galleryItems, $getPost = false) {
    $imageSizes = wp_get_registered_image_subsizes();
    $imageSizes['full'] = 'full';

    foreach($galleryItems as &$galleryItem) {
      if($getPost) {
        $galleryItem = get_post($galleryItem);
      }
      $likes = get_field('likes', $galleryItem->ID);
      $galleryItem->likes = $likes ? $likes : 0;
      $galleryItem->images = array();

      foreach($imageSizes as $size => $dimensions) {
        $imageSrc = wp_get_attachment_image_src($galleryItem->ID, $size);

        $galleryItem->images["$size"] = array(
          'src' => $imageSrc[0],
          'width' => $imageSrc[1]
        );
      }
    }
  }

  function getAttachment($id) {
    $query = new \WP_Query(array(
      'p' => $id,
      'post_type' => 'attachment',
      'post_status' => 'any'
    ));

    $attachment = array();

    if($query->posts) {
      formatGalleryImages($query->posts);
      $attachment = $query->posts[0];
    }

    return $attachment;

  }

  function getSiteMeta() {
    return new \WP_REST_Response(array(
      'title' => get_bloginfo('name'),
      'tagline' => get_bloginfo('description'),
      'url' => get_bloginfo('url'),
      'img' => wp_get_attachment_image_src(get_theme_mod('custom_logo'), 'large')[0]
    ));
  }

  function getStories($request, $photosPage = false) {
    $terms = getStoryTerms();

    foreach($terms as &$term) {
      $term->image = getAttachment(get_field('banner_image', 'story_'.$term->term_id));
    }

    if($photosPage) {
      return $terms;
    }
    else{
      return new \WP_REST_Response(array(
        'stories' => $terms,
        'hero' => getAttachment(get_field('stories_hero', 'options'))
      ));
    }
  }

  function getStory($request) {
    $args = array(
      'post_type' => 'post',
      'order' => 'DESC',
      'posts_per_page' => -1,

      'tax_query' => array(
        array(
          'taxonomy' => 'story',
          'field'    => 'slug',
          'terms'    => $request['slug'],
        ),
      ),
    );

    $query = new \WP_Query($args);
    formatPostsForApi($query->posts);

    if($request['queryForTerm']) {
       $args = array(
        'taxonomy' => 'story',
        'slug' => $request['slug']
      );
      $termQuery = new \WP_Term_Query($args);
      $terms = $termQuery->get_terms();
      
      foreach($terms as &$term) {
        $term->image = getAttachment(get_field('banner_image', 'story_'.$term->term_id));
      }
      $query->term = $terms[0];
    }

    return new \WP_REST_Response($query);
  }

  function getStoryMedia($request) {
    $terms = getStoryTerms();
    $currentTerm = false;
    foreach ($terms as $term) {
      if($term->slug === $request['slug']) {
        $currentTerm = $term;
        break;
      }
    }
    if(!$currentTerm) {
      return new \WP_REST_Response(array(
        'media' => false
      ));
    }

    $args = array(
      'post_type' => 'attachment',
      'post_status' => 'any',
      'order' => 'ASC',
      'orderby'   => 'meta_value_num',
      'meta_key'  => 'wpmf_order',
      'posts_per_page' => -1,
      'tax_query' => array(
        array(
          'taxonomy' => 'wpmf-category',
          'field' => 'slug',
          'terms'    => $request['slug'],
          'include_children' => true
        ),
      ),
    );
    $query = new \WP_Query($args);

    formatGalleryImages($query->posts);

    return new \WP_REST_Response(array(
      'media' => $query->posts,
      'term' => $currentTerm
    ));
  }

  function getStoryTerms() {
    $args = array(
      'taxonomy' => 'story',
      'orderby' => 'name',
      'order' => 'ASC'
    );
    $query = new \WP_Term_Query($args);
    return $query->get_terms();
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

    register_rest_route('hfm/v1', '/storymedia', array(
      'methods' => 'GET',
      'callback' => $n('getStoryMedia'),
      'permission_callback' => '__return_true'
    ));
  }
}