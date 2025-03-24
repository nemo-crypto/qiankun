
1. **基座应用搭建**

```bash
# 创建主应用
npx create-react-app main-app
cd main-app

# 安装qiankun
npm install qiankun
```

```typescript:src/App.tsx
import { useState, useEffect } from 'react';
import { registerMicroApps, start } from 'qiankun';

function App() {
  useEffect(() => {
    // 注册子应用
    registerMicroApps([
      {
        name: 'sub-react', // 子应用名称
        entry: '//localhost:3001', // 子应用入口
        container: '#subapp-container', // 子应用容器
        activeRule: '/sub-react', // 激活规则
      },
      // 可以注册多个子应用
    ]);

    // 启动 qiankun
    start();
  }, []);

  return (
    <div className="App">
      <header>主应用</header>
      {/* 子应用容器 */}
      <div id="subapp-container"></div>
    </div>
  );
}

export default App;
```

2. **子应用配置**

```bash
# 创建子应用
npx create-react-app sub-react
cd sub-react

# 安装必要依赖
npm install @rescripts/cli
```

```javascript:config-overrides.js
const { name } = require('./package.json');

module.exports = {
  webpack: (config) => {
    config.output.library = `${name}-[name]`;
    config.output.libraryTarget = 'umd';
    config.output.chunkLoadingGlobal = `webpackJsonp_${name}`;
    config.output.globalObject = 'window';

    return config;
  },
  devServer: (_) => {
    const config = _;
    config.headers = {
      'Access-Control-Allow-Origin': '*',
    };
    config.historyApiFallback = true;
    config.hot = false;
    config.liveReload = false;
    return config;
  },
};
```

3. **子应用入口文件**

```typescript:src/index.tsx
import './public-path';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

let root: any = null;

function render(props: any) {
  const { container } = props;
  const targetContainer = container ? container.querySelector('#root') : document.querySelector('#root');
  
  root = ReactDOM.createRoot(targetContainer);
  root.render(<App />);
}

// 独立运行时
if (!window.__POWERED_BY_QIANKUN__) {
  render({});
}

// 导出生命周期钩子
export async function bootstrap() {
  console.log('[react] sub-react bootstraped');
}

export async function mount(props: any) {
  console.log('[react] props from main framework', props);
  render(props);
}

export async function unmount() {
  root.unmount();
}
```

4. **公共路径配置**

```typescript:src/public-path.ts
if (window.__POWERED_BY_QIANKUN__) {
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}
```

5. **路由配置**

```typescript:src/router/index.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

export default function AppRouter() {
  return (
    <BrowserRouter basename={window.__POWERED_BY_QIANKUN__ ? '/sub-react' : '/'}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}
```
6. **通信机制**

```typescript:src/utils/event.ts
// 主应用
import { initGlobalState } from 'qiankun';

const initialState = {
  user: {
    name: 'admin',
  },
};

const actions = initGlobalState(initialState);

actions.onGlobalStateChange((state, prev) => {
  console.log('主应用: 变更前', prev);
  console.log('主应用: 变更后', state);
});

export default actions;
```

```typescript:src/App.tsx
// 子应用
function App(props: any) {
  const { onGlobalStateChange, setGlobalState } = props;

  useEffect(() => {
    onGlobalStateChange?.((state: any, prev: any) => {
      console.log('子应用: 变更前', prev);
      console.log('子应用: 变更后', state);
    });
  }, []);

  return (
    <div>
      <button onClick={() => setGlobalState({ user: { name: 'new name' } })}>
        修改全局状态
      </button>
    </div>
  );
}
```

7. **样式隔离**

```javascript:src/App.tsx
// 主应用配置
registerMicroApps([
  {
    name: 'sub-react',
    entry: '//localhost:3001',
    container: '#subapp-container',
    activeRule: '/sub-react',
    props: {
      sandbox: {
        strictStyleIsolation: true, // 严格样式隔离
        experimentalStyleIsolation: true, // 实验性样式隔离
      },
    },
  },
]);
```

8. **性能优化**

```typescript:src/App.tsx
// 预加载配置
import { registerMicroApps, start, prefetchApps } from 'qiankun';

// 预加载配置
prefetchApps([
  { name: 'sub-react', entry: '//localhost:3001' },
]);

// 或者在注册时配置
registerMicroApps([
  {
    name: 'sub-react',
    entry: '//localhost:3001',
    container: '#subapp-container',
    activeRule: '/sub-react',
    props: {
      prefetch: true, // 开启预加载
    },
  },
]);
```

9. **错误处理**

```typescript:src/App.tsx
// 主应用错误处理
registerMicroApps([
  {
    name: 'sub-react',
    entry: '//localhost:3001',
    container: '#subapp-container',
    activeRule: '/sub-react',
    loader: (loading) => {
      console.log('loading', loading);
    },
    props: {
      errorBoundary: (error) => {
        console.log('error', error);
        return <div>子应用加载失败</div>;
      },
    },
  },
]);
```

10. **部署配置**

```nginx:nginx.conf
server {
  listen 80;
  server_name localhost;

  # 主应用
  location / {
    root /usr/share/nginx/html/main;
    index index.html index.htm;
    try_files $uri $uri/ /index.html;
  }

  # 子应用
  location /sub-react {
    root /usr/share/nginx/html/sub-react;
    index index.html index.htm;
    try_files $uri $uri/ /sub-react/index.html;
  }
}
```

注意事项：
1. **版本兼容**
```plaintext
- 确保各个应用的依赖版本兼容
- 注意React版本一致性
- 检查qiankun版本更新
```


2. **开发规范**
```
- 遵循微前端开发规范
- 做好应用隔离
- 规范通信机制
```

3. **性能优化**
```plaintext
- 合理使用预加载
- 优化加载时机
- 控制应用大小
```

4. **调试技巧**
```plaintext
- 使用开发者工具
- 查看控制台输出
- 监控应用状态
```

5. **安全考虑**
```plaintext
- 跨域配置
- 权限控制
- 数据安全
```
