import { lazy } from 'react'

/* =========================================================
 * 📚 题目注册中心
 * ---------------------------------------------------------
 * 新增一个题组，只需要两步：
 *   1. 在 src/questions/ 下新建一个文件夹，写一个 index.jsx 作为题组入口
 *   2. 在下面 topics 数组里加一条记录
 *
 * 每个题组自包含（组件、样式、数据都在自己文件夹里），
 * 删除时直接把整个文件夹 + 这里的注册条目一起删即可。
 *
 * tags[0] 作为科目分类（综合素质 / 教育教学知识与能力）
 * ========================================================= */

const rawTopics = [
  {
    id: 'zonghe-suzhi-choice',
    icon: '📖',
    title: '综合素质 · 单选题',
    subtitle: '科目一选择题真题与错题记录，涵盖职业理念、教育法规、文化素养等',
    tags: ['综合素质', '选择题', '科目一'],
    difficulty: '高频',
    createdAt: '2026-09-16',
    loader: () => import('./zonghe-suzhi-choice/index.jsx'),
  },
  {
    id: 'zonghe-suzhi-material',
    icon: '📋',
    title: '综合素质 · 材料分析题',
    subtitle: '教育观、学生观、教师观等高频材料分析题，含答题模板与得分点拆解',
    tags: ['综合素质', '材料分析', '科目一'],
    difficulty: '重点',
    createdAt: '2026-09-16',
    loader: () => import('./zonghe-suzhi-material/index.jsx'),
  },

  /* 👇 未来在这里继续加，例如：
  {
    id: 'jiaoyu-jiaoxue-choice',
    icon: '🎓',
    title: '教育教学知识与能力 · 单选题',
    subtitle: '教育基础、学生指导、班级管理、学科知识等',
    tags: ['教育教学知识与能力', '选择题', '科目二'],
    difficulty: '高频',
    createdAt: '2026-09-16',
    loader: () => import('./jiaoyu-jiaoxue-choice/index.jsx'),
  },
  {
    id: 'jiaoyu-jiaoxue-jianDa',
    icon: '✍️',
    title: '教育教学知识与能力 · 简答题',
    subtitle: '高频简答考点默写与错题回顾',
    tags: ['教育教学知识与能力', '简答题', '科目二'],
    difficulty: '重点',
    createdAt: '2026-09-16',
    loader: () => import('./jiaoyu-jiaoxue-jianda/index.jsx'),
  },
  */
]

// 把 loader 转成 lazy 组件，只创建一次，避免每次 render 都重新挂载
export const topics = rawTopics.map((t) => ({
  ...t,
  Component: lazy(t.loader),
}))

// 按科目分类聚合，方便首页分组展示
export function groupTopicsByCategory() {
  const groups = new Map()
  for (const t of topics) {
    const cat = t.tags?.[0] ?? '其他'
    if (!groups.has(cat)) groups.set(cat, [])
    groups.get(cat).push(t)
  }
  return Array.from(groups.entries()).map(([name, items]) => ({ name, items }))
}
