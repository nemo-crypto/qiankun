# Qiankun 多框架微前端示例

以Vue 2为主应用，接入Vue、React和原生HTML子应用，演示应用注册、按路由激活、共享状态、独立运行与聚合构建。

<!-- BEGIN project-discovery -->
## 项目定位与实践入口

Qiankun micro-frontend demo with a Vue host and Vue, React and vanilla HTML sub-apps. 微前端架构实战：路由挂载、共享状态、独立运行与聚合构建。

适合从以下入口阅读实现与接入条件：

- [子应用注册](main/src/micro-app.js)
- [公共模块](common/README.md)
- [React 子应用](sub-react/README.md)
<!-- END project-discovery -->

## 工程与路由

| 工程 | 技术/职责 | 激活规则 | 使用说明 |
|---|---|---|---|
| main | Vue 2 + qiankun基座 | 主入口 | [主应用](main/README.md) |
| sub-vue | Vue 2 + Router + Vuex | `/sub-vue` | [Vue子应用](sub-vue/README.md) |
| sub-react | React 16 + CRA + rewired | `/sub-react` | [React子应用](sub-react/README.md) |
| sub-html | 原生HTML + http-server | `/sub-html` | [HTML子应用](sub-html/README.md) |
| common | 共享状态、API和SDK | 无独立页面 | [公共模块](common/README.md) |

应用注册位于 [main/src/micro-app.js](main/src/micro-app.js)，子应用挂载到 `#subapp-viewport`，基座下发routerBase与全局状态读取方法。

## 安装与启动

根package.json包含名为install的生命周期脚本，会继续安装主/子应用依赖。为了明确区分根工具安装和批量子项目安装，可按以下方式执行：

```bash
npm install --ignore-scripts
npm run install
npm start
```

根start并行启动四个应用。原示例主入口为 `http://localhost:8080`；最终端口以各项目配置和启动日志为准，HTML子应用脚本固定7799。

## 地址与跨应用配置

主应用使用 `VUE_APP_SUB_VUE`、`VUE_APP_SUB_REACT`、`VUE_APP_SUB_HTML` 作为entry地址，各值应与对应子应用监听地址一致。Vue子应用端口取 `VUE_APP_PORT`，React配置由CRA及其覆盖文件处理。

Vue/React子应用使用UMD输出并配置跨域头；子应用路由、资源publicPath、基座activeRule与实际部署路径必须配套。独立打开子应用只能验证其单独运行，仍需从基座验证挂载、切换与卸载。

## 构建与部署

```bash
npm run build
```

构建后由 `scripts/bundle.sh` 组织为 `dist/main/` 与 `dist/subapp/{sub-vue,sub-react,sub-html}/`。该脚本会清理dist；HTML子项目构建也会清理自身dist，只应在确认这些目录为构建产物后运行。

服务器需要正确映射基座、子应用静态资源与路由回退；当前目录未提供可直接复用的完整服务器部署配置。

## 测试与维护

根test是返回失败的占位脚本，不是自动化测试。子应用存在各自检查命令，具体见各README。重点验收应用entry可达、路由切换、资源路径、共享状态、跨域与卸载清理。

依赖属于历史Vue/React工具链，未声明统一Node engines。本轮核对配置和源码，未安装依赖、启动服务或执行构建。原实践文章记录保留为 `https://juejin.im/post/6875462470593904653`，外链未在本轮验证。
