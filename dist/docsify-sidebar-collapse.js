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

  var css = ".sidebar-nav > ul > li ul {\n  display: none;\n}\n\n.app-sub-sidebar {\n  display: none;\n}\n\n.app-sub-sidebar.open {\n  display: block;\n}\n\n.sidebar-nav .open > ul:not(.app-sub-sidebar),\n.sidebar-nav .active:not(.collapse) > ul {\n  display: block;\n}\n\n/* 抖动 */\n.sidebar-nav li.open:not(.collapse) > ul {\n  display: block;\n}\n\n.active + ul.app-sub-sidebar {\n  display: block;\n}\n";
  styleInject(css);

  function sidebarCollapsePlugin(hook, vm) {
    hook.doneEach(function (html, next) {
      var activeNode = getActiveNode();
      openActiveToRoot(activeNode);
      addFolderFileClass();
      addLevelClass();
      syncScrollTop(activeNode);
      next(html);
    });
    hook.ready(function () {
      document.querySelector('.sidebar-nav').addEventListener('click', handleMenuClick);
    });
  }

  function init() {
    document.addEventListener('scroll', scrollSyncMenuStatus);
  }

  var lastTop; // 侧边栏滚动状态

  function syncScrollTop(activeNode) {
    if (activeNode && lastTop != undefined) {
      var curTop = activeNode.getBoundingClientRect().top;
      document.querySelector('.sidebar').scrollBy(0, curTop - lastTop);
    }
  }

  function scrollSyncMenuStatus() {
    requestAnimationFrame(function () {
      var el = document.querySelector('.app-sub-sidebar > .active');

      if (el) {
        el.parentNode.parentNode.querySelectorAll('.app-sub-sidebar').forEach(function (dom) {
          return dom.classList.remove('open');
        });

        while (el.parentNode.classList.contains('app-sub-sidebar')) {
          if (el.parentNode.classList.contains('open')) {
            break;
          } else {
            el.parentNode.classList.add('open');
            el = el.parentNode;
          }
        }
      }
    });
  }

  function handleMenuClick(e) {
    lastTop = e.target.getBoundingClientRect().top;
    var newActiveNode = findTagParent(e.target, 'LI', 2);
    if (!newActiveNode) return;

    if (newActiveNode.classList.contains('open')) {
      newActiveNode.classList.remove('open'); // docsify 默认行为会操作 collapse，我们异步之后修补

      setTimeout(function () {
        newActiveNode.classList.add('collapse');
      }, 0);
    } else {
      removeOpenToRoot(getActiveNode());
      openActiveToRoot(newActiveNode); // docsify 默认行为会操作 collapse，我们异步之后修补

      setTimeout(function () {
        newActiveNode.classList.remove('collapse');
      }, 0);
    }

    syncScrollTop(newActiveNode);
  }

  function getActiveNode() {
    var node = document.querySelector('.sidebar-nav .active');

    if (!node) {
      var curLink = document.querySelector(".sidebar-nav a[href=\"".concat(decodeURIComponent(location.hash).replace(/ /gi, '%20'), "\"]"));
      node = findTagParent(curLink, 'LI', 2);

      if (node) {
        node.classList.add('active');
      }
    }

    return node;
  }

  function openActiveToRoot(node) {
    if (node) {
      node.classList.add('open', 'active');

      while (node && node.className !== 'sidebar-nav' && node.parentNode) {
        if (node.parentNode.tagName === 'LI' || node.parentNode.className === 'app-sub-sidebar') {
          node.parentNode.classList.add('open');
        }

        node = node.parentNode;
      }
    }
  }

  function removeOpenToRoot(node) {
    if (node) {
      node.classList.remove('open', 'active');

      while (node && node.className !== 'sidebar-nav' && node.parentNode) {
        if (node.parentNode.tagName === 'LI' || node.parentNode.className === 'app-sub-sidebar') {
          node.parentNode.classList.remove('open');
        }

        node = node.parentNode;
      }
    }
  }

  function findTagParent(curNode, tagName, level) {
    if (curNode && curNode.tagName === tagName) return curNode;
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

  function addFolderFileClass() {
    document.querySelectorAll('.sidebar-nav li').forEach(function (li) {
      if (li.querySelector('ul:not(.app-sub-sidebar)')) {
        li.classList.add('folder');
      } else {
        li.classList.add('file');
      }
    });
  }

  function addLevelClass() {
    function find(root, level) {
      root.childNodes && root.childNodes.forEach(function (child) {
        if (child.classList && child.classList.contains('folder')) {
          child.classList.add("level-".concat(level));

          if (window.$docsify && window.$docsify.sidebarDisplayLevel && typeof window.$docsify.sidebarDisplayLevel === 'number' && level <= window.$docsify.sidebarDisplayLevel) {
            child.classList.add('open');
          }

          if (child && child.childNodes.length > 1) {
            find(child.childNodes[1], level + 1);
          }
        }
      });
    }

    find(document.querySelector('.sidebar-nav > ul'), 1);
  }

  init();

  var css$1 = "@media screen and (max-width: 768px) {\n  /* 移动端适配 */\n  .markdown-section {\n    max-width: none;\n    padding: 16px;\n  }\n  /* 改变原来按钮热区大小 */\n  .sidebar-toggle {\n    padding: 0 0 10px 10px;\n  }\n  /* my pin */\n  .sidebar-pin {\n    appearance: none;\n    outline: none;\n    position: fixed;\n    bottom: 0;\n    border: none;\n    width: 40px;\n    height: 40px;\n    background: transparent;\n  }\n}\n";
  styleInject(css$1);

  var PIN = 'DOCSIFY_SIDEBAR_PIN_FLAG';

  function init$1() {
    // 响应式尺寸 @media screen and (max-width: 768px)
    if (document.documentElement.clientWidth > 768) return;
    localStorage.setItem(PIN, false); // 添加覆盖标签

    var btn = document.createElement('button');
    btn.classList.add('sidebar-pin');
    btn.onclick = togglePin;
    document.body.append(btn);
    window.addEventListener('load', function () {
      var content = document.querySelector('.content'); // 点击内容区域收起侧边栏

      document.body.onclick = content.onclick = function (e) {
        if (e.target === document.body || e.currentTarget === content) {
          if (localStorage.getItem(PIN) === 'true') {
            togglePin();
          }
        }
      };
    });
  }

  function togglePin() {
    var pin = localStorage.getItem(PIN);
    pin = pin === 'true';
    localStorage.setItem(PIN, !pin);

    if (pin) {
      document.querySelector('.sidebar').style.transform = 'translateX(0)';
      document.querySelector('.content').style.transform = 'translateX(0)';
    } else {
      document.querySelector('.sidebar').style.transform = 'translateX(300px)';
      document.querySelector('.content').style.transform = 'translateX(300px)';
    }
  }

  init$1();

  function install() {
    if (!window.$docsify) {
      console.error('这是一个docsify插件，请先引用docsify库！');
    } else {
      for (var _len = arguments.length, plugins = new Array(_len), _key = 0; _key < _len; _key++) {
        plugins[_key] = arguments[_key];
      }

      $docsify.plugins = plugins.concat($docsify.plugins || []);
    }
  }

  install(sidebarCollapsePlugin);

})));
