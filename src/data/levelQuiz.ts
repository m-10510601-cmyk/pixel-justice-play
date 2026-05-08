// Mini-quiz banks for level-up challenges. Difficulty rises with tier.
// Tier = current level (1..4). Tier 1 = L1→L2, Tier 4 = L4→L5.
// Each call to getQuiz() returns 5 random questions from the matching bank.

import type { Lang } from "@/game/SettingsContext";

export type QuizQuestion = {
  q: Record<Lang, string>;
  options: Record<Lang, string[]>; // length 4
  answerIdx: number;
  explain: Record<Lang, string>;
};

const tier1: QuizQuestion[] = [
  {
    q: {
      en: "Taking a classmate's pencil without permission is best described as:",
      zh: "未经同意拿走同学的铅笔最贴切的描述是：",
      ms: "Mengambil pensel rakan tanpa kebenaran paling sesuai digambarkan sebagai:",
    },
    options: {
      en: ["Borrowing", "Theft", "Sharing", "Joke"],
      zh: ["借用", "盗窃", "分享", "玩笑"],
      ms: ["Pinjam", "Curi", "Berkongsi", "Gurauan"],
    },
    answerIdx: 1,
    explain: {
      en: "Taking property without consent meets the basic definition of theft.",
      zh: "未经同意取走他人财物即构成盗窃的基本要件。",
      ms: "Mengambil harta tanpa kebenaran memenuhi definisi asas kecurian.",
    },
  },
  {
    q: {
      en: "Which act is illegal in Malaysia?",
      zh: "在马来西亚，下列哪项行为是非法的？",
      ms: "Perbuatan manakah menyalahi undang-undang di Malaysia?",
    },
    options: {
      en: ["Voting at 21", "Drink-driving", "Owning a pet", "Renting a house"],
      zh: ["21 岁投票", "酒驾", "养宠物", "租房"],
      ms: ["Mengundi pada 21", "Memandu mabuk", "Memelihara haiwan", "Menyewa rumah"],
    },
    answerIdx: 1,
    explain: {
      en: "Drink-driving is an offence under the Road Transport Act 1987.",
      zh: "酒驾属 1987 年陆路交通法令下的罪行。",
      ms: "Memandu mabuk adalah kesalahan di bawah Akta Pengangkutan Jalan 1987.",
    },
  },
  {
    q: {
      en: "Bullying that causes injury can be charged under which area of law?",
      zh: "造成伤害的霸凌行为可依据哪一类法律提控？",
      ms: "Buli yang menyebabkan kecederaan boleh didakwa di bawah bidang undang-undang yang mana?",
    },
    options: {
      en: ["Tax law", "Criminal law", "Trade law", "Maritime law"],
      zh: ["税法", "刑法", "贸易法", "海事法"],
      ms: ["Undang-undang cukai", "Undang-undang jenayah", "Undang-undang perdagangan", "Undang-undang maritim"],
    },
    answerIdx: 1,
    explain: {
      en: "Causing hurt is a criminal offence under the Penal Code.",
      zh: "致人受伤属刑事法典下的刑事罪行。",
      ms: "Menyebabkan kecederaan adalah kesalahan jenayah di bawah Kanun Keseksaan.",
    },
  },
  {
    q: {
      en: "Cheating in an exam usually leads to:",
      zh: "考试作弊通常会导致：",
      ms: "Meniru dalam peperiksaan biasanya mengakibatkan:",
    },
    options: {
      en: ["A reward", "School discipline", "A pay rise", "Nothing"],
      zh: ["奖励", "校规处分", "加薪", "无事"],
      ms: ["Ganjaran", "Tindakan disiplin", "Kenaikan gaji", "Tiada apa-apa"],
    },
    answerIdx: 1,
    explain: {
      en: "Schools enforce academic discipline policies against cheating.",
      zh: "学校会依学术诚信规章对作弊进行处分。",
      ms: "Sekolah menguatkuasakan dasar disiplin akademik terhadap peniruan.",
    },
  },
  {
    q: {
      en: "What does 'consent' mean in law?",
      zh: "法律上的“同意”是指：",
      ms: "Apakah maksud 'persetujuan' dalam undang-undang?",
    },
    options: {
      en: ["Silence", "Free agreement", "A guess", "Refusal"],
      zh: ["沉默", "自愿同意", "猜测", "拒绝"],
      ms: ["Diam", "Persetujuan bebas", "Tekaan", "Penolakan"],
    },
    answerIdx: 1,
    explain: {
      en: "Consent must be a free, informed agreement — not silence or pressure.",
      zh: "同意须为自由、知情的合意，不等于沉默或被迫。",
      ms: "Persetujuan mesti bebas dan dimaklumkan — bukan diam atau paksaan.",
    },
  },
  {
    q: {
      en: "Reporting a crime to the police is:",
      zh: "向警方报案是：",
      ms: "Melaporkan jenayah kepada polis adalah:",
    },
    options: {
      en: ["Illegal", "A civic right", "A crime", "Optional only for adults"],
      zh: ["违法", "公民权利", "犯罪", "仅成人选择"],
      ms: ["Menyalahi undang-undang", "Hak sivik", "Jenayah", "Pilihan dewasa sahaja"],
    },
    answerIdx: 1,
    explain: {
      en: "Anyone may lodge a police report; it is a basic civic right.",
      zh: "任何人都可报警，这是基本公民权利。",
      ms: "Sesiapa sahaja boleh membuat laporan polis; ia hak sivik asas.",
    },
  },
  {
    q: {
      en: "Which is NOT evidence?",
      zh: "下列哪项不属于证据？",
      ms: "Yang manakah BUKAN bukti?",
    },
    options: {
      en: ["A photo", "A rumour", "A receipt", "A witness statement"],
      zh: ["照片", "传闻", "收据", "证人陈述"],
      ms: ["Gambar", "Khabar angin", "Resit", "Kenyataan saksi"],
    },
    answerIdx: 1,
    explain: {
      en: "Rumours are unverified hearsay and not admissible evidence.",
      zh: "传闻属未经核实的传言，不构成可采证据。",
      ms: "Khabar angin tidak disahkan dan tidak diterima sebagai bukti.",
    },
  },
  {
    q: {
      en: "A 'minor' in Malaysian law generally means a person under:",
      zh: "马来西亚法律中“未成年人”一般指年龄低于：",
      ms: "'Kanak-kanak' dalam undang-undang Malaysia umumnya bermaksud seseorang berumur bawah:",
    },
    options: {
      en: ["12", "15", "18", "21"],
      zh: ["12", "15", "18", "21"],
      ms: ["12", "15", "18", "21"],
    },
    answerIdx: 2,
    explain: {
      en: "Under the Age of Majority Act 1971, majority is reached at 18.",
      zh: "依据 1971 年成年法令，成年年龄为 18 岁。",
      ms: "Di bawah Akta Umur Dewasa 1971, umur dewasa ialah 18 tahun.",
    },
  },
];

