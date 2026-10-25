import { useEffect, useState } from 'react'
import './styles.css'

/* =========================================================
 * 综合素质 · 常识图鉴
 * ---------------------------------------------------------
 * 记录"光看文字记不住、得配图"的常识题（生物、地理、名作等）。
 * 每道题除了题干/选项/解析，还能挂一组配图图鉴（gallery）：
 * 选项上写 animal: '<图鉴 id>'，就会把对应的动物卡片渲染在题目下方。
 *
 * 新增题目：往 questions 里加一条；新增配图：往 profiles 里加一条，
 * 图片按类别放到 public/<类别>/ 下（如 public/animals/、public/instruments/）。
 * ========================================================= */

// 图片放在 public/<类别>/ 下，构建时需带上 base 前缀
const IMG_BASE = import.meta.env.BASE_URL

// 配图图鉴字典：id -> 卡片信息
const profiles = {
  frog: {
    name: '青蛙',
    group: '无尾目 · 蛙科',
    img: 'animals/frog.jpg',
    traits: [
      '皮肤光滑湿润，能辅助呼吸',
      '后肢粗长有力，擅长跳跃和游泳',
      '眼睛突出，趾间有蹼',
    ],
    note: '幼体是蝌蚪，用鳃呼吸；成体用肺呼吸。',
  },
  toad: {
    name: '蟾蜍',
    group: '无尾目 · 蟾蜍科',
    img: 'animals/toad.jpg',
    traits: [
      '皮肤粗糙、布满疣粒，比较耐旱',
      '身体肥硕、四肢短，多爬行少跳跃',
      '眼后有耳后腺，能分泌白色毒液',
    ],
    note: '俗称"癞蛤蟆"，捕食害虫，是农田益友。',
  },
  newt: {
    name: '蝾螈',
    group: '有尾目 · 蝾螈科',
    img: 'animals/newt.jpg',
    traits: [
      '身体细长，终生保留尾巴',
      '四肢短小，头扁嘴宽',
      '喜阴湿，多生活在溪流、水塘边',
    ],
    note: '图中为东方蝾螈：背面黑褐、腹面橘红。',
  },
  salamander: {
    name: '大鲵',
    group: '有尾目 · 隐鳃鲵科',
    img: 'animals/giant-salamander.jpg',
    traits: [
      '头宽而扁，身体粗壮扁平',
      '皮肤松弛多皱褶，布满斑纹',
      '四肢短粗，尾巴侧扁',
    ],
    note: '俗称"娃娃鱼"，叫声似婴儿啼哭。',
  },
  yingbiao: {
    name: '影表尺（圭表）',
    group: '古代天文仪器 · 量天尺',
    img: 'instruments/guibiao.jpg',
    traits: [
      '表：直立的标杆，用来投出日影',
      '圭：平放的带刻度长尺，用来量影长',
      '影最短为夏至、最长为冬至，据此定节气',
    ],
    note: '又称表尺、天文尺、量天尺；前身是《周礼》里的"土圭"。',
  },
  dengfeng: {
    name: '石圭上的二十四节气',
    group: '登封观星台 · 量天尺',
    img: 'instruments/observatory-solstice.svg',
    portrait: true,
    traits: [
      '影端越靠台身，影越短 → 接近夏至',
      '影端越远，影越长 → 接近冬至',
      '影长相同的节气两两成对，分列石圭左右',
    ],
    note: '石圭名“量天尺”，向北铺约 31 米，二十四节气据此测定。',
  },
  markCB: {
    name: 'CB 标志',
    group: '国际电工委员会 IECEE',
    img: 'marks/cb.svg',
    traits: [
      'IECEE「CB 体系」的标志，用于电工产品安全认证',
      '成员国之间互认检测报告，不是某一国的强制认证',
      'CB 取自 Certification Body（认证机构）',
    ],
    note: '看到 CB 先想到“国际互认”，不是国家标志。',
  },
  markCE: {
    name: 'CE 标志',
    group: '欧盟 · 强制性标志',
    img: 'marks/ce.svg',
    traits: [
      '欧盟的强制性合格标志，法文 Conformité Européenne 缩写',
      '加贴 CE 表示产品符合欧盟安全、健康、环保要求',
      '是进入欧盟市场的“通行证”',
    ],
    note: 'CE 常被误当成“中国出口”，其实它属于欧盟。',
  },
  markCCC: {
    name: 'CCC 标志（3C 认证）',
    group: '中国 · 强制性产品认证',
    img: 'marks/ccc.svg',
    traits: [
      'China Compulsory Certification，中国强制性产品认证',
      '俗称“3C 认证”，因为缩写正好是三个 C',
      '列入目录的产品未获认证，不得出厂、销售或进口',
    ],
    note: '另有 CCC-S（安全）、CCC-EMC（电磁兼容）等细分标志。',
  },
  markFCC: {
    name: 'FCC 标志',
    group: '美国 · 联邦通信委员会',
    img: 'marks/fcc.svg',
    traits: [
      '美国联邦通信委员会（FCC）认证',
      '主要管无线电、通信类电子设备的电磁干扰',
      '只针对美国市场，不是国际通用标志',
    ],
    note: 'CE、CCC、FCC 是三套并行体系，各管一片市场。',
  },
}

