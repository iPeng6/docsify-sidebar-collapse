import './style.css'

let lastTop = 0 // 侧边栏滚动状态

$docsify.plugins = [
  function (hook, vm) {
    hook.doneEach(function (html, next) {
      let el = document.querySelector('.sidebar-nav .active')
      if (el) {
        el.classList.add('open')
        while (el.className !== 'sidebar-nav') {
          if (
            el.parentElement.tagName === 'LI' ||
            el.parentElement.className === 'app-sub-sidebar'
          ) {
            el.parentElement.classList.add('open')
          }
          el = el.parentElement
        }
      }
      document.querySelectorAll('.sidebar-nav li').forEach((li) => {
        if (li.querySelector('ul:not(.app-sub-sidebar)')) {
          li.classList.add('folder')
        } else {
          li.classList.add('file')
        }
      })

      // fix #12 空格问题
      const curLink = document.querySelector(
        `a[href="${decodeURIComponent(location.hash).replace(/ /gi, '%20')}"]`
      )

      let dom = curLink
      while (dom && dom.classList && dom.className !== 'sidebar-nav') {
        dom.classList.add('open')
        dom = dom.parentNode
      }

      if (curLink) {
        const curTop = curLink.getBoundingClientRect().top

        document.querySelector('.sidebar').scrollBy(0, curTop - lastTop)
      }

      next(html)
    })
  },
].concat($docsify.plugins || [])

window.addEventListener('hashchange', (e) => {
  requestAnimationFrame(() => {
    const el = document.querySelector('.sidebar-nav .active')
    if (el) {
      el.parentElement.parentElement
        .querySelectorAll('.app-sub-sidebar')
        .forEach((dom) => dom.classList.remove('open'))

      if (
        el.parentElement.tagName === 'LI' ||
        el.parentElement.className === 'app-sub-sidebar'
      ) {
        el.parentElement.classList.add('open')
      }
    }
  })
})

document.addEventListener(
  'scroll',
  (e) => {
    requestAnimationFrame(() => {
      let el = document.querySelector('.app-sub-sidebar > .active')
      if (el) {
        el.parentElement.parentElement
          .querySelectorAll('.app-sub-sidebar')
          .forEach((dom) => dom.classList.remove('open'))
        while (el.parentElement.classList.contains('app-sub-sidebar')) {
          el.parentElement.classList.add('open')
          el = el.parentElement
        }
      }
    })
  },
  false
)

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.sidebar-nav').addEventListener(
    'click',
    (e) => {
      lastTop = e.target.getBoundingClientRect().top

      if (e.target.tagName === 'LI') {
        e.target.classList.toggle('open')
      }
      // fix #11 空行问题
      if (
        e.target.tagName === 'P' &&
        e.target.parentNode &&
        e.target.parentNode.tagName === 'LI'
      ) {
        e.target.parentNode.classList.toggle('open')
      }

      if (e.target.tagName === 'A') {
        const elp = findTagParent(e.target, 'LI', 2)
        if (elp) {
          if (elp.classList.contains('open')) {
            requestAnimationFrame(() => {
              elp.classList.add('collapse')
              elp.classList.remove('open')
            })
          } else {
            requestAnimationFrame(() => {
              if (elp.classList.contains('collapse')) {
                elp.classList.remove('collapse')
              }
              elp.classList.add('open')
            })
          }
        }
      }
    },
    true
  )
})

function findTagParent(curNode, tagName, level) {
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
