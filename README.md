### 一、qiankun (蚂蚁金服)
```

 1. 主应用配置

```javascript:src/main-app/src/main.js
import { registerMicroApps, start } from 'qiankun';

// 注册子应用
registerMicroApps([
  {
    name: 'vue-app', // 单个子应用名称
    entry: '//localhost:8081', // 子应用入口
    container: '#vue-container', // 子应用容器
    activeRule: '/vue-app', // 激活规则
  },
  {
    name: 'react-app',
    entry: '//localhost:8082',
    container: '#react-container',
    activeRule: '/react-app',
  }
]);

// 启动 qiankun
start({
  prefetch: true, // 预加载
  sandbox: {
    strictStyleIsolation: true, // 严格的样式隔离
  }
});
```


 2. 主应用路由配置

```javascript:src/main-app/src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('../views/Home.vue'),
    },
    {
      path: '/vue-app/:pathMatch(.*)*',
      component: () => import('../views/MicroApp.vue'),
    },
    {
      path: '/react-app/:pathMatch(.*)*',
      component: () => import('../views/MicroApp.vue'),
    }
  ]
});

export default router;
```

 3. 主要应用容器组件

```vue:src/main-app/src/views/MicroApp.vue
<template>
  <div>
    <div id="vue-container">tets</div>
    <div id="react-container">tets</div>
  </div>
</template>

<script>
export default {
  name: 'MicroApp'
}
</script>
```

 4. Vue项目中子应用配置

```javascript:src/vue-app/src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

let instance = null;

// 渲染函数
function render(props = {}) {
  const { container } = props;
  instance = createApp(App);
  
  instance.use(router).use(store);
  instance.mount(container ? container.querySelector('#app') : '#app');
}

// qiankun生命周期钩子函数
export async function bootstrap() {
  console.log('vue app bootstraped');
}

export async function mount(props) {
  console.log('vue app mounted', props);
  render(props);
}

export async function unmount() {
  console.log('vue app unmounted');
  instance.unmount();
  instance = null;
}

// 独立运行时
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}
```

 5. Vue项目子应用配置文件

```javascript:src/vue-app/vue.config.js
const { defineConfig } = require('@vue/cli-service');
const packageName = require('./package.json').name;

module.exports = defineConfig({
  devServer: {
    port: 8081, // 启动端口8081
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  configureWebpack: {
    output: {
      library: `${packageName}-[name]`,
      libraryTarget: 'umd',
      chunkLoadingGlobal: `webpackJsonp_${packageName}`,
    },
  },
});
```

 6. React项目子应用配置

```javascript:src/react-app/src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

function render(props = {}) {
  const { container } = props;
  ReactDOM.render(
    <App />,
    container ? container.querySelector('#root') : document.querySelector('#root')
  );
}

export async function bootstrap() {
  console.log('react app bootstraped');
}

export async function mount(props) {
  console.log('react app mounted', props);
  render(props);
}

export async function unmount(props) {
  const { container } = props;
  ReactDOM.unmountComponentAtNode(
    container ? container.querySelector('#root') : document.querySelector('#root')
  );
}

if (!window.__POWERED_BY_QIANKUN__) {
  render();
}
```

 7. React项目子应用配置文件

```javascript:src/react-app/config-overrides.js
const { name } = require('./package.json');

module.exports = {
  webpack: (config) => {
    config.output.library = `${name}-[name]`;
    config.output.libraryTarget = 'umd';
    config.output.chunkLoadingGlobal = `webpackJsonp_${name}`;
    config.output.globalObject = 'window';

    return config;
  },
  devServer: (configFunction) => {
    return function (proxy, allowedHost) {
      const config = configFunction(proxy, allowedHost);
      config.headers = {
        'Access-Control-Allow-Origin': '*',
      };
      return config;
    };
  },
};
```

 8. 公共依赖处理

```javascript:src/main-app/src/shared/index.js
import store from '../store';

const shared = {
  store,
  utils: {
    // 公共工具函数
  },
  constants: {
    // 公共常量
  }
};

export default shared;
```

 9. 通信机制实现

```javascript:src/main-app/src/utils/eventBus.js
class EventBus {
  constructor() {
    this.events = {};
  }

  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data));
    }
  }

  off(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    }
  }
}

export default new EventBus();
```

 10. 状态管理

```javascript:src/main-app/src/store/index.js
import { createStore } from 'vuex';

