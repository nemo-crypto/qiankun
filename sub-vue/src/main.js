import './public-path'
import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import { store as commonStore } from 'common'
import 'common/src/demo.css'
import App from './App.vue'
import routes from './router'
Vue.use(Vuex)
Vue.config.productionTip = false
let instance = null
let cleanup = null
function render(props = {}) {
  const store = new Vuex.Store({})
  cleanup = commonStore.globalRegister(store, props)
  const router = new VueRouter({ mode: 'history', base: props.routerBase || process.env.BASE_URL, routes })
  instance = new Vue({ router, store, render: h => h(App) }).$mount(props.container ? props.container.querySelector('#app') : '#app')
}
if (!window.__POWERED_BY_QIANKUN__) render()
export async function bootstrap() {}
export async function mount(props) { render(props) }
export async function unmount() {
  if (instance) { instance.$destroy(); instance.$el.innerHTML = ''; instance = null }
  if (cleanup) { cleanup(); cleanup = null }
}
