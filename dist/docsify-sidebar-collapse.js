(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (factory());
}(this, (function () { 'use strict';

  function styleInject(css, ref) {
    if ( ref === void 0 ) ref = {};
    var insertAt = ref.insertAt;

    if (!css || typeof document === 'undefined') { return; }

    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';

    if (insertAt === 'top') {
      if (head.firstChild) {
        head.insertBefore(style, head.firstChild);
      } else {
        head.appendChild(style);
      }
    } else {
      head.appendChild(style);
    }

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  }

  var css = ".sidebar-nav > ul > li ul {\n  display: none;\n}\n\n.app-sub-sidebar {\n  display: none;\n}\n\n.app-sub-sidebar.open {\n  display: block;\n}\n\n.sidebar-nav .open > ul:not(.app-sub-sidebar),\n.sidebar-nav .active:not(.hold) > ul {\n  display: block;\n}\n\n.active + ul.app-sub-sidebar {\n  display: block;\n}\n";
  styleInject(css);

  var lastTop = 0; // 侧边栏滚动状态

  $docsify.plugins = [function (hook, vm) {
    hook.doneEach(function (html, next) {
      // 每次路由切换时数据全部加载完成后调用，没有参数。
      var el = document.querySelector('.sidebar-nav .active');

      if (el) {
        el.classList.add('open');

        while (el.className !== 'sidebar-nav') {
          if (el.parentElement.tagName === 'LI' || el.parentElement.className === 'app-sub-sidebar') {
            el.parentElement.classList.add('open');
          }

          el = el.parentElement;
        }
      }

      document.querySelectorAll('.sidebar-nav li').forEach(function (li) {
        if (li.querySelector('ul:not(.app-sub-sidebar)')) {
          li.classList.add('folder');
        } else {
          li.classList.add('file');
        }
      });
      var curLink = document.querySelector("a[href=\"".concat(location.hash, "\"]"));

      if (curLink) {
        var curTop = curLink.getBoundingClientRect().top; // console.log('to', lastTop, curTop)

        document.querySelector('.sidebar').scrollTo(0, curTop < lastTop ? 0 : lastTop);
      }

      next(html);
    });
  }].concat($docsify.plugins || []);
  window.addEventListener('hashchange', function (e) {
    requestAnimationFrame(function () {
      var el = document.querySelector('.sidebar-nav .active');

      if (el) {
        el.parentElement.parentElement.querySelectorAll('.app-sub-sidebar').forEach(function (dom) {
          return dom.classList.remove('open');
        });

        if (el.parentElement.tagName === 'LI' || el.parentElement.className === 'app-sub-sidebar') {
          el.parentElement.classList.add('open');
        }
      }
    });
  });
  document.addEventListener('scroll', function (e) {
    requestAnimationFrame(function () {
      var el = document.querySelector('.app-sub-sidebar > .active');

      if (el) {
        el.parentElement.parentElement.querySelectorAll('.app-sub-sidebar').forEach(function (dom) {
          return dom.classList.remove('open');
        });

        while (el.parentElement.classList.contains('app-sub-sidebar')) {
          el.parentElement.classList.add('open');
          el = el.parentElement;
        }
      }
    });
  }, false);
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('.sidebar-nav').addEventListener('click', function (e) {
      lastTop = document.querySelector('.sidebar').scrollTop; // console.log('click', lastTop)

      if (e.target.tagName === 'LI') {
        e.target.classList.toggle('open');
      }

      if (e.target.tagName === 'A') {
        var elp = e.target.parentElement;

        if (elp.tagName === 'LI') {
          if (elp.classList.contains('open')) {
            requestAnimationFrame(function () {
              elp.classList.add('collapse');
              elp.classList.remove('open');
              elp.classList.add('hold');
            });
          } else {
            requestAnimationFrame(function () {
              if (elp.classList.contains('hold')) {
                elp.classList.remove('collapse');
                elp.classList.add('open');
                elp.classList.remove('hold');
              }
            });
          }
        }
      }
    }, true);
  });

})));
