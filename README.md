### 一、qiankun (蚂蚁金服)
```
npm i qiankun -S

import { registerMicroApps, start } from 'qiankun';

registerMicroApps([
  {
    name: 'vue app', // 微应用的名称
    entry: '//localhost:8080', // 微应用的入口
    container: '#container', // 微应用的容器节点
    activeRule: '/vue', // 激活微应用的路由规则
  },
  {
    name: 'react app',
    entry: '//localhost:3000',
    container: '#container',
    activeRule: '/react',
  },
]);

start(); // 启动 qiankun
```
特点：
- 基于 single-spa
- 完善的沙箱机制
- 样式隔离
- 资源预加载
- HTML Entry 方式
常见问题解决：
- 跨域问题：确保微应用的 devServer 配置了正确的 CORS 头
- 样式隔离：可以使用 experimentalStyleIsolation 配置
- JS 沙箱：qiankun 默认启用了 JS 沙箱，可以通过配置调整
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
- 使用 Web Components
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
- 支持多实例
- 性能优秀
### 四、Garfish (字节)
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
