import './style.css'

function sidebarCollapsePlugin(hook, vm) {
  hook.doneEach(function (html, next) {
    const activeNode = getActiveNode()
    openActiveToRoot(activeNode)

    addFolderFileClass()
    addLevelClass()
    syncScrollTop(activeNode)

    next(html)
  })
  hook.ready(function () {
    document
      .querySelector('.sidebar-nav')
      .addEventListener('click', handleMenuClick)
  })
}

function init() {
  document.addEventListener('scroll', scrollSyncMenuStatus)
}

let lastTop // 侧边栏滚动状态
function syncScrollTop(activeNode) {
  if (activeNode && lastTop != undefined) {
    const curTop = activeNode.getBoundingClientRect().top
    document.querySelector('.sidebar').scrollBy(0, curTop - lastTop)
  }
}

function scrollSyncMenuStatus() {
  requestAnimationFrame(() => {
    let el = document.querySelector('.app-sub-sidebar > .active')
    if (el) {
      el.parentNode.parentNode
        .querySelectorAll('.app-sub-sidebar')
        .forEach((dom) => dom.classList.remove('open'))
      while (el.parentNode.classList.contains('app-sub-sidebar')) {
        if (el.parentNode.classList.contains('open')) {
          break
        } else {
          el.parentNode.classList.add('open')
          el = el.parentNode
        }
      }
    }
  })
}

function handleMenuClick(e) {
  lastTop = e.target.getBoundingClientRect().top

  const newActiveNode = findTagParent(e.target, 'LI', 2)
  if (!newActiveNode) return
  if (newActiveNode.classList.contains('open')) {
    newActiveNode.classList.remove('open')
    // docsify 默认行为会操作 collapse，我们异步之后修补
    setTimeout(() => {
      newActiveNode.classList.add('collapse')
    }, 0)
  } else {
    removeOpenToRoot(getActiveNode())
    openActiveToRoot(newActiveNode)
    // docsify 默认行为会操作 collapse，我们异步之后修补
    setTimeout(() => {
      newActiveNode.classList.remove('collapse')
    }, 0)
  }
  syncScrollTop(newActiveNode)
}

function getActiveNode() {
  let node = document.querySelector('.sidebar-nav .active')

  if (!node) {
    const curLink = document.querySelector(
      `.sidebar-nav a[href="${decodeURIComponent(location.hash).replace(
        / /gi,
        '%20'
      )}"]`
    )
    node = findTagParent(curLink, 'LI', 2)
    if (node) {
      node.classList.add('active')
    }
  }
  return node
}

function openActiveToRoot(node) {
  if (node) {
    node.classList.add('open', 'active')
    while (node && node.className !== 'sidebar-nav' && node.parentNode) {
      if (
        node.parentNode.tagName === 'LI' ||
        node.parentNode.className === 'app-sub-sidebar'
      ) {
        node.parentNode.classList.add('open')
      }
      node = node.parentNode
    }
  }
}

function removeOpenToRoot(node) {
  if (node) {
    node.classList.remove('open', 'active')
    while (node && node.className !== 'sidebar-nav' && node.parentNode) {
      if (
        node.parentNode.tagName === 'LI' ||
        node.parentNode.className === 'app-sub-sidebar'
      ) {
        node.parentNode.classList.remove('open')
      }
      node = node.parentNode
    }
  }
}

function findTagParent(curNode, tagName, level) {
  if (curNode && curNode.tagName === tagName) return curNode
  let l = 0
  while (curNode) {
    l++
    if (l > level) return
    if (curNode.parentNode.tagName === tagName) {
      return curNode.parentNode
    }
    curNode = curNode.parentNode
  }
}

function addFolderFileClass() {
  document.querySelectorAll('.sidebar-nav li').forEach((li) => {
    if (li.querySelector('ul:not(.app-sub-sidebar)')) {
      li.classList.add('folder')
    } else {
      li.classList.add('file')
    }
  })
}

function addLevelClass() {
  function find(root, level) {
    root && root.childNodes &&
      root.childNodes.forEach((child) => {
        if (child.classList && child.classList.contains('folder')) {
          child.classList.add(`level-${level}`)

          if (
            window.$docsify &&
            window.$docsify.sidebarDisplayLevel &&
            typeof window.$docsify.sidebarDisplayLevel === 'number' &&
            level <= window.$docsify.sidebarDisplayLevel
          ) {
            child.classList.add('open')
          }

          if (child && child.childNodes.length > 1) {
            find(child.childNodes[1], level + 1)
          }
        }
      })
  }
  find(document.querySelector('.sidebar-nav > ul'), 1)
}

init()

export default sidebarCollapsePlugin
