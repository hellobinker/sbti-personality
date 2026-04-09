// SBTI 人格类型数据结构
export interface SBTIType {
  code: string;
  name: string;
  title: string;
  description: string;
  traits: string[];
  image: string;
  color: string;
  bgGradient: string;
  humor: string;
}

// 27种SBTI人格类型
export const SBTI_TYPES: SBTIType[] = [
  {
    code: "SEXY",
    name: "尤物",
    title: "天生的万人迷",
    description: "您就是天生的尤物！自带魅力光环，走到哪里都是焦点。别人为社交发愁，你为拒绝追求者而烦恼。",
    traits: ["魅力四射", "自信爆棚", "自带光环", "桃花运旺"],
    image: "/images/sexy.png",
    color: "#FF69B4",
    bgGradient: "from-pink-400 to-rose-500",
    humor: "自拍永远在C位，发朋友圈永远有人点赞，收到最多的消息是'在吗'"
  },
  {
    code: "LOVE-R",
    name: "多情者",
    title: "恋爱脑本脑",
    description: "爱意太满，现实显得有点贫瘠。你对每一段感情都认真到感动自己，却总是被伤得最深的那个。",
    traits: ["情感丰富", "容易投入", "过度思考", "患得患失"],
    image: "/images/love-r.png",
    color: "#E91E63",
    bgGradient: "from-red-400 to-pink-500",
    humor: "恋爱经历比你追的剧还多，但每次分手都觉得这次是真爱"
  },
  {
    code: "ZZZZ",
    name: "装死者",
    title: "躺平界扛把子",
    description: "我没死，我只是在睡觉。遇到问题第一反应是逃避，第二反应是装死，第三反应是躺平。",
    traits: ["极度拖延", "逃避现实", "爱睡懒觉", "能躺不坐"],
    image: "/images/zzzz.png",
    color: "#607D8B",
    bgGradient: "from-gray-400 to-slate-500",
    humor: "周一到周五：再睡五分钟。周六周日：世界毁灭也不起床"
  },
  {
    code: "THIN-K",
    name: "思考者",
    title: "想太多的哲学家",
    description: "已深度思考100秒。你总能在简单的事情上想出一百种可能性，然后在凌晨三点得出一个让自己更焦虑的结论。",
    traits: ["过度分析", "思维缜密", "焦虑体质", "夜深人静想最多"],
    image: "/images/think.png",
    color: "#9C27B0",
    bgGradient: "from-purple-400 to-indigo-500",
    humor: "别人：今晚吃什么？你：人生的意义是什么？然后失眠到天亮"
  },
  {
    code: "CTRL",
    name: "拿捏者",
    title: "掌控达人",
    description: "怎么样，被我拿捏了吧？你的人生就是一部精密的计划表，连别人的时间都安排得明明白白。",
    traits: ["掌控欲强", "善于规划", "执行力高", "讨厌意外"],
    image: "/images/ctrl.png",
    color: "#3F51B5",
    bgGradient: "from-blue-500 to-indigo-600",
    humor: "连发朋友圈都要掐准时间，点赞数不达标会失眠"
  },
  {
    code: "SOLO",
    name: "孤儿",
    title: "独行侠",
    description: "我哭了，我怎么会是孤儿？不是没有朋友，是那种深入骨髓的孤独感永远挥之不去。",
    traits: ["孤立感强", "被抛下感", "独来独往", "内心敏感"],
    image: "/images/solo.png",
    color: "#455A64",
    bgGradient: "from-gray-500 to-gray-700",
    humor: "群消息永远已读不回，不是不合群，是真的不知道怎么融入"
  },
  {
    code: "MALO",
    name: "吗喽",
    title: "打工人本工",
    description: "人生是个副本，而我只是一只吗喽。你是那种被生活毒打后依然微笑面对的工具人。",
    traits: ["自我定位卑微", "勤勤恳恳", "任劳任怨", "容易满足"],
    image: "/images/malo.png",
    color: "#8D6E63",
    bgGradient: "from-amber-600 to-yellow-700",
    humor: "上班为了下班，下班为了上班，周五最快乐，周日最焦虑"
  },
  {
    code: "WOC!",
    name: "握草人",
    title: "震惊专业户",
    description: "卧槽，我怎么是这个人格？你的震惊能力满分，一言不合就'卧槽'，吃瓜永远在线。",
    traits: ["爱吐槽", "震惊体质", "吃瓜达人", "不多管闲事"],
    image: "/images/woc.png",
    color: "#4CAF50",
    bgGradient: "from-green-400 to-emerald-500",
    humor: "看八卦比谁都积极，真到自己就'卧槽，这也行？'"
  },
  {
    code: "MONK",
    name: "僧人",
    title: "无欲无求",
    description: "没有那种世俗的欲望。你已经看透了红尘俗世，对一切都保持佛系心态。",
    traits: ["低欲望", "看淡名利", "内心平静", "知足常乐"],
    image: "/images/monk.png",
    color: "#009688",
    bgGradient: "from-teal-400 to-cyan-500",
    humor: "别人在卷，你在躺；别人焦虑，你在喝茶；别人发财，你不心动"
  },
  {
    code: "FAKE",
    name: "伪人",
    title: "社交面具王",
    description: "已经，没有人类了。你的社交面具已经厚到可以防水防火，连自己都分不清哪个是真实的自己。",
    traits: ["社交面具厚", "表里不一", "善于伪装", "自我迷失"],
    image: "/images/fake.png",
    color: "#673AB7",
    bgGradient: "from-violet-500 to-purple-600",
    humor: "笑得很开心，心里在骂人。社交达人是假象，社恐才是本质"
  },
  {
    code: "OJBK",
    name: "无所谓人",
    title: "摆烂大师",
    description: "我说随便，是真的随便。你的人生哲学就是'都行、可以、没关系'，没有一件事值得你认真。",
    traits: ["极度随缘", "摆烂高手", "选择困难", "懒得计较"],
    image: "/images/ojbk.png",
    color: "#FFC107",
    bgGradient: "from-amber-400 to-orange-500",
    humor: "点菜随便、约会随便、工资随便...反正都是随便的人生"
  },
  {
    code: "FUCK",
    name: "草者",
    title: "暴躁老哥",
    description: "操！这是什么人格？你的情绪就像过山车，一点就燃，炸完又后悔。",
    traits: ["情绪化", "说话冲", "容易暴躁", "真性情"],
    image: "/images/fuck.png",
    color: "#F44336",
    bgGradient: "from-red-500 to-orange-600",
    humor: "开车骂人、打游戏骂人、点外卖慢了也要骂，但骂完就忘"
  },
  {
    code: "SHIT",
    name: "愤世者",
    title: "世界欠你的",
    description: "这个世界，构石一坨。你看什么都不顺眼，觉得全世界都在针对你。",
    traits: ["愤世嫉俗", "怨气冲天", "负能量爆棚", "看不惯一切"],
    image: "/images/shit.png",
    color: "#795548",
    bgGradient: "from-yellow-700 to-amber-800",
    humor: "每天都在吐槽，吐槽社会、吐槽老板、吐槽天气、吐槽人生"
  },
  {
    code: "THAN-K",
    name: "感恩者",
    title: "讨好型人格",
    description: "我感谢苍天！我感谢大地！你是那种把自己的需求放在最后，永远在感谢别人的好人。",
    traits: ["过度感恩", "容易自责", "讨好型", "不懂拒绝"],
    image: "/images/thank.png",
    color: "#FF9800",
    bgGradient: "from-orange-400 to-amber-500",
    humor: "别人道歉你先说没关系，别人索取你先说可以，委屈自己成全别人"
  },
  {
    code: "MUM",
    name: "妈妈",
    title: "照顾者本能",
    description: "或许……我可以叫你妈妈吗……？你是那种照顾别人比照顾自己还上心的人。",
    traits: ["照顾欲强", "母爱/父爱泛滥", "操心命", "忽略自己"],
    image: "/images/mum.png",
    color: "#E91E63",
    bgGradient: "from-pink-500 to-rose-600",
    humor: "自己感冒了还给别人送药，自己没吃饭先给别人做饭"
  },
  {
    code: "ATM",
    name: "送钱者",
    title: "人肉ATM机",
    description: "像一台老旧但坚固的ATM机：插进去的是别人的焦虑，吐出来的是'没事，有我'。",
    traits: ["过度付出", "有求必应", "经济支持者", "情绪垃圾桶"],
    image: "/images/atm.png",
    color: "#CDDC39",
    bgGradient: "from-lime-500 to-green-600",
    humor: "借钱从来不催还，请客从来不心疼，自己穷得叮当响还帮人搬家"
  },
  {
    code: "JOKE-R",
    name: "小丑",
    title: "自我调侃王",
    description: "原来我们都是小丑。你把自己的尴尬经历编成段子，在自嘲中找到存在感。",
    traits: ["自嘲高手", "幽默细胞", "化解尴尬", "内心戏多"],
    image: "/images/joker.png",
    color: "#FF5722",
    bgGradient: "from-deep-orange-400 to-red-500",
    humor: "用自己的糗事娱乐大家，笑着笑着自己也想哭"
  },
  {
    code: "BOSS",
    name: "领导者",
    title: "天生的领袖",
    description: "方向盘给我，我来开。你是天生的领导者，有你在的地方你就要当老大。",
    traits: ["领导欲强", "主导倾向", "爱发号施令", "喜欢掌控"],
    image: "/images/boss.png",
    color: "#1A237E",
    bgGradient: "from-indigo-700 to-blue-800",
    humor: "开会必须坐主位，群里必须当群主，连唱歌都要麦霸"
  },
  {
    code: "IMSB",
    name: "傻者",
    title: "自我怀疑者",
    description: "认真的么？我真的是傻逼么？你总是在质疑自己，觉得自己做什么都不对。",
    traits: ["自我怀疑", "自我攻击", "不自信", "容易后悔"],
    image: "/images/imsb.png",
    color: "#546E7A",
    bgGradient: "from-blue-gray-500 to-gray-600",
    humor: "发消息要撤回三次才敢发，做完决定就后悔，夸你一句觉得在讽刺"
  },
  {
    code: "DEAD",
    name: "死者",
    title: "行走的dead",
    description: "我，还活着吗？你已经死了，但还在呼吸；对世界失去兴趣，只剩躯壳在行走。",
    traits: ["极度丧感", "麻木状态", "无欲无求", "行尸走肉"],
    image: "/images/dead.png",
    color: "#37474F",
    bgGradient: "from-gray-600 to-gray-800",
    humor: "没有快乐，也没有悲伤，只有无尽的空虚"
  },
  {
    code: "GOGO",
    name: "行者",
    title: "行动派",
    description: "gogogo~出发咯！你是那种说走就走、想到就做的人，从不拖延。",
    traits: ["执行力强", "行动力满", "爱冒险", "不安分"],
    image: "/images/gogo.png",
    color: "#FF9800",
    bgGradient: "from-orange-500 to-amber-600",
    humor: "别人还在计划，你已经到了；别人在想，你已经做完了"
  },
  {
    code: "OHNO",
    name: "哦不人",
    title: "焦虑制造机",
    description: "哦不！我怎么会是这个人格？！你总往坏处想，一有风吹草动就觉得自己要完蛋。",
    traits: ["焦虑体质", "灾难思维", "杞人忧天", "负能量收集器"],
    image: "/images/ohno.png",
    color: "#FFEB3B",
    bgGradient: "from-yellow-400 to-orange-500",
    humor: "看到消息已读不回就开始写遗书，其实人家只是去吃饭了"
  },
  {
    code: "DIOR",
    name: "屌丝",
    title: "逆袭中的屌丝",
    description: "等着我屌丝逆袭。你是那种明明很努力但总觉得自己很low的人。",
    traits: ["自嘲底层", "努力上进", "经济压力大", "不服输"],
    image: "/images/dior.png",
    color: "#795548",
    bgGradient: "from-amber-700 to-orange-800",
    humor: "月薪三千想逆袭，月供一万说小意思，泡面配火腿肠是日常"
  },
  {
    code: "DRUNK",
    name: "酒鬼",
    title: "借酒消愁",
    description: "烈酒烧喉，不得不醉。你是那种用喝酒来逃避现实的人。",
    traits: ["借酒浇愁", "情绪化饮酒", "需要麻痹", "夜生活丰富"],
    image: "/images/drunk.png",
    color: "#9C27B0",
    bgGradient: "from-purple-600 to-indigo-700",
    humor: "开心喝酒庆祝，不开心借酒消愁，反正都是喝酒的理由"
  },
  {
    code: "POOR",
    name: "贫困者",
    title: "穷但有骨气",
    description: "我穷，但我很专。钱包空空但志气满满，穷也要穷得有骨气。",
    traits: ["经济困难", "节衣缩食", "有骨气", "精打细算"],
    image: "/images/poor.png",
    color: "#607D8B",
    bgGradient: "from-gray-400 to-gray-600",
    humor: "双十一研究规则到凌晨，加购物车删了又加，加了又删"
  },
  {
    code: "IMFW",
    name: "废物",
    title: "摆烂废物",
    description: "我真的……是废物吗？经常把废物挂在嘴边，但心里还是想证明自己。",
    traits: ["自我否定", "摆烂心态", "间歇性努力", "持续性颓废"],
    image: "/images/imfw.png",
    color: "#616161",
    bgGradient: "from-gray-500 to-gray-700",
    humor: "收藏夹里全是教程，行动计划写了二十版，执行力为零"
  },
  {
    code: "HHHH",
    name: "傻乐者",
    title: "快乐傻狗",
    description: "哈哈哈哈哈哈。你是那种什么都能笑、什么都觉得好笑的人间乐子。",
    traits: ["极度乐观", "笑点极低", "快乐源泉", "没心没肺"],
    image: "/images/hhhh.png",
    color: "#FFD700",
    bgGradient: "from-yellow-400 to-amber-500",
    humor: "笑点低到看天气预报都能笑，朋友圈的快乐瀑布"
  }
];

// 获取人格类型
export const getTypeByCode = (code: string): SBTIType | undefined => {
  return SBTI_TYPES.find(t => t.code === code);
};

// 获取随机人格
export const getRandomType = (): SBTIType => {
  return SBTI_TYPES[Math.floor(Math.random() * SBTI_TYPES.length)];
};
