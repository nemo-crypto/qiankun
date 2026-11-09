import './public-path'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { createBridge } from 'common'
import 'common/src/demo.css'
import App from './App'
let root = null
let bridge = null
function render(props = {}) {
  bridge = createBridge(props)
  root = createRoot(props.container ? props.container.querySelector('#app') : document.getElementById('app'))
  root.render(<App bridge={bridge} embedded={!!props.container} />)
}
if (!window.__POWERED_BY_QIANKUN__) render()
export async function bootstrap() {}
export async function mount(props) { render(props) }
export async function unmount() {
  if (root) { root.unmount(); root = null }
  if (bridge) { bridge.destroy(); bridge = null }
}
