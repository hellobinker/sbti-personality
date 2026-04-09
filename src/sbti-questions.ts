// SBTI 测试题目数据结构
export interface Question {
  id: number;
  question: string;
  options: {
    text: string;
    scores: Record<string, number>; // 各人格类型的得分
  }[];
}

// 31道测试题目
export const SBTI_QUESTIONS: Question[] = [
  {
    id: 1,
    question: "早上闹钟响了，你的反应是？",
    options: [
      { text: "立刻弹起来，今天也要元气满满！", scores: { "GOGO": 3, "HHHH": 2, "CTRL": 2 } },
      { text: "再睡五分钟...十分钟...算了请半天假", scores: { "ZZZZ": 3, "OJBK": 2, "DEAD": 2 } },
      { text: "痛苦地爬起来，心里骂骂咧咧", scores: { "MALO": 3, "FUCK": 2, "THAN-K": 1 } }
    ]
  },
  {
    id: 2,
    question: "你下班/放学后的状态是？",
    options: [
      { text: "健身、读书、充电，卷死他们", scores: { "CTRL": 3, "BOSS": 2, "THIN-K": 2 } },
      { text: "躺着刷手机，直到睡着", scores: { "ZZZZ": 3, "IMFW": 2, "DEAD": 2 } },
      { text: "和朋友聚会/喝酒嗨皮", scores: { "HHHH": 3, "WOC!": 2, "DRUNK": 3 } }
    ]
  },
  {
    id: 3,
    question: "朋友找你借钱，你的反应？",
    options: [
      { text: "直接转，兄弟有难必须帮", scores: { "ATM": 3, "THAN-K": 2, "MUM": 2 } },
      { text: "找借口拒绝，怕要不回来", scores: { "OJBK": 2, "IMSB": 2, "POOR": 3 } },
      { text: "开始分析他的人品和还钱能力", scores: { "THIN-K": 3, "CTRL": 2, "FAKE": 1 } }
    ]
  },
  {
    id: 4,
    question: "在KTV里，你是？",
    options: [
      { text: "麦霸，必须掌控全场", scores: { "BOSS": 3, "SEXY": 2, "HHHH": 1 } },
      { text: "角落里的隐形人，默默拍手", scores: { "SOLO": 3, "IMSB": 2, "MONK": 1 } },
      { text: "唱一首跑调的歌逗大家开心", scores: { "JOKE-R": 3, "HHHH": 2, "FAKE": 1 } }
    ]
  },
  {
    id: 5,
    question: "你收到最多的消息类型是？",
    options: [
      { text: "工作/学习相关，必须秒回", scores: { "CTRL": 3, "MUM": 2, "BOSS": 2 } },
      { text: "没人找我，消息像死了一样", scores: { "SOLO": 3, "DEAD": 2, "IMFW": 2 } },
      { text: "八卦/吐槽/哈哈哈", scores: { "WOC!": 3, "LOVE-R": 2, "HHHH": 2 } }
    ]
  },
  {
    id: 6,
    question: "你经常说的话是？",
    options: [
      { text: "卧槽、牛逼、笑死我了", scores: { "WOC!": 3, "HHHH": 2, "FUCK": 2 } },
      { text: "随便、都行、没问题", scores: { "OJBK": 3, "THAN-K": 2, "ZZZZ": 1 } },
      { text: "我不行、我很差、我垃圾", scores: { "IMSB": 3, "IMFW": 2, "DEAD": 2 } }
    ]
  },
  {
    id: 7,
    question: "看到负面新闻，你的反应？",
    options: [
      { text: "这世界还有救吗？人心不古啊", scores: { "SHIT": 3, "DEAD": 2, "OHNO": 2 } },
      { text: "关我什么事，照常刷手机", scores: { "OJBK": 3, "MONK": 2, "ZZZZ": 2 } },
      { text: "转发评论，表达愤怒", scores: { "SHIT": 2, "FUCK": 2, "BOSS": 1 } }
    ]
  },
  {
    id: 8,
    question: "你觉得自己是？",
    options: [
      { text: "天选之人，自带光环", scores: { "SEXY": 3, "BOSS": 2, "CTRL": 2 } },
      { text: "普通打工人，工具人本工", scores: { "MALO": 3, "POOR": 2, "IMFW": 2 } },
      { text: "人间凑数的NPC", scores: { "IMFW": 3, "SOLO": 2, "DIOR": 2 } }
    ]
  },
  {
    id: 9,
    question: "你和家人的关系？",
    options: [
      { text: "经常联系，互相牵挂", scores: { "MUM": 3, "THAN-K": 2, "LOVE-R": 2 } },
      { text: "能不联系就不联系，有代沟", scores: { "SOLO": 3, "FAKE": 2, "MONK": 2 } },
      { text: "表面和睦，内心疏远", scores: { "FAKE": 3, "IMSB": 2, "DEAD": 2 } }
    ]
  },
  {
    id: 10,
    question: "你做决定的特点是？",
    options: [
      { text: "纠结半天，选完又后悔", scores: { "THIN-K": 3, "IMSB": 2, "OHNO": 2 } },
      { text: "纠结很久，但最终随便选", scores: { "OJBK": 3, "ZZZZ": 2, "IMFW": 2 } },
      { text: "秒选，不行再说", scores: { "GOGO": 3, "FUCK": 2, "BOSS": 2 } }
    ]
  },
  {
    id: 11,
    question: "你朋友圈的状态是？",
    options: [
      { text: "岁月静好，精致生活", scores: { "SEXY": 3, "FAKE": 3, "CTRL": 2 } },
      { text: "负能量爆棚，吐槽发泄", scores: { "SHIT": 3, "DEAD": 2, "FUCK": 2 } },
      { text: "很少发，太麻烦了", scores: { "SOLO": 3, "MONK": 2, "ZZZZ": 2 } }
    ]
  },
  {
    id: 12,
    question: "恋爱中你是？",
    options: [
      { text: "恋爱脑本脑，全身心投入", scores: { "LOVE-R": 3, "THAN-K": 2, "IMSB": 1 } },
      { text: "保持理性，不行就撤", scores: { "CTRL": 3, "MONK": 2, "THIN-K": 2 } },
      { text: "不敢开始，怕受伤害", scores: { "IMSB": 3, "SOLO": 2, "FAKE": 2 } }
    ]
  },
  {
    id: 13,
    question: "你的消费观是？",
    options: [
      { text: "该省省该花花，开心最重要", scores: { "HHHH": 3, "SEXY": 2, "OJBK": 2 } },
      { text: "精打细算，每分钱都要花在刀刃上", scores: { "POOR": 3, "CTRL": 2, "THIN-K": 1 } },
      { text: "今朝有酒今朝醉，哪管明天", scores: { "DRUNK": 3, "DIOR": 2, "IMFW": 2 } }
    ]
  },
  {
    id: 14,
    question: "你经常的状态是？",
    options: [
      { text: "焦虑，想太多", scores: { "THIN-K": 3, "OHNO": 3, "IMSB": 2 } },
      { text: "麻木，行尸走肉", scores: { "DEAD": 3, "IMFW": 2, "ZZZZ": 2 } },
      { text: "平静，无欲无求", scores: { "MONK": 3, "OJBK": 2, "ZZZZ": 1 } }
    ]
  },
  {
    id: 15,
    question: "你对未来的态度？",
    options: [
      { text: "充满期待，制定计划", scores: { "CTRL": 3, "BOSS": 2, "GOGO": 2 } },
      { text: "走一步看一步，不想那么远", scores: { "OJBK": 3, "MONK": 2, "ZZZZ": 2 } },
      { text: "不想未来，反正也就那样", scores: { "DEAD": 3, "IMFW": 2, "SHIT": 2 } }
    ]
  },
  {
    id: 16,
    question: "你和朋友闹矛盾了？",
    options: [
      { text: "主动道歉，哪怕不是我的错", scores: { "THAN-K": 3, "MUM": 2, "IMSB": 2 } },
      { text: "冷战，等对方先来找", scores: { "SOLO": 3, "IMFW": 2, "FAKE": 2 } },
      { text: "当面吵清楚，不憋着", scores: { "FUCK": 3, "BOSS": 2, "SHIT": 2 } }
    ]
  },
  {
    id: 17,
    question: "别人夸你，你会？",
    options: [
      { text: "开心接受，觉得说得对", scores: { "SEXY": 3, "BOSS": 2, "HHHH": 2 } },
      { text: "礼貌感谢，心里觉得是客套", scores: { "FAKE": 3, "IMSB": 2, "SOLO": 2 } },
      { text: "脸红否认，我不配我不配", scores: { "IMSB": 3, "THAN-K": 2, "MONK": 1 } }
    ]
  },
  {
    id: 18,
    question: "便秘蹲马桶30分钟，你会？",
    options: [
      { text: "继续坐着等，坚信下一秒就有结果", scores: { "ZZZZ": 3, "OJBK": 2, "THIN-K": 2 } },
      { text: "拍自己屁股骂，废物废物废物", scores: { "FUCK": 3, "SHIT": 2, "JOKE-R": 2 } },
      { text: "果断用开塞露，效率至上", scores: { "CTRL": 3, "BOSS": 2, "GOGO": 2 } }
    ]
  },
  {
    id: 19,
    question: "你理想的周末是？",
    options: [
      { text: "睡到自然醒，点外卖刷剧", scores: { "ZZZZ": 3, "DEAD": 2, "IMFW": 2 } },
      { text: "出门社交，各种局安排满", scores: { "SEXY": 3, "BOSS": 2, "WOC!": 2 } },
      { text: "一个人待着，充电休息", scores: { "MONK": 3, "SOLO": 2, "THIN-K": 2 } }
    ]
  },
  {
    id: 20,
    question: "你被老板/老师当众批评了？",
    options: [
      { text: "表面道歉，心里骂了一万遍", scores: { "FAKE": 3, "MALO": 2, "THAN-K": 2 } },
      { text: "当场反驳，我没错就是没错", scores: { "BOSS": 3, "FUCK": 3, "SEXY": 2 } },
      { text: "默默忍着，回家自己消化", scores: { "IMSB": 3, "SOLO": 2, "DEAD": 2 } }
    ]
  },
  {
    id: 21,
    question: "你最大的优点是？",
    options: [
      { text: "善良、乐于助人", scores: { "MUM": 3, "THAN-K": 2, "ATM": 2 } },
      { text: "聪明、执行力强", scores: { "CTRL": 3, "BOSS": 2, "GOGO": 2 } },
      { text: "有趣、会聊天", scores: { "HHHH": 3, "JOKE-R": 2, "WOC!": 2 } }
    ]
  },
  {
    id: 22,
    question: "你最大的缺点是？",
    options: [
      { text: "想太多、太敏感", scores: { "THIN-K": 3, "IMSB": 2, "LOVE-R": 2 } },
      { text: "太容易相信人/太善良", scores: { "THAN-K": 3, "ATM": 2, "MUM": 2 } },
      { text: "懒、三分钟热度", scores: { "IMFW": 3, "ZZZZ": 2, "OJBK": 2 } }
    ]
  },
  {
    id: 23,
    question: "深夜凌晨两点，你在？",
    options: [
      { text: "还在加班/学习，苦命打工人", scores: { "MALO": 3, "CTRL": 2, "DIOR": 2 } },
      { text: "躺在床上胡思乱想，失眠中", scores: { "THIN-K": 3, "OHNO": 2, "IMSB": 2 } },
      { text: "喝酒/蹦迪/夜生活刚开始", scores: { "DRUNK": 3, "HHHH": 2, "WOC!": 2 } }
    ]
  },
  {
    id: 24,
    question: "你的手机相册里最多的是？",
    options: [
      { text: "自拍/他拍，好看的自己", scores: { "SEXY": 3, "CTRL": 2, "BOSS": 1 } },
      { text: "截图/表情包/沙雕图", scores: { "WOC!": 3, "HHHH": 2, "JOKE-R": 2 } },
      { text: "没什么好看的，删了很多", scores: { "SOLO": 3, "DEAD": 2, "MONK": 2 } }
    ]
  },
  {
    id: 25,
    question: "你对'人生的意义'怎么看？",
    options: [
      { text: "人生本无意义，活在当下", scores: { "MONK": 3, "OJBK": 2, "ZZZZ": 2 } },
      { text: "没意义，很丧很绝望", scores: { "DEAD": 3, "SHIT": 2, "IMFW": 2 } },
      { text: "意义在于折腾，要精彩", scores: { "BOSS": 3, "GOGO": 2, "SEXY": 2 } }
    ]
  },
  {
    id: 26,
    question: "你和别人合照时？",
    options: [
      { text: "必须美颜修图才发", scores: { "SEXY": 3, "CTRL": 2, "FAKE": 2 } },
      { text: "从来不发，太尴尬了", scores: { "IMSB": 3, "SOLO": 2, "DEAD": 2 } },
      { text: "随便拍拍，无所谓", scores: { "JOKE-R": 3, "HHHH": 2, "OJBK": 2 } }
    ]
  },
  {
    id: 27,
    question: "你经常感到？",
    options: [
      { text: "开心，每天都很充实", scores: { "HHHH": 3, "GOGO": 2, "SEXY": 2 } },
      { text: "疲惫，被生活压垮", scores: { "MALO": 3, "DEAD": 2, "IMFW": 2 } },
      { text: "焦虑，想太多停不下来", scores: { "THIN-K": 3, "OHNO": 2, "IMSB": 2 } }
    ]
  },
  {
    id: 28,
    question: "你对'成功'的理解是？",
    options: [
      { text: "有钱、有地位、被人认可", scores: { "CTRL": 3, "BOSS": 2, "SEXY": 2 } },
      { text: "开心就好，平平淡淡", scores: { "MONK": 3, "OJBK": 2, "HHHH": 2 } },
      { text: "活着就是成功了吧", scores: { "DEAD": 3, "POOR": 2, "SHIT": 2 } }
    ]
  },
  {
    id: 29,
    question: "你喜欢什么样的生活节奏？",
    options: [
      { text: "快节奏，时刻紧绷", scores: { "CTRL": 3, "BOSS": 2, "GOGO": 2 } },
      { text: "慢节奏，享受生活", scores: { "MONK": 3, "OJBK": 2, "ZZZZ": 2 } },
      { text: "无所谓，跟着感觉走", scores: { "IMFW": 3, "DIOR": 2, "DRUNK": 2 } }
    ]
  },
  {
    id: 30,
    question: "如果用一个词形容自己，你会选？",
    options: [
      { text: "牛逼/优秀/天生我材", scores: { "SEXY": 3, "BOSS": 2, "CTRL": 2 } },
      { text: "普通/平凡/凑数", scores: { "MALO": 3, "IMFW": 2, "DIOR": 2 } },
      { text: "迷茫/丧/无意义", scores: { "DEAD": 3, "IMSB": 2, "SHIT": 2 } }
    ]
  },
  {
    id: 31,
    question: "最后，你觉得自己是？",
    options: [
      { text: "独一无二，天选之人", scores: { "SEXY": 3, "BOSS": 2, "GOGO": 2 } },
      { text: "芸芸众生，普通一个", scores: { "MALO": 3, "SOLO": 2, "MONK": 2 } },
      { text: "人间凑数，废物本废", scores: { "IMFW": 3, "DEAD": 2, "IMSB": 2 } }
    ]
  }
];

// 计算最终人格类型
export const calculateResult = (answers: number[]): string => {
  const scores: Record<string, number> = {};

  answers.forEach((answerIndex, questionIndex) => {
    const question = SBTI_QUESTIONS[questionIndex];
    if (question && question.options[answerIndex]) {
      const optionScores = question.options[answerIndex].scores;
      Object.entries(optionScores).forEach(([type, score]) => {
        scores[type] = (scores[type] || 0) + score;
      });
    }
  });

  // 找出最高分的人格类型
  let maxScore = 0;
  let resultType = "HHHH"; // 默认傻乐者

  Object.entries(scores).forEach(([type, score]) => {
    if (score > maxScore) {
      maxScore = score;
      resultType = type;
    }
  });

  return resultType;
};
