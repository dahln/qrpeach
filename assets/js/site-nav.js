(function () {
  var mobileBreakpoint = window.matchMedia('(max-width: 767px)');

  document.documentElement.classList.add('has-nav-toggle');

  function syncHeader(header, expanded) {
    var toggle = header.querySelector('[data-nav-toggle]');

    header.classList.toggle('nav-open', expanded);

    if (toggle) {
      toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    }
  }

  function closeOnDesktop(header) {
    if (!mobileBreakpoint.matches) {
      syncHeader(header, false);
    }
  }

  document.querySelectorAll('.site-header').forEach(function (header) {
    var toggle = header.querySelector('[data-nav-toggle]');

    if (!toggle) {
      return;
    }

    syncHeader(header, false);

    toggle.addEventListener('click', function () {
      var expanded = toggle.getAttribute('aria-expanded') === 'true';
      syncHeader(header, !expanded);
    });

    mobileBreakpoint.addEventListener('change', function () {
      closeOnDesktop(header);
    });

    closeOnDesktop(header);
  });
})();