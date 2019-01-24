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

window.addEventListener('hashchange', event => {
	requestAnimationFrame(() => {
		let el = document.querySelector('.sidebar-nav .active')
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
