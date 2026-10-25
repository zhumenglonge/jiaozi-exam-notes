# 📝 教资备考 · 真题错题本

小学教师资格证（综合素质）真题与错题的练习本。把这门考试里刷过的每一道题、记错的每一个点，都用可交互的形式沉淀下来，反复巩固直到全部掌握。

## 项目定位

- **面向科目一（综合素质）**：单选题 + 材料分析题两大题型，后续可扩展到科目二（教育教学知识与能力）。
- **不只是看题**：单选题可以点选作答、即时判对错、看解析；材料分析题可以「先自己写 → 再对照参考答案分点拆解」。
- **纯前端、零后端**：题库和笔记都在代码里，构建产物是纯静态文件，能直接挂在 GitHub Pages 上。
- **题目按题组自包含**：一个题型 = `src/questions/` 下的一个文件夹，删掉文件夹就等于删掉题型，不会留下死代码。

## 技术栈

| 项 | 选型 |
|---|---|
| 框架 | React 19 |
| 构建 | Vite 7 |
| 路由 | 无路由库，手写 `location.hash` 解析（`#/topic/{id}`） |
| 样式 | 单文件全局 CSS（[src/App.css](src/App.css) + [src/index.css](src/index.css)），未使用 CSS Modules |
| 代码检查 | ESLint 9（`eslint-plugin-react-hooks`、`eslint-plugin-react-refresh`） |
| 部署 | GitHub Actions → GitHub Pages |

## 本地启动

```bash
# 安装依赖
npm install

# 启动开发服务器（默认 http://localhost:5173/）
npm run dev

# 生产构建，产物在 dist/
npm run build

# 本地预览构建产物
npm run preview

# 代码检查
npm run lint
```

> 开发环境下 `base` 为 `/`，构建时才加 `/jiaozi-exam-notes/` 前缀，所以本地跑起来不会有子路径问题。

## 目录结构

```
exam-notes-app/
├── .github/workflows/deploy.yml   # 推 main 自动部署到 GitHub Pages
├── index.html                     # 页面标题、description 在此修改
├── vite.config.js                 # base 路径按 command 切换
└── src/
    ├── main.jsx                   # 应用入口
    ├── App.jsx                    # 只负责「目录页 ⇄ 题目页」切换，不写业务
    ├── App.css                    # 全站样式（题组共用）
    ├── index.css                  # 全局 reset / 基础变量
    └── questions/
        ├── registry.js            # 📚 题目注册中心（新增题组改这里）
        ├── zonghe-suzhi-choice/   # 综合素质 · 单选题
        │   └── index.jsx
        └── zonghe-suzhi-material/ # 综合素质 · 材料分析题
            └── index.jsx
```

## 题组注册机制

[src/questions/registry.js](src/questions/registry.js) 是唯一的「题目清单」。`App.jsx` 只读这个清单来渲染首页目录、并按 id 渲染对应题组，所以**加题型不需要动 App.jsx**。

清单由 `rawTopics` 数组维护，导出前会被统一转换成带 `lazy` 组件的 `topics`：

```js
export const topics = rawTopics.map((t) => ({
  ...t,
  Component: lazy(t.loader), // 只创建一次，避免每次 render 重新挂载
}))
```

另外 `groupTopicsByCategory()` 会按 `tags[0]` 把题组归类，首页用它在每个科目下分组展示。

### topics 元数据字段

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `id` | `string` | ✅ | 题组唯一标识，同时是 URL 的一部分（`#/topic/{id}`） |
| `icon` | `string` | 建议 | 首页卡片与题目页标题前的 emoji |
| `title` | `string` | ✅ | 题组标题，如「综合素质 · 单选题」 |
| `subtitle` | `string` | 建议 | 一句话简介，显示在卡片和题目页头部 |
| `tags` | `string[]` | ✅ | **`tags[0]` 决定科目分类**（如「综合素质」），`tags[1..]` 作为普通标签展示 |
| `difficulty` | `string` | 可选 | 难度/重要度角标，如 `'高频'`、`'重点'`，以特殊样式渲染 |
| `createdAt` | `string` | 可选 | 创建日期 `YYYY-MM-DD`，卡片底部显示 `📅 2026-09-16` |
| `loader` | `() => Promise` | ✅ | 动态 import 题组入口，如 `() => import('./zonghe-suzhi-choice/index.jsx')` |

## 新增一个题组（两步）

### 第一步：在 `src/questions/` 下新建文件夹

新建 `src/questions/jiaoyu-jiaoxue-choice/index.jsx`，默认导出一个 React 组件。组件应当自己完成「取数据 → 渲染 → 交互」，样式优先复用 `App.css` 里已有点位（`.question-card`、`.options-list`、`.note-section`、`.tag` 等）。

```jsx
import { useState } from 'react'

const questions = [ /* 题库数据，字段见下文 */ ]

export default function JiaoyuJiaoxueChoice() {
  return (
    <div className="demo-wrap">
      <div className="demo-header">
        <h3>🎓 教育教学知识与能力 · 单选题</h3>
        <p className="desc">点击选项作答 → 查看对错与解析</p>
      </div>
      <div className="stats-bar">
        <span>共 <b>{questions.length}</b> 题</span>
      </div>
      {questions.map((q) => <QuestionCard key={q.id} question={q} />)}
    </div>
  )
}
```