export default createStore({
  state: {
    globalData: {}
  },
  mutations: {
    SET_GLOBAL_DATA(state, data) {
      state.globalData = data;
    }
  },
  actions: {
    updateGlobalData({ commit }, data) {
      commit('SET_GLOBAL_DATA', data);
    }
  }
});
```

 11. 样式隔离

```javascript:src/main-app/src/utils/styleIsolation.js
export function addStyleScope(styleStr, scopeName) {
  return styleStr.replace(/([^}]*){([^}]*)}/g, (match, selector, style) => {
    const newSelector = selector
      .split(',')
      .map(s => `${s.trim()}[data-qiankun="${scopeName}"]`)
      .join(',');
    return `${newSelector}{${style}}`;
  });
}
```

 12. 错误处理

```javascript:src/main-app/src/utils/errorHandler.js
export function setupErrorHandler() {
  window.addEventListener('error', (event) => {
    console.error('Micro App Error:', event);
    // 错误上报逻辑
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event);
    // 错误上报逻辑
  });
}
```

 13. 启动命令

```json:package.json
{
  "scripts": {
    "start": "npm-run-all --parallel start:*",
    "start:main": "cd main-app && npm start",
    "start:vue": "cd vue-app && npm start",
    "start:react": "cd react-app && npm start",
    "build": "npm-run-all --parallel build:*",
    "build:main": "cd main-app && npm run build",
    "build:vue": "cd vue-app && npm run build",
    "build:react": "cd react-app && npm run build"
  }
}
```

特点：
- 基于single-spa
- 完善的沙箱机制
- 样式隔离
- 资源预加载
- HTML Entry 方式
常见问题解决：
- 跨域问题：确保微应用的 devServer 配置了正确的 CORS 头
- 样式隔离：可以使用 experimentalStyleIsolation 配置
- JS 沙箱：qiankun 默认启用了JS沙箱，可以通过配置调整
start({
  sandbox: {
    strictStyleIsolation: true, // 严格的样式隔离
    experimentalStyleIsolation: true, // 实验性的样式隔离
  }
});

确保微应用的打包配置正确，特别是 output.library 和 output.libraryTarget
微应用需要在自己的 HTML 入口文件增加 entry 配置
主应用和微应用的路由需要协调，避免冲突
建议使用 hash 或 history 路由模式
注意跨域问题的处理

### 二、micro-app (京东)
```
<!-- 主应用 -->
<micro-app 
  name="app1" 
  url="http://localhost:3000/" 
  baseroute="/my-page">
</micro-app>
<!-- 子应用无需改造 -->
```
特点：
- 使用Web Components
- 零依赖
- 简单易用
- 不需要改造子应用
- 天然隔离

### 三、wujie (腾讯)
```
// 主应用
import { setupApp } from 'wujie';
setupApp({
  name: 'app1',
  url: 'http://localhost:8080',
  exec: true,
  props: { data: 'shared' }
});
// 组件使用
<WujieVue
  width="100%"
  height="100%"
  name="app1"
  url="http://localhost:8080"
  :sync="true"
  :props="props"
/>
```
特点：
- 基于 Web Components
- 使用 iframe 隔离
- 预加载能力
- 支持多个实例
- 性能优秀
### 四、Garfish(字节跳动)
```
// 主应用
import Garfish from 'garfish';
Garfish.run({
  domGetter: '#container',
  apps: [{
    name: 'app1',
    entry: 'http://localhost:8080',
    activeWhen: '/app1'
  }]
});
// 子应用
export function provider() {
  return {
    render() {},
    destroy() {}
  };
}
```
特点：
- 轻量级
- 性能好
- 灵活的插件系统
- 完善的沙箱机制
五、各框架对比
1. 隔离方案：
- qiankun: Proxy 快照
- micro-app: Web Components
- wujie: iframe + Web Components
- Garfish: VM 上下文

2. 通信方式：
- qiankun: Props + 全局状态
- micro-app: CustomEvent
- wujie: Props + 通信对象
- Garfish: Props + Channel

3. 子应用加载：
- qiankun: HTML Entry
- micro-app: HTML Entry
- wujie: iframe fetch
- Garfish: HTML Entry

4. 适用场景：
- qiankun: 大型复杂应用
- micro-app: 简单集成场景
- wujie: 高性能要求场景
- Garfish: 轻量级应用

6. 常见问题解决方案
```
// 1. 样式隔离
// qiankun
{
  sandbox: {
    experimentalStyleIsolation: true
  }
}

// micro-app
<micro-app name="app1" scopecss>

// 2. JS 隔离
// qiankun
{
  sandbox: {
    strictIsolation: true
  }
}

// 3. 路由同步
// 主应用
window.history.pushState = new Proxy(window.history.pushState, {
  apply(target, thisBinding, args) {
    // 通知子应用
    return target.apply(thisBinding, args);
  }
});
```
- 最佳实践
```
// 1. 应用通信
// 统一状态管理
import { initGlobalState } from 'qiankun';

const actions = initGlobalState({
  user: 'admin',
  theme: 'dark'
});

// 2. 性能优化
// 预加载
{
  prefetch: true,
  prefetchApps: ['app1', 'app2']
}

// 3. 错误处理
{
  errorBoundary: (err) => {
    console.error(err);
    return <h1>应用加载失败</h1>;
  }
}
```

### 六、选择建议：
1. 如果是新项目，推荐使用 micro-app 或 wujie
- 如果是复杂项目，推荐使用 qiankun
- 如果对性能要求高，推荐使用 wujie
- 如果需要轻量级方案，推荐使用 Garfish
注意事项：
- 合理规划应用拆分粒度
- 注意应用间通信的性能影响
- 做好错误边界处理
- 考虑应用预加载策略
- 注意样式和 JS 隔离的完整性
