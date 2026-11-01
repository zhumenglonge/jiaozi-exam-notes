import { useState } from 'react'
import './styles.css'

/* =========================================================
 * 综合素质 · 历史时间轴（横向阶段 + 垂挂事项）
 * ---------------------------------------------------------
 * 顶部是一根横向"阶段条"：每个大一统/大时期是一段彩色条，
 * 从左到右按时间排列。有内部更替的阶段（如三国、南北朝），
 * 在其下方垂出一根分支，把里面的朝代像"事项"一样列出来。
 *
 * 数据约定：朝代条目字段为 n(名称) a(起始年,公元前为负)
 * b(结束年) info(简介) items(子组/子朝代)。
 * 点任意朝代看详情（点谁高亮谁）；切换视窗可只看某一段。
 * ========================================================= */

// 视窗快捷切换：range 为 [起始年, 结束年]，用于筛选显示哪些阶段
const RANGES = [
  { label: '全部', range: [-2300, 2100] },
  { label: '三国两晋南北朝', range: [180, 620] },
  { label: '五代辽宋夏金', range: [880, 1300] },
]

// 朝代主数据（a/b 为年份，公元前用负数）
const ROWS = [
  { n: '夏', a: -2070, b: -1600, info: '约前2070–前1600，中国史书中第一个王朝，都城阳城。' },
  { n: '商', a: -1600, b: -1046, info: '约前1600–前1046，青铜文明与甲骨文，都城殷。' },
  { n: '西周', a: -1046, b: -771, info: '前1046–前771，武王伐纣建周，分封制、礼乐制。' },
  {
    n: '东周', a: -770, b: -221, items: [
      { n: '春秋', a: -770, b: -476, info: '东周前半期，诸侯争霸（齐桓公、晋文公等春秋五霸）。' },
      { n: '战国', a: -475, b: -221, info: '东周后半期，七雄兼并，前221年为秦所灭。' },
    ],
  },
  { n: '秦', a: -221, b: -206, info: '前221–前207（前206年秦亡），第一个大一统王朝，书同文车同轨。' },
  {
    n: '两汉', a: -206, b: 220, items: [
      { n: '西汉', a: -206, b: 8, info: '前206–8年，都长安，文景之治、汉武盛世。' },
      { n: '新', a: 9, b: 23, info: '9–23年，王莽篡汉改号"新"，绿林赤眉起义后灭亡。' },
      { n: '东汉', a: 25, b: 220, info: '25–220年，都洛阳，光武中兴，末年黄巾起义、军阀割据。' },
    ],
  },
  {
    n: '三国', a: 220, b: 280, items: [
      { n: '魏', a: 220, b: 266, info: '220–266，曹丕代汉建魏，都洛阳，后为西晋禅代。' },
      { n: '蜀', a: 221, b: 263, info: '221–263，刘备称帝于成都，263年为魏所灭。' },
      { n: '吴', a: 229, b: 280, info: '229–280，孙权称帝建业，280年为西晋所灭。' },
    ],
  },
  {
    n: '两晋', a: 265, b: 420, items: [
      { n: '西晋', a: 265, b: 316, info: '265–316，司马炎代魏统一三国，八王之乱后崩溃。' },
      { n: '东晋', a: 317, b: 420, info: '317–420，司马睿南迁建康，与北方十六国对峙。' },
    ],
  },
  { n: '十六国', a: 304, b: 439, info: '304–439，匈奴、鲜卑等民族在北方建立的众多割据政权，与东晋并存。' },
  {
    n: '南北朝', a: 420, b: 589, items: [
      {
        n: '南朝', a: 420, b: 589, items: [
          { n: '宋', a: 420, b: 479, info: '南朝宋（刘宋）420–479，刘裕代东晋而建。' },
          { n: '齐', a: 479, b: 502, info: '南朝齐（萧齐）479–502，萧道成代宋而建。' },
          { n: '梁', a: 502, b: 557, info: '南朝梁（萧梁）502–557，萧衍代齐而建，侯景之乱后衰亡。' },
          { n: '陈', a: 557, b: 589, info: '南朝陈557–589，陈霸先建，589年为隋所灭，南北朝结束。' },
        ],
      },
      {
        n: '北朝', a: 439, b: 581, items: [
          { n: '北魏', a: 386, b: 535, info: '北魏386–535，鲜卑拓跋氏建，439年统一北方，孝文帝改革、迁都洛阳。' },
          { n: '东魏', a: 534, b: 550, info: '东魏534–550，北魏分裂出的政权，实权在权臣高欢。' },
          { n: '西魏', a: 535, b: 557, info: '西魏535–557，北魏分裂出的政权，实权在宇文泰。' },
          { n: '北齐', a: 550, b: 577, info: '北齐550–577，高洋逼东魏禅让建立，都邺城，与西魏/北周东西对峙，577年为北周所灭。' },
          { n: '北周', a: 557, b: 581, info: '北周557–581，宇文觉代西魏而建，灭北齐后统一北方，581年为隋代。' },
        ],
      },
    ],
  },
  { n: '隋', a: 581, b: 618, info: '581–618，杨坚代北周建隋，589年统一全国，开科举、修大运河，二世而亡。' },
  { n: '唐', a: 618, b: 907, info: '618–907，都长安，贞观之治、开元盛世，后历经安史之乱与藩镇割据。' },
  {
    n: '五代十国', a: 907, b: 979, items: [
      { n: '五代', a: 907, b: 960, info: '907–960，中原更替的后梁、后唐、后晋、后汉、后周五个短命王朝。' },
      { n: '十国', a: 902, b: 979, info: '902–979，南方及北方的十余个割据政权，979年为北宋消灭。' },
    ],
  },
  {
    n: '宋金对峙', a: 960, b: 1279, items: [
      { n: '北宋', a: 960, b: 1127, info: '960–1127，赵匡胤陈桥兵变建宋，都开封，1127年靖康之变为金所灭。' },
      { n: '辽', a: 916, b: 1125, info: '辽（契丹）916–1125，与北宋对峙北方，为金所灭。' },
      { n: '西夏', a: 1038, b: 1227, info: '西夏1038–1227，党项族政权，与宋、辽、金并立，为蒙古所灭。' },
      { n: '南宋', a: 1127, b: 1279, info: '1127–1279，宋室南渡都临安，1279年崖山海战为元所灭。' },
      { n: '金', a: 1115, b: 1234, info: '金（女真）1115–1234，灭辽亡北宋，与南宋对峙，1234年为蒙古所灭。' },
    ],
  },
  { n: '元', a: 1271, b: 1368, info: '1271–1368（1279年灭南宋统一全国），蒙古族大一统王朝，都大都。' },
  { n: '明', a: 1368, b: 1644, info: '1368–1644，朱元璋建明，都南京后迁北京，1644年李自成入京崇祯自缢。' },
  { n: '清', a: 1636, b: 1912, info: '1636（入关1644）–1912，满族大一统王朝，康乾盛世后衰落，1912年溥仪退位。' },
  { n: '至今', a: 1912, b: 2100, info: '1912年中华民国成立，1949年中华人民共和国成立至今。' },
]

