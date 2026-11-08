# HTML 子应用

原生页面与JavaScript子工程，使用http-server提供入口，在基座中按/sub-html激活。

[完整工程说明](../README.md) · [源码入口](js/main.js)

## 安装与执行

建议先按根工程说明批量安装。单独维护本工程时，在当前目录执行npm install，再运行所需命令：

```bash
npm start
npm run build
```

## 配置与接入

start在7799端口提供跨域静态服务。build执行scripts/build.sh，从public与js生成dist；开发入口和构建入口都要检查相对资源路径。

基座场景需要其他服务和应用入口同时可用；直接访问本应用与通过基座加载应分别验证。公共状态和工具从上级common目录接入，其自身没有独立服务。

## 验证范围

本轮核对package.json、入口与打包配置，未安装依赖或运行应用。当前test脚本为占位失败命令，没有自动化用例。
