import { useState } from 'react'

/* =========================================================
 * 综合素质 · 材料分析题
 * ---------------------------------------------------------
 * 记录科目一（综合素质）的材料分析题真题与错题。
 * 每道题包含：材料原文、问题、参考答案、答题思路、笔记。
 * 支持「先看自己思路 → 再展开参考答案对照」的练习模式。
 * ========================================================= */

// 题库数据 —— 在这里添加/修改题目
const questions = [
  {
    id: 1,
    source: '2024年上半年真题',
    score: 14,
    knowledgePoint: '教育观（素质教育观）',
    material: `在一节作文课上，有的同学写作思维敏捷，有的同学写作思路局限，李老师走进教室，神秘地对同学们说："今天的课先不讲写作文，我们来做个小实验。"作文课为什么要做实验啊？同学们疑惑了。

李老师说："先别急，答案最后揭晓。我们今天的实验内容是蚂蚁对什么感兴趣？"同学们议论纷纷，争执不下。李老师让两名同学抓些蚂蚁回来，放在一个盘子里，同学们先在盘子里放了几粒饭粒，蚂蚁都在往盘子外面爬，对饭粒无暇顾及。李老师又换成了糖，蚂蚁仍在往外爬。过了好久才有一只爬过来尝了尝，其他蚂蚁也慢慢跟过来了。李老师又滴了一些醋，盘子里顿时全是醋味，所有蚂蚁立刻四散而逃。

李老师又问："蚂蚁会游泳吗？"有学生说会，有学生说不会。李老师端来一盆水，把蚂蚁放在水里，蚂蚁一下水就开始拼命挣扎。"快救它们！"有同学尖叫起来，李老师放入一根草叶，蚂蚁都爬上去，转危为安。最后，李老师要同学们根据今天的实验写一篇作文，同学们思路都打开了，写得又快又好，连平时写作最慢的同学都一气呵成。`,
    question: '请结合材料，从教育观的角度，评析李老师的教育行为。（14分）',
    referenceAnswer: [
      {
        point: '总论',
        content:
          '材料中，李老师的教育行为是正确的，体现了正确的教育观，值得我们学习。',
      },
      {
        point: '素质教育是面向全体学生的教育',
        content:
          '教育中应该使每个学生都得到发展。材料中，李老师通过设计实验的方法，让写作思维敏捷和写作思路局限的学生一起观察、讨论和动手操作，确保每个学生都能在活动中获得体验和启发，最后学生的思路都打开了，连平时写作最慢的学生也能一气呵成，这个过程体现了面向全体学生的教育理念。',
      },
      {
        point: '素质教育是促进学生全面地、生动活泼地、可持续地发展的教育',
        content:
          '教育中不仅要促进学生全面发展，还要发挥学生的主体性，促进学生终身学习。材料中，李老师摒弃枯燥的讲授，用神秘小箱子、趣味实验、悬念提问激发学生的好奇心，让学生在轻松、愉快、主动探究的氛围中打开思路，促进了学生全面地、主动地发展。',
      },
      {
        point: '新课改教学观：从"以教育者为中心"转向"以学习者为中心"',
        content:
          '教师要把课堂还给学生，充分调动学生学习的积极性和主动性。材料中，李老师尊重学生的主体地位，让学生自己观察、讨论、得出结论，教师只作为引导者、支持者，充分发挥了学生的主体性，做到了以学习者为中心。',
      },
      {
        point: '总结',
        content:
          '综上所述，我们在教学中应该树立正确的教育理念，促进学生的发展。',
      },
    ],
    extraNote:
      '【特殊说明】主观题的答案并不唯一，考生也可以从其他角度来分析材料。例如，新课改背景下的教学观要求教学从"重结论轻过程"转向"重结论更重过程"，即要求教师能够看到学习过程的重要性，让学生能够参与学习的过程。材料中，李老师没有只关注结果，而是用实验的方式让学生体会写作，最终学生的思路都打开了，做到了重结论更重过程。言之有理、分析论证充分即可得分。',
    tips: '答题模板：总论（判断+点明理论）→ 分论点（理论+材料分析）× 3~4 → 总结（回扣+启示）',
  },
]

export default function ZongheSuzhiMaterial() {
  return (
    <div className="demo-wrap">
      <div className="demo-header">
        <h3>📋 综合素质 · 材料分析题</h3>
        <p className="desc">
          先自己组织答案 → 展开参考答案对照 → 记录答题思路与易漏点
        </p>
      </div>

      <div className="stats-bar">
        <span>共 <b>{questions.length}</b> 题</span>
      </div>

      {questions.map((q) => (
        <MaterialQuestionCard key={q.id} question={q} />
      ))}
    </div>
  )
}

/* ==================== 单道材料分析题组件 ==================== */
function MaterialQuestionCard({ question }) {
  const [showAnswer, setShowAnswer] = useState(false)
  const [myAnswer, setMyAnswer] = useState('')
  const [note, setNote] = useState('')

  return (
    <div className="question-card material-card">
      {/* 题号 & 来源 & 分值 */}
      <div className="question-meta">
        <span className="question-number">第 {question.id} 题</span>
        {question.source && <span className="question-source">{question.source}</span>}
        <span className="question-score">{question.score} 分</span>
      </div>

      {/* 知识点标签 */}
      <div className="question-tags">
        <span className="tag knowledge-point">{question.knowledgePoint}</span>
      </div>

      {/* 材料原文 */}
      <div className="material-section">
        <div className="material-label">📄 材料</div>
        <div className="material-content">
          {question.material.split('\n\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </div>

      {/* 问题 */}
      <div className="question-stem">
        <strong>问题：</strong>{question.question}
      </div>

      {/* 我的作答区 */}
      <div className="note-section">
        <div className="note-label">✍️ 我的作答（先自己写，再对照答案）</div>
        <textarea
          className="my-answer-input"
          value={myAnswer}
          onChange={(e) => setMyAnswer(e.target.value)}
          placeholder="按照「总论 → 分论点×3~4 → 总结」的结构，写下你的答案..."
          rows={8}
        />
      </div>

      {/* 展开/收起参考答案 */}
      <div className="btn-row">
        <button
          className="btn-primary"
          onClick={() => setShowAnswer(!showAnswer)}
        >
          {showAnswer ? '🔒 收起参考答案' : '🔓 展开参考答案'}
        </button>
      </div>

      {/* 参考答案 */}
      {showAnswer && (
        <div className="reference-answer">
          <div className="answer-label">📖 参考答案</div>
          {question.referenceAnswer.map((item, i) => (
            <div key={i} className="answer-point">
              <div className="point-title">
                {item.point === '总论' || item.point === '总结'
                  ? `【${item.point}】`
                  : `（${i}）${item.point}`}
              </div>
              <div className="point-content">{item.content}</div>
            </div>
          ))}

          {/* 答题技巧 */}
          {question.tips && (
            <div className="tips-section">
              <div className="tips-label">💡 答题技巧</div>
              <div className="tips-content">{question.tips}</div>
            </div>
          )}

          {/* 特殊说明 */}
          {question.extraNote && (
            <div className="extra-note-section">
              <div className="extra-note-content">{question.extraNote}</div>
            </div>
          )}
        </div>
      )}

      {/* 笔记 */}
      <div className="note-section">
        <div className="note-label">📝 易漏点 / 补充笔记</div>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="记录自己容易遗漏的得分点、记忆口诀..."
        />
      </div>
    </div>
  )
}
