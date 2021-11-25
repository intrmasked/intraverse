// handle links with @href started with '#' only
$(document).on('click', '.nav-link', function(e) {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
        var target = $(this.hash);
        if (target.length) {
          e.preventDefault();
          var scrollto = target.offset().top;
          $('html, body').animate({
            scrollTop: scrollto
          }, 1500);
          return false;
        }
      }
});