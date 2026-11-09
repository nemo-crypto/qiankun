import Vue from 'vue'
import App from './App.vue'
import { registerMicroApps, start, setDefaultMountApp, addGlobalUncaughtErrorHandler } from 'qiankun'
import apps from './micro-app'
import { runtime, record } from './runtime'
Vue.config.productionTip = false
new Vue({ render: h => h(App) }).$mount('#app')
registerMicroApps(apps.map(app => ({ ...app, loader: loading => { runtime.loading = loading } })), {
  beforeLoad: [async app => { runtime.error = ''; record(app.name, '加载资源') }],
  beforeMount: [async app => { runtime.error = ''; record(app.name, '开始挂载') }],
  afterMount: [async app => { runtime.loading = false; record(app.name, '挂载完成') }],
  afterUnmount: [async app => { record(app.name, '卸载完成') }]
})
addGlobalUncaughtErrorHandler(event => {
  runtime.loading = false
  runtime.error = event.message || event.reason?.message || '子应用未能加载，请检查服务和入口地址。'
})
setDefaultMountApp('/sub-vue')
start({ prefetch: false, sandbox: { experimentalStyleIsolation: true } })
