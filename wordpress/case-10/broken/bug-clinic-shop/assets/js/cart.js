jQuery(function ($) {
  function stop($button) {
    $button.removeClass('clinic-pending').removeAttr('aria-busy');
  }
  $(document.body).on('adding_to_cart.clinic', function (_event, $button) {
    $button.addClass('clinic-pending').attr('aria-busy', 'true');
  });
  const badge = document.querySelector('.clinic-cart-count');
  if (badge) {
    const before = badge.textContent;
    new MutationObserver(function () {
      if (badge.textContent !== before) stop($('.clinic-pending'));
    }).observe(badge, { childList: true, characterData: true, subtree: true });
  }
});
