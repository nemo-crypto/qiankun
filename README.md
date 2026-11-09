# Qiankun 微前端工作台

一个可直接运行的多框架示例：Vue 基座加载 Vue、React 和原生 JavaScript 子应用，包含双向状态通信、独立运行、深层路由和完整挂载/卸载流程。无需后端、数据库或第三方账号。

## 30 秒开始

需要 **Node.js 22.14+ 或 24 LTS、npm 10+**。推荐 `nvm use` 后执行：

```bash
npm install
npm run dev
```

打开 **http://127.0.0.1:8080**。默认配置即可使用；第一次安装取决于网络。后续可用 `npm ci` 按根锁文件复现依赖。按 Ctrl+C 会关闭四个服务。

| 应用 | 独立地址 | 基座路由 |
| --- | --- | --- |
| 主应用 | http://127.0.0.1:8080 | `/` 自动进入 Vue 示例 |
| Vue 子应用 | http://127.0.0.1:7777 | `/sub-vue`、`/sub-vue/about` |
| React 子应用 | http://127.0.0.1:7788 | `/sub-react` |
| 原生子应用 | http://127.0.0.1:7799 | `/sub-html` |

## 先试这几个操作

1. 在 Vue 应用修改名字、增加计数，观察上方基座面板。
2. 切换 React 或原生应用，继续编辑同一份状态。
3. 点基座「重置共享状态」，验证当前子应用同步恢复。
4. 访问 Vue「路由说明」并刷新，观察子路由仍可用。
5. 独立打开子应用，验证不依赖基座也能操作。

数据只保存在当前页面内存，刷新即重置。各子应用独立打开时各自维护本地状态，不与另一个浏览器标签页共享。

## 常用命令

| 命令 | 用途 |
| --- | --- |
| `npm run dev` / `npm start` | 启动全部应用，源文件修改后自动刷新 |
| `npm run dev -w sub-react` | 仅启动 React 子应用，其他应用同理 |
| `npm run build` | 构建全部应用，不依赖 Bash 或 Make |
| `npm run preview` | 在 http://127.0.0.1:4173 预览生产产物 |
| `npm run check` | 共享状态协议、端口与 SPA 服务测试 |
| `npm run setup:browsers` | 首次下载 Chromium 测试浏览器 |
| `npm test` | 单元检查 + 自动构建及生产浏览器测试 |
| `npm run test:e2e:dev` | 自动启动四个服务，测试开发环境接入 |

浏览器测试会自行启动服务器，请先停止占用对应端口的手动服务。生产测试包括桌面、手机和 iPad 尺寸的 Chromium 模拟环境，不是真机验证。报告在 `playwright-report/`，失败 trace 和截图在 `test-results/`。

## 目录与实现

```text
main/          Vue 2 基座、导航、加载失败反馈、生命周期记录
sub-vue/       Vue 2 + Router + Vuex，含懒加载子路由
sub-react/     React 18 + Hooks + createRoot
sub-html/      原生 DOM 与事件管理
common/        状态桥接、Vuex 适配与演示样式
config/        统一 Webpack 5 配置、HTML 模板、环境配置
scripts/       跨平台启动、构建与生产预览
 tests/        状态、服务器及浏览器行为测试
```

源码入口：[应用注册](main/src/micro-app.js)、[状态桥接](common/src/state.js)、[Vuex 适配](common/src/store/global-register.js)。子应用 UMD 库和 chunk 命名相互隔离；资源 publicPath 与路由 base 分开处理。React 和原生应用只在自己的容器内查询节点，卸载时清理订阅与事件。

保留 Vue 2.7 是为了延续原仓库的迁移教学结构。Vue 2 已结束常规维护，本示例不是新生产系统的框架选型建议。Webpack 的开发热替换关闭，使用自动页面刷新，避免旧生命周期实例与热替换相互干扰。

## 自定义端口和入口

无需配置就可启动。需要修改时复制 `.env.example` 为根目录 `.env`，修改后重新启动；构建中的环境值需要重新构建。

开发子应用地址默认取当前访问主机名与配置端口。需要局域网访问时设置 `HOST=0.0.0.0`，通过本机局域网 IP 访问；开发服务器仅用于可信开发网络。生产默认同源 `/subapp/{应用名}/`，没有写死的外部域名。

`VUE_APP_SUB_VUE`、`VUE_APP_SUB_REACT`、`VUE_APP_SUB_HTML` 可以覆盖子应用 entry；跨域部署还需配置目标服务器的 CORS 和资源路径。环境变量会进入前端构建，只能填写公开配置。

## 构建、预览和部署

```bash
npm run build
npm run preview
```

产物为 `dist/main/` 和 `dist/subapp/{sub-vue,sub-react,sub-html}/`。每次构建仅清理对应应用的输出目录。预览服务包含深层路由回退，缺失 JS/CSS 返回 404，不伪装成 HTML。

生产服务器规则与新增子应用教程见 [接入与部署指南](docs/接入与部署.md)。仓库附带 [Nginx 配置示例](config/nginx.conf.example)，需要按实际域名和文件路径调整；本地预览不代表已部署到外网。

## 常见问题

- **端口占用**：关闭自己启动的旧服务，或修改 `.env`；服务启动失败会退出并清理已启动的其他应用。
- **npm 缓存权限错误**：项目 `.npmrc` 使用 `.npm-cache/`，不依赖全局缓存权限，也不需要 sudo 安装。
- **子应用加载失败**：页面保留基座导航并展示错误；恢复服务后点「重新加载页面」。
- **直接打开 HTML 文件没有效果**：必须通过上述开发或预览服务访问；HTML 由统一模板生成。
- **新增 state 不同步**：qiankun 要求顶层字段在基座初始化时声明，先修改 `common/src/state.js` 的默认结构。

<!-- BEGIN project-discovery -->
## 项目定位与实践入口

Qiankun micro-frontend demo with a Vue host and Vue, React and vanilla HTML sub-apps. 微前端架构实战：路由挂载、共享状态、独立运行与聚合构建。

适合从以下入口阅读实现与接入条件：

- [子应用注册](main/src/micro-app.js)
- [公共模块](common/README.md)
- [React 子应用](sub-react/README.md)
<!-- END project-discovery -->
