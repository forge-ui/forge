# 集中预览的实验室快照

这些文件仅用于 `/prototype/component-fusion` 的交互原型展示，不属于 core 的公开组件或 npm 包。已在 core 融合的项目由页面优先展示真实组件。

快照来自同级 `forge-interaction-lab` 中已经完成 Forge 字体、Solar 图标、蓝紫黑主题和中英文调整的版本。保留 122 项（116 个 HTML 原型、F01–F06 六个 React 演示），排除审计清单中的 186；待评估项目的展示位置由外层目录控制。

`public/prototype/component-fusion/` 是可独立运行的构建结果，不依赖实验室的 4317 服务。HTML 共享脚本和样式按内容去重；字体以数据形式载入以兼容隔离 iframe。iframe 仅允许脚本，不获得父页面的同源访问权。所有消息必须匹配对应 iframe 的来源窗口和原型编号。

在仓库根目录执行 `node private/component-fusion-lab/build.mjs`，校验本仓 HTML 快照并重建 React 示例、共享嵌入资源和目录，不依赖同级实验室目录。构建需要仓库已安装的 esbuild、React、Motion 和 Solar 依赖。

HTML 原型及其共享脚本、样式以 `public/prototype/component-fusion/` 中的文件为维护源，修复可直接在这里进行。只有明确需要重新导入实验室时，才执行 `node private/component-fusion-lab/build.mjs ../forge-interaction-lab`；该命令会覆盖 HTML 快照及公共运行时，导入前需核对主仓已有修复。

F01–F06 的 React 源码保存在当前目录，使用同一实验室演示状态，不执行外部上传、归档或权限变更。修改这些源码后重新构建即可。

原始交互素材的 MIT 许可见 `THIRD_PARTY_NOTICES.md`，复制到公开资产目录；两套字体的许可也随快照保留。构建输出保留依赖的许可注释。