const tier2: QuizQuestion[] = [
  {
    q: {
      en: "Spreading false rumours about a classmate online could be:",
      zh: "在网上散布关于同学的不实谣言，可能构成：",
      ms: "Menyebar khabar palsu mengenai rakan dalam talian boleh menjadi:",
    },
    options: {
      en: ["Free speech", "Defamation", "Marketing", "A compliment"],
      zh: ["言论自由", "诽谤", "营销", "赞美"],
      ms: ["Kebebasan bersuara", "Fitnah", "Pemasaran", "Pujian"],
    },
    answerIdx: 1,
    explain: {
      en: "False statements harming reputation may amount to defamation.",
      zh: "损害他人名誉的不实陈述可构成诽谤。",
      ms: "Kenyataan palsu yang mencederakan nama baik boleh menjadi fitnah.",
    },
  },
  {
    q: {
      en: "Section 379 of the Penal Code addresses:",
      zh: "刑事法典第 379 条针对：",
      ms: "Seksyen 379 Kanun Keseksaan berkaitan:",
    },
    options: {
      en: ["Murder", "Theft", "Defamation", "Forgery"],
      zh: ["谋杀", "盗窃", "诽谤", "伪造"],
      ms: ["Bunuh", "Curi", "Fitnah", "Pemalsuan"],
    },
    answerIdx: 1,
    explain: {
      en: "Section 379 of the Malaysian Penal Code defines theft.",
      zh: "马来西亚刑事法典第 379 条规定盗窃罪。",
      ms: "Seksyen 379 Kanun Keseksaan Malaysia menetapkan kesalahan curi.",
    },
  },
  {
    q: {
      en: "Cyberbullying may be prosecuted under:",
      zh: "网络霸凌可依据下列哪项法律提控：",
      ms: "Buli siber boleh didakwa di bawah:",
    },
    options: {
      en: ["Road Transport Act", "Communications & Multimedia Act", "Income Tax Act", "Companies Act"],
      zh: ["陆路交通法令", "通讯与多媒体法令", "所得税法令", "公司法令"],
      ms: ["Akta Pengangkutan Jalan", "Akta Komunikasi & Multimedia", "Akta Cukai Pendapatan", "Akta Syarikat"],
    },
    answerIdx: 1,
    explain: {
      en: "Section 233 of the Communications & Multimedia Act 1998 covers offensive online content.",
      zh: "1998 年通讯与多媒体法令第 233 条管制具冒犯性的网络内容。",
      ms: "Seksyen 233 Akta Komunikasi & Multimedia 1998 melibatkan kandungan dalam talian yang menyinggung.",
    },
  },
  {
    q: {
      en: "If two students plan a theft together but only one acts, the other is:",
      zh: "若两名学生共谋盗窃但只有一人动手，另一人：",
      ms: "Jika dua pelajar merancang curi tetapi hanya seorang bertindak, yang lain:",
    },
    options: {
      en: ["Innocent", "An abettor", "A witness only", "A victim"],
      zh: ["无罪", "教唆/共犯", "仅证人", "受害人"],
      ms: ["Tidak bersalah", "Bersubahat", "Saksi sahaja", "Mangsa"],
    },
    answerIdx: 1,
    explain: {
      en: "Planning + encouraging the act constitutes abetment under the Penal Code.",
      zh: "策划并鼓励犯罪行为即构成刑事法典下的教唆罪。",
      ms: "Merancang dan menggalakkan perbuatan jenayah adalah subahat di bawah Kanun Keseksaan.",
    },
  },
  {
    q: {
      en: "Hurt caused intentionally is generally covered by:",
      zh: "故意致人受伤通常由下列哪条管辖：",
      ms: "Cederakan dengan sengaja umumnya dilindungi oleh:",
    },
    options: {
      en: ["Section 323 Penal Code", "Contracts Act", "Land Code", "Customs Act"],
      zh: ["刑事法典第 323 条", "契约法令", "土地法典", "海关法令"],
      ms: ["Seksyen 323 Kanun Keseksaan", "Akta Kontrak", "Kanun Tanah", "Akta Kastam"],
    },
    answerIdx: 0,
    explain: {
      en: "Section 323 punishes voluntarily causing hurt.",
      zh: "第 323 条规定故意致人受伤的刑罚。",
      ms: "Seksyen 323 menghukum sengaja menyebabkan kecederaan.",
    },
  },
  {
    q: {
      en: "A teacher seizing a phone for the day is generally:",
      zh: "老师暂时没收手机一天，通常属于：",
      ms: "Guru merampas telefon untuk satu hari secara umum adalah:",
    },
    options: {
      en: ["Theft", "Reasonable discipline", "Robbery", "Assault"],
      zh: ["盗窃", "合理纪律措施", "抢劫", "侵犯"],
      ms: ["Curi", "Disiplin munasabah", "Rompak", "Serangan"],
    },
    answerIdx: 1,
    explain: {
      en: "Schools have lawful authority to enforce reasonable discipline.",
      zh: "学校具备执行合理校纪的合法权力。",
      ms: "Sekolah mempunyai kuasa sah untuk menguatkuasakan disiplin munasabah.",
    },
  },
  {
    q: {
      en: "Which protects children from abuse in Malaysia?",
      zh: "下列哪项法令保护马来西亚儿童免受虐待：",
      ms: "Yang mana melindungi kanak-kanak daripada penderaan di Malaysia?",
    },
    options: {
      en: ["Child Act 2001", "Tourism Act", "Banking Act", "Mining Act"],
      zh: ["2001 年儿童法令", "旅游法令", "银行法令", "采矿法令"],
      ms: ["Akta Kanak-kanak 2001", "Akta Pelancongan", "Akta Perbankan", "Akta Perlombongan"],
    },
    answerIdx: 0,
    explain: {
      en: "The Child Act 2001 is the main statute protecting minors.",
      zh: "2001 年儿童法令是保护未成年人的主要法律。",
      ms: "Akta Kanak-kanak 2001 adalah statut utama melindungi kanak-kanak.",
    },
  },
  {
    q: {
      en: "A signed receipt as evidence is best classified as:",
      zh: "已签署的收据作为证据，最适合归类为：",
      ms: "Resit yang ditandatangani sebagai bukti paling sesuai dikelaskan sebagai:",
    },
    options: {
      en: ["Hearsay", "Documentary evidence", "Opinion", "Rumour"],
      zh: ["传闻", "书证", "意见", "谣言"],
      ms: ["Khabar angin", "Bukti dokumen", "Pendapat", "Khabar"],
    },
    answerIdx: 1,
    explain: {
      en: "Receipts are documentary evidence under the Evidence Act 1950.",
      zh: "收据属于 1950 年证据法令下的书面证据。",
      ms: "Resit ialah bukti dokumen di bawah Akta Keterangan 1950.",
    },
  },
];

