(function (global) {
  'use strict';

  // Clipboard helper with a compatibility fallback for environments where the
  // async Clipboard API is not available.
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }

    return new Promise(function (resolve, reject) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
        document.execCommand('copy');
        document.body.removeChild(textarea);
        resolve();
      } catch (error) {
        document.body.removeChild(textarea);
        reject(error);
      }
    });
  }

  function initSourcesPage() {
    document.querySelectorAll('[data-copy-source]').forEach(function (button) {
      button.addEventListener('click', function () {
        const selector = button.getAttribute('data-copy-source');
        const target = document.querySelector(selector);
        if (!target) {
          return;
        }

        const originalText = button.innerHTML;
        copyText(target.textContent.trim()).then(function () {
          button.classList.add('copied');
          button.textContent = 'Copied';
          window.setTimeout(function () {
            button.classList.remove('copied');
            button.innerHTML = originalText;
          }, 1600);
        }).catch(function () {
          button.textContent = 'Copy failed';
          window.setTimeout(function () {
            button.innerHTML = originalText;
          }, 1600);
        });
      });
    });
  }

  global.initSourcesPage = initSourcesPage;
})(typeof window !== 'undefined' ? window : this);
