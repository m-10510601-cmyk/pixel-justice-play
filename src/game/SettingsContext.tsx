import { createContext, useContext, useEffect, useMemo, useState, ReactNode, useCallback, useRef } from "react";
import {
  applyXp,
  loadLevel,
  resolveQuiz as resolveLevelQuiz,
  saveLevel,
  xpToNext as xpNeeded,
  LEVEL_NAMES,
  type LevelState,
  loadXpSources,
  saveXpSources,
  DEFAULT_XP_SOURCES,
  type XpSource,
  type XpSources,
} from "@/lib/levels";
import { loadAvatar, saveAvatar, type AvatarId } from "@/lib/avatars";

export type Theme = "light" | "dark" | "default";
export type Lang = "en" | "zh" | "ms";

type Dict = Record<string, string>;
const DICT: Record<Lang, Dict> = {
  en: {
    "evidence.title": "EVIDENCE ANALYSIS",
    "evidence.help": "Tap to mark evidence as RELIABLE. Long-press for details.",
    "evidence.selected": "✓ SELECTED",
    "evidence.close": "CLOSE",
    "legal.title": "LEGAL REASONING",
    "legal.help": "Choose the legal category that best fits the evidence. Think — don't guess.",
    "verdict.title": "DELIVER VERDICT",
    "verdict.help": "Your final judgement. Choose carefully — there are consequences.",
    "verdict.guilty": "⚖ GUILTY",
    "verdict.notguilty": "✓ NOT GUILTY",
    "verdict.assign": "ASSIGN PUNISHMENT",
    "verdict.deliver": "DELIVER ▶",
    "result.title": "EVALUATION",
    "result.upheld": "JUDGEMENT UPHELD",
    "result.questioned": "JUDGEMENT QUESTIONED",
    "result.alignsYes": "Your verdict aligns with the evidence and the standard of proof.",
    "result.alignsNo": "Your verdict diverges from what the reliable evidence supports.",
    "result.standard": "STANDARD: ",
    "result.impact": "SOCIETAL IMPACT",
    "result.justice": "Justice",
    "result.trust": "Public Trust",
    "result.fairness": "Fairness",
    "result.compare": "COMPARE TO REAL CASES",
    "result.hide": "HIDE REAL-WORLD NOTE",
    "result.retry": "RETRY",
    "result.continue": "CONTINUE",
    "app.title": "LAW GUARDIAN",
    "app.tagline":
      "Defend justice across school halls and city streets. Solve cases, learn the law, become a true Law Guardian.",
    "btn.start": "▶ START",
    "btn.back": "←",
    "btn.next": "NEXT ▶",
    "nav.triumph": "TRIUMPH",
    "nav.settings": "SETTINGS",
    "nav.store": "STORE",
    "quest.title": "CHOOSE YOUR QUEST",
    "quest.school": "1. SCHOOL LIFE",
    "quest.society": "2. SOCIETY LIFE",
    "chapter.school.title": "SCHOOL CHAPTER",
    "chapter.society.title": "SOCIETY CHAPTER",
    "chapter.school.blurb": "Build core judgement skills with relatable cases — theft, cheating, bullying.",
    "chapter.society.blurb": "Confront grey areas — fraud, negligence, public disputes — where impact is broader.",
    "chapter.case": "CASE",
    "settings.title": "SETTINGS",
    "avatar.title": "CHOOSE AVATAR",
    "avatar.equipped": "EQUIPPED",
    "avatar.locked": "Reach Lv {n} to unlock",
    "avatar.current": "Current Lv",
    "avatar.close": "CLOSE",
    "settings.brightness": "BRIGHTNESS",
    "settings.sound": "SOUND",
    "settings.bgm": "MUSIC",
    "settings.on": "ON",
    "settings.off": "OFF",
    "settings.language": "LANGUAGE",
    "settings.terms": "TERMS OF POLICY",
    "settings.feedback": "FEEDBACK",
    "lang.zh": "华文",
    "lang.ms": "B. MELAYU",
    "lang.en": "ENGLISH",
    "store.title": "STORE",
    "triumph.title": "TRIUMPH",
    "triumph.done": "★ DONE",
    "triumph.locked": "✕ LOCKED",
    "case.brief": "CASE BRIEF",
    "case.statements": "STATEMENTS",
    "step.brief": "BRIEF",
    "step.evidence": "EVIDENCE",
    "step.law": "LAW",
    "step.verdict": "VERDICT",
    "step.result": "RESULT",
    "home.coins": "COINS",
    "home.tagline": "A legal education journey matched to Malaysian Law.",
    "tutorial.title": "NEW PLAYER TUTORIAL",
    "tutorial.body":
      "Pick a chapter and solve cases: read the brief, weigh evidence, choose a law category, then deliver a verdict. Correct judgements earn ⭐ coins. Spend coins in the STORE.",
    "tutorial.ok": "GOT IT",
    "daily.title": "DAILY REWARDS",
    "daily.day": "DAY",
    "daily.claim": "CLAIM",
    "daily.claimed": "CLAIMED",
    "daily.come_back": "COME BACK TOMORROW",
    "daily.special": "SPECIAL TOOL",
    "share.title": "INVITE FRIENDS",
    "share.copy": "COPY INVITE LINK",
    "share.copied": "LINK COPIED! +100 COINS",
    "share.already": "REWARD ALREADY CLAIMED",
    "save.title": "CLOUD SAVE",
    "save.now": "SAVE NOW",
    "save.load": "LOAD",
    "save.saved": "PROGRESS SAVED",
    "save.loaded": "PROGRESS LOADED",
    "feedback.title": "FEEDBACK",
    "feedback.placeholder": "Tell us your suggestion…",
    "feedback.send": "SEND",
    "feedback.thanks": "THANK YOU!",
    "store.time_ext": "TIME EXTENSION",
    "store.owned": "OWNED",
    "store.buy": "BUY",
    "store.not_enough": "NOT ENOUGH COINS",
    "terms.title": "TERMS & POLICY",
    "terms.tos": "TERMS OF SERVICE",
    "terms.tos_body":
      "Educational purpose only. Fictional characters and scenarios. Not professional legal advice. Content is matched to Malaysian Law for learning.",
    "terms.privacy": "PRIVACY POLICY",
    "terms.privacy_body":
      "We do not collect personal data. Only non-personal gameplay data is stored locally. No data is shared with third parties.",
    "terms.ai": "AI ETHICS",
    "terms.ai_body":
      "AI enhances interactivity to support critical thinking. We acknowledge AI limitations and commit to safe, ethical educational content.",
    "terms.agree": "I AGREE",
    "quiz.title": "LEVEL-UP QUIZ",
    "quiz.promotionTo": "Promotion to",
    "quiz.intro": "Answer 5 legal questions. Score 3 or more to level up. Fail and your current-level XP is reset.",
    "quiz.rule1": "5 questions, single choice.",
    "quiz.rule2": "Pass = 3 correct or more.",
    "quiz.rule3": "Fail keeps your level but resets XP to 0.",
    "quiz.begin": "BEGIN",
    "quiz.question": "Q",
    "quiz.next": "NEXT",
    "quiz.submit": "SUBMIT",
    "quiz.passed": "PASSED — LEVEL UP!",
    "quiz.failed": "FAILED — XP RESET",
    "quiz.score": "Score",
    "quiz.promotedTo": "Promoted to",
    "quiz.xpReset": "Try clearing chapters again to retry.",
    "quiz.done": "CONTINUE",
    "reward.xpGained": "Experience gained",
    "reward.levelProgress": "Level Progress",
    "quiz.ready": "★ Level-up quiz unlocked — return home!",
    "level.details.title": "LEVEL DETAILS",
    "level.next": "Next Level",
    "level.toNext": "XP to next level",
    "level.path": "Promotion Path",
    "level.howToEarn": "How to earn XP",
    "level.howBody": "Complete chapters: each ⭐ earned = 10 XP. Replays count too. Pass the 5-question quiz at each tier to level up — failing keeps your level but resets current XP.",
    "level.challengeNow": "Challenge Quiz Now",
    "level.statusCurrent": "Current",
    "level.statusDone": "Achieved",
    "level.statusLocked": "Locked",
    "level.maxed": "MAX LEVEL",
    "level.sources.title": "XP SOURCES",
    "level.sources.chapter": "First clear",
    "level.sources.replay": "Replay",
    "level.sources.quiz": "Quiz bonus",
    "level.sources.total": "Total",
  },
  zh: {
    "evidence.title": "证据分析",
    "evidence.help": "轻触将证据标记为可靠。长按查看详情。",
    "evidence.selected": "✓ 已选择",
    "evidence.close": "关闭",
    "legal.title": "法律推理",
    "legal.help": "选择最符合证据的法律类别。要思考 — 别乱猜。",
    "verdict.title": "宣判",
    "verdict.help": "这是你的最终判决，请慎重 — 后果由你承担。",
    "verdict.guilty": "⚖ 有罪",
    "verdict.notguilty": "✓ 无罪",
    "verdict.assign": "决定处分",
    "verdict.deliver": "宣判 ▶",
    "result.title": "评估",
    "result.upheld": "判决获支持",
    "result.questioned": "判决受到质疑",
    "result.alignsYes": "你的判决符合证据与举证标准。",
    "result.alignsNo": "你的判决偏离了可靠证据所支持的结论。",
    "result.standard": "标准：",
    "result.impact": "社会影响",
    "result.justice": "正义",
    "result.trust": "公众信任",
    "result.fairness": "公正",
    "result.compare": "对比真实案例",
    "result.hide": "隐藏真实案例说明",
    "result.retry": "重试",
    "result.continue": "继续",
    "app.title": "正义守护者",
    "app.tagline": "在校园与城市间捍卫正义。审理案件、学习法律，成为真正的正义守护者。",
    "btn.start": "▶ 开始",
    "btn.back": "←",
    "btn.next": "下一步 ▶",
    "nav.triumph": "成就",
    "nav.settings": "设置",
    "nav.store": "商店",
    "quest.title": "选择任务",
    "quest.school": "1. 校园生活",
    "quest.society": "2. 社会生活",
    "chapter.school.title": "校园篇章",
    "chapter.society.title": "社会篇章",
    "chapter.school.blurb": "通过盗窃、作弊、霸凌等贴近生活的案件，培养基础判断能力。",
    "chapter.society.blurb": "面对欺诈、过失与公共纠纷等灰色地带，影响更为广泛。",
    "chapter.case": "案件",
    "settings.title": "设置",
    "avatar.title": "选择头像",
    "avatar.equipped": "已装备",
    "avatar.locked": "升至 Lv {n} 解锁",
    "avatar.current": "当前等级",
    "avatar.close": "关闭",
    "settings.brightness": "亮度",
    "settings.sound": "音量",
    "settings.bgm": "背景音乐",
    "settings.on": "开",
    "settings.off": "关",
    "settings.language": "语言",
    "settings.terms": "服务条款",
    "settings.feedback": "反馈",
    "lang.zh": "华文",
    "lang.ms": "B. MELAYU",
    "lang.en": "ENGLISH",
    "store.title": "商店",
    "triumph.title": "成就",
    "triumph.done": "★ 已完成",
    "triumph.locked": "✕ 未解锁",
    "case.brief": "案件简介",
    "case.statements": "陈述",
    "step.brief": "简介",
    "step.evidence": "证据",
    "step.law": "法律",
    "step.verdict": "判决",
    "step.result": "结果",
    "home.coins": "金币",
    "home.tagline": "贴合马来西亚法律的法律教育之旅。",
    "tutorial.title": "新手教程",
    "tutorial.body":
      "选择章节并解决案件：阅读简介、权衡证据、选择法律类别，然后宣判。正确判决获得 ⭐ 金币，可在商店消费。",
    "tutorial.ok": "明白了",
    "daily.title": "每日奖励",
    "daily.day": "第",
    "daily.claim": "领取",
    "daily.claimed": "已领取",
    "daily.come_back": "明天再来",
    "daily.special": "特别道具",
    "share.title": "邀请好友",
    "share.copy": "复制邀请链接",
    "share.copied": "已复制！+100 金币",
    "share.already": "奖励已领取",
    "save.title": "云端存档",
    "save.now": "立即保存",
    "save.load": "读取",
    "save.saved": "已保存进度",
    "save.loaded": "已读取进度",
    "feedback.title": "反馈",
    "feedback.placeholder": "请告诉我们您的建议…",
    "feedback.send": "发送",
    "feedback.thanks": "谢谢您！",
    "store.time_ext": "时间延长",
    "store.owned": "已拥有",
    "store.buy": "购买",
    "store.not_enough": "金币不足",
    "terms.title": "条款与政策",
    "terms.tos": "服务条款",
    "terms.tos_body": "仅作教育用途。虚构人物与情境。非专业法律建议。内容贴合马来西亚法律以供学习。",
    "terms.privacy": "隐私政策",
    "terms.privacy_body": "我们不收集个人数据。仅在本地存储非个人游玩数据，不与第三方共享。",
    "terms.ai": "AI 伦理",
    "terms.ai_body": "AI 提升互动以支持批判性思考。我们承认 AI 的局限，并承诺提供安全、合乎伦理的教育内容。",
    "terms.agree": "我同意",
    "quiz.title": "升级测验",
    "quiz.promotionTo": "晋升至",
    "quiz.intro": "回答 5 题法律题。答对 3 题或以上即可升级，否则当前等级经验清零。",
    "quiz.rule1": "5 题单选。",
    "quiz.rule2": "通过条件：答对 ≥ 3 题。",
    "quiz.rule3": "未通过则保留等级，当前 XP 清零。",
    "quiz.begin": "开始",
    "quiz.question": "第",
    "quiz.next": "下一题",
    "quiz.submit": "提交",
    "quiz.passed": "通过 — 等级提升！",
    "quiz.failed": "未通过 — 经验清零",
    "quiz.score": "得分",
    "quiz.promotedTo": "已晋升至",
    "quiz.xpReset": "再去刷章节重新挑战吧。",
    "quiz.done": "继续",
    "reward.xpGained": "获得经验",
    "reward.levelProgress": "等级进度",
    "quiz.ready": "★ 升级测验已就绪 — 回主页应战！",
    "level.details.title": "等级详情",
    "level.next": "下一级",
    "level.toNext": "距下一级",
    "level.path": "晋升路线",
    "level.howToEarn": "如何获得经验",
    "level.howBody": "完成章节：本次每获得一颗 ⭐ 计入 10 点经验，重复刷取同样有效。每升一级前需通过 5 题法律测验（答对 ≥ 3 题），失败则保留等级、当前经验清零。",
    "level.challengeNow": "立即挑战测验",
    "level.statusCurrent": "当前",
    "level.statusDone": "已达成",
    "level.statusLocked": "未解锁",
    "level.maxed": "已满级",
    "level.sources.title": "XP 来源",
    "level.sources.chapter": "首次通关",
    "level.sources.replay": "重玩",
    "level.sources.quiz": "测验奖励",
    "level.sources.total": "累计",
  },
  ms: {
    "evidence.title": "ANALISIS BUKTI",
    "evidence.help": "Ketik untuk menandakan bukti sebagai BOLEH DIPERCAYAI. Tekan lama untuk butiran.",
    "evidence.selected": "✓ DIPILIH",
    "evidence.close": "TUTUP",
    "legal.title": "PENAAKULAN UNDANG-UNDANG",
    "legal.help": "Pilih kategori undang-undang yang paling sesuai dengan bukti. Fikir — jangan teka.",
    "verdict.title": "SAMPAIKAN KEPUTUSAN",
    "verdict.help": "Penghakiman akhir anda. Pilih dengan teliti — ada akibatnya.",
    "verdict.guilty": "⚖ BERSALAH",
    "verdict.notguilty": "✓ TIDAK BERSALAH",
    "verdict.assign": "TETAPKAN HUKUMAN",
    "verdict.deliver": "SAMPAIKAN ▶",
    "result.title": "PENILAIAN",
    "result.upheld": "PENGHAKIMAN DIKEKALKAN",
    "result.questioned": "PENGHAKIMAN DIPERSOAL",
    "result.alignsYes": "Keputusan anda selaras dengan bukti dan piawaian pembuktian.",
    "result.alignsNo": "Keputusan anda menyimpang daripada apa yang disokong oleh bukti yang boleh dipercayai.",
    "result.standard": "PIAWAIAN: ",
    "result.impact": "IMPAK SOSIAL",
    "result.justice": "Keadilan",
    "result.trust": "Kepercayaan Awam",
    "result.fairness": "Kesaksamaan",
    "result.compare": "BANDING DENGAN KES SEBENAR",
    "result.hide": "SEMBUNYI NOTA DUNIA SEBENAR",
    "result.retry": "CUBA SEMULA",
    "result.continue": "TERUSKAN",
    "app.title": "PENJAGA UNDANG-UNDANG",
    "app.tagline":
      "Pertahankan keadilan di sekolah dan jalanan kota. Selesaikan kes, pelajari undang-undang, jadilah Penjaga sejati.",
    "btn.start": "▶ MULA",
    "btn.back": "←",
    "btn.next": "SETERUSNYA ▶",
    "nav.triumph": "KEMENANGAN",
    "nav.settings": "TETAPAN",
    "nav.store": "KEDAI",
    "quest.title": "PILIH MISI ANDA",
    "quest.school": "1. KEHIDUPAN SEKOLAH",
    "quest.society": "2. KEHIDUPAN MASYARAKAT",
    "chapter.school.title": "BAB SEKOLAH",
    "chapter.society.title": "BAB MASYARAKAT",
    "chapter.school.blurb": "Bina kemahiran asas penghakiman melalui kes — kecurian, peniruan, buli.",
    "chapter.society.blurb": "Hadapi kawasan kelabu — penipuan, kecuaian, pertikaian awam — dengan impak lebih luas.",
    "chapter.case": "KES",
    "settings.title": "TETAPAN",
    "avatar.title": "PILIH AVATAR",
    "avatar.equipped": "DIPAKAI",
    "avatar.locked": "Capai Lv {n} untuk buka",
    "avatar.current": "Tahap Semasa",
    "avatar.close": "TUTUP",
    "settings.brightness": "KECERAHAN",
    "settings.sound": "BUNYI",
    "settings.bgm": "MUZIK",
    "settings.on": "HIDUP",
    "settings.off": "MATI",
    "settings.language": "BAHASA",
    "settings.terms": "TERMA POLISI",
    "settings.feedback": "MAKLUM BALAS",
    "lang.zh": "华文",
    "lang.ms": "B. MELAYU",
    "lang.en": "ENGLISH",
    "store.title": "KEDAI",
    "triumph.title": "KEMENANGAN",
    "triumph.done": "★ SELESAI",
    "triumph.locked": "✕ TERKUNCI",
    "case.brief": "RINGKASAN KES",
    "case.statements": "KENYATAAN",
    "step.brief": "RINGKASAN",
    "step.evidence": "BUKTI",
    "step.law": "UNDANG",
    "step.verdict": "KEPUTUSAN",
    "step.result": "HASIL",
    "home.coins": "SYILING",
    "home.tagline": "Perjalanan pendidikan undang-undang yang sepadan dengan Undang-undang Malaysia.",
    "tutorial.title": "TUTORIAL PEMAIN BARU",
    "tutorial.body":
      "Pilih bab dan selesaikan kes: baca ringkasan, timbang bukti, pilih kategori undang-undang, kemudian sampaikan keputusan. Penghakiman betul memperoleh ⭐ syiling untuk dibelanjakan di KEDAI.",
    "tutorial.ok": "FAHAM",
    "daily.title": "GANJARAN HARIAN",
    "daily.day": "HARI",
    "daily.claim": "TUNTUT",
    "daily.claimed": "DITUNTUT",
    "daily.come_back": "KEMBALI ESOK",
    "daily.special": "ALAT KHAS",
    "share.title": "JEMPUT RAKAN",
    "share.copy": "SALIN PAUTAN JEMPUTAN",
    "share.copied": "DISALIN! +100 SYILING",
    "share.already": "GANJARAN TELAH DITUNTUT",
    "save.title": "SIMPAN AWAN",
    "save.now": "SIMPAN SEKARANG",
    "save.load": "MUAT",
    "save.saved": "KEMAJUAN DISIMPAN",
    "save.loaded": "KEMAJUAN DIMUAT",
    "feedback.title": "MAKLUM BALAS",
    "feedback.placeholder": "Beritahu cadangan anda…",
    "feedback.send": "HANTAR",
    "feedback.thanks": "TERIMA KASIH!",
    "store.time_ext": "LANJUTAN MASA",
    "store.owned": "DIMILIKI",
    "store.buy": "BELI",
    "store.not_enough": "SYILING TIDAK CUKUP",
    "terms.title": "TERMA & POLISI",
    "terms.tos": "TERMA PERKHIDMATAN",
    "terms.tos_body":
      "Tujuan pendidikan sahaja. Watak dan senario rekaan. Bukan nasihat undang-undang profesional. Kandungan disepadankan dengan Undang-undang Malaysia.",
    "terms.privacy": "DASAR PRIVASI",
    "terms.privacy_body":
      "Kami tidak mengumpul data peribadi. Hanya data permainan bukan peribadi disimpan secara setempat. Tiada perkongsian dengan pihak ketiga.",
    "terms.ai": "ETIKA AI",
    "terms.ai_body":
      "AI menambah interaktiviti untuk menyokong pemikiran kritis. Kami mengakui had AI dan komited kepada kandungan pendidikan yang selamat dan beretika.",
    "terms.agree": "SAYA BERSETUJU",
    "quiz.title": "KUIZ NAIK PANGKAT",
    "quiz.promotionTo": "Naik pangkat ke",
    "quiz.intro": "Jawab 5 soalan undang-undang. Jawab betul 3 atau lebih untuk naik pangkat. Gagal akan reset XP tahap semasa.",
    "quiz.rule1": "5 soalan, pilih satu.",
    "quiz.rule2": "Lulus = 3 jawapan betul atau lebih.",
    "quiz.rule3": "Gagal mengekalkan tahap tetapi reset XP.",
    "quiz.begin": "MULA",
    "quiz.question": "Soalan",
    "quiz.next": "SETERUSNYA",
    "quiz.submit": "HANTAR",
    "quiz.passed": "LULUS — NAIK TAHAP!",
    "quiz.failed": "GAGAL — XP DIRESET",
    "quiz.score": "Markah",
    "quiz.promotedTo": "Dinaikkan ke",
    "quiz.xpReset": "Cuba selesaikan bab semula untuk mencuba lagi.",
    "quiz.done": "TERUSKAN",
    "reward.xpGained": "EXP Diperoleh",
    "reward.levelProgress": "Kemajuan Tahap",
    "quiz.ready": "★ Kuiz naik tahap dibuka — pulang!",
    "level.details.title": "BUTIRAN TAHAP",
    "level.next": "Tahap Seterusnya",
    "level.toNext": "EXP ke tahap seterusnya",
    "level.path": "Laluan Naik Pangkat",
    "level.howToEarn": "Cara dapat EXP",
    "level.howBody": "Selesaikan bab: setiap ⭐ diperoleh = 10 EXP. Main semula juga dikira. Lulus kuiz 5 soalan di setiap tahap untuk naik pangkat — gagal mengekalkan tahap tetapi reset EXP semasa.",
    "level.challengeNow": "Cabar Kuiz Sekarang",
    "level.statusCurrent": "Semasa",
    "level.statusDone": "Dicapai",
    "level.statusLocked": "Terkunci",
    "level.maxed": "TAHAP MAKSIMUM",
    "level.sources.title": "SUMBER EXP",
    "level.sources.chapter": "Tamat Pertama",
    "level.sources.replay": "Main Semula",
    "level.sources.quiz": "Bonus Kuiz",
    "level.sources.total": "Jumlah",
  },
};

