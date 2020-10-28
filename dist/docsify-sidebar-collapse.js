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

  var css = ".sidebar-nav > ul > li ul {\n  display: none;\n}\n\n.app-sub-sidebar {\n  display: none;\n}\n\n.app-sub-sidebar.open {\n  display: block;\n}\n\n.sidebar-nav .open > ul:not(.app-sub-sidebar),\n.sidebar-nav .active:not(.collapse) > ul {\n  display: block;\n}\n\n.active + ul.app-sub-sidebar {\n  display: block;\n}\n";
  styleInject(css);

  var lastTop = 0; // 侧边栏滚动状态

  $docsify.plugins = [function (hook, vm) {
    hook.doneEach(function (html, next) {
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
      }); // fix #12 空格问题

      var curLink = document.querySelector("a[href=\"".concat(decodeURIComponent(location.hash).replace(/ /gi, '%20'), "\"]"));
      var dom = curLink;

      while (dom && dom.classList && dom.className !== 'sidebar-nav') {
        dom.classList.add('open');
        dom = dom.parentNode;
      }

      if (curLink) {
        var curTop = curLink.getBoundingClientRect().top;
        document.querySelector('.sidebar').scrollBy(0, curTop - lastTop);
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
      lastTop = e.target.getBoundingClientRect().top;

      if (e.target.tagName === 'LI') {
        e.target.classList.toggle('open');
      } // fix #11 空行问题


      if (e.target.tagName === 'P' && e.target.parentNode && e.target.parentNode.tagName === 'LI') {
        e.target.parentNode.classList.toggle('open');
      }

      if (e.target.tagName === 'A') {
        var elp = findTagParent(e.target, 'LI', 2);

        if (elp) {
          if (elp.classList.contains('open')) {
            requestAnimationFrame(function () {
              elp.classList.add('collapse');
              elp.classList.remove('open');
            });
          } else {
            requestAnimationFrame(function () {
              if (elp.classList.contains('collapse')) {
                elp.classList.remove('collapse');
              }

              elp.classList.add('open');
            });
          }
        }
      }
    }, true);
  });

  function findTagParent(curNode, tagName, level) {
    var l = 0;

    while (curNode) {
      l++;
      if (l > level) return;

      if (curNode.parentNode.tagName === tagName) {
        return curNode.parentNode;
      }

      curNode = curNode.parentNode;
    }
  }

})));