const fmt = (y) => (y < 0 ? `前${-y}` : `${y}`)

// 阶段条配色：随序号从紫到蓝平滑过渡（还原参考图的渐变）
function stageColor(i, n) {
  const hue = n <= 1 ? 250 : 262 - (i / (n - 1)) * 92
  return `hsl(${hue} 60% 54%)`
}

export default function ZongheLishiTimeline() {
  const [view, setView] = useState(RANGES[0].range)
  const [highlight, setHighlight] = useState(null)
  const [selected, setSelected] = useState(null)
  const [s, e] = view

  // 只显示与视窗区间相交的阶段
  const stages = ROWS.filter((r) => r.b > s && r.a < e)

  // 开关式选中：点中→高亮（有简介则显详情卡）；再点同一个→取消选中
  const onClick = (it) => {
    if (highlight === it.n) {
      setHighlight(null)
      setSelected(null)
    } else {
      setHighlight(it.n)
      setSelected(it.info ? it : null)
    }
  }

  // 阶段下方垂挂的事项：叶子是朝代，遇到子组（南朝/北朝）再缩进一层
  const renderDrop = (items) =>
    items.map((it) => {
      if (it.items) {
        return (
          <div key={`${it.n}-${it.a}`} className="tl-sub">
            <div className="tl-sub-head">
              <span className="tl-sub-name">{it.n}</span>
              <span className="tl-sub-years">{fmt(it.a)}–{fmt(it.b)}</span>
            </div>
            <div className="tl-sub-branch">{renderDrop(it.items)}</div>
          </div>
        )
      }
      return (
        <div key={`${it.n}-${it.a}`} className="tl-item">
          <button
            type="button"
            className={`tl-item-btn${highlight === it.n ? ' hl' : ''}`}
            onClick={() => onClick(it)}
          >
            <span className="tl-item-name">{it.n}</span>
            <span className="tl-item-years">{fmt(it.a)}–{fmt(it.b)}</span>
          </button>
        </div>
      )
    })

  return (
    <div className="tl-wrap">
      <div className="tl-toolbar">
        <span className="tl-toolbar-label">视窗</span>
        {RANGES.map((r) => (
          <button
            key={r.label}
            type="button"
            className={`tl-chip${r.range[0] === s && r.range[1] === e ? ' on' : ''}`}
            onClick={() => setView(r.range)}
          >
            {r.label}
          </button>
        ))}
      </div>

      <p className="tl-sub-hint">
        节点轴：每个大时期是时间轴上的一个节点（左→右按时间，右端箭头表时间流向）· 节点下方垂出其内的朝代更替 · 点击看详情
      </p>

      <div className="tl-flow">
        {stages.map((st, i) => {
          const isGroup = !!st.items
          const nodeOn = highlight === st.n
          return (
            <div key={st.n} className="tl-col" style={{ '--sc': stageColor(i, stages.length) }}>
              <button
                type="button"
                className={`tl-node${nodeOn ? ' hl' : ''}`}
                onClick={() => onClick(st)}
                title={`${st.n} ${fmt(st.a)}–${fmt(st.b)}`}
              >
                {i + 1}
              </button>
              <div className="tl-stage-text">
                <span className={`tl-stage-name${nodeOn ? ' hl' : ''}`}>{st.n}</span>
                <span className="tl-stage-years">{fmt(st.a)}–{fmt(st.b)}</span>
              </div>

              {isGroup && <div className="tl-drop">{renderDrop(st.items)}</div>}
            </div>
          )
        })}
      </div>

      {selected && (
        <div className="tl-info">
          <div className="tl-info-title">
            {selected.n} {fmt(selected.a)}–{fmt(selected.b)}（{selected.b - selected.a}年）
          </div>
          <div className="tl-info-body">{selected.info}</div>
        </div>
      )}
    </div>
  )
}
