import './styles.css'

/* =========================================================
 * 综合素质 · 考试日程速览（2027 上半年 · 小学）
 * ---------------------------------------------------------
 * 不是题目，是考务信息备忘：2027 上半年的报名/考试节点、
 * 小学学段科目安排、报名流程和注意事项。
 *
 * ⚠️ 官方公告一般于 2026 年 12 月底 ~ 1 月初发布，
 * 发布后把 segments[].est 改为 false 并填准确日期即可。
 * ========================================================= */

// 笔试日程（全国大致统一，报名窗口各省差一两天，以省公告为准）
const writtenStages = [
  {
    key: '笔试报名',
    when: '2027 年 1 月中旬',
    est: true,
    detail: '各省公告约 2026 年 12 月底起陆续发布，报名窗口通常只有 3~4 天，错过不能补报',
    ref: '参考：2026 上半年为 1 月 9 日–12 日报名',
  },
  {
    key: '笔试考试',
    when: '2027 年 3 月上旬',
    est: true,
    detail: '周六考试，上午 9:00–11:00 / 下午 13:00–15:00，考前一周打印准考证',
    ref: '参考：2026 上半年为 3 月 7 日考试',
  },
  {
    key: '面试报名',
    when: '2027 年 4 月中旬',
    est: true,
    detail: '笔试成绩公布后开放，笔试两科全部合格才能报',
    ref: '参考：2026 上半年为 4 月中旬报名',
  },
  {
    key: '面试考试',
    when: '2027 年 5 月中旬',
    est: true,
    detail: '周六、周日两天，结构化问答 + 试讲 + 答辩',
    ref: '参考：2026 上半年为 5 月 16 日–17 日考试',
  },
]

// 小学学段笔试科目安排
const subjects = [
  {
    time: '上午 9:00–11:00',
    code: '201',
    label: '科目一',
    name: '综合素质',
    tips: '职业理念 · 教育法律法规 · 教师职业道德 · 文化素养 · 基本能力（单选 + 材料分析 + 作文）',
  },
  {
    time: '下午 13:00–15:00',
    code: '202',
    label: '科目二',
    name: '教育教学知识与能力',
    tips: '教育基础 · 学生指导 · 班级管理 · 学科知识 · 教学设计 · 教学实施 · 教学评价（单选 + 简答 + 材料分析 + 教学设计题）',
  },
]

// 报名流程九步
const steps = [
  '登录官网注册（获取邮箱/密码，笔试每次报名都要重新注册）',
  '签订诚信考试承诺书',
  '填写个人信息 + 上传照片',
  '选择考区（户籍 / 居住证申领地 / 学籍所在地三选一）',
  '选择类别（小学）+ 报考科目',
  '提交后等待网上审核（必要时补充证明材料）',
  '审核通过后按时网上缴费',
  '考前一周打印准考证',
  '参加考试',
]

// 提醒条目：type = info | warn | danger
const reminders = [
  {
    type: 'info',
    text: '报名官网只有一个：中小学教师资格考试网 ntce.neea.edu.cn',
  },
  {
    type: 'warn',
    text: '照片要求：近 6 个月免冠白底彩色证件照，jpg/jpeg，宽≤400px、高≤600px、文件≤200K',
  },
  {
    type: 'danger',
    text: '缴费截止前必须完成支付，逾期视为自动放弃，不再安排补缴',
  },
  {
    type: 'danger',
    text: '考试费一经缴纳，无论是否到考均不予退费',
  },
  {
    type: 'info',
    text: '中小学笔试通过率约 35%，是通过性考试但并非裸考能过，建议留足 2 个月备考',
  },
]

export default function ZongheKaoshiRili() {
  return (
    <div className="kaqing">
      {/* 顶部：状态横幅 */}
      <div className="kaqing-banner">
        <div className="kaqing-banner-title">2027 上半年 · 小学教资</div>
        <div className="kaqing-banner-sub">
          以下时间依据历年规律<b>预估</b>，官方公告预计 2026 年 12 月底 ~ 1 月初发布，
          发布后以公告为准
        </div>
      </div>

      {/* 时间线 */}
      <section className="kaqing-section">
        <h3 className="kaqing-section-title">🗓️ 关键节点</h3>
        <div className="kaqing-timeline">
          {writtenStages.map((s, i) => (
            <div key={s.key} className={`kaqing-node ${i % 2 ? 'odd' : ''}`}>
              <div className="kaqing-node-dot">{i + 1}</div>
              <div className="kaqing-node-card">
                <div className="kaqing-node-head">
                  <b>{s.key}</b>
                  <span className={`kaqing-when ${s.est ? 'est' : ''}`}>
                    {s.est ? '预估 · ' : ''}{s.when}
                  </span>
                </div>
                <p className="kaqing-node-detail">{s.detail}</p>
                <p className="kaqing-node-ref">{s.ref}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 科目安排 */}
      <section className="kaqing-section">
        <h3 className="kaqing-section-title">📖 小学笔试科目（一天考完，共两科）</h3>
        <div className="kaqing-subjects">
          {subjects.map((sub) => (
            <div key={sub.code} className="kaqing-subject-card">
              <div className="kaqing-subject-time">{sub.time}</div>
              <div className="kaqing-subject-name">
                <span className="kaqing-subject-code">{sub.label}</span>
                {sub.name}
              </div>
              <p className="kaqing-subject-tips">{sub.tips}</p>
            </div>
          ))}
        </div>
        <p className="kaqing-footnote">
          面试时报学科（语文 / 数学 / 英语等），笔试阶段不需要选。
        </p>
      </section>

      {/* 报名流程 */}
      <section className="kaqing-section">
        <h3 className="kaqing-section-title">📝 报名流程</h3>
        <ol className="kaqing-steps">
          {steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      {/* 注意事项 */}
      <section className="kaqing-section">
        <h3 className="kaqing-section-title">⚠️ 注意事项</h3>
        <div className="kaqing-reminders">
          {reminders.map((r) => (
            <div key={r.text} className={`kaqing-reminder ${r.type}`}>
              {r.text}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
