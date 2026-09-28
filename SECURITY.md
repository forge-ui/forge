# 安全与依赖维护

AtomGit 分支使用 MIT 许可的 Phosphor 图标，通过 `@forge-ui-official/core/icons` 提供兼容入口。

本轮升级 Next.js 至 16.3.5、React 至 19.3.0，并更新锁文件中的受影响依赖；构建工具 esbuild 固定在已修复的 0.28 系列。React 类型声明固定为 19.2.14 / 19.2.3，以保持现有公共声明契约。

运行 `pnpm core:check`、`pnpm core:check-package`、`pnpm core:check-consumer`、`pnpm typecheck` 和 `pnpm audit --registry=https://registry.npmjs.org` 验证。许可证门禁包含在 `core:check` 中。

Starter 和浏览器扩展使用此仓库构建的本地 Core 包，来源与 SHA-256 记录在各项目 vendor 目录中。本轮只更新 AtomGit，不发布 npm。依赖审计结果取决于执行时的漏洞数据库，不能替代部署环境的安全检查。