// 题库数据 —— 在这里添加/修改题目
const questions = [
  {
    id: 1,
    stem: '现存两栖动物中，体型最大的是（　）。',
    options: [
      { label: 'A', text: '青蛙', animal: 'frog' },
      { label: 'B', text: '蟾蜍', animal: 'toad' },
      { label: 'C', text: '蝾螈', animal: 'newt' },
      { label: 'D', text: '大鲵', animal: 'salamander' },
    ],
    answer: 'D',
    explanation:
      '大鲵（中国大鲵，俗称"娃娃鱼"）是现存体型最大的两栖动物：成体全长通常在 0.6—1.2 米，最大的个体接近 1.8 米；而青蛙、蟾蜍、蝾螈的体长大多只有几厘米到十几厘米，差距悬殊。',
    points: [
      '分类：青蛙、蟾蜍属无尾目（成体无尾、善跳）；蝾螈、大鲵属有尾目（身体细长、终生有尾）。',
      '两栖动物共性：幼体生活在水中、用鳃呼吸；成体大多能上陆，用肺呼吸并以皮肤辅助呼吸。',
      '易混点："娃娃鱼"是俗称，它不是鱼，而是两栖动物；中国大鲵属国家二级重点保护野生动物（野外种群）。',
      '记忆点：无尾蛙蟾、有尾蝾螈，体型之最看大鲵。',
    ],
    source: '文化素养 · 科学常识',
    galleryTitle: '🐾 四种动物图鉴',
    tags: ['文化素养', '科学常识', '生物'],
  },
  {
    id: 2,
    stem: '测量仪器是单独或连同辅助设备一起用于测量的器具，各个国家在不同时期发明了不同的测量仪器。下列仪器中，属于中国古代发明的是（　）。',
    options: [
      { label: 'A', text: '密度计' },
      { label: 'B', text: '温度计' },
      { label: 'C', text: '千分尺' },
      { label: 'D', text: '影表尺' },
    ],
    answer: 'D',
    explanation:
      '影表尺是中国古代专门用来测量日影长短的尺子（又叫表尺、天文尺、量天尺），与直立的“表”合称圭表，靠正午表影的长短定冬至、夏至和二十四节气。而密度计、温度计、千分尺都是近代西方的测量仪器：温度计出现于 16—17 世纪的欧洲，千分尺是 1631 年法国人帕尔默创制的外径千分尺，密度计也是 18 世纪欧洲的产物。',
    points: [
      '⚠️ 网上流传的“答案 C（千分尺）”站不住脚：千分尺由法国人帕尔默 1631 年发明；中国古代有的是带刻度的“铜卡尺”（东汉墓出土，常被视为游标卡尺前身），容易被误当成千分尺。按“中国古代发明”判断，应选 D 影表尺。',
      '圭表的构成：表（直立标杆，投出日影）＋ 圭（水平刻度尺，量影长）；影表尺就是安在圭面上的那把专用尺。',
      '它能干什么：夏至影最短、冬至影最长，据此定二至二分、划分二十四节气，是制定历法的基础。',
      '实物与人物：陶寺遗址漆木圭尺（距今约 4000 年，最早的圭表实物）；江苏仪征东汉铜圭表；元代郭守敬在登封建观星台，表高四丈，北侧石圭即“量天尺”。',
      '同类古代仪器别混：日晷（测时刻）、浑仪/浑象（测天体位置）、漏刻（计时）、司南（指向）都是中国发明。',
      '词源彩蛋：“圭臬”本义就是圭表的圭和臬（表），后来引申为准则、法度。',
    ],
    source: '2025年下半年真题 · 小学综合素质 第18题',
    galleryTitle: '🧭 影表尺 / 圭表图鉴',
    gallery: [
      { option: 'D', profile: 'yingbiao' },
      { option: 'D', profile: 'dengfeng' },
    ],
    tags: ['文化素养', '科学常识', '古代科技'],
  },
  {
    id: 3,
    stem: '强制性标准是指通过法律、法规等强制手段加以实施的标准。下列选项中，属于中国强制性产品认证标志的是（　）。',
    options: [
      { label: 'A', text: 'CB', mark: 'markCB' },
      { label: 'B', text: 'CE', mark: 'markCE' },
      { label: 'C', text: 'CCC', mark: 'markCCC' },
      { label: 'D', text: 'FCC', mark: 'markFCC' },
    ],
    answer: 'C',
    explanation:
      '“3C 认证”就是 CCC 认证，全称 China Compulsory Certification（中国强制性产品认证），是我国为保护人身健康和财产安全、保护环境与国家安全而设立的强制性产品认证制度。而 A 的 CB 是国际电工委员会 IECEE 的 CB 体系标志，用于成员国之间检测结果互认；B 的 CE 是欧盟的合格标志；D 的 FCC 是美国联邦通信委员会的认证，三者都不是中国的标志。',
    points: [
      '两个概念先分清：“3C”是 CCC 的俗称（三个 C），指的是认证制度；强制性标准指的是必须执行的标准，例如国家标准中 GB 为强制性、GB/T 为推荐性。3C 认证制度从 2002 年 5 月 1 日起正式实施。',
      'CCC 的适用范围：列入《强制性产品认证目录》的产品（电线电缆、家用电器、儿童玩具、汽车配件等），未获认证不得出厂、销售、进口或在经营活动中使用。',
      '四个标志对号入座：CCC = 中国；CE = 欧盟（Conformité Européenne）；FCC = 美国联邦通信委员会；CB = IECEE 的 CB 体系（国际互认，不是国家标志）。',
      '易混点：CE 常被误认为“中国出口”，其实是欧盟标志；CB 重在“认证机构互认”，不是某一国的强制认证。',
      '记忆法：认字母认地区——两个 C 是欧洲（CE），三个 C 是中国（CCC），FCC 的 F 是 Federal（联邦），CB 是 Certification Body。',
    ],
    source: '2025年下半年真题 · 小学综合素质 第19题',
    galleryTitle: '🔖 四个认证标志图鉴',
    gallery: [
      { option: 'A', profile: 'markCB' },
      { option: 'B', profile: 'markCE' },
      { option: 'C', profile: 'markCCC' },
      { option: 'D', profile: 'markFCC' },
    ],
    tags: ['文化素养', '科学常识', '认证标志'],
  },
  {
    id: 4,
    stem: '中国历史上曾多次出现政治清明、经济发展、社会稳定的“治世”或“盛世”。关于这些时期，下列排序正确的是（　）。',
    options: [
      { label: 'A', text: '文景之治—光武中兴—贞观之治—开元盛世' },
      { label: 'B', text: '光武中兴—开元盛世—贞观之治—文景之治' },
      { label: 'C', text: '光武中兴—贞观之治—开元盛世—文景之治' },
      { label: 'D', text: '文景之治—贞观之治—光武中兴—开元盛世' },
    ],
    answer: 'A',
    explanation:
      '四个治世按时间轴排：文景之治（西汉，前 180—前 141）→ 光武中兴（东汉，25—57）→ 贞观之治（唐，627—649）→ 开元盛世（唐，713—741），也就是“西汉 → 东汉 → 唐初 → 唐中期”。B、C 都把最晚的开元盛世排到了前面，D 把东汉的光武中兴排到了唐朝之后，所以只有 A 正确。',
    points: [
      '朝代顺序先站稳：西汉（前 202—9）→ 新（9—23）→ 东汉（25—220）→ 三国两晋南北朝 → 隋（581—618）→ 唐（618—907）。光武中兴属于东汉而不是西汉，这是本题最大的陷阱。',
      '人物对号：文景之治 = 汉文帝 + 汉景帝；光武中兴 = 汉光武帝刘秀；贞观之治 = 唐太宗李世民；开元盛世 = 唐玄宗李隆基（前期）。',
      '易混：文景之治和光武中兴都姓“汉”，但一个在西汉初年、一个在东汉初年，中间隔着王莽新朝和绿林、赤眉大乱。',
      '排序题速解：只要记住“汉在前、唐在后”和唐朝内部的“贞观在前、开元在后”，四个选项立刻能排除。',
      '年代锚点：文景≈公元前 2 世纪，光武≈公元 1 世纪，贞观≈公元 7 世纪前期，开元≈公元 8 世纪前期，大致每跳一档跨 600 年。',
    ],
    source: '2025年下半年真题 · 小学综合素质 第20题',
    timelineTitle: '🕰 四个治世时间线（前 180 → 741）',
    timeline: [
      {
        dynasty: '西汉',
        title: '文景之治',
        person: '汉文帝刘恒 · 汉景帝刘启',
        years: '前 180 — 前 141',
        events: [
          '承秦末战乱与楚汉之争，推行“与民休息”：轻徭薄赋，田租一度降到三十税一',
          '文帝十三年（前 167）因缇萦上书废除肉刑，刑罚趋于宽缓',
          '景帝前元三年（前 154）平定吴楚七国之乱，中央集权加强',
          '府库充盈、粮价低廉，为汉武帝的扩张攒下了家底',
        ],
        verdict: '中国帝制时代第一个公认的“治世”，核心是“少折腾、轻赋税”。',
      },
      {
        dynasty: '东汉',
        title: '光武中兴',
        person: '汉光武帝刘秀',
        years: '25 — 57',
        events: [
          '公元 25 年刘秀称帝、定都洛阳，重建汉朝（东汉）',
          '释放奴婢、精兵简政：合并郡县、裁减官吏，减轻百姓负担',
          '建武十五年（39）“度田”清查土地人口，抑制豪强兼并',
          '以“柔道”治国，功臣封侯而不掌实权，避免内乱',
        ],
        verdict: '西汉灭亡、王莽新朝大乱之后的“二次创业”，东汉前期由此稳定。',
      },
      {
        dynasty: '唐',
        title: '贞观之治',
        person: '唐太宗李世民',
        years: '627 — 649',
        events: [
          '626 年玄武门之变后即位，次年改元“贞观”',
          '纳谏用贤：魏征直言、房玄龄与杜如晦主政，完善三省六部制与科举',
          '630 年李靖灭东突厥，太宗被各族尊为“天可汗”',
          '641 年文成公主入藏和亲；玄奘 629—645 年西行取经',
        ],
        verdict: '以“纳谏”著称的治世，后世《贞观政要》把它当作帝王教科书。',
      },
      {
        dynasty: '唐',
        title: '开元盛世',
        person: '唐玄宗李隆基',
        years: '713 — 741',
        events: [
          '712 年即位，713 年改元“开元”，任用姚崇、宋璟为相',
          '整顿吏治、裁汰冗官，发展生产，人口与财政达到唐代顶峰',
          '杜甫《忆昔》追忆“稻米流脂粟米白，公私仓廪俱丰实”',
          '741 年开元结束，天宝年间急转直下：755 年安史之乱爆发',
        ],
        verdict: '唐朝的顶点也是转折点——同一个皇帝，前半程是开元，后半程是天宝。',
      },
    ],
    tags: ['文化素养', '历史常识', '古代史'],
  },
]