const tier3: QuizQuestion[] = [
  {
    q: {
      en: "The standard of proof in a criminal trial is:",
      zh: "刑事审判的举证标准是：",
      ms: "Piawaian pembuktian dalam perbicaraan jenayah ialah:",
    },
    options: {
      en: ["Balance of probabilities", "Beyond reasonable doubt", "More likely than not", "Reasonable suspicion"],
      zh: ["可能性权衡", "排除合理怀疑", "更有可能", "合理怀疑"],
      ms: ["Imbangan kebarangkalian", "Tanpa keraguan munasabah", "Lebih berkemungkinan", "Syak munasabah"],
    },
    answerIdx: 1,
    explain: {
      en: "Criminal cases require proof beyond reasonable doubt.",
      zh: "刑事案件须以排除合理怀疑标准证明。",
      ms: "Kes jenayah memerlukan bukti tanpa keraguan munasabah.",
    },
  },
  {
    q: {
      en: "Mens rea refers to:",
      zh: "“犯罪意图”（mens rea）是指：",
      ms: "Mens rea merujuk kepada:",
    },
    options: {
      en: ["Guilty act", "Guilty mind", "Defence", "Sentence"],
      zh: ["犯罪行为", "犯罪心态", "辩护", "判刑"],
      ms: ["Perbuatan salah", "Niat jahat", "Pembelaan", "Hukuman"],
    },
    answerIdx: 1,
    explain: {
      en: "Mens rea is the mental element — the guilty mind required for most offences.",
      zh: "犯罪意图是大多数罪行所需的主观心态要件。",
      ms: "Mens rea ialah unsur mental — niat jahat yang diperlukan bagi kebanyakan kesalahan.",
    },
  },
  {
    q: {
      en: "Which is a complete defence to a criminal charge?",
      zh: "下列哪项可作为刑事指控的完全抗辩理由？",
      ms: "Yang manakah pembelaan lengkap kepada pertuduhan jenayah?",
    },
    options: {
      en: ["Anger", "Self-defence within limits", "Boredom", "Curiosity"],
      zh: ["愤怒", "在限度内的正当防卫", "无聊", "好奇"],
      ms: ["Marah", "Mempertahankan diri dalam had", "Bosan", "Ingin tahu"],
    },
    answerIdx: 1,
    explain: {
      en: "Lawful self-defence within proportionate limits is a recognised defence.",
      zh: "在比例原则内的合法正当防卫是被认可的抗辩。",
      ms: "Pembelaan diri yang sah dalam had berkadar adalah pembelaan diiktiraf.",
    },
  },
  {
    q: {
      en: "An eyewitness who didn't see the act but heard about it gives:",
      zh: "未亲眼目睹但听他人转述的证人提供的是：",
      ms: "Saksi yang tidak melihat perbuatan tetapi mendengar tentangnya memberikan:",
    },
    options: {
      en: ["Direct evidence", "Hearsay", "Expert evidence", "Real evidence"],
      zh: ["直接证据", "传闻证据", "专家证据", "实物证据"],
      ms: ["Bukti langsung", "Khabar angin", "Bukti pakar", "Bukti benda"],
    },
    answerIdx: 1,
    explain: {
      en: "Second-hand accounts are hearsay and usually inadmissible.",
      zh: "二手转述属传闻证据，通常不可采。",
      ms: "Akaun terpakai ialah khabar angin dan biasanya tidak diterima.",
    },
  },
  {
    q: {
      en: "Negligence requires proof of:",
      zh: "过失（侵权）需要证明：",
      ms: "Kecuaian memerlukan bukti:",
    },
    options: {
      en: ["Intent only", "Duty, breach, causation, damage", "Profit motive", "Witness count"],
      zh: ["仅有意图", "义务、违反、因果、损害", "营利动机", "证人数量"],
      ms: ["Niat sahaja", "Kewajipan, pelanggaran, sebab, kerosakan", "Motif untung", "Bilangan saksi"],
    },
    answerIdx: 1,
    explain: {
      en: "Negligence: duty of care, breach, causation, and resulting damage.",
      zh: "过失四要件：注意义务、违反、因果关系、损害。",
      ms: "Kecuaian: kewajipan jaga, pelanggaran, sebab, dan kerosakan.",
    },
  },
  {
    q: {
      en: "Which court hears most serious criminal cases first instance?",
      zh: "下列哪个法院多审理较严重刑案的第一审？",
      ms: "Mahkamah mana mendengar kebanyakan kes jenayah berat di peringkat pertama?",
    },
    options: {
      en: ["Magistrates' Court", "Sessions Court", "High Court", "Federal Court"],
      zh: ["推事庭", "推事高级庭（Sessions）", "高等法院", "联邦法院"],
      ms: ["Mahkamah Majistret", "Mahkamah Sesyen", "Mahkamah Tinggi", "Mahkamah Persekutuan"],
    },
    answerIdx: 2,
    explain: {
      en: "The High Court has unlimited original criminal jurisdiction for serious offences.",
      zh: "高等法院对严重刑事案件拥有无限制的初审管辖权。",
      ms: "Mahkamah Tinggi mempunyai bidang kuasa asal jenayah yang tidak terhad untuk kesalahan berat.",
    },
  },
  {
    q: {
      en: "Strict liability means:",
      zh: "严格责任意味着：",
      ms: "Liabiliti ketat bermaksud:",
    },
    options: {
      en: ["Intent must be proved", "Liability without proving intent", "No liability", "Only fines apply"],
      zh: ["须证明意图", "无须证明意图即承担责任", "不负责任", "仅罚款"],
      ms: ["Niat mesti dibuktikan", "Tanggungjawab tanpa bukti niat", "Tiada liabiliti", "Hanya denda"],
    },
    answerIdx: 1,
    explain: {
      en: "For strict-liability offences the prosecution need not prove mens rea.",
      zh: "严格责任罪行下，控方无须证明犯罪心态。",
      ms: "Bagi kesalahan liabiliti ketat, pendakwaan tidak perlu membuktikan mens rea.",
    },
  },
  {
    q: {
      en: "Burden of proof in criminal cases lies on:",
      zh: "刑事案件中举证责任在：",
      ms: "Beban pembuktian dalam kes jenayah terletak pada:",
    },
    options: {
      en: ["The accused", "The prosecution", "The judge", "The jury"],
      zh: ["被告", "控方", "法官", "陪审团"],
      ms: ["Tertuduh", "Pendakwaan", "Hakim", "Juri"],
    },
    answerIdx: 1,
    explain: {
      en: "The prosecution must prove the case; the accused is presumed innocent.",
      zh: "控方负举证责任，被告享有无罪推定。",
      ms: "Pendakwaan mesti membuktikan kes; tertuduh dianggap tidak bersalah.",
    },
  },
];

