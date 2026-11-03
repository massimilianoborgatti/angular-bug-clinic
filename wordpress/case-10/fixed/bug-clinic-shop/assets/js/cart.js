jQuery(function ($) {
  function stop($button) {
    $button.removeClass('clinic-pending').removeAttr('aria-busy');
  }
  $(document.body).on('adding_to_cart.clinic', function (_event, $button) {
    $button.addClass('clinic-pending').attr('aria-busy', 'true');
  });
  $(document.body).on('added_to_cart.clinic', function (_event, _fragments, _hash, $button) {
    stop($button || $('.clinic-pending'));
  });
  $(document).on('ajaxError.clinic', function (_event, _xhr, settings) {
    if (settings.url.includes('wc-ajax=add_to_cart')) stop($('.clinic-pending'));
  });
  $(document).on('ajaxSuccess.clinic', function (_event, _xhr, settings, response) {
    if (settings.url.includes('wc-ajax=add_to_cart') && response && response.error) {
      stop($('.clinic-pending'));
    }
  });
});
