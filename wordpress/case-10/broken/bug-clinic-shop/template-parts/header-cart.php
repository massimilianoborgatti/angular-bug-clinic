<?php
if (!defined('ABSPATH')) { exit; }
?>
<div class="site-header-cart" aria-live="polite">
    <?php echo clinic_cart_markup(); // Markup escapes each dynamic value. ?>
</div>