const tier4: QuizQuestion[] = [
  {
    q: {
      en: "The doctrine of stare decisis requires courts to:",
      zh: "“先例约束”原则要求法院：",
      ms: "Doktrin stare decisis memerlukan mahkamah:",
    },
    options: {
      en: ["Ignore prior cases", "Follow binding precedent", "Always acquit", "Re-write statutes"],
      zh: ["忽略先前判例", "遵循具约束力的先例", "一律判无罪", "重写法令"],
      ms: ["Abaikan kes lalu", "Ikuti duluan mengikat", "Sentiasa lepaskan", "Tulis semula statut"],
    },
    answerIdx: 1,
    explain: {
      en: "Lower courts are bound by higher-court precedents on the same point of law.",
      zh: "在同一法律问题上，下级法院须受上级法院判例约束。",
      ms: "Mahkamah rendah terikat oleh duluan mahkamah atasan dalam isu undang-undang yang sama.",
    },
  },
  {
    q: {
      en: "For murder under section 302 Penal Code, the maximum penalty is:",
      zh: "刑事法典第 302 条谋杀罪的最高刑罚为：",
      ms: "Bagi kesalahan bunuh di bawah Seksyen 302 Kanun Keseksaan, hukuman maksimum:",
    },
    options: {
      en: ["Fine only", "Imprisonment up to 5 years", "Death (now discretionary)", "Community service"],
      zh: ["仅罚款", "最高监禁 5 年", "死刑（现已酌情）", "社区服务"],
      ms: ["Denda sahaja", "Penjara sehingga 5 tahun", "Hukuman mati (kini budi bicara)", "Khidmat masyarakat"],
    },
    answerIdx: 2,
    explain: {
      en: "Section 302 carries the death penalty, made discretionary by 2023 reforms.",
      zh: "第 302 条原为死刑，经 2023 年改革后改为酌情判处。",
      ms: "Seksyen 302 memperuntukkan hukuman mati, kini budi bicara selepas pindaan 2023.",
    },
  },
  {
    q: {
      en: "Culpable homicide not amounting to murder is dealt with under:",
      zh: "不构成谋杀的杀人罪由下列何条规定：",
      ms: "Pembunuhan boleh dihukum yang bukan bunuh diatur di bawah:",
    },
    options: {
      en: ["Section 304", "Section 379", "Section 415", "Section 506"],
      zh: ["第 304 条", "第 379 条", "第 415 条", "第 506 条"],
      ms: ["Seksyen 304", "Seksyen 379", "Seksyen 415", "Seksyen 506"],
    },
    answerIdx: 0,
    explain: {
      en: "Section 304 punishes culpable homicide not amounting to murder.",
      zh: "第 304 条处罚不构成谋杀的杀人行为。",
      ms: "Seksyen 304 menghukum pembunuhan tidak terjumlah kepada bunuh.",
    },
  },
  {
    q: {
      en: "Provocation as a partial defence may reduce murder to:",
      zh: "“激怒”作为部分抗辩可将谋杀减为：",
      ms: "Provokasi sebagai pembelaan separa boleh mengurangkan bunuh kepada:",
    },
    options: {
      en: ["Acquittal", "Culpable homicide not amounting to murder", "Theft", "Negligence"],
      zh: ["无罪释放", "不构成谋杀的杀人罪", "盗窃", "过失"],
      ms: ["Pelepasan", "Pembunuhan bukan bunuh", "Curi", "Kecuaian"],
    },
    answerIdx: 1,
    explain: {
      en: "Sudden grave provocation can reduce a murder charge to culpable homicide.",
      zh: "突发严重激怒可将谋杀指控降格为非谋杀杀人。",
      ms: "Provokasi mendadak yang serius boleh mengurangkan tuduhan bunuh kepada pembunuhan.",
    },
  },
  {
    q: {
      en: "An admission by the accused is governed by:",
      zh: "被告的供认由下列哪部法律规定：",
      ms: "Pengakuan tertuduh dikawal oleh:",
    },
    options: {
      en: ["Evidence Act 1950", "Companies Act", "Sale of Goods Act", "Hire Purchase Act"],
      zh: ["1950 年证据法令", "公司法令", "货品买卖法令", "租购法令"],
      ms: ["Akta Keterangan 1950", "Akta Syarikat", "Akta Jualan Barangan", "Akta Sewa Beli"],
    },
    answerIdx: 0,
    explain: {
      en: "Sections 17–23 of the Evidence Act 1950 govern admissions and confessions.",
      zh: "1950 年证据法令第 17–23 条规范供认与认罪陈述。",
      ms: "Seksyen 17–23 Akta Keterangan 1950 mengatur pengakuan.",
    },
  },
  {
    q: {
      en: "An offence triable by the High Court only is generally:",
      zh: "仅高等法院可审理的罪行通常是：",
      ms: "Kesalahan yang hanya boleh dibicarakan oleh Mahkamah Tinggi biasanya:",
    },
    options: {
      en: ["Petty theft", "Capital offences", "Traffic fines", "Tenancy disputes"],
      zh: ["小额盗窃", "可判极刑罪", "交通罚款", "租赁纠纷"],
      ms: ["Curi kecil", "Kesalahan boleh dihukum mati", "Saman trafik", "Pertikaian sewa"],
    },
    answerIdx: 1,
    explain: {
      en: "Capital offences and the most serious crimes go directly to the High Court.",
      zh: "可判极刑及最严重的罪行直接由高等法院审理。",
      ms: "Kesalahan boleh dihukum mati dan kes paling berat terus ke Mahkamah Tinggi.",
    },
  },
  {
    q: {
      en: "A confession to police is generally:",
      zh: "向警方所作的供述一般：",
      ms: "Pengakuan kepada polis pada amnya:",
    },
    options: {
      en: ["Always admissible", "Inadmissible unless statutory exceptions apply", "Conclusive proof", "Hearsay only"],
      zh: ["一律可采", "原则上不可采，除非法定例外", "决定性证据", "仅传闻"],
      ms: ["Sentiasa diterima", "Tidak diterima melainkan pengecualian berkanun", "Bukti muktamad", "Khabar angin sahaja"],
    },
    answerIdx: 1,
    explain: {
      en: "Section 25 of the Evidence Act bars confessions to police, with limited exceptions.",
      zh: "证据法令第 25 条原则上禁止采用对警方所作供述，仅有有限例外。",
      ms: "Seksyen 25 Akta Keterangan menghalang pengakuan kepada polis, dengan pengecualian terhad.",
    },
  },
  {
    q: {
      en: "Sentencing principles in Malaysia commonly include:",
      zh: "马来西亚量刑原则一般包括：",
      ms: "Prinsip hukuman di Malaysia lazimnya termasuk:",
    },
    options: {
      en: ["Profit, fame", "Retribution, deterrence, rehabilitation, prevention", "Speed only", "Family ties"],
      zh: ["利润、名声", "报应、阻吓、改造、预防", "速度", "亲属关系"],
      ms: ["Untung, nama", "Pembalasan, pencegahan, pemulihan, halangan", "Kelajuan", "Hubungan keluarga"],
    },
    answerIdx: 1,
    explain: {
      en: "Classic sentencing aims: retribution, deterrence, rehabilitation, prevention.",
      zh: "经典量刑目的：报应、阻吓、改造、预防。",
      ms: "Tujuan hukuman klasik: pembalasan, pencegahan, pemulihan, halangan.",
    },
  },
];

const BANKS: Record<1 | 2 | 3 | 4, QuizQuestion[]> = {
  1: tier1,
  2: tier2,
  3: tier3,
  4: tier4,
};

/** Pick 5 random questions for the given tier (= current level). */
export const getQuiz = (tier: 1 | 2 | 3 | 4): QuizQuestion[] => {
  const bank = BANKS[tier];
  const shuffled = [...bank].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 5);
};