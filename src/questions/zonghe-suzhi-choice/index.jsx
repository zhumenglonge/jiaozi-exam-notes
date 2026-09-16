import { useState } from 'react'

/* =========================================================
 * 综合素质 · 单选题
 * ---------------------------------------------------------
 * 记录科目一（综合素质）的选择题真题与错题。
 * 每道题包含：题干、选项、正确答案、解析、笔记。
 * 可以点击选项作答，系统会标记对错并展示解析。
 * ========================================================= */

// 题库数据 —— 在这里添加/修改题目
const questions = [
  {
    id: 1,
    stem: '张老师在工作中，注重培养学生的独立思考能力和解决问题的能力。这体现了张老师遵循了（ ）的教育理念。',
    options: [
      { label: 'A', text: '素质教育' },
      { label: 'B', text: '应试教育' },
      { label: 'C', text: '精英教育' },
      { label: 'D', text: '传统教育' },
    ],
    answer: 'A',
    explanation:
      '素质教育强调培养学生的创新精神和实践能力，注重学生独立思考和问题解决能力的提升，与题干描述一致。',
    source: '2024年上半年真题',
    tags: ['职业理念', '素质教育'],
  },
  {
    id: 2,
    stem: '根据《中华人民共和国教育法》，国家实行（ ）的学校教育制度。',
    options: [
      { label: 'A', text: '学前教育、初等教育、中等教育、高等教育' },
      { label: 'B', text: '初等教育、中等教育、高等教育' },
      { label: 'C', text: '义务教育、非义务教育' },
      { label: 'D', text: '基础教育、职业教育、高等教育' },
    ],
    answer: 'A',
    explanation:
      '《教育法》第十七条规定：国家实行学前教育、初等教育、中等教育、高等教育的学校教育制度。',
    source: '2023年下半年真题',
    tags: ['教育法规', '教育法'],
  },
  {
    id: 3,
    stem: '"四书五经"中的"四书"不包括（ ）。',
    options: [
      { label: 'A', text: '《大学》' },
      { label: 'B', text: '《中庸》' },
      { label: 'C', text: '《春秋》' },
      { label: 'D', text: '《孟子》' },
    ],
    answer: 'C',
    explanation:
      '四书为《大学》《中庸》《论语》《孟子》；《春秋》属于五经之一（诗、书、礼、易、春秋）。',
    source: '2024年上半年真题',
    tags: ['文化素养', '传统文化'],
  },
]

export default function ZongheSuzhiChoice() {
  return (
    <div className="demo-wrap">
      <div className="demo-header">
        <h3>📖 综合素质 · 单选题</h3>
        <p className="desc">
          点击选项作答 → 查看对错与解析 → 在笔记区记录易错点
        </p>
      </div>

      <div className="stats-bar">
        <span>共 <b>{questions.length}</b> 题</span>
      </div>

      {questions.map((q) => (
        <QuestionCard key={q.id} question={q} />
      ))}
    </div>
  )
}

/* ==================== 单道题组件 ==================== */
function QuestionCard({ question }) {
  const [selected, setSelected] = useState(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [note, setNote] = useState('')

  const isCorrect = selected === question.answer

  const handleSelect = (label) => {
    if (showAnswer) return // 已提交则不可再改
    setSelected(label)
    setShowAnswer(true)
  }

  const handleReset = () => {
    setSelected(null)
    setShowAnswer(false)
  }

  return (
    <div className="question-card">
      {/* 题号 & 来源 */}
      <div className="question-meta">
        <span className="question-number">第 {question.id} 题</span>
        {question.source && <span className="question-source">{question.source}</span>}
      </div>

      {/* 题干 */}
      <h4>{question.stem}</h4>

      {/* 选项 */}
      <div className="options-list">
        {question.options.map((opt) => {
          let cls = 'option-item'
          if (showAnswer) {
            if (opt.label === question.answer) cls += ' correct'
            else if (opt.label === selected && !isCorrect) cls += ' wrong'
          } else if (opt.label === selected) {
            cls += ' selected'
          }
          return (
            <div
              key={opt.label}
              className={cls}
              onClick={() => handleSelect(opt.label)}
            >
              <strong>{opt.label}.</strong> {opt.text}
              {showAnswer && opt.label === question.answer && ' ✅'}
              {showAnswer && opt.label === selected && !isCorrect && ' ❌'}
            </div>
          )
        })}
      </div>

      {/* 答案 & 解析 */}
      {showAnswer && (
        <div className={`answer-section ${isCorrect ? '' : 'wrong-answer'}`}>
          <div className="answer-label">
            {isCorrect ? '✅ 回答正确！' : `❌ 回答错误，正确答案：${question.answer}`}
          </div>
          <div className="answer-explanation">{question.explanation}</div>
        </div>
      )}

      {/* 标签 */}
      <div className="question-tags">
        {question.tags?.map((tag) => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>

      {/* 笔记 */}
      <div className="note-section">
        <div className="note-label">📝 我的笔记 / 易错点</div>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="记录你的理解、易错点、记忆口诀..."
        />
      </div>

      {/* 操作按钮 */}
      <div className="btn-row">
        {showAnswer && (
          <button onClick={handleReset}>🔄 重新作答</button>
        )}
        {!showAnswer && selected && (
          <button className="btn-primary" onClick={() => setShowAnswer(true)}>
            提交答案
          </button>
        )}
      </div>
    </div>
  )
}
