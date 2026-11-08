# React 子应用

React 16与react-scripts 3工程，通过react-app-rewired覆盖打包和开发服务配置。

[完整工程说明](../README.md) · [源码入口](src/index.js)

## 安装与执行

建议先按根工程说明批量安装。单独维护本工程时，在当前目录执行npm install，再运行所需命令：

```bash
npm start
npm run build
npm test -- --watchAll=false
```

## 配置与接入

config-overrides.js配置UMD库名、独立jsonpFunction和跨域头，并关闭开发服务自动打开与热更新。基座激活规则为/sub-react。

基座场景需要其他服务和应用入口同时可用；直接访问本应用与通过基座加载应分别验证。公共状态和工具从上级common目录接入，其自身没有独立服务。

## 验证范围

本轮核对package.json、入口与打包配置，未安装依赖或运行应用。仅将package.json中存在的脚本列为执行入口，不代表本轮已运行通过。
