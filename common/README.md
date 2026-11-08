# 微前端公共模块

提供主/子应用之间复用的状态、API和SDK源码，入口为 [src/index.js](src/index.js)，模块分别位于 `src/store/`、`src/api/` 与 `src/sdk/`。

[完整工程说明](../README.md)

## 使用条件

该目录不是独立Web应用，没有start或build脚本。Vue子应用通过 `file:../common` 引入，相关webpack配置会处理common的转译。消费方需要核对相对依赖、打包转译与共享状态约定。

## 维护

修改共享方法时，同时检查主应用和实际消费子应用。不要把主应用提供的状态访问接口与各子应用本地store混为一谈。当前test脚本为占位命令，本轮未运行跨应用联调。
