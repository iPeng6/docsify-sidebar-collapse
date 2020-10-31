import './sidebar-pin.css'

const PIN = 'DOCSIFY_SIDEBAR_PIN_FLAG'

function init() {
  // 响应式尺寸 @media screen and (max-width: 768px)
  if (document.documentElement.clientWidth > 768) return

  localStorage.setItem(PIN, false)

  // 添加覆盖标签
  const btn = document.createElement('button')
  btn.classList.add('sidebar-pin')
  btn.onclick = togglePin
  document.body.append(btn)

  window.addEventListener('load', () => {
    const content = document.querySelector('.content')

    // 点击内容区域收起侧边栏
    document.body.onclick = content.onclick = (e) => {
      if (e.target === document.body || e.currentTarget === content) {
        if (localStorage.getItem(PIN) === 'true') {
          togglePin()
        }
      }
    }
  })
}

function togglePin() {
  let pin = localStorage.getItem(PIN)
  pin = pin === 'true'
  localStorage.setItem(PIN, !pin)
  if (pin) {
    document.querySelector('.sidebar').style.transform = 'translateX(0)'
    document.querySelector('.content').style.transform = 'translateX(0)'
  } else {
    document.querySelector('.sidebar').style.transform = 'translateX(300px)'
    document.querySelector('.content').style.transform = 'translateX(300px)'
  }
}

init()
