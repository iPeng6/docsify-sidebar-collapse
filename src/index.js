import './style.css';

$docsify.plugins = [
  function(hook, vm) {
    hook.doneEach(function(html, next) {
      let el = document.querySelector('.sidebar-nav .active');
      el.classList.add('open');
      while (el && el.className !== 'sidebar-nav') {
        if (el.parentElement.tagName === 'LI') {
          el.parentElement.className = 'open';
        }
        el = el.parentElement;
      }
      next(html);
    });
  },
].concat($docsify.plugins || []);