export default function ZongheChangshi() {
  // 点图放大用的当前图片，null 表示未打开
  const [zoom, setZoom] = useState(null)

  useEffect(() => {
    if (!zoom) return
    const onKey = (e) => {
      if (e.key === 'Escape') setZoom(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [zoom])

  return (
    <div className="cs-wrap">
      <div className="demo-header">
        <h3>🐾 综合素质 · 常识图鉴</h3>
        <p className="desc">
          文字记不住的常识，配图一起记 —— 点击选项作答，点图片看大图
        </p>
      </div>

      <div className="stats-bar">
        <span>
          共 <b>{questions.length}</b> 题 · 配图 <b>{Object.keys(profiles).length}</b> 张
        </span>
      </div>

      {questions.map((q) => (
        <QuestionCard key={q.id} question={q} onZoom={setZoom} />
      ))}

      {zoom && (
        <div className="lightbox" onClick={() => setZoom(null)}>
          <figure onClick={(e) => e.stopPropagation()}>
            <img src={zoom.img} alt={zoom.name} />
            <figcaption>
              {zoom.name}
              {zoom.group && ` · ${zoom.group}`}
            </figcaption>
          </figure>
        </div>
      )}
    </div>
  )
}

/* ==================== 单道题组件 ==================== */
function QuestionCard({ question, onZoom }) {
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

  // 图鉴条目：优先用题目自带的 gallery（支持一题挂多张图），
  // 否则按选项里的 animal 字段自动生成
  const galleryItems = question.gallery
    ? question.gallery
        .filter((g) => profiles[g.profile])
        .map((g) => ({ key: g.profile, option: g.option, profile: profiles[g.profile] }))
    : question.options
        .filter((o) => profiles[o.animal])
        .map((o) => ({ key: o.animal, option: o.label, profile: profiles[o.animal] }))

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
              <strong>{opt.label}.</strong>
              {opt.mark && profiles[opt.mark] && (
                <img
                  className="option-mark"
                  src={`${IMG_BASE}${profiles[opt.mark].img}`}
                  alt={`${opt.text} 标志`}
                />
              )}
              {opt.text}
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

          {question.points?.length > 0 && (
            <div className="exam-points">
              <div className="exam-points-title">📌 考点延伸</div>
              <ul>
                {question.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* 配图图鉴：始终展示，方便先认图再做题 */}
      {galleryItems.length > 0 && (
        <Gallery
          items={galleryItems}
          title={question.galleryTitle ?? '配图图鉴'}
          answer={question.answer}
          showAnswer={showAnswer}
          onZoom={onZoom}
        />
      )}

      {/* 时间线：始终展示，方便随时对照年代 */}
      {question.timeline?.length > 0 && (
        <Timeline
          title={question.timelineTitle ?? '时间线'}
          items={question.timeline}
        />
      )}

      {/* 标签 */}
      <div className="question-tags">
        {question.tags?.map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
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
        {showAnswer && <button onClick={handleReset}>🔄 重新作答</button>}
        {!showAnswer && selected && (
          <button className="btn-primary" onClick={() => setShowAnswer(true)}>
            提交答案
          </button>
        )}
      </div>
    </div>
  )
}

/* ==================== 时间线 ==================== */
function Timeline({ title, items }) {
  return (
    <section className="timeline">
      <div className="gallery-head">
        <h4>{title}</h4>
        <p>按时间从早到晚</p>
      </div>

      <ol className="timeline-list">
        {items.map((it) => (
          <li key={it.title} className="timeline-item">
            <div className="timeline-marker">{it.dynasty}</div>

            <div className="timeline-body">
              <div className="timeline-head">
                <span className="timeline-title">{it.title}</span>
                <span className="timeline-years">{it.years}</span>
              </div>
              <div className="timeline-person">{it.person}</div>
              <ul className="timeline-events">
                {it.events.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
              {it.verdict && <p className="timeline-verdict">{it.verdict}</p>}
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

/* ==================== 配图图鉴 ==================== */
function Gallery({ items, title, answer, showAnswer, onZoom }) {
  return (
    <section className="animal-gallery">
      <div className="gallery-head">
        <h4>{title}</h4>
        <p>点图片放大，对照特征区分</p>
      </div>

      <div className="animal-grid">
        {items.map(({ key, option, profile: p }) => {
          const isAnswer = showAnswer && option === answer
          const img = `${IMG_BASE}${p.img}`

          return (
            <figure
              key={key}
              className={`animal-card${p.portrait ? ' is-portrait' : ''}${isAnswer ? ' is-answer' : ''}`}
            >
              <button
                type="button"
                className="animal-photo"
                onClick={() => onZoom({ img, name: p.name, group: p.group })}
                aria-label={`放大查看${p.name}`}
              >
                <img src={img} alt={`${p.name}：${p.traits[0]}`} loading="lazy" />
                <span className="animal-badge">{option}</span>
                {isAnswer && <span className="answer-badge">正确答案</span>}
              </button>

              <figcaption>
                <div className="animal-name">
                  {p.name}
                  <span className="animal-group">{p.group}</span>
                </div>
                <ul className="animal-traits">
                  {p.traits.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                {p.note && <p className="animal-note">{p.note}</p>}
              </figcaption>
            </figure>
          )
        })}
      </div>
    </section>
  )
}
