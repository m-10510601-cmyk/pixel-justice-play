import schoolLaptopImg from "@/assets/case-school-laptop.jpg";
import societyFraudImg from "@/assets/case-society-fraud.jpg";
import type { Lang } from "@/game/SettingsContext";

export type LocStr = { en: string; zh: string; ms: string };
export const L = (lang: Lang, s: LocStr | string) =>
  typeof s === "string" ? s : (s[lang] ?? s.en);

export type LegalCategory = {
  id: string;
  label: LocStr;
  correct?: boolean;
  rationale: LocStr;
};

export type Evidence = {
  id: string;
  icon: string;
  title: LocStr;
  summary: LocStr;
  detail: LocStr;
  reliable: boolean;
};

export type Verdict = { id: "guilty" | "not_guilty"; label: LocStr };
export type Punishment = { id: string; label: LocStr };

export type CaseData = {
  id: string;
  chapter: "school" | "society";
  title: LocStr;
  brief: LocStr;
  image?: string;
  statements: { speaker: LocStr; quote: LocStr }[];
  evidence: Evidence[];
  categories: LegalCategory[];
  punishments: Punishment[];
  correctVerdict: Verdict["id"];
  realWorldNote: LocStr;
  standardOfProof: LocStr;
};

export const CASES: CaseData[] = [
  {
    id: "school-1",
    chapter: "school",
    image: schoolLaptopImg,
    title: {
      en: "The Missing Laptop",
      zh: "失踪的笔记本电脑",
      ms: "Komputer Riba yang Hilang",
    },
    brief: {
      en: "A Year-10 student, Alex, is accused of stealing a classmate's laptop from the library during lunch break.",
      zh: "十年级学生阿历克斯（Alex）被指控在午休时间从图书馆盗走同学的笔记本电脑。",
      ms: "Pelajar Tingkatan 4, Alex, dituduh mencuri komputer riba rakan sekelas di perpustakaan ketika rehat tengah hari.",
    },
    statements: [
      {
        speaker: { en: "Witness — Mia", zh: "证人 — 米娅", ms: "Saksi — Mia" },
        quote: {
          en: "I saw Alex near the bag, but I didn't see them open it.",
          zh: "我看到阿历克斯靠近书包，但没看见他打开。",
          ms: "Saya nampak Alex dekat beg itu, tetapi tidak nampak dia membukanya.",
        },
      },
      {
        speaker: { en: "Defendant — Alex", zh: "被告 — 阿历克斯", ms: "Tertuduh — Alex" },
        quote: {
          en: "I was at the canteen the whole time. Ask the cashier.",
          zh: "我一直都在食堂，问收银员就知道。",
          ms: "Saya berada di kantin sepanjang masa. Tanyalah juruwang.",
        },
      },
      {
        speaker: { en: "Victim — Jordan", zh: "受害者 — 乔丹", ms: "Mangsa — Jordan" },
        quote: {
          en: "My laptop was gone when I came back from class.",
          zh: "我下课回来时笔记本电脑就不见了。",
          ms: "Komputer riba saya hilang apabila saya pulang dari kelas.",
        },
      },
    ],
    evidence: [
      {
        id: "cctv",
        icon: "📹",
        title: { en: "Library CCTV", zh: "图书馆监控", ms: "CCTV Perpustakaan" },
        summary: {
          en: "Footage shows a hooded figure near the bag.",
          zh: "录像显示一名戴帽身影靠近书包。",
          ms: "Rakaman menunjukkan sosok berhud berhampiran beg.",
        },
        detail: {
          en: "The figure's face is not visible. Build, height and clothing do not clearly match Alex.",
          zh: "无法看见面孔。体型、身高和衣着与阿历克斯并不吻合。",
          ms: "Wajah tidak kelihatan. Bentuk badan, tinggi dan pakaian tidak jelas sepadan dengan Alex.",
        },
        reliable: false,
      },
      {
        id: "alibi",
        icon: "🥪",
        title: { en: "Canteen Receipt", zh: "食堂收据", ms: "Resit Kantin" },
        summary: {
          en: "Time-stamped receipt at 12:14 PM.",
          zh: "收据时间戳为下午 12:14。",
          ms: "Resit bercop masa 12:14 tengah hari.",
        },
        detail: {
          en: "The theft window is 12:10–12:20. Receipt + cashier statement place Alex away from the library.",
          zh: "盗窃时间为 12:10–12:20。收据加上收银员证词证明阿历克斯不在图书馆。",
          ms: "Tempoh kecurian ialah 12:10–12:20. Resit dan kenyataan juruwang menunjukkan Alex tiada di perpustakaan.",
        },
        reliable: true,
      },
      {
        id: "rumor",
        icon: "💬",
        title: { en: "Hallway Rumor", zh: "走廊传闻", ms: "Khabar Angin Lorong" },
        summary: {
          en: "Students whisper that Alex 'always needs money'.",
          zh: "同学私下议论阿历克斯“总缺钱”。",
          ms: "Pelajar berbisik Alex 'sentiasa perlukan duit'.",
        },
        detail: {
          en: "Hearsay with no source. Not admissible as evidence of theft.",
          zh: "无来源的传闻，无法作为盗窃证据。",
          ms: "Cakap dengar tanpa sumber. Tidak boleh diterima sebagai bukti kecurian.",
        },
        reliable: false,
      },
      {
        id: "fingerprint",
        icon: "🔍",
        title: { en: "No Prints on Bag", zh: "书包上无指纹", ms: "Tiada Cap Jari pada Beg" },
        summary: {
          en: "Forensic check found no usable prints.",
          zh: "鉴识检查未发现可用指纹。",
          ms: "Pemeriksaan forensik tidak menemui cap jari yang boleh digunakan.",
        },
        detail: {
          en: "Absence of physical evidence weakens any direct link to Alex.",
          zh: "缺乏物证削弱了与阿历克斯的直接联系。",
          ms: "Ketiadaan bukti fizikal melemahkan sebarang kaitan langsung dengan Alex.",
        },
        reliable: true,
      },
    ],
    categories: [
      {
        id: "theft",
        label: { en: "Theft", zh: "盗窃", ms: "Kecurian" },
        rationale: {
          en: "Requires proof Alex took the laptop. Evidence does not show this.",
          zh: "需要证据证明阿历克斯拿走了电脑，但证据并未显示这一点。",
          ms: "Memerlukan bukti Alex mengambil komputer riba. Bukti tidak menunjukkannya.",
        },
      },
      {
        id: "misconduct",
        label: { en: "Misconduct", zh: "违纪", ms: "Salah Laku" },
        rationale: {
          en: "No rule-breaking behavior was demonstrated.",
          zh: "未显示任何违反规定的行为。",
          ms: "Tiada tingkah laku melanggar peraturan ditunjukkan.",
        },
      },
      {
        id: "insufficient",
        label: { en: "Insufficient Evidence", zh: "证据不足", ms: "Bukti Tidak Mencukupi" },
        correct: true,
        rationale: {
          en: "Reliable evidence supports Alex's alibi; no direct proof of theft exists.",
          zh: "可靠证据支持阿历克斯的不在场证明；无直接盗窃证据。",
          ms: "Bukti yang boleh dipercayai menyokong alibi Alex; tiada bukti langsung kecurian.",
        },
      },
    ],
    punishments: [
      { id: "none", label: { en: "No Action", zh: "不予处分", ms: "Tiada Tindakan" } },
      { id: "warning", label: { en: "Verbal Warning", zh: "口头警告", ms: "Amaran Lisan" } },
      { id: "suspension", label: { en: "Suspension", zh: "停学", ms: "Penggantungan" } },
    ],
    correctVerdict: "not_guilty",
    realWorldNote: {
      en: "In real schools, disciplinary panels require clear, corroborated evidence. Circumstantial presence is rarely enough.",
      zh: "在真实学校中，纪律委员会需要清晰且相互印证的证据，仅凭出现在现场往往不足以定案。",
      ms: "Di sekolah sebenar, panel disiplin memerlukan bukti yang jelas dan disokong. Kehadiran semata-mata jarang memadai.",
    },
    standardOfProof: {
      en: "Balance of probabilities — and here, the probabilities favor the defendant.",
      zh: "盖然性优势 — 此案中可能性偏向被告。",
      ms: "Imbangan kebarangkalian — dan di sini, kebarangkalian memihak kepada tertuduh.",
    },
  },
  {
    id: "society-1",
    chapter: "society",
    image: societyFraudImg,
    title: {
      en: "The Online Investment Scheme",
      zh: "网络投资骗局",
      ms: "Skim Pelaburan Dalam Talian",
    },
    brief: {
      en: "Sam, a small business owner, is accused of fraud after running an online 'guaranteed returns' investment group that collapsed.",
      zh: "小企业主山姆（Sam）被指控诈骗，他经营的网络“保证回报”投资群组已崩盘。",
      ms: "Sam, pemilik perniagaan kecil, dituduh menipu selepas mengendalikan kumpulan pelaburan dalam talian 'pulangan dijamin' yang runtuh.",
    },
    statements: [
      {
        speaker: { en: "Investor — Priya", zh: "投资者 — 普莉娅", ms: "Pelabur — Priya" },
        quote: {
          en: "Sam personally promised me 30% monthly returns.",
          zh: "山姆亲口向我承诺每月 30% 的回报。",
          ms: "Sam sendiri berjanji kepada saya pulangan bulanan 30%.",
        },
      },
      {
        speaker: { en: "Defendant — Sam", zh: "被告 — 山姆", ms: "Tertuduh — Sam" },
        quote: {
          en: "I believed the strategy would work. I lost my own savings too.",
          zh: "我相信这个策略会成功，我自己的积蓄也亏了。",
          ms: "Saya percaya strategi itu akan berjaya. Saya juga kehilangan simpanan sendiri.",
        },
      },
      {
        speaker: { en: "Accountant — Lee", zh: "会计 — 李", ms: "Akauntan — Lee" },
        quote: {
          en: "Funds from new investors were paid out to earlier ones.",
          zh: "新投资者的资金被支付给早期投资者。",
          ms: "Dana daripada pelabur baharu dibayar kepada pelabur terdahulu.",
        },
      },
    ],
    evidence: [
      {
        id: "chats",
        icon: "💬",
        title: { en: "Promotional Chats", zh: "宣传聊天记录", ms: "Sembang Promosi" },
        summary: {
          en: "Screenshots promising 'guaranteed' returns.",
          zh: "截图承诺“保证”回报。",
          ms: "Tangkap layar menjanjikan pulangan 'dijamin'.",
        },
        detail: {
          en: "Sam's own messages explicitly use the word 'guaranteed' — a material misrepresentation.",
          zh: "山姆的讯息明确使用“保证”一词 — 属于实质性虚假陈述。",
          ms: "Mesej Sam sendiri jelas menggunakan perkataan 'dijamin' — satu salah nyata material.",
        },
        reliable: true,
      },
      {
        id: "ledger",
        icon: "📒",
        title: { en: "Bank Ledger", zh: "银行账目", ms: "Lejar Bank" },
        summary: {
          en: "Shows new deposits funding old payouts.",
          zh: "显示新存款用于支付旧投资者。",
          ms: "Menunjukkan deposit baharu membiayai pembayaran lama.",
        },
        detail: {
          en: "Classic Ponzi-style flow. Strong indicator of fraudulent structure regardless of intent.",
          zh: "典型的庞氏资金流，无论意图如何，均强烈显示为欺诈结构。",
          ms: "Aliran gaya Ponzi klasik. Petunjuk kuat struktur penipuan tanpa mengira niat.",
        },
        reliable: true,
      },
      {
        id: "tweet",
        icon: "🐦",
        title: { en: "Anonymous Tweet", zh: "匿名推文", ms: "Tweet Tanpa Nama" },
        summary: {
          en: "An unknown account claims Sam 'always lies'.",
          zh: "一个不明账号声称山姆“一直在说谎”。",
          ms: "Akaun tidak dikenali mendakwa Sam 'selalu menipu'.",
        },
        detail: {
          en: "Unverified, anonymous source. Not reliable evidence.",
          zh: "未经核实的匿名来源，不属可靠证据。",
          ms: "Sumber tanpa nama yang tidak disahkan. Bukan bukti yang boleh dipercayai.",
        },
        reliable: false,
      },
      {
        id: "loss",
        icon: "💸",
        title: { en: "Sam's Personal Loss", zh: "山姆的个人损失", ms: "Kerugian Peribadi Sam" },
        summary: {
          en: "Sam also lost personal funds.",
          zh: "山姆也亏损了个人资金。",
          ms: "Sam juga kehilangan dana peribadi.",
        },
        detail: {
          en: "Suggests possible self-deception, but does not negate misrepresentation to investors.",
          zh: "可能表明自我欺骗，但不能否认对投资者的虚假陈述。",
          ms: "Menunjukkan kemungkinan tipu diri, tetapi tidak menafikan salah nyata kepada pelabur.",
        },
        reliable: true,
      },
    ],
    categories: [
      {
        id: "fraud",
        label: { en: "Fraud", zh: "欺诈", ms: "Penipuan" },
        correct: true,
        rationale: {
          en: "Knowing misrepresentation ('guaranteed') + Ponzi-style flow meets the threshold.",
          zh: "明知的虚假陈述（“保证”）加上庞氏资金流，已达欺诈门槛。",
          ms: "Salah nyata yang diketahui ('dijamin') + aliran gaya Ponzi mencukupi ambang.",
        },
      },
      {
        id: "negligence",
        label: { en: "Negligence", zh: "过失", ms: "Kecuaian" },
        rationale: {
          en: "Understates the deliberate misrepresentation shown in the chats.",
          zh: "低估了聊天记录中显示的故意虚假陈述。",
          ms: "Memandang ringan salah nyata sengaja yang ditunjukkan dalam sembang.",
        },
      },
      {
        id: "insufficient",
        label: { en: "Insufficient Evidence", zh: "证据不足", ms: "Bukti Tidak Mencukupi" },
        rationale: {
          en: "Two independently reliable evidence streams exist — sufficient.",
          zh: "存在两条独立可靠的证据 — 已经足够。",
          ms: "Dua aliran bukti bebas yang boleh dipercayai wujud — mencukupi.",
        },
      },
    ],
    punishments: [
      { id: "fine", label: { en: "Fine + Restitution", zh: "罚款＋赔偿", ms: "Denda + Pampasan" } },
      { id: "ban", label: { en: "Industry Ban", zh: "行业禁入", ms: "Larangan Industri" } },
      { id: "prison", label: { en: "Custodial Sentence", zh: "监禁", ms: "Hukuman Penjara" } },
    ],
    correctVerdict: "guilty",
    realWorldNote: {
      en: "Real fraud cases (e.g. investment scams) often turn on written promises and money flow patterns, not just intent.",
      zh: "真实的欺诈案件（例如投资骗局）往往取决于书面承诺与资金流向，而不仅仅是意图。",
      ms: "Kes penipuan sebenar (cth. skim pelaburan) sering bergantung pada janji bertulis dan aliran wang, bukan sekadar niat.",
    },
    standardOfProof: {
      en: "Beyond reasonable doubt — met by combined documentary evidence.",
      zh: "排除合理怀疑 — 由综合书面证据满足。",
      ms: "Melampaui keraguan munasabah — dipenuhi oleh gabungan bukti dokumen.",
    },
  },
];

export const getCase = (id: string) => CASES.find((c) => c.id === id);
export const casesByChapter = (chapter: "school" | "society") =>
  CASES.filter((c) => c.chapter === chapter);
