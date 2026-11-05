import './styles.css'

/* =========================================================
 * 综合素质 · 学生观背诵笔记
 * ---------------------------------------------------------
 * 不是题目，是知识点背诵笔记（"两独一发"口诀）。
 * 数据以数组常量写在文件顶部，按区块组织：
 *   口诀框架 → 三条展开 → 易混对比 → 答题模板 → 踩坑提醒
 * 修改口诀或条目直接改下面的数组即可。
 * ========================================================= */

// 口诀：一条主线 + 拆解
const mnemonic = {
  line: '两独一发',
  parts: [
    { char: '两', mean: '两条带"独"的学生观' },
    { char: '独', mean: '独特的人 · 独立意义的人' },
    { char: '一', mean: '一条' },
    { char: '发', mean: '学生是发展的人' },
  ],
}

// 三条展开：title 主旨，bullets 用 **加粗** 标记重点词，catch 题干关键词
const items = [
  {
    num: '①',
    title: '学生是发展的人',
    bullets: [
      '学生是**「半成品」**不是「次品」：现在不行≠以后不行，得用发展的眼光看',
      '身心发展有**规律**、有**节奏**（顺序性、阶段性、不平衡性、互补性、个别差异性），早熟晚熟都正常，急不来',
      '身上有**巨大潜能**：多给机会、容得下犯错，宽容引导胜于一棍子打死',
    ],
    catch: '题干出现「还是个孩子」「慢慢来」「潜力」「用静止眼光看」，选它。',
  },
  {
    num: '②',
    title: '学生是独特的人',
    bullets: [
      '学生是**完整的人**，不只是学习机器',
      '学生有**自身的独特性**，有人擅长语言，有人擅长动手',
      '学生和**成人差异巨大**，别拿成人标准衡量小孩',
    ],
    catch: '题干出现「兴趣各不相同」「因材施教」「用成人标准要求」，选它。',
  },
  {
    num: '③',
    title: '学生是具有独立意义的人',
    bullets: [
      '学生**独立于教师头脑之外**，不以教师意志为转移，不能想捏就捏',
      '学生是**学习的主体**（教师只是主导）',
      '学生是**权利的主体**：罚站、搜身、念日记，都踩线了',
    ],
    catch: '题干出现「教师强行安排」「学生不愿意」「惩罚、侵犯隐私」，选它。',
  },
]

// 易混对比：独特 vs 独立
const confuse = {
  question: '这两条是全世界考生混得最狠的一对，因为它们回答的根本不是同一个问题：',
  vs: [
    {
      side: '独特的人',
      asks: '这个学生和别人、和成人有什么不一样？',
      core: '讲的是「差异」',
      bullets: [
        '学生和学生之间不一样 → 要**因材施教**',
        '学生和成人不一样 → 别要求一年级像上班族一样坐 40 分钟',
        '学生是完整的人 → 不是只有「分数」这一个维度',
      ],
    },
    {
      side: '独立意义的人',
      asks: '这个学生听谁的？学习里谁说了算？',
      core: '讲的是「地位」',
      bullets: [
        '**意志独立**：老师想当然「我为他们好」，强行把音乐课改成刷题课、学生不愿意 → 违背的就是这条',
        '**主体独立**：学习中学生才是主体，老师替学生把所有活干了（代劳、填鸭），学生反而没成长',
        '**权利独立**：学生有自己的权利——人格尊严、隐私，罚站一节课、搜书包、当众念日记 → 踩的是这条',
      ],
    },
  ],
  trap: {
    label: '一个挖坑的经典题干（务必记住）',
    text: '「老师不考虑学生的意愿，强行做了某事」——看着像「独特」，其实考的是**独立**。',
    solve: '一句话区分：「独特」看**不同**，「独立」看**谁说了算**。',
  },
  keyword: '关键词「不同、差异、因材施教」→ 独；「强行、不愿意、惩罚、权益」→ 立。',
}

// 材料分析题万能模板：steps 步骤 + 串记口诀
const template = {
  steps: [
    '第一步：定性——该老师的做法**符合/违背**了「以人为本」的学生观',
    '第二步：学生是发展的人 + 结合材料（例：「老师因为学生一次犯错就放弃他，是用静止的眼光看学生」）',
    '第三步：学生是独特的人 + 结合材料',
    '第四步：学生是具有独立意义的人 + 结合材料',
    '第五步：总结——我们要践行新课改的学生观，促进每一个学生的发展',
  ],
  motto: '发展规律有潜能，独特完整差异在，独立学习权利主体。',
}

