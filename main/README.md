# Vue 主应用

Vue 2与qiankun组成基座，在src/main.js启动并通过src/micro-app.js注册三个子应用。

[完整工程说明](../README.md) · [源码入口](src/micro-app.js)

## 安装与执行

建议先按根工程说明批量安装。单独维护本工程时，在当前目录执行npm install，再运行所需命令：

```bash
npm start
npm run build
npm run lint
```

## 配置与接入

VUE_APP_SUB_VUE、VUE_APP_SUB_REACT和VUE_APP_SUB_HTML必须指向实际子应用入口。挂载容器为#subapp-viewport，activeRule分别为/sub-vue、/sub-react、/sub-html。

基座场景需要其他服务和应用入口同时可用；直接访问本应用与通过基座加载应分别验证。公共状态和工具从上级common目录接入，其自身没有独立服务。

## 验证范围

本轮核对package.json、入口与打包配置，未安装依赖或运行应用。仅将package.json中存在的脚本列为执行入口，不代表本轮已运行通过。
