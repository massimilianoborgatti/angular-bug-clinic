<?php
if (!defined('ABSPATH')) { exit; }

function clinic_cart_class() {
    return 'clinic-header-cart';
}

function clinic_cart_markup() {
    $count = WC()->cart ? WC()->cart->get_cart_contents_count() : 0;
    $total = WC()->cart ? WC()->cart->get_cart_total() : wc_price(0);
    ob_start();
    ?>
    <a class="<?php echo esc_attr(clinic_cart_class()); ?>" href="<?php echo esc_url(wc_get_cart_url()); ?>" aria-label="View cart">
        <span aria-hidden="true">▣</span> Cart
        <span class="clinic-cart-count"><?php echo esc_html((string) $count); ?></span>
        <span class="clinic-cart-total"><?php echo wp_kses_post($total); ?></span>
    </a>
    <?php
    return ob_get_clean();
}

function clinic_header_cart() {
    get_template_part('template-parts/header-cart');
}

add_action('init', function () {
    remove_action('storefront_header', 'storefront_header_cart', 60);
    add_action('storefront_header', 'clinic_header_cart', 60);
    remove_action('storefront_sidebar', 'storefront_get_sidebar', 10);
});

add_filter('woocommerce_add_to_cart_fragments', function ($fragments) {
    $fragments['a.' . clinic_cart_class()] = clinic_cart_markup();
    return $fragments;
});

add_action('wp_enqueue_scripts', function () {
    wp_enqueue_style('clinic-shop', get_stylesheet_uri(), array('storefront-style'), '1.0.0');
    wp_enqueue_script('wc-cart-fragments');
    wp_enqueue_script('clinic-cart', get_stylesheet_directory_uri() . '/assets/js/cart.js', array('jquery', 'wc-add-to-cart', 'wc-cart-fragments'), '1.0.0', true);
}, 20);
