import { createBridge } from 'common'
import 'common/src/demo.css'
let bridge = null
let root = null
let unsubscribe = null
let save = null
let increment = null
function render(props = {}) {
  bridge = createBridge(props)
  root = props.container ? props.container.querySelector('#app') : document.getElementById('app')
  root.innerHTML = `<section class="mf-demo" data-testid="html-app">
    <div class="mf-eyebrow">VANILLA / PLATFORM EXPERIENCE</div><h1>不依赖框架，也能融入系统。</h1><p>原生 JavaScript 示例。通过标准生命周期接入，使用同一份共享状态协议。</p>
    <div class="mf-grid"><section class="mf-panel"><h2>共享用户</h2><div class="mf-value" data-testid="child-user"></div><form><label for="html-name">新用户名称</label><input id="html-name" maxlength="30" placeholder="输入一个名字" required /><div class="mf-actions"><button class="mf-primary">更新共享用户</button></div></form></section>
    <section class="mf-panel"><h2>共享计数器</h2><div class="mf-value" data-testid="child-count"></div><p data-source></p><div class="mf-actions"><button class="mf-primary" data-increment>共享计数 +1</button></div></section></div>
    <div class="mf-note">运行模式：${props.container ? 'qiankun 基座内' : '独立运行'} · 卸载时移除事件与订阅；用户输入通过 textContent 展示。</div></section>`
  unsubscribe = bridge.subscribe(state => {
    root.querySelector('[data-testid="child-user"]').textContent = state.user.name
    root.querySelector('[data-testid="child-count"]').textContent = String(state.count)
    root.querySelector('[data-source]').textContent = `最近更新：${state.source}`
  })
  save = event => {
    event.preventDefault()
    const input = root.querySelector('input')
    const name = input.value.trim()
    if (name) { bridge.setState({ user: { name }, source: '原生应用' }); input.value = '' }
  }
  increment = () => bridge.setState({ count: bridge.getState().count + 1, source: '原生应用' })
  root.querySelector('form').addEventListener('submit', save)
  root.querySelector('[data-increment]').addEventListener('click', increment)
}
if (!window.__POWERED_BY_QIANKUN__) render()
export async function bootstrap() {}
export async function mount(props) { render(props) }
export async function unmount() {
  if (unsubscribe) unsubscribe()
  if (bridge) bridge.destroy()
  if (root) {
    root.querySelector('form').removeEventListener('submit', save)
    root.querySelector('[data-increment]').removeEventListener('click', increment)
    root.replaceChildren()
  }
  root = bridge = unsubscribe = save = increment = null
}