interface Ctx {
  theme: Theme;
  setTheme: (t: Theme) => void;
  volume: number;
  setVolume: (v: number) => void;
  bgmEnabled: boolean;
  setBgmEnabled: (b: boolean) => void;
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  playCue: () => void;
  coins: number;
  addCoins: (n: number) => void;
  spendCoins: (n: number) => boolean;
  agreedTerms: boolean;
  acceptTerms: () => void;
  tutorialSeen: boolean;
  markTutorialSeen: () => void;
  shareClaimed: boolean;
  claimShare: () => void;
  dailyClaims: boolean[]; // length 7
  dailyAvailableDay: number; // 1..7, 0 if all claimed today
  claimDailyDay: (day: number) => boolean;
  timeExtensions: number;
  buyTimeExtension: () => boolean;
  // Level / XP system
  level: 1 | 2 | 3 | 4 | 5;
  levelName: string;
  xp: number;
  xpToNext: number;
  pendingQuiz: boolean;
  addXp: (n: number, source?: XpSource) => void;
  resolveQuiz: (passed: boolean) => void;
  xpSources: XpSources;
  avatarId: AvatarId;
  setAvatar: (id: AvatarId) => void;
}

const SettingsCtx = createContext<Ctx | null>(null);

const LS = "lawguardian.settings.v1";
const META_LS = "lawguardian.meta.v1";

