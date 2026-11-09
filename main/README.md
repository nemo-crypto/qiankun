# 主应用

负责应用注册、加载反馈、导航与共享状态。单独启动基座时需另行启动子应用，建议默认从根目录启动全部。

[总指南](../README.md) · [源码入口](src/main.js) · [接入与部署](../docs/接入与部署.md)

在仓库根目录安装依赖：

```bash
npm install
npm run dev -w main
```

完整联调执行根目录 `npm run dev`。构建单个应用执行 `npm run build -w main`；生产预览需要先在根目录构建全部应用。

构建配置统一在 `config/webpack.cjs`，环境配置位于根目录 `.env`。开发与生产 HTML 均由 `config/template.html` 生成，不再维护两份手写页面。

测试集中在根目录：`npm run check`、`npm run test:e2e` 和 `npm run test:e2e:dev`，具体执行记录见 [优化进度](../docs/优化进度.md)。
