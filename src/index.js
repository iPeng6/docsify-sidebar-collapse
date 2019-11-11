import './style.css'

$docsify.plugins = [
  function(hook, vm) {
    hook.doneEach(function(html, next) {
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
      next(html)
    })
  }
].concat($docsify.plugins || [])

window.addEventListener('hashchange', e => {
  requestAnimationFrame(() => {
    const el = document.querySelector('.sidebar-nav .active')
    if (el) {
      el.parentElement.parentElement
        .querySelectorAll('.app-sub-sidebar')
        .forEach(dom => dom.classList.remove('open'))

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
  e => {
    requestAnimationFrame(() => {
      let el = document.querySelector('.app-sub-sidebar > .active')
      if (el) {
        el.parentElement.parentElement
          .querySelectorAll('.app-sub-sidebar')
          .forEach(dom => dom.classList.remove('open'))
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
    e => {
      if (e.target.tagName === 'LI') {
        e.target.classList.toggle('open')
      }

      if (e.target.tagName === 'A') {
        const elp = e.target.parentElement
        if (elp.tagName === 'LI') {
          if (elp.classList.contains('open')) {
            requestAnimationFrame(() => {
              elp.classList.add('collapse')
              elp.classList.remove('open')
              elp.classList.add('hold')
            })
          } else {
            requestAnimationFrame(() => {
              if (elp.classList.contains('hold')) {
                elp.classList.remove('collapse')
                elp.classList.add('open')
                elp.classList.remove('hold')
              }
            })
          }
        }
      }
    },
    true
  )
})