type Meta = {
  coins: number;
  agreedTerms: boolean;
  tutorialSeen: boolean;
  shareClaimed: boolean;
  dailyClaims: boolean[];
  dailyDate: string; // YYYY-MM-DD of last reset
  timeExtensions: number;
};
const DEFAULT_META: Meta = {
  coins: 0,
  agreedTerms: false,
  tutorialSeen: false,
  shareClaimed: false,
  dailyClaims: [false, false, false, false, false, false, false],
  dailyDate: "",
  timeExtensions: 0,
};
const todayStr = () => new Date().toISOString().slice(0, 10);
const loadMeta = (): Meta => {
  try {
    const raw = localStorage.getItem(META_LS);
    if (!raw) return { ...DEFAULT_META };
    const m = { ...DEFAULT_META, ...(JSON.parse(raw) as Partial<Meta>) };
    if (!Array.isArray(m.dailyClaims) || m.dailyClaims.length !== 7) {
      m.dailyClaims = [...DEFAULT_META.dailyClaims];
    }
    return m;
  } catch {
    return { ...DEFAULT_META };
  }
};

const load = () => {
  try {
    const raw = localStorage.getItem(LS);
    if (!raw) return null;
    return JSON.parse(raw) as { theme?: Theme; volume?: number; lang?: Lang };
    // bgmEnabled is read separately below to keep back-compat
  } catch {
    return null;
  }
};

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const initial = typeof window !== "undefined" ? load() : null;
  const [theme, setThemeState] = useState<Theme>(initial?.theme ?? "default");
  const [volume, setVolumeState] = useState<number>(
    typeof initial?.volume === "number" ? Math.min(100, Math.max(0, initial.volume)) : 70,
  );
  const [bgmEnabled, setBgmEnabledState] = useState<boolean>(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(LS) : null;
      if (!raw) return true;
      const v = JSON.parse(raw) as { bgmEnabled?: boolean };
      return v.bgmEnabled !== false;
    } catch {
      return true;
    }
  });
  const [lang, setLangState] = useState<Lang>(initial?.lang ?? "en");
  const [meta, setMeta] = useState<Meta>(() => (typeof window !== "undefined" ? loadMeta() : { ...DEFAULT_META }));
  const [levelState, setLevelState] = useState<LevelState>(() =>
    typeof window !== "undefined" ? loadLevel() : { level: 1, xp: 0, pendingQuiz: false },
  );
  const [xpSources, setXpSources] = useState<XpSources>(() =>
    typeof window !== "undefined" ? loadXpSources() : { ...DEFAULT_XP_SOURCES },
  );
  const [avatarId, setAvatarIdState] = useState<AvatarId>(() =>
    typeof window !== "undefined" ? loadAvatar() : "rookie",
  );
  const setAvatar = useCallback((id: AvatarId) => {
    setAvatarIdState(id);
    saveAvatar(id);
  }, []);

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(LS, JSON.stringify({ theme, volume, lang, bgmEnabled }));
    } catch {}
  }, [theme, volume, lang, bgmEnabled]);

  useEffect(() => {
    try {
      localStorage.setItem(META_LS, JSON.stringify(meta));
    } catch {}
  }, [meta]);

  useEffect(() => {
    saveLevel(levelState);
  }, [levelState]);

  useEffect(() => {
    saveXpSources(xpSources);
  }, [xpSources]);

  // Apply theme class to <html>
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("theme-light", "theme-dark");
    if (theme === "light") root.classList.add("theme-light");
    if (theme === "dark") root.classList.add("theme-dark");
  }, [theme]);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const playCue = useCallback(() => {
    try {
      if (volume <= 0) return;
      if (!audioCtxRef.current) {
        const AC =
          window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AC();
      }
      const ctx = audioCtxRef.current!;
      if (ctx.state === "suspended") ctx.resume();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "square";
      o.frequency.value = 660;
      g.gain.value = (volume / 100) * 0.08;
      o.connect(g).connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + 0.06);
    } catch {}
  }, [volume]);

  const setTheme = useCallback((t: Theme) => setThemeState(t), []);
  const setVolume = useCallback((v: number) => setVolumeState(Math.min(100, Math.max(0, v))), []);
  const setBgmEnabled = useCallback((b: boolean) => setBgmEnabledState(b), []);
  const setLang = useCallback((l: Lang) => setLangState(l), []);

  const t = useCallback((key: string) => DICT[lang][key] ?? DICT.en[key] ?? key, [lang]);

  const addCoins = useCallback((n: number) => {
    setMeta((m) => ({ ...m, coins: Math.max(0, m.coins + n) }));
  }, []);
  const spendCoins = useCallback((n: number) => {
    let ok = false;
    setMeta((m) => {
      if (m.coins < n) return m;
      ok = true;
      return { ...m, coins: m.coins - n };
    });
    return ok;
  }, []);
  const acceptTerms = useCallback(() => setMeta((m) => ({ ...m, agreedTerms: true })), []);
  const markTutorialSeen = useCallback(() => setMeta((m) => ({ ...m, tutorialSeen: true })), []);
  const claimShare = useCallback(() => {
    setMeta((m) => (m.shareClaimed ? m : { ...m, shareClaimed: true, coins: m.coins + 100 }));
  }, []);

  // Daily reset: if dailyDate differs from today, reset claims for next day eligibility.
  // Logic: dailyClaims[i] true == claimed. The "available day" is the lowest unclaimed index+1.
  // We only allow claiming once per real day (track via dailyDate).
  const claimDailyDay = useCallback((day: number) => {
    let ok = false;
    setMeta((m) => {
      const idx = day - 1;
      if (idx < 0 || idx > 6) return m;
      if (m.dailyClaims[idx]) return m;
      // must be the next available day
      const nextIdx = m.dailyClaims.findIndex((c) => !c);
      if (nextIdx !== idx) return m;
      // one claim per day
      const today = todayStr();
      if (m.dailyDate === today) return m;
      const newClaims = [...m.dailyClaims];
      newClaims[idx] = true;
      const reward = day === 7 ? 0 : 50 * day; // day 7 = special tool
      const extras = day === 7 ? 1 : 0;
      ok = true;
      // If all 7 claimed, cycle resets next day
      const allDone = newClaims.every((c) => c);
      return {
        ...m,
        dailyClaims: allDone ? [...DEFAULT_META.dailyClaims] : newClaims,
        dailyDate: today,
        coins: m.coins + reward,
        timeExtensions: m.timeExtensions + extras,
      };
    });
    return ok;
  }, []);

  const buyTimeExtension = useCallback(() => {
    let ok = false;
    setMeta((m) => {
      if (m.coins < 150) return m;
      ok = true;
      return { ...m, coins: m.coins - 150, timeExtensions: m.timeExtensions + 1 };
    });
    return ok;
  }, []);

  const addXp = useCallback((n: number, source: XpSource = "chapter") => {
    if (n <= 0) return;
    setLevelState((s) => applyXp(s, n));
    setXpSources((s) => ({ ...s, [source]: s[source] + n }));
  }, []);
  const resolveQuiz = useCallback((passed: boolean) => {
    setLevelState((s) => resolveLevelQuiz(s, passed));
    if (passed) {
      // Quiz pass bonus — recorded as quiz source.
      setLevelState((s) => applyXp(s, 20));
      setXpSources((s) => ({ ...s, quiz: s.quiz + 20 }));
    }
  }, []);

  const dailyAvailableDay = (() => {
    if (meta.dailyDate === todayStr()) return 0;
    const idx = meta.dailyClaims.findIndex((c) => !c);
    return idx < 0 ? 0 : idx + 1;
  })();

  const value = useMemo<Ctx>(
    () => ({
      theme,
      setTheme,
      volume,
      setVolume,
      bgmEnabled,
      setBgmEnabled,
      lang,
      setLang,
      t,
      playCue,
      coins: meta.coins,
      addCoins,
      spendCoins,
      agreedTerms: meta.agreedTerms,
      acceptTerms,
      tutorialSeen: meta.tutorialSeen,
      markTutorialSeen,
      shareClaimed: meta.shareClaimed,
      claimShare,
      dailyClaims: meta.dailyClaims,
      dailyAvailableDay,
      claimDailyDay,
      timeExtensions: meta.timeExtensions,
      buyTimeExtension,
      level: levelState.level,
      levelName: LEVEL_NAMES[levelState.level],
      xp: levelState.xp,
      xpToNext: xpNeeded(levelState.level),
      pendingQuiz: levelState.pendingQuiz,
      addXp,
      resolveQuiz,
      xpSources,
      avatarId,
      setAvatar,
    }),
    [
      theme,
      setTheme,
      volume,
      setVolume,
      bgmEnabled,
      setBgmEnabled,
      lang,
      setLang,
      t,
      playCue,
      meta,
      addCoins,
      spendCoins,
      acceptTerms,
      markTutorialSeen,
      claimShare,
      dailyAvailableDay,
      claimDailyDay,
      buyTimeExtension,
      levelState,
      addXp,
      resolveQuiz,
      xpSources,
      avatarId,
      setAvatar,
    ],
  );

  return <SettingsCtx.Provider value={value}>{children}</SettingsCtx.Provider>;
};

export const useSettings = () => {
  const v = useContext(SettingsCtx);
  if (!v) throw new Error("useSettings must be used inside <SettingsProvider>");
  return v;
};
