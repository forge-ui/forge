---
title: 前端设计 Skill 怎么选：通用审美、组件库规范与团队自写
description: Claude Code、Codex、Cursor 都支持 Skill。前端设计类 Skill 大致分三种：通用审美、组件库自带规范、团队自己写。本文讲清它们的区别、怎么判断一个 Skill 好不好，以及怎么组合使用。
date: 2026-11-12
keywords: 前端 Skill, 前端设计 Skill, Claude Code Skill, frontend design skill, Agent Skills
tags: 前端 Skill, Claude Code
---

Skill 是一份放在编码助手 skills 目录里的说明书：一个 `SKILL.md` 加上若干参考文档和脚本。和每次手写提示词不同，Skill 会被助手按需自动读取，内容也能随项目一起维护。Claude Code、Codex、Cursor 都支持这种格式（[Agent Skills 规范](https://agentskills.io/home)）。

做前端时，最常见的需求是“让 AI 写出来的界面好看、而且一致”。围绕这个需求，前端设计类 Skill 大致有三种。

## 三种前端设计 Skill

### 1. 通用审美类

代表是 Anthropic 官方的 `frontend-design`。它的目标是避开千篇一律的“AI 味”界面：先确定一个鲜明的视觉方向（极简、杂志、复古未来……），再在字体、配色、动效、构图上做出有记忆点的选择。

- 适合：营销页、作品集、活动页、原型，任何“要让人记住”的界面。
- 局限：它刻意追求每次都不一样，对后台系统来说正好相反——后台要的是第二十个页面和第一个页面长得一样。

### 2. 组件库自带规范类

组件库为编码助手准备的 Skill，告诉它“这套库里有什么组件、什么场景用哪个、参数怎么填、哪些写法不允许”。Forge 的 `forge-skill` 属于这一类。

- 适合：后台、内部系统、SaaS 控制台，任何要长期迭代、多人（和多个 AI）一起写的产品。
- 局限：只对这个组件库有效；换了组件库，Skill 也要换。

### 3. 团队自写类

把团队自己的约定写成 Skill：目录结构、接口调用方式、权限处理、上线前要跑的检查。

- 适合：已经有成熟代码规范的团队。
- 局限：写好不难，维护难，规范和代码容易慢慢脱节。

## 怎么判断一个 Skill 好不好

看三件事：

- **规则能不能被检查。** “保持一致”“注意美观”这类话对模型约束很弱。好的规则是具体的：状态用哪个组件、金额怎么对齐、弹窗必须能用 Esc 关闭，最好还配一个脚本能从代码里查出违规。
- **有没有评测。** 同一批任务，装和不装各跑一遍，看合格率和错误数有没有变化。没有评测，就只能凭感觉判断它有没有用。
- **会不会撑爆上下文。** Skill 越写越长，助手要读的内容越多，花的时间和 token 也越多。好的做法是主文件只放原则和索引，细节放在参考文档里按需读取，大块的组件参数交给 MCP 查询。

## Forge Skill 是怎么做的

- **主文件只放工作流和铁律**：先判断页面角色（列表、详情、表单、看板……），再选模板、页面组件和组件，最后跑检查。
- **细节按需读取**：组件选型、页面模式、颜色层级、弹窗焦点、状态表达等二十多份参考文档，用到才读。
- **规则配检查**：写死的颜色、手搓的表格和弹窗、空的点击事件、指向 `#` 的链接，都能被 `forge-check` 和 MCP 的 `check_code` 从源码里查出来。
- **有公开评测**：20 个后台任务，用 Claude Code 跑，装了 Skill 和 MCP 后合格率从 90% 到 100%，页面检查的平均警告从 0.7 降到 0，代价是每题平均多花约 50 秒。题目和结果都在 [Forge 仓库](https://github.com/forge-ui/forge/tree/main/evals)。

## 组合使用

这三类不冲突，可以叠加：

- 做后台：组件库 Skill 管组件和规范，团队 Skill 管业务约定。通用审美类 Skill 最好不要同时启用，它会把助手往“每页都不一样”的方向推。
- 做官网或活动页：用通用审美类 Skill 定视觉方向，组件库 Skill 只用来保证表单、按钮这类基础控件可用。

## 安装 Forge Skill

```bash
curl -fsSL https://www.forgeui.org/setup.sh | bash
```

脚本会识别本机的 Claude Code、Cursor 和 Codex，同时装好 Skill 和 MCP。其他支持 Agent Skills 格式的工具，可以把 [skills/forge-skill](https://github.com/forge-ui/forge/tree/main/skills/forge-skill) 目录复制到它的 skills 目录里。

## 相关阅读

- [用 Claude Code 写后台页面：从一句话需求到通过规范检查](/articles/claude-code-admin-pages)
- [前端设计 Skill：让编码助手按规范写后台页面](/docs/ui-for-agents)
- [页面检查](/docs/check)