// 两个最容易踩的坑
const pitfalls = [
  {
    title: '坑一：主导 vs 主体',
    text: '教师是**主导**，学生是**主体**。题干把老师当成一切的中心 → 违背学生观。',
  },
  {
    title: '坑二：发展规律 vs 个别差异',
    text: '顺序性、阶段性，说的是**所有人**都按这个顺序长（发展的人）；个别差异性，说的是**人和人不一样**（独特的人）。单选题最爱在这里挖坑，看清主语再选。',
  },
]

/* ---------- 小工具：把 **加粗** 文本渲染成 <b> ---------- */
function Rich({ text }) {
  const parts = String(text).split(/\*\*(.+?)\*\*/g)
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? <b key={i}>{p}</b> : <span key={i}>{p}</span>,
      )}
    </>
  )
}

export default function ZongheXueshengguan() {
  return (
    <div className="xsg">
      {/* 顶部：口诀横幅 */}
      <div className="xsg-banner">
        <div className="xsg-banner-title">背了忘、忘了背？先记住 4 个字</div>
        <div className="xsg-mnemonic">两独一发</div>
        <div className="xsg-parts">
          {mnemonic.parts.map((p) => (
            <div key={p.char} className="xsg-part">
              <div className="xsg-part-char">{p.char}</div>
              <div className="xsg-part-mean">{p.mean}</div>
            </div>
          ))}
        </div>
        <div className="xsg-banner-sub">
          写一遍比读十遍记得牢，考前照着下面的结构默写一遍
        </div>
      </div>

      {/* 01 三条展开 */}
      <section className="xsg-section">
        <h3 className="xsg-section-title">🧠 01 · 三条展开背</h3>
        {items.map((it) => (
          <div key={it.num} className="xsg-item">
            <div className="xsg-item-head">
              <span className="xsg-item-num">{it.num}</span>
              <b>{it.title}</b>
            </div>
            <ul className="xsg-bullets">
              {it.bullets.map((b) => (
                <li key={b}>
                  <Rich text={b} />
                </li>
              ))}
            </ul>
            <div className="xsg-catch">
              👉 <Rich text={it.catch} />
            </div>
          </div>
        ))}
      </section>

      {/* 02 独特 vs 独立 */}
      <section className="xsg-section">
        <h3 className="xsg-section-title">⚖️ 02 · 独特 vs 独立，到底怎么分</h3>
        <p className="xsg-lead">{confuse.question}</p>
        <div className="xsg-vs">
          {confuse.vs.map((v) => (
            <div key={v.side} className="xsg-vs-card">
              <div className="xsg-vs-title">{v.side}</div>
              <div className="xsg-vs-ask">问的是：{v.asks}</div>
              <div className="xsg-vs-core">{v.core}</div>
              <ul className="xsg-bullets">
                {v.bullets.map((b) => (
                  <li key={b}>
                    <Rich text={b} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="xsg-trap">
          <div className="xsg-trap-label">🕳️ {confuse.trap.label}</div>
          <div className="xsg-trap-text">
            <Rich text={confuse.trap.text} />
          </div>
          <div className="xsg-trap-solve">
            <Rich text={confuse.trap.solve} />
          </div>
        </div>
        <div className="xsg-catch">
          👉 <Rich text={confuse.keyword} />
        </div>
      </section>

      {/* 03 材料分析模板 */}
      <section className="xsg-section">
        <h3 className="xsg-section-title">📝 03 · 材料分析题万能模板</h3>
        <ol className="xsg-steps">
          {template.steps.map((s) => (
            <li key={s}>
              <Rich text={s} />
            </li>
          ))}
        </ol>
        <div className="xsg-motto">
          <span className="xsg-motto-label">🔗 串记口诀</span>
          {template.motto}
        </div>
      </section>

      {/* 04 踩坑提醒 */}
      <section className="xsg-section">
        <h3 className="xsg-section-title">💣 04 · 两个最容易踩的坑</h3>
        <div className="xsg-pitfalls">
          {pitfalls.map((p) => (
            <div key={p.title} className="xsg-pitfall">
              <b>{p.title}</b>
              <p>
                <Rich text={p.text} />
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 尾部：默写清单 */}
      <div className="xsg-final">
        <div className="xsg-final-title">🌙 今晚默写挑战</div>
        <p>
          两独一发 → 每条三个小点 → 独特看「不同」，独立看「谁说了算」。
          默得出来，这题你就稳了。
        </p>
      </div>
    </div>
  )
}