### 第二步：在 `registry.js` 的 `rawTopics` 里登记

```js
{
  id: 'jiaoyu-jiaoxue-choice',
  icon: '🎓',
  title: '教育教学知识与能力 · 单选题',
  subtitle: '教育基础、学生指导、班级管理、学科知识等',
  tags: ['教育教学知识与能力', '选择题', '科目二'],
  difficulty: '高频',
  createdAt: '2026-09-16',
  loader: () => import('./jiaoyu-jiaoxue-choice/index.jsx'),
}
```

保存后首页会自动出现新分类和新卡片，无需改动 `App.jsx`。删除题组时，把文件夹和这条记录一起删掉即可。

## 单题字段 schema

### 单选题

```js
{
  id: 1,                                  // 题号，题组内唯一
  stem: '张老师在工作中，注重培养学生的独立思考能力……体现了（ ）',  // 题干
  options: [                              // 选项，label 需与 answer 对应
    { label: 'A', text: '素质教育' },
    { label: 'B', text: '应试教育' },
    { label: 'C', text: '精英教育' },
    { label: 'D', text: '传统教育' },
  ],
  answer: 'A',                            // 正确选项的 label
  explanation: '素质教育强调……与题干描述一致。',  // 解析，作答后展示
  source: '2024年上半年真题',              // 来源角标
  tags: ['职业理念', '素质教育'],           // 知识点标签
}
```

### 材料分析题

```js
{
  id: 1,
  source: '2024年上半年真题',
  score: 14,                              // 分值，显示在题目头部
  knowledgePoint: '教育观（素质教育观）',   // 知识点，单独高亮标签
  material: `第一段材料……\n\n第二段材料……`, // 材料原文，按 \n\n 切分成段落
  question: '请结合材料，从教育观的角度，评析李老师的教育行为。（14分）',
  referenceAnswer: [                      // 参考答案分点
    { point: '总论', content: '……' },     // point 为「总论」「总结」时渲染成【总论】
    { point: '素质教育是面向全体学生的教育', content: '……' },
  ],
  tips: '答题模板：总论 → 分论点 × 3~4 → 总结',  // 可选，答题技巧区
  extraNote: '【特殊说明】主观题的答案并不唯一……', // 可选，补充说明区
}
```

> 新增题目只需在对应 `index.jsx` 顶部的 `const questions = [...]` 里追加对象；同一题组内 `id` 保持唯一即可。

## GitHub Pages 部署

部署完全由 [.github/workflows/deploy.yml](.github/workflows/deploy.yml) 驱动：

- **触发条件**：推送到 `main`，或到 Actions 页面手动 `workflow_dispatch`。
- **build job**：checkout → Node 20（带 npm 缓存）→ `actions/configure-pages`（`enablement: true`，仓库没开 Pages 也会自动启用）→ `npm ci` → `npm run build` → 上传 `./dist` 产物。
- **deploy job**：`needs: build`，用 `actions/deploy-pages` 发布到 `github-pages` environment。
- **并发控制**：`concurrency.group: pages` + `cancel-in-progress: true`，同一时间只跑一个部署。

线上地址：<https://zhumenglonge.github.io/jiaozi-exam-notes/>

### 关于 base 路径

[vite.config.js](vite.config.js) 里写的是：

```js
base: command === 'build' ? '/jiaozi-exam-notes/' : '/'
```

因为 GitHub Pages 的项目站点挂在 `/<仓库名>/` 子路径下，构建时必须加前缀，否则 JS/CSS 会 404；而 `npm run dev` 本地跑在根路径，所以只在 build 时加。

⚠️ **仓库改名或换账号时必须同步改这里**，`base` 要和仓库名保持一致。

## 已知待办

| 优先级 | 问题 | 说明 |
|---|---|---|
| 🔴 高 | **笔记与作答未持久化** | 单选题的笔记、材料分析题的「我的作答」和「易漏点笔记」目前都只是组件内 `useState`，**刷新页面即丢失**。名为「错题本」但没真正记住任何东西，建议按 `题目 id` 做 key 落 `localStorage`。 |
| 🟡 中 | **题库硬编码在组件文件里** | 每个题组的 `const questions = [...]` 直接写在 `index.jsx` 顶部，数据与视图混在一起。题量变大后建议拆出 `data.js` / `questions.json`，组件只负责渲染。 |
| 🟡 中 | **favicon 指向不存在的文件** | [index.html](index.html) 引用了 `/vite.svg`，但项目没有 `public/` 目录，控制台会有 404。要么新建 `public/` 放图标，要么改成内联 emoji / data URI。 |
| 🟡 中 | **样式全部全局共享** | 全站六七百行样式集中在 `App.css`，两个题组共用同一批 class（`.question-card`、`.note-section` 等），改一处可能影响另一处。后续可考虑 CSS Modules 或按题组拆样式。 |
| 🟢 低 | **题库覆盖面窄** | 目前单选题 3 道、材料分析题 1 道，科目二整体尚未开始，`registry.js` 里只留了注释模板。 |
| 🟢 低 | **无进度/正确率统计** | 首页只有「N 个题组 / N 个科目」，没有做题进度、错题数量、正确率等回顾性数据。 |

## 一起完善

新增题组照着上面两步走即可；修 bug 或补题库直接提 PR。题库内容欢迎纠错——真题答案有争议时，以官方真题解析为准。
