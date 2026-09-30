# 流式消息交互 Demo

- 状态：用户已确认采用默认淡入；`userAccepted=true`。
- 确认效果：`fade`、`500ms`、`linear`。`blur` 与 `raw` 保留作为对照。
- 实现：正文已接入 `@forge-ui-official/core` 的 `StreamingAnswer`。
- 数据：固定原创文案模拟网络分块，宿主将已接收正文与接收状态交给 Core。

## 参考依据

参考 [America.gov Chat](https://america.gov/chat) 公开下发的前端代码：[chat-session.CfwlJmLy.js](https://america.gov/_astro/chat-session.CfwlJmLy.js)。

当时检查到的默认文字动画配置为 `fadeIn`、`500ms`、`linear`、`word`、`stagger: 0`。CSS 同时包含 `blurIn`，默认使用 `fadeIn`。

流式缓冲使用 `requestAnimationFrame`，约每 `120ms` 刷新一次文字，动态释放速率为 `0.15–0.45` 字符/ms；每帧计算使用的时间差上限为 `32ms`。

本 Demo 根据这些公开实现复现交互思路，补充中文场景。用户在本次会话确认“这个不错就用这个吧”后，开始将已确认效果迁入 Core。

## Core 接入

- 共享的 `src/app/_demos/use-demo-stream.ts` 仅模拟网络接收、停顿及取消。每次接收都追加 `receivedText`；原型中的同名文件保留转导出。
- 平滑缓冲、文字淡入及动画结束由 Core 负责，Demo 不再做一次文字播放。
- 接收期间使用 `status="streaming"`，包括等待首批文字和网络暂时停顿。
- 接收完毕后使用 `status="complete"`，界面等 Core `onDone` 回调后显示完成状态和操作区。
- 点击停止取消模拟接收，传 `status="stopped"`，Core 保留当时已显示正文。复制操作读取已显示正文。
- 每次重播递增 `runId` 并作为组件 `key`，切换模式、内容或时长会清空上次演示。
- Demo 使用 `format="markdown"`。`raw` 使用 `motion="none"`，其余模式遵循系统减弱动态效果偏好。
- Markdown 样式和动画来自 Core；演示页已移除直接 `streamdown` 引用和独立正文样式。

## 本地运行

在仓库根目录运行（要求 Node ≥ 22.13）：

```sh
pnpm exec next dev --hostname 127.0.0.1 --port 3104
```

本机默认 Node 较旧时使用已有的 Node 24：

```sh
PATH=/Users/hesong/.nvm/versions/node/v24.18.0/bin:$PATH pnpm exec next dev --hostname 127.0.0.1 --port 3104
```

访问 http://127.0.0.1:3104/prototype/streaming 。可用 `?variant=fade`、`?variant=blur`、`?variant=raw` 打开对应效果。

## 迁移后验证重点

- 英文、中文新增内容的淡入节奏，旧内容不重播。
- 网络停顿保持生成状态，完成等待 Core 回调。
- 停止保留已显示内容，重播从头开始。
- 长文本上滚停止跟随，点击“回到最新”恢复跟随。
- Markdown 标题、列表、表格和代码块的展示以及移动端宽度。

## 迁移后代码验证

- 使用本地 Node 24 运行原型页面、网络模拟 hook、组件文档页的 ESLint，检查通过。
- 根项目 TypeScript `tsc --noEmit --incremental false` 检查通过。
- Core 全量检查通过：118 项组件测试、17 项审计脚本测试；新增 14 项流式交互回归。
- `core:build`、`core:check-package`、根项目 `typecheck` 通过。
- tarball 在 Next 15.5.24、Next 16.3.5 的真实消费构建通过；检查了 Markdown SSR 内容和发布 CSS 中的动画。
- Chrome 中验证 Core 英文 1495 字符与中文 479 字符正常完成、网络停顿及停止。新增字动画为 `sd-forge-answer-in / 0.5s`，已显示字为 `0s`。
- 以上记录对应发布前的仓库内集成验证；发布版本见 `core/CHANGELOG.md`。

## 原型阶段已完成的验证

以下记录来自迁入 Core 之前的原型：

- TypeScript 与原型 ESLint 检查通过。
- 在用户当前 Chrome 会话中验证英文完成（1495 字符）、中文完成（479 字符）、停止冻结、重播、选项切换清空旧内容。
- 运行中 DOM 确认新增词使用 `sd-fadeIn / 0.5s`，旧词不重播；直接追加模式无动画 span。
- 长文上滚后内容高度继续增加，scrollTop 保持 0；点击回到最新后距底部约 0.5px。
- 390px 视口中无横向溢出；网络抖动示例可完成。

## Showcase 入口

- `/cases/agent#streaminganswer` 已内嵌流式淡入示例，可切换中英文、模拟停顿、播放、停止和重播。
- 案例页与独立原型共用网络模拟 hook，正文均使用 Core `StreamingAnswer`。
- 组件文档页的体验链接指向 Showcase；案例页同时保留完整演示链接。
- 本次增补已通过 TypeScript、定向 ESLint 和 Showcase 审计命令；浏览器确认了播放、停止冻结、重播、语言切换清空和停顿选项。
