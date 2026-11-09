# 公共模块

通过 npm workspaces 连接主应用和子应用，不需要单独安装或启动。

- `src/state.js`：默认状态和框架无关 bridge，提供读取、写入、订阅、销毁。
- `src/store/global-register.js`：Vuex 适配，每次注册返回 cleanup，卸载时必须调用。
- `src/demo.css`：限定在 `.mf-demo` 下的演示样式。
- `src/api`、`src/sdk`：保留原来的空扩展点，当前没有真实后端请求。

bridge 返回状态快照，避免子应用直接更改基座对象。顶层状态字段须在 `defaultState()` 中预先声明。独立模式本地更新，嵌入模式通过 qiankun props 通知基座。

```js
const bridge = createBridge(props)
const unsubscribe = bridge.subscribe(state => renderState(state))
bridge.setState({ count: bridge.getState().count + 1, source: '我的应用' })
// unmount 时执行
unsubscribe()
bridge.destroy()
```

从 `common` 导入 `createBridge`，示例中的 `props` 和 `renderState` 由消费应用提供。根目录 `npm run check` 覆盖桥接行为；浏览器测试覆盖三种框架的真实联动。
