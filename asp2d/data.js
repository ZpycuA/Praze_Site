/* ============================================================
   Asaka Straight Project — data.js
   © 2026 ZpycuA. CC BY-NC 4.0.
   所有数值、物品、AI 配置、脚本钩子都在这里。

   v0.40 变更摘要：
   - 弹道科学核算：全部武器动能改为 E = ½mv² 计算值（真实弹头质量 + 初速）
   - 修正项：.38 / .50AE / .45ACP / 5.56 / 7.62x39 / 12号鹿弹（弹丸单位）
   - 弹药初速修正：使枪口初速符合该口径常见平台的实测区间
   - 任务系统扩容：default（兼容）+ story（三章剧情链）+ challenges + daily

   v0.42 变更摘要（本次）：
   - 新增 ASAKA.config.deployLimit：每张地图每难度的战备价值上下限
   - 新增 ASAKA.config.keybinds：全按键映射（供 index 直接读取，无需硬编码）
   - 新增 ASAKA.assets：立绘/贴图路径函数（供 index 动态加载角色/敌人/BOSS）
   —— 除以上三处新增，v0.40 内容一字未动。
   ============================================================ */
"use strict";
window.ASAKA = window.ASAKA || {};

ASAKA.config = {
  PX_PER_M: 10,
  downTimePlayer: 30,
  downTimeAI: 30,
  rescueTimeAlly: 4,
  rescueTimeEnemy: 4,
  hearingRangeBase: 900,
  soundTTL: {
    white: 0.9,
    red: 1.4
  },
  sfxVolume: 0.35,
  viewDist: 700,
  fov: 1.94778744523,
  interaction: {
    pickupRadius: 60,
    pickupRadiusBoss: 90,
    searchTime: 2.5
  },
  extract: {
    radius: 80,
    time: 8,
    enemyBlockRadius: 200
  },
  spawnDist: {
    normal: 620,
    elite: 900,
    super: 1100,
    boss: 1300,
    ai: 500,
    lootFromPlayer: 300
  },
  burn: {
    tickInterval: 0.35
  },
  training: {
    dummyCount: 5,
    dummyHp: 200
  },
  ai: {
    visionRange: {
      close: 180
    },
    fovMul: {
      elite: 0.85,
      normal: 0.62
    },
    nade: {
      minDist: 150,
      maxDist: 480,
      chance: 0.45,
      cdMin: 11,
      cdMax: 20,
      cdRetryMin: 4,
      cdRetryMax: 9
    },
    pickup: {
      radius: 120,
      cdMin: 6,
      cdMax: 14
    },
    fleeThreshold: 0.3,
    healThreshold: 0.5
  },
  deployLimit: {
    factory: {
      easy: {
        min: 0,
        max: 8000
      },
      normal: {
        min: 2000,
        max: 12000
      },
      hard: {
        min: 5000,
        max: 20000
      },
      nightmare: {
        min: 8000,
        max: 30000
      }
    },
    desert: {
      easy: {
        min: 0,
        max: 12000
      },
      normal: {
        min: 4000,
        max: 18000
      },
      hard: {
        min: 8000,
        max: 28000
      },
      nightmare: {
        min: 12000,
        max: 40000
      }
    },
    lab: {
      easy: {
        min: 0,
        max: 15000
      },
      normal: {
        min: 6000,
        max: 25000
      },
      hard: {
        min: 10000,
        max: 40000
      },
      nightmare: {
        min: 15000,
        max: 60000
      }
    }
  },
  keybinds: {
    reload: "r",
    switchWeapon: "f",
    nade: "g",
    melee: "v",
    bag: "b",
    help: "h",
    pause: "escape",
    protectL1: "1",
    protectL2: "2",
    protectL3: "3",
    skillKeys: ["q", "e", "z", "x", "c", "4", "5", "6", "7", "8"],
    skillLabels: ["Q", "E", "Z", "X", "C", "4", "5", "6", "7", "8"]
  }
};

ASAKA.assets = {
  spriteSize: 96,
  /* 角色立绘映射：id → 文件路径 */
  _charMap: {
    kate:    '../image/Kate_wm.png',
    lingna:  '../image/Lingna_wm.png',
    captain: null,                          /* 队长无立绘 */
    buwen:   '../image/BuwenYe_wm.png'
  },
  /* BOSS 立绘映射：id → 文件路径 */
  _bossMap: {
    yukino_b: '../image/NirienYukino_wm.png',
    krona_b:  '../image/KronaChi_wm.png'
  },
  characterPortrait: function(id){
    if(id in this._charMap) return this._charMap[id];
    return 'ch_' + id + '.png';
  },
  enemyPortrait: function(id){
    return 'enemy_' + id + '.png';
  },
  bossPortrait: function(id){
    if(id in this._bossMap) return this._bossMap[id];
    return 'boss_' + id + '.png';
  }
};

ASAKA.hitZones = [
  {
    id: "face",
    n: "面部",
    weight: 0.015,
    dmgMul: 3.4,
    armorSlot: "visor"
  },
  {
    id: "head",
    n: "头部",
    weight: 0.085,
    dmgMul: 2,
    armorSlot: "shell"
  },
  {
    id: "thorax",
    n: "胸部",
    weight: 0.44,
    dmgMul: 1,
    armorSlot: "torso"
  },
  {
    id: "abdomen",
    n: "腹部",
    weight: 0.19,
    dmgMul: 1.05,
    armorSlot: "torso"
  },
  {
    id: "larm",
    n: "左臂",
    weight: 0.08,
    dmgMul: 0.72,
    armorSlot: null
  },
  {
    id: "rarm",
    n: "右臂",
    weight: 0.08,
    dmgMul: 0.72,
    armorSlot: null
  },
  {
    id: "lleg",
    n: "左腿",
    weight: 0.055,
    dmgMul: 0.85,
    armorSlot: null
  },
  {
    id: "rleg",
    n: "右腿",
    weight: 0.055,
    dmgMul: 0.85,
    armorSlot: null
  }
];

ASAKA.damageModel = {
  humanBodyCoeff: 34,
  prazerBodyCoeff: 48,
  heavyArmorBodyCoeff: 42,
  limbPartMultiplier: 2.2,
  abdomenBleedChance: 0.5,
  faceStunTime: 1.2,
  psi: 0.00335791,
  tEff: 0.5
};

ASAKA.weapons = [
  {
    id: "p9",
    n: "P-9 手枪",
    cls: "pistol",
    cal: "9mm",
    e: 520,
    pen: 0,
    rpm: 420,
    mag: 15,
    res: 75,
    rel: 1.5,
    spd: 360,
    rng: 80,
    spr: 0.052,
    auto: false,
    rar: "common",
    snd: "pistol",
    rec: 0.9,
    flavor: "短后坐枪管摆动式半自动手枪，闭膛待击。9×19mm 帕拉贝鲁姆，双排 15 发弹匣。大陆上几乎所有警队和后勤兵的标准配枪——便宜、皮实、只要能扣动扳机就能打响，缺点是停止作用有限，对轻甲之外的防护毫无办法。"
  },
  {
    id: "r38",
    n: "R-38 转轮手枪",
    cls: "pistol",
    cal: ".38",
    e: 430,
    pen: 1,
    rpm: 220,
    mag: 6,
    res: 48,
    rel: 2.6,
    spd: 290,
    rng: 70,
    spr: 0.055,
    auto: false,
    rar: "green",
    snd: "pistol",
    rec: 1.1,
    flavor: "单双动混合击发的六发转轮。.38 特种弹，弹巢靠抛壳杆一发一发退出。没有弹匣、没有保险，唯一的优点是不会卡壳。沙城二里缘家老侍卫传下来的东西，握把上刻着一段没人读得懂的普勒语祷文。"
  },
  {
    id: "deagle",
    n: "D-50 沙鹰",
    cls: "pistol",
    cal: ".50AE",
    e: 2140,
    pen: 3,
    rpm: 170,
    mag: 7,
    res: 35,
    rel: 2.4,
    spd: 470,
    rng: 85,
    spr: 0.048,
    auto: false,
    rar: "blue",
    snd: "pistol",
    rec: 1.8,
    flavor: "导气式旋转闭锁半自动手枪，.50 AE 大口径。枪重近两公斤，握在手里像一块砖。后坐力极其夸张，射速完全取决于射手的腕力——有人形容它\"第一枪打空气，第二枪打月亮，第三枪才打中目标\"。对上重甲目标有一点穿透力，代价是每开一枪都要重新调整姿势。"
  },
  {
    id: "rsh",
    n: "RSH-12 犀牛",
    cls: "pistol",
    cal: ".357",
    e: 940,
    pen: 2,
    rpm: 340,
    mag: 8,
    res: 48,
    rel: 2,
    spd: 420,
    rng: 80,
    spr: 0.045,
    auto: false,
    rar: "yellow",
    snd: "pistol",
    rec: 1.4,
    flavor: "枪管下置式转轮手枪，击发时后坐几乎垂直向上，回正极快。.357 马格南弹，八发弹巢。这是二里缘家族侍卫队的旧式制式手枪，后来被自动化武器替代，但仍有老兵坚持用它——\"它不会骗你，扣一次响一次\"。"
  },
  {
    id: "smg45",
    n: "SMG-45 冲锋枪",
    cls: "smg",
    cal: ".45ACP",
    e: 630,
    pen: 1,
    rpm: 780,
    mag: 25,
    res: 150,
    rel: 2,
    spd: 290,
    rng: 60,
    spr: 0.078,
    auto: true,
    rar: "green",
    snd: "smg",
    rec: 0.72,
    flavor: "自由枪机式、开膛待击冲锋枪，.45 ACP 大口径。射速控制在 780 RPM，就是为了让 25 发弹匣不至于三秒倒空。弹速偏慢，但停止作用在这个口径下非常可观。走私贩和佣兵的最爱——不是因为它好，是因为它便宜、好修、口径大。"
  },
  {
    id: "smg9",
    n: "SMG-9 冲锋枪",
    cls: "smg",
    cal: "9mm",
    e: 580,
    pen: 0,
    rpm: 1000,
    mag: 32,
    res: 180,
    rel: 1.9,
    spd: 380,
    rng: 55,
    spr: 0.082,
    auto: true,
    rar: "blue",
    snd: "smg",
    rec: 0.6,
    flavor: "自由枪机、闭膛击发，1000 RPM 的高射速冲锋枪。9mm 帕拉贝鲁姆，32 发弹匣，不到两秒就能清空。弹道散布偏大，超过 40 米基本靠概率命中。尼珀斯尔内卫部队用它做室内清剿，走廊宽度正好是它的舒适区。"
  },
  {
    id: "pdw",
    n: "PDW-4",
    cls: "smg",
    cal: "4.6mm",
    e: 440,
    pen: 0,
    rpm: 1050,
    mag: 40,
    res: 240,
    rel: 1.7,
    spd: 720,
    rng: 50,
    spr: 0.066,
    auto: true,
    rar: "yellow",
    snd: "smg",
    rec: 0.5,
    flavor: "个人防卫武器概念下的产物，4.6×30mm 小口径高速弹。40 发长弹匣、初速接近 700 m/s，后坐极轻，单手都能压住。缺点同样明显：弹头太轻，一过 50 米动能衰减得厉害，打穿软质护甲都费劲。是后勤兵、车辆乘员和保镖的武器。"
  },
  {
    id: "vector",
    n: "V-11 维克托",
    cls: "smg",
    cal: ".45ACP",
    e: 670,
    pen: 1,
    rpm: 1200,
    mag: 33,
    res: 200,
    rel: 1.85,
    spd: 300,
    rng: 52,
    spr: 0.06,
    auto: true,
    rar: "orange",
    snd: "smg",
    rec: 0.55,
    flavor: "采用延迟反冲（偏置弹簧）系统的冲锋枪，把 .45 ACP 的后坐压到接近 9mm 的水平。1200 RPM 的超高射速让它在 0.5 秒内就能把一整个弹匣推出去——在走廊拐角确实好用，但一次交火基本就是一次换弹。枪身重心奇怪，需要一点时间去习惯。"
  },
  {
    id: "ar556",
    n: "AR-556 突击步枪",
    cls: "rifle",
    cal: "5.56mm",
    e: 1770,
    pen: 3,
    rpm: 700,
    mag: 30,
    res: 180,
    rel: 2.3,
    spd: 940,
    rng: 140,
    spr: 0.038,
    auto: true,
    rar: "blue",
    snd: "rifle",
    rec: 1,
    flavor: "直接导气式、旋转闭锁枪机的标准突击步枪。5.56×45mm NATO，30 发直弹匣。射速 700 RPM 在同类里算克制，配合中等后坐，中距离可控性很好。是所有派系都在用的\"万金油\"——它不是最好的枪，但你几乎总能在战场上找到它的弹匣。"
  },
  {
    id: "ak762",
    n: "AK-762 突击步枪",
    cls: "rifle",
    cal: "7.62mm",
    e: 2110,
    pen: 5,
    rpm: 620,
    mag: 30,
    res: 150,
    rel: 2.6,
    spd: 730,
    rng: 130,
    spr: 0.055,
    auto: true,
    rar: "blue",
    snd: "rifle",
    rec: 1.4,
    flavor: "长行程活塞导气式步枪，7.62×39mm 中间威力弹。射速 620 RPM，后坐较大，但停止作用远比 5.56 干脆。枪机行程长、加工公差大，反过来带来了\"泥里滚一圈还能打响\"的可靠性。沙城禁卫军用了它几十年，枪托被擦得发亮，护木上还留着历年的刻字。"
  },
  {
    id: "dmr",
    n: "DMR-556 精确射手步枪",
    cls: "rifle",
    cal: "5.56mm",
    e: 1960,
    pen: 4,
    rpm: 320,
    mag: 20,
    res: 120,
    rel: 2.4,
    spd: 990,
    rng: 180,
    spr: 0.018,
    auto: false,
    rar: "yellow",
    snd: "rifle",
    rec: 1.6,
    flavor: "在 AR 平台上加长的半自动精确射手步枪，20 发弹匣，自由浮动式枪管。5.56 弹头在 990 m/s 的初速下，150 米内打胸膛基本一发一发。半自动的射速上限让它很难应付近距离突袭——一旦被人贴到 20 米内，你只能切副武器。"
  },
  {
    id: "scarl",
    n: "SCAR-L 战斗步枪",
    cls: "rifle",
    cal: "5.56mm",
    e: 1620,
    pen: 3,
    rpm: 660,
    mag: 30,
    res: 180,
    rel: 2.35,
    spd: 900,
    rng: 145,
    spr: 0.036,
    auto: true,
    rar: "yellow",
    snd: "rifle",
    rec: 0.95,
    flavor: "短行程活塞导气式战斗步枪，5.56×45mm。相比直接导气结构，活塞能减少积碳对枪机的影响，也让它在消音状态下的气体回流更可控。射速 660 RPM，中远距离点射稳定。大陆银行的警卫队用这款枪——干净、可靠、保养记录能查到每一发子弹。"
  },
  {
    id: "g36",
    n: "G-36 突击步枪",
    cls: "rifle",
    cal: "5.56mm",
    e: 1690,
    pen: 3,
    rpm: 780,
    mag: 30,
    res: 180,
    rel: 2.2,
    spd: 920,
    rng: 138,
    spr: 0.034,
    auto: true,
    rar: "orange",
    snd: "rifle",
    rec: 0.85,
    flavor: "短行程活塞 + 旋转闭锁，导气调节由气体导管自动完成。5.56×45mm，30 发弹匣。射击循环极其顺滑，是同类突击步枪里后坐曲线最舒服的一支——枪口几乎不跳，连发散布很小。代价是结构复杂，战场修理不如 AK 那样\"敲一敲就能用\"。"
  },
  {
    id: "akm",
    n: "AKM-74 突击步枪",
    cls: "rifle",
    cal: "7.62mm",
    e: 2020,
    pen: 5,
    rpm: 650,
    mag: 30,
    res: 150,
    rel: 2.5,
    spd: 715,
    rng: 135,
    spr: 0.052,
    auto: true,
    rar: "orange",
    snd: "rifle",
    rec: 1.35,
    flavor: "现代化改进型 AK，加入了枪口制退器和斜切枪口，后坐比原型温和一些。7.62×39mm，650 RPM。它把老 AK 的可靠性和新枪的人机工效凑到了一起，是尼珀斯尔精锐部队的制式步枪。在中距离交火中，它的每一发都带着\"扎实\"的感觉。"
  },
  {
    id: "sr762",
    n: "SR-762 栓动狙击枪",
    cls: "sniper",
    cal: "7.62mm",
    e: 3270,
    pen: 6,
    rpm: 55,
    mag: 5,
    res: 40,
    rel: 3.2,
    spd: 830,
    rng: 250,
    spr: 0.004,
    auto: false,
    rar: "yellow",
    snd: "sniper",
    rec: 2.4,
    flavor: "旋转后拉式栓动狙击步枪，7.62×51mm。5 发内置弹匣，配浮动式重枪管。栓动结构决定了它几乎不会故障，也决定了它一次只能打一发。中距离一发毙敌的首选，一旦暴露位置就非常被动——栓动循环和换弹的那几秒钟，是射手最危险的时刻。"
  },
  {
    id: "svd",
    n: "SVD-762 半自动狙击枪",
    cls: "sniper",
    cal: "7.62mm",
    e: 3390,
    pen: 6,
    rpm: 110,
    mag: 10,
    res: 60,
    rel: 2.8,
    spd: 830,
    rng: 230,
    spr: 0.008,
    auto: false,
    rar: "orange",
    snd: "sniper",
    rec: 1.9,
    flavor: "短行程活塞导气式半自动狙击步枪，10 发弹匣，配 PSO 类型 4 倍镜。7.62×54R 弹，落点稳定，半自动循环让它能够在短时间内补第二发。在 200-300 米距离上，它的持续压制能力比栓动更让人头疼——不是每一枪都能爆头，但每一枪都会打中。"
  },
  {
    id: "amr",
    n: "AMR-50 反器材步枪",
    cls: "sniper",
    cal: ".50BMG",
    e: 15500,
    pen: 9,
    rpm: 32,
    mag: 4,
    res: 24,
    rel: 4,
    spd: 860,
    rng: 300,
    spr: 0.003,
    auto: false,
    rar: "orange",
    snd: "sniper",
    rec: 3.4,
    flavor: "导气式半自动反器材步枪，.50 BMG 大口径。枪身重量超过 12 公斤，一般需要依托射击。4 发弹匣，32 RPM。它的设计目标从来不是人，而是轻装甲车辆、雷达和工事——但如果你真的被它打中了，那么\"轻装甲\"这个前提就没了。"
  },
  {
    id: "rail",
    n: "RAIL-9 磁轨步枪",
    cls: "sniper",
    cal: "磁轨",
    pen: 10,
    rpm: 40,
    mag: 5,
    res: 30,
    rel: 3.6,
    spd: 2400,
    rng: 380,
    spr: 0.001,
    auto: false,
    rar: "silver",
    snd: "sniper",
    rec: 3.8,
    flavor: "二里缘家族实验室流出的原型机，电磁轨道加速弹丸，初速超过 2000 m/s。弹丸是实心金属块，不依赖火药——因此没有枪口焰、没有烟、声音也只是\"撕开空气\"的一声。穿透力是常规狙击弹的几倍，但整枪结构脆弱、对振动敏感，每次射击都会损耗导轨，不是能长期上战场的东西。",
    e: 24500
  },
  {
    id: "sg12",
    n: "SG-12 半自动霰弹枪",
    cls: "shotgun",
    cal: "12号",
    e: 270,
    pen: 0,
    rpm: 85,
    mag: 6,
    res: 48,
    rel: 3,
    spd: 410,
    rng: 35,
    spr: 0.135,
    auto: false,
    rar: "blue",
    snd: "shotgun",
    rec: 2.6,
    pellets: 9,
    flavor: "导气式半自动霰弹枪，12 号口径，6 发管式弹仓。一次射击抛出九颗铅弹，10 米内几乎是一条线。射速受限于 85 RPM，但霰弹本来也不是用射速说话的。狭窄走廊和室内清剿的主力。"
  },
  {
    id: "sg8",
    n: "SG-8 双管猎枪",
    cls: "shotgun",
    cal: "12号",
    e: 280,
    pen: 1,
    rpm: 200,
    mag: 2,
    res: 30,
    rel: 1.8,
    spd: 420,
    rng: 32,
    spr: 0.14,
    auto: false,
    rar: "green",
    snd: "shotgun",
    rec: 3,
    pellets: 11,
    flavor: "中折式双管霰弹枪，12 号口径，每个枪管一发。11 颗铅弹、无弹匣、无自动机构——打完两发就只能重新装填。边陲小镇的老猎户人手一把，用来打狼、打野猪、打闯入者。它身上有一种前工业时代的东西：干脆、直接、不留后路。"
  },
  {
    id: "aa12",
    n: "AA-12 全自动霰弹枪",
    cls: "shotgun",
    cal: "12号",
    e: 270,
    pen: 0,
    rpm: 320,
    mag: 20,
    res: 80,
    rel: 4.2,
    spd: 410,
    rng: 34,
    spr: 0.14,
    auto: true,
    rar: "orange",
    snd: "shotgun",
    rec: 2.2,
    pellets: 8,
    flavor: "长行程活塞、恒力缓冲的全自动霰弹枪，配 20 发弹鼓。320 RPM 意味着它每秒能推出五发霰弹——理论上足以在走廊里形成一道\"墙\"。但后坐和弹药消耗同样可观，实战中很少有人连续点射超过三发。是防守型武器，不适合冲锋。"
  },
  {
    id: "lmg58",
    n: "MG-58 通用机枪",
    cls: "lmg",
    cal: "7.62mm",
    e: 3270,
    pen: 5,
    rpm: 750,
    mag: 75,
    res: 225,
    rel: 5,
    spd: 830,
    rng: 130,
    spr: 0.07,
    auto: true,
    rar: "orange",
    snd: "lmg",
    rec: 1.5,
    flavor: "导气式、开膛待击的通用机枪，7.62×51mm，75 发弹链箱。750 RPM 的持续压制火力，需要两人协作才能发挥它的全部价值。单人操作时换弹超过五秒，这段时间里它基本上是一块废铁。尼珀斯尔每个据点都配一挺，靠它把进入射界的通道变成\"死亡走廊\"。"
  },
  {
    id: "m249",
    n: "M-249 班用机枪",
    cls: "lmg",
    cal: "5.56mm",
    e: 1690,
    pen: 3,
    rpm: 850,
    mag: 100,
    res: 300,
    rel: 5.6,
    spd: 920,
    rng: 125,
    spr: 0.072,
    auto: true,
    rar: "red",
    snd: "lmg",
    rec: 1.35,
    flavor: "轻量化班用自动武器，5.56×45mm，100 发弹链袋。850 RPM 的高射速配合 5.56 较轻的后坐，理论上可以由单人携带和射击——实际上重量和换弹时间仍然让它属于\"班组武器\"。它的存在意义不是精确，而是\"你不敢从掩体后面出来\"。"
  },
  {
    id: "gm94",
    n: "GM-94 弹管榴弹发射器",
    cls: "launcher",
    cal: "43mm",
    e: 0,
    pen: 0,
    rpm: 80,
    mag: 4,
    res: 0,
    rel: 4,
    spd: 180,
    rng: 180,
    spr: 0.012,
    auto: false,
    rar: "orange",
    snd: "shotgun",
    rec: 2.4,
    isLauncher: true,
    flavor: "4 发泵动式弹管榴弹发射器，43mm 口径。上弹方式类似霰弹枪，可混装高爆弹与温压弹。它发射的弹丸初速低，飞行时能看清轨迹，实战中用来清理掩体、逼迫走位或直接处理轻装甲目标。装填时把枪身倒转、逐发塞入，动作慢到在交火中做不完。"
  },
  {
    id: "krona_night",
    n: "黑奈·夜切",
    cls: "melee",
    cal: "melee",
    e: 2900,
    rpm: 190,
    mag: 0,
    res: 0,
    rel: 0.35,
    spd: 0,
    rng: 0,
    spr: 0,
    auto: false,
    rar: "bronze",
    snd: "pistol",
    rec: 0.12,
    isMelee: true,
    meleeRange: 82,
    meleeArc: 1.35,
    flavor: "黑奈家族传下的短刀。刀身以冷锻陨铁反复折叠而成，表面呈暗蓝灰色，纹路如水波。刀柄末端嵌着一颗拇指大的蓝白宝石——那是明见逃出沙城时带走的唯一饰品。刀身极轻，出鞘几乎无声。黑奈契用它结束了不止一条性命，也从不让别人碰它。",
    pen: 3
  }
];

ASAKA.ammoTypes = {
  "9mm": {
    cal: "9mm",
    n: "9mm 标准弹",
    pen: 0,
    eMul: 1,
    rar: "common",
    tier: 0,
    flavor: "9×19mm 帕拉贝鲁姆，全金属被甲圆头弹。动能约 500 J，穿软质衣物没问题，遇上凯夫拉纤维就开始吃力。它是所有手枪口径里最通用的一个——便宜、到处都有、打不死人也不会让你卡壳。"
  },
  "9mm_ap": {
    cal: "9mm",
    n: "9mm 穿甲弹",
    pen: 2,
    eMul: 1.05,
    rar: "blue",
    tier: 3,
    flavor: "硬化钢芯被甲弹，弹头内部是尖锥形钢芯而非铅芯。在 9mm 平台上穿甲能力提升有限，但对轻型防弹衣和头盔面罩有实质效果。代价是空腔效应减弱，打在无防护目标上反而比铅芯弹更\"干净\"——穿透是它的全部目的。"
  },
  ".38": {
    cal: ".38",
    n: ".38 特种弹",
    pen: 1,
    eMul: 1,
    rar: "common",
    tier: 0,
    flavor: ".38 Special，转轮时代的经典弹种。弹速偏低（约 290 m/s），后坐柔和，适合单手持握。它不追求穿透，靠的是弹头变形造成的空腔——对软目标效果尚可，对任何硬质护具都接近无效。"
  },
  ".357": {
    cal: ".357",
    n: ".357 马格南",
    pen: 2,
    eMul: 1,
    rar: "green",
    tier: 1,
    flavor: ".357 Magnum，转轮平台上的高膛压弹。药筒比 .38 Special 更长，装药更多，初速提高到 420 m/s 以上。它是上世纪执法部门最信任的口径之一——穿透力、停止作用、可控性都还说得过去。"
  },
  ".50AE": {
    cal: ".50AE",
    n: ".50AE 弹",
    pen: 3,
    eMul: 1,
    rar: "blue",
    tier: 2,
    flavor: ".50 Action Express，为沙漠之鹰系列设计的大口径手枪弹。弹头重量超过 19 克，动能接近 2140 J——这已经超过一些轻型步枪弹的水平。缺点是药筒庞大、弹匣容量小，后坐力让连续射击几乎不可能。"
  },
  ".45ACP": {
    cal: ".45ACP",
    n: ".45ACP 弹",
    pen: 1,
    eMul: 1,
    rar: "common",
    tier: 0,
    flavor: ".45 ACP，亚音速重弹头。约 230 格令的弹头以 290 m/s 出膛，动能约 620 J——不算高，但停止作用出色，靠\"打进去以后不再出来\"制造杀伤。消音使用时几乎听不到音爆，是冲锋枪口径里最安静的选项之一。"
  },
  ".45ACP_ap": {
    cal: ".45ACP",
    n: ".45ACP 穿甲弹",
    pen: 3,
    eMul: 1.05,
    rar: "blue",
    tier: 3,
    flavor: ".45 ACP 的硬化弹芯型号。为了在保留大口径弹头的同时获取穿透能力，弹芯被换成了钢制——空腔效应大幅下降，但对付轻度防弹衣效果明显。属于\"两全其美但两边都不极致\"的改装弹。"
  },
  "4.6mm": {
    cal: "4.6mm",
    n: "4.6mm 高速弹",
    pen: 0,
    eMul: 1,
    rar: "common",
    tier: 0,
    flavor: "4.6×30mm，PDW 概念专用小口径高速弹。弹头仅约 1.7 克，初速却接近 720 m/s。它靠速度而非质量穿透，对软质护甲有一定效果，但一旦速度衰减，剩下的就只有\"一颗小钢珠\"的破坏力。"
  },
  "5.56mm": {
    cal: "5.56mm",
    n: "5.56mm 标准弹",
    pen: 3,
    eMul: 1,
    rar: "blue",
    tier: 2,
    flavor: "5.56×45mm NATO，全金属被甲船尾弹。约 4 克弹头、940 m/s 初速，靠高速造成的翻滚和碎裂来增大杀伤。对轻型护甲穿透尚可，中距离上是均衡性最好的弹种。"
  },
  "5.56mm_ap": {
    cal: "5.56mm",
    n: "5.56mm 穿甲弹",
    pen: 5,
    eMul: 1.05,
    rar: "yellow",
    tier: 4,
    flavor: "钨芯穿甲弹（类似 M995 思路）。弹头内的铅芯被钨合金穿透体替代，能有效击穿中级防弹插板。代价是对软目标的杀伤明显下降——它会在体内留下一条很直的通道，而不是翻滚破裂。"
  },
  "7.62mm": {
    cal: "7.62mm",
    n: "7.62mm 标准弹",
    pen: 5,
    eMul: 1,
    rar: "blue",
    tier: 2,
    flavor: "7.62×39mm 中间威力弹，或 7.62×51mm 全威力弹（视平台而定）。重弹头 + 中等初速，穿透和停止作用都比较均衡。它是 AK 系列崛起的基础——比手枪弹更远、比全威力步枪弹更可控。"
  },
  "7.62mm_ap": {
    cal: "7.62mm",
    n: "7.62mm 穿甲弹",
    pen: 7,
    eMul: 1.05,
    rar: "orange",
    tier: 4,
    flavor: "7.62 平台上的钢/钨芯穿甲弹。对绝大多数轻型和中型插板都有穿透能力，只有面对重装甲或多层复合护具时才会被有效阻挡。它是\"你确定对面有甲\"的时候才该带的弹种。"
  },
  ".50BMG": {
    cal: ".50BMG",
    n: ".50BMG 弹",
    pen: 9,
    eMul: 1,
    rar: "orange",
    tier: 4,
    flavor: ".50 Browning Machine Gun。弹头重约 42 克，初速 860 m/s，动能接近 15500 J——这不是\"枪弹\"，这是一发\"打穿墙\"的东西。在反器材步枪上，它对轻装甲车辆和工事效果显著；对血肉目标，则基本是\"擦到就没\"的水平。"
  },
  "磁轨": {
    cal: "磁轨",
    n: "磁轨弹丸",
    pen: 10,
    eMul: 1,
    rar: "red",
    tier: 5,
    flavor: "二里缘实验室配发的实心钨合金弹丸。它没有火药、没有弹壳——加速完全由轨道电磁力完成，出口速度超过 2000 m/s。穿透力在常规弹种之上，但弹丸本身结构简单，命中后的空腔效应并不突出——它不是\"打进去炸开\"，而是\"打进去，然后从背后出来\"。"
  },
  "12号": {
    cal: "12号",
    n: "12号 鹿弹",
    pen: 0,
    eMul: 1,
    rar: "common",
    tier: 0,
    flavor: "12 号口径 00 号鹿弹（buckshot），每发含 8-9 颗直径约 8.4mm 的铅弹。单颗弹丸动能约 270 J。10 米内弹丸还聚成一团，超过 25 米就散得几乎没有杀伤。它的设计目的只有一个：在极近距离内造成最大程度的破坏。"
  },
  "12号_龙息": {
    cal: "12号",
    n: "12号 龙息弹",
    pen: 0,
    eMul: 0.85,
    rar: "yellow",
    tier: 4,
    onHit: [
      {
        kind: "fireZone",
        p: {
          radius: 65,
          dur: 3,
          dps: 120
        }
      }
    ],
    flavor: "弹头里装的不是铅弹，而是镁铝合金颗粒。出膛时被火药点燃，在空中拖出一条 5-10 米的火焰尾迹。命中点周围会溅出持续燃烧的金属颗粒。它的穿透力差，但能点燃掩体后的目标，或者逼人从掩体里跳出来。"
  },
  "43mm": {
    cal: "43mm",
    n: "43mm 榴弹",
    pen: 0,
    eMul: 1,
    rar: "blue",
    tier: 2,
    flavor: "43mm 榴弹发射器通用弹种，通过弹管逐发装填。低初速、高抛角，通常不直接命中而是靠落点附近的爆炸破片杀伤。它属于\"清房间\"的武器——对付掩体后的人比对付空地上的人更有效。"
  }
};

ASAKA.playerSkills = {
  jump: {
    n: "猫跃",
    cd: 20,
    cost: 10,
    kind: "dash",
    p: {
      distance: 110,
      invuln: 0.3
    }
  },
  aimbuff: {
    n: "精准射击",
    cd: 45,
    cost: 15,
    kind: "timedBuff",
    p: {
      field: "aimBuffT",
      duration: 3
    }
  },
  dash: {
    n: "狐步",
    cd: 25,
    cost: 12,
    kind: "timedBuff",
    p: {
      field: "dashT",
      duration: 5
    }
  },
  suppress: {
    n: "压制",
    cd: 60,
    cost: 20,
    kind: "timedBuff",
    p: {
      field: "suppressT",
      duration: 4
    }
  },
  drone: {
    n: "侦察无人机",
    cd: 30,
    cost: 0,
    kind: "drone",
    p: {
      duration: 25,
      markRadius: 800,
      markDuration: 15
    }
  },
  rally: {
    n: "激励",
    cd: 75,
    cost: 0,
    kind: "healPercent",
    p: {
      percent: 0.15
    }
  },
  shield: {
    n: "盾墙",
    cd: 30,
    cost: 0,
    kind: "timedBuff",
    p: {
      field: "shieldT",
      duration: 5
    }
  },
  taunt: {
    n: "嘲讽",
    cd: 60,
    cost: 0,
    kind: "timedBuff",
    p: {
      field: "tauntT",
      duration: 3
    }
  },
  money: {
    n: "金钱攻势",
    cd: 40,
    cost: 0,
    kind: "summon",
    p: {
      unit: "rifle",
      max: 6,
      perCast: 2,
      hpMul: 0.6,
      radius: 90,
      ally: true
    }
  },
  frostnova: {
    n: "冰霜新星",
    cd: 30,
    cost: 20,
    kind: "aoeDamage",
    p: {
      radius: 160,
      damage: 80,
      slowT: 3
    }
  },
  shadowstep: {
    n: "暗影步",
    cd: 8,
    cost: 0,
    kind: "teleport",
    p: {
      distance: 120,
      random: true
    }
  },
  howl: {
    n: "虚妄素",
    cd: 25,
    cost: 0,
    kind: "confuseAoe",
    p: {
      radius: 200,
      duration: 6
    }
  }
};

ASAKA.bossSkills = {
  money: {
    kind: "summon",
    cd: [9, 14],
    label: "呼叫护卫",
    p: {
      unit: "rifle",
      max: 6,
      perCast: 2,
      hpMul: 0.6,
      radius: 80,
      ally: false
    }
  },
  frostnova: {
    kind: "bossFrostnova",
    cd: [6, 12],
    label: "冰霜新星",
    p: {
      radius: 200,
      damage: 60
    }
  },
  shadowstep: {
    kind: "bossTeleport",
    cd: [6, 12],
    label: "暗影步",
    p: {
      distance: 140
    }
  },
  howl: {
    kind: "confuseAoe",
    cd: [6, 12],
    label: "虚妄素",
    p: {
      radius: 200,
      duration: 3
    }
  },
  shieldwall: {
    kind: "selfBuff",
    cd: [6, 12],
    label: "能量护盾",
    p: {
      field: "shieldT",
      duration: 5
    }
  },
  missiles: {
    kind: "missileRain",
    cd: [6, 12],
    label: "导弹齐射",
    p: {
      count: 4,
      damage: 150,
      radius: 150,
      fuse: 1.5,
      delayMs: 200
    }
  },
  overload: {
    kind: "overload",
    cd: [6, 12],
    label: "过载",
    p: {
      duration: 10,
      dmgMul: 1.5
    }
  }
};

ASAKA.attach = {
  muzzle: [
    {
      id: "m_sup",
      n: "消音器",
      rar: "blue",
      d: {
        spr: -0.06,
        e: -0.07,
        sndMod: "sup"
      },
      flavor: "膨胀腔式消音器。它并不\"消除\"枪声，只是把火药气体在腔室内逐级膨胀、降温，把原本的\"炸响\"变成\"闷响\"——亚音速弹可以接近静音，超音速弹仍然会有弹道音爆。代价是枪口动能下降、枪管有效长度增加、连续射击时热量积聚快。"
    },
    {
      id: "m_comp",
      n: "补偿器",
      rar: "green",
      d: {
        rec: -0.16,
        spr: -0.08
      },
      flavor: "顶部开口式枪口补偿器。让部分火药气体向上喷出，把枪口下压——抵消一部分枪口上跳。对连发武器效果明显，对栓动则意义不大。代价是侧面和后方的枪口焰更明显，同时\"提醒\"队友：不要站在枪口侧方。"
    },
    {
      id: "m_brk",
      n: "制退器",
      rar: "yellow",
      d: {
        rec: -0.3,
        spr: -0.05
      },
      flavor: "大开口式枪口制退器。后向排气，把大部分后坐力\"推回去\"。能把 7.62 平台的后坐压到接近 5.56 的水平。代价是枪声巨响、枪口焰巨大、靠近枪口侧方会感受到明显的冲击波——室内使用基本等于自毁听力。"
    },
    {
      id: "m_loud",
      n: "扩音器",
      rar: "red",
      d: {
        e: 0.16,
        rec: 0.15
      },
      flavor: "一种古怪的改装——在枪口加装谐振腔，让部分火药气体在弹头脱离枪口前继续膨胀，赋予弹头额外的初速。听起来像是\"什么都没牺牲的好事\"，但它同时增加了枪口上跳和噪声，也缩短了枪管寿命。某些佣兵偏好它，理由纯粹是\"多出来的动能值一条命\"。"
    }
  ],
  sight: [
    {
      id: "s_iron",
      n: "机械瞄具",
      rar: "common",
      d: {},
      flavor: "原厂准星与照门。不耗电、不会坏、不依赖任何东西。缺点是射击视野受限、快速目标捕获不如红点。"
    },
    {
      id: "s_red",
      n: "红点瞄准镜",
      rar: "green",
      d: {
        spr: -0.16
      },
      flavor: "单点反射式红点瞄准镜。一颗红色光点，双眼睁开时直接\"投\"在视野里，反应速度比机械瞄具快得多。缺点是光点在中远距离会遮挡目标，也依赖电池。"
    },
    {
      id: "s_holo",
      n: "全息瞄准镜",
      rar: "blue",
      d: {
        spr: -0.24
      },
      flavor: "全息衍射式瞄具。准星是一个环，环上有一个小点——比红点更适合快速移动目标。结构比红点复杂，抗振性更好，电池寿命也更长。中近距离的通用选择。"
    },
    {
      id: "s_scope4",
      n: "4 倍战术镜",
      rar: "yellow",
      d: {
        spr: -0.34,
        rng: 0.25,
        zoom: 2.5
      },
      flavor: "4 倍固定倍率瞄准镜，带密位分划。中距离的主要选择，视野损失与放大收益平衡得最好。近战时需要切副武器或凭肌肉记忆盲射。"
    },
    {
      id: "s_scope8",
      n: "8 倍高倍镜",
      rar: "orange",
      d: {
        spr: -0.44,
        rng: 0.5,
        zoom: 4
      },
      flavor: "8 倍高倍率狙击镜，带可调视差。适合 200 米以外的精确射击。视野极窄，一旦被人贴近到 50 米内，就只能在镜里看到一片模糊的绿色。"
    },
    {
      id: "s_thermal",
      n: "热成像瞄具",
      rar: "gold",
      d: {
        spr: -0.48,
        rng: 0.4,
        zoom: 5
      },
      flavor: "被动式热成像。它不发射任何东西，只接收物体散发的红外辐射——因此在烟雾、薄雾和黑暗里仍然有效。它能看穿烟雾，但看不穿玻璃或水。视野呈灰白、需要靠温度差辨认目标，与常规瞄具的操作习惯差异很大。"
    }
  ],
  mag: [
    {
      id: "g_ext",
      n: "扩容弹匣",
      rar: "green",
      d: {
        mag: 0.5
      },
      flavor: "在标准弹匣基础上加长 50%。容量提升明显，重量和换弹时间也相应增加。"
    },
    {
      id: "g_quick",
      n: "快拔弹匣",
      rar: "green",
      d: {
        rel: -0.24
      },
      flavor: "弹匣表面做防滑处理、卡榫略微削薄，配合快速装填套使用时能明显缩短换弹时间。代价是弹匣壳强度降低，重击后可能变形。"
    },
    {
      id: "g_drum",
      n: "弹鼓",
      rar: "blue",
      d: {
        mag: 1.2,
        rel: 0.32
      },
      flavor: "大容量弹鼓。容量爆炸性提升，但重量可观、换弹时间翻倍——实战中通常只在据点防守时使用。"
    },
    {
      id: "g_light",
      n: "轻量化弹匣",
      rar: "yellow",
      d: {
        mag: 0.25,
        rel: -0.32
      },
      flavor: "聚合物壳体、减薄壁厚。容量略增、换弹更快，代价是强度下降，摔一下就可能变形。"
    },
    {
      id: "g_tac",
      n: "战术弹匣",
      rar: "orange",
      d: {
        mag: 0.6,
        rel: -0.18
      },
      flavor: "兼顾容量与换弹速度的高端弹匣。材料工艺到位，能同时获得两点收益——价格自然不菲。"
    }
  ],
  grip: [
    {
      id: "h_vert",
      n: "垂直握把",
      rar: "green",
      d: {
        rec: -0.2
      },
      flavor: "最基础的握把。提供一个稳定的手部支点，主要作用是抑制枪口上跳。"
    },
    {
      id: "h_ang",
      n: "斜角握把",
      rar: "blue",
      d: {
        rec: -0.26,
        spr: -0.06
      },
      flavor: "向前倾斜的握把。相对垂直握把，它更适合快速转向——手腕角度更自然，近距离遭遇战中更能保住首发精度。"
    },
    {
      id: "h_ergo",
      n: "战术握把",
      rar: "yellow",
      d: {
        rec: -0.32,
        rel: -0.1
      },
      flavor: "按人机工效学设计的握把，指槽与掌心贴合度更高。除了压制后坐，还能减少手部疲劳，让换弹动作更顺。"
    },
    {
      id: "h_bipod",
      n: "脚架握把",
      rar: "orange",
      d: {
        rec: -0.48,
        spr: -0.2
      },
      flavor: "可折叠的两脚架。依托地面或掩体架设时，后坐和散布都会大幅降低；站立射击时则等于背了个多余的东西。适合狙击手和机枪手。"
    }
  ]
};

ASAKA.helmetShells = [
  {
    id: "hs0",
    n: "无头盔壳",
    lv: 0,
    rar: "common",
    red: 0,
    energyPerPct: 0,
    flavor: "什么都没戴。"
  },
  {
    id: "hs1",
    n: "轻型头盔壳",
    lv: 1,
    rar: "common",
    red: 0.22,
    energyPerPct: 30,
    flavor: "钢制头盔，二战到冷战时期的样式。对弹片、落石和飞溅物有一定防护，正面对步枪弹基本只能改变弹道方向。"
  },
  {
    id: "hs2",
    n: "突击头盔壳",
    lv: 2,
    rar: "green",
    red: 0.38,
    energyPerPct: 55,
    flavor: "尼龙/复合材料头盔，类似 PASGT 的现代改进型。能挡住手枪弹和部分霰弹破片，对步枪弹只能减弱穿透。"
  },
  {
    id: "hs3",
    n: "战斗头盔壳",
    lv: 3,
    rar: "blue",
    red: 0.52,
    energyPerPct: 85,
    flavor: "芳纶纤维 + 陶瓷复合层结构。能可靠挡住 9mm 和 .45 ACP，对 5.56 有概率拦截。佩戴舒适，是佣兵和特种部队的常见配置。"
  },
  {
    id: "hs4",
    n: "重型头盔壳",
    lv: 4,
    rar: "yellow",
    red: 0.64,
    energyPerPct: 125,
    flavor: "加厚陶瓷复合材料，在保留活动性的同时提高了防护等级。可以防住 5.56 标准弹和部分 7.62 弹，但重量让佩戴者更容易疲劳。"
  },
  {
    id: "hs5",
    n: "突击队头盔壳",
    lv: 5,
    rar: "orange",
    red: 0.74,
    energyPerPct: 175,
    flavor: "尼珀斯尔精锐部队制式头盔，多层陶瓷 + 钛合金支撑框架。可以防住大多数步枪弹，包括 7.62×39。正面命中不再意味着\"倒下\"，只意味着\"被砸了一下\"。"
  },
  {
    id: "hs6",
    n: "指挥头盔壳",
    lv: 6,
    rar: "red",
    red: 0.82,
    energyPerPct: 230,
    flavor: "带数据链的指挥型头盔，集成通信、瞄准辅助和弹道计算模块。装甲层进一步加厚，代价是需要专门的电池模块供电。"
  },
  {
    id: "hs8",
    lv: 8,
    rar: "inc",
    red: 0.94,
    energyPerPct: 400,
    flavor: "任务道具。\n贵金属、宝石、感压层、陶瓷层、碳纤维层层嵌套。它几乎是刀枪不入，但对颈部损伤极大。",
    n: "BW-HElmET!"
  }
];

ASAKA.helmetVisors = [
  {
    id: "hv0",
    n: "无面罩",
    lv: 0,
    rar: "common",
    red: 0,
    energyPerPct: 0,
    visionPenalty: 0,
    flavor: "直接露脸。"
  },
  {
    id: "hv2",
    n: "简单面罩",
    lv: 2,
    rar: "green",
    red: 0.28,
    energyPerPct: 40,
    visionPenalty: 0.08,
    flavor: "钢化玻璃面罩，只能挡住飞溅物和碎片。视野略窄，长时间佩戴会有雾化问题。"
  },
  {
    id: "hv3",
    n: "战斗面罩",
    lv: 3,
    rar: "blue",
    red: 0.42,
    energyPerPct: 65,
    visionPenalty: 0.06,
    flavor: "多层聚碳酸酯 + 陶瓷涂层，能挡住 9mm 和破片。玻璃本身经过防眩光处理，视野损失可以接受。"
  },
  {
    id: "hv4",
    n: "重型面罩",
    lv: 4,
    rar: "yellow",
    red: 0.55,
    energyPerPct: 95,
    visionPenalty: 0.05,
    flavor: "加厚复合面罩。能挡住大多数手枪弹和部分步枪弹，但是重量让它在快速转头时有点拖沓。"
  },
  {
    id: "hv5",
    n: "突击队面罩",
    lv: 5,
    rar: "orange",
    red: 0.66,
    energyPerPct: 130,
    visionPenalty: 0.04,
    flavor: "尼珀斯尔制式面罩。夹层内含陶瓷颗粒和抗冲击层，能挡住大部分步枪弹。透光率略低，但视野损失几乎察觉不到。"
  },
  {
    id: "hv6",
    n: "指挥面罩",
    lv: 6,
    rar: "red",
    red: 0.76,
    energyPerPct: 175,
    visionPenalty: 0.03,
    flavor: "带抬头显示（HUD）的指挥型面罩。可以在玻璃上投射手雷落点、队友位置和剩余弹药。防护等级同步提升。"
  },
  {
    id: "hv8",
    lv: 8,
    rar: "inc",
    red: 0.92,
    energyPerPct: 300,
    n: "BW-MasK!",
    flavor: "任务道具。\n由多层特种玻璃与金刚石薄膜组成。",
    visionPenalty: 0.5
  }
];

ASAKA.helmetEars = [
  {
    id: "he0",
    n: "无耳机",
    lv: 0,
    rar: "common",
    hearingMul: 1,
    flashResist: 0,
    flavor: "裸耳。"
  },
  {
    id: "he2",
    n: "简单耳机",
    lv: 2,
    rar: "green",
    hearingMul: 1.15,
    flashResist: 0.1,
    flavor: "被动降噪耳罩。能压掉一部分高频枪声，同时通过麦克风把外部声音\"补\"回耳里，反而听得更远。"
  },
  {
    id: "he3",
    n: "战术耳机",
    lv: 3,
    rar: "blue",
    hearingMul: 1.3,
    flashResist: 0.2,
    flavor: "主动降噪 + 环境拾音。它能削弱枪声这种脉冲噪声，同时把脚步、拉栓、换弹这类微弱声音放大。是老练玩家的标配。"
  },
  {
    id: "he4",
    n: "指挥耳机",
    lv: 4,
    rar: "yellow",
    hearingMul: 1.5,
    flashResist: 0.3,
    flavor: "带通信模块的战术耳机。除了拾音，还能接入小队频道进行实时通话。同时具备对闪光弹声光效应的轻度抑制。"
  },
  {
    id: "he5",
    n: "突击队耳机",
    lv: 5,
    rar: "orange",
    hearingMul: 1.7,
    flashResist: 0.4,
    flavor: "尼珀斯尔精锐装备。拾音增益更高，能分辨 30 米外的脚步方向；同时内置电子压限器，闪光弹爆炸时能自动\"截断\"过载音量，减少眩晕。"
  },
  {
    id: "he6",
    n: "指挥中枢耳机",
    lv: 6,
    rar: "red",
    hearingMul: 2,
    flashResist: 0.5,
    flavor: "带数据链的指挥耳机，可与头盔 HUD 联动，在视野边缘提示声源方向。拾音能力已经接近专业声呐员。"
  }
];

ASAKA.vestFibers = [
  {
    id: "vf0",
    n: "无纤维层",
    lv: 0,
    rar: "common",
    red: 0,
    energyPerPct: 0,
    flavor: "裸身上阵。"
  },
  {
    id: "vf1",
    n: "布质护具",
    lv: 1,
    rar: "common",
    red: 0.2,
    energyPerPct: 35,
    flavor: "厚帆布 + 皮革。能挡住刀砍和飞溅物，对子弹基本只能\"减小一点动能\"。"
  },
  {
    id: "vf2",
    n: "凯夫拉纤维",
    lv: 2,
    rar: "green",
    red: 0.34,
    energyPerPct: 60,
    flavor: "纯凯夫拉软质纤维。通过纤维拉伸分散弹头动能，能挡住手枪弹。对步枪弹则无能为力——它只是\"让弹头在被穿透时损失一部分能量\"。"
  },
  {
    id: "vf3",
    n: "陶瓷纤维",
    lv: 3,
    rar: "blue",
    red: 0.46,
    energyPerPct: 90,
    flavor: "凯夫拉 + 小块陶瓷复合，是佣兵最常见的配置。陶瓷颗粒在被击中的瞬间破裂、消耗弹头动能，凯夫拉层负责兜底。多打几发后陶瓷碎裂，防护效果会明显下降。"
  },
  {
    id: "vf4",
    n: "复合纤维",
    lv: 4,
    rar: "yellow",
    red: 0.58,
    energyPerPct: 130,
    flavor: "多层芳纶 + 陶瓷复合，抗冲击性能优异。能挡住大多数手枪弹和一部分步枪弹。重量适中，是长距离行动的首选。"
  },
  {
    id: "vf5",
    n: "重型纤维",
    lv: 5,
    rar: "orange",
    red: 0.68,
    energyPerPct: 180,
    flavor: "尼珀斯尔精锐制式。多层陶瓷复合 + 钛合金支撑。能挡住 5.56 甚至部分 7.62 弹，代价是灵活性下降。"
  },
  {
    id: "vf6",
    n: "动力外骨骼",
    lv: 6,
    rar: "red",
    red: 0.76,
    energyPerPct: 240,
    flavor: "带外骨骼辅助的复合纤维层。外骨骼分担了装甲的重量，让佩戴者仍然能保持接近正常的机动性。同时提供额外的支撑力矩，可以在被冲击时稳定身体。"
  }
];

ASAKA.vestPlates = [
  {
    id: "vp0",
    n: "无插板",
    lv: 0,
    rar: "common",
    red: 0,
    energyPerPct: 0,
    flavor: "只有纤维层，没有硬质插板。"
  },
  {
    id: "vp2",
    n: "陶瓷插板",
    lv: 2,
    rar: "green",
    red: 0.36,
    energyPerPct: 60,
    flavor: "单片氧化铝陶瓷。它能挡住手枪弹和部分 5.56 弹——原理是陶瓷在被击中时破裂，用碎裂过程消耗弹头动能。一块板通常只能承受几发命中。"
  },
  {
    id: "vp3",
    n: "复合插板",
    lv: 3,
    rar: "blue",
    red: 0.5,
    energyPerPct: 90,
    flavor: "陶瓷 + 聚乙烯背衬的复合插板。陶瓷层负责消耗动能，聚乙烯层负责吸收剩余冲击。比纯陶瓷更抗多发命中。"
  },
  {
    id: "vp4",
    n: "重型插板",
    lv: 4,
    rar: "yellow",
    red: 0.62,
    energyPerPct: 130,
    flavor: "标准军用级复合插板。能挡住 7.62×39 和大部分 5.56 弹种。重量已经明显影响活动，属于\"换命\"的装备。"
  },
  {
    id: "vp5",
    n: "装甲插板",
    lv: 5,
    rar: "orange",
    red: 0.72,
    energyPerPct: 175,
    flavor: "尼珀斯尔精锐专用。多层陶瓷 + 钛合金背板。能挡住绝大多数步枪弹，代价是胸前的重量像一块砖。"
  },
  {
    id: "vp6",
    n: "复合陶瓷插板",
    lv: 6,
    rar: "red",
    red: 0.8,
    energyPerPct: 230,
    flavor: "高硬度陶瓷与多层复合背板。面对 7.62 穿甲弹也有可靠拦截能力。每一块板的造价相当于一支完整的突击步枪。"
  },
  {
    id: "vp8",
    lv: 8,
    rar: "inc",
    red: 0.95,
    energyPerPct: 400,
    flavor: "任务道具。\n贵金属、宝石、陶瓷、感压层层嵌套。",
    n: "BW-BLaNK!"
  }
];

ASAKA.backpacks = [
  {
    id: "bp0",
    n: "无背包",
    lv: 0,
    rar: "common",
    cap: 0,
    stk: 0,
    flavor: "身上没地方装东西。"
  },
  {
    id: "bp1",
    n: "帆布挎包",
    lv: 1,
    rar: "common",
    cap: 6,
    stk: 0,
    flavor: "单肩帆布挎包，露营用品店最常见的那种。能装几盒弹药、一两件补给。"
  },
  {
    id: "bp2",
    n: "突击背包",
    lv: 2,
    rar: "green",
    cap: 10,
    stk: 0,
    flavor: "30L 左右的战术背包。外部有 MOLLE 挂载点，能装下一天行动的补给。"
  },
  {
    id: "bp3",
    n: "巡逻背包",
    lv: 3,
    rar: "blue",
    cap: 15,
    stk: 0,
    flavor: "45L 巡逻背包，多隔层设计。能装下两三天的物资和一部分战利品。"
  },
  {
    id: "bp4",
    n: "突击队背包",
    lv: 4,
    rar: "yellow",
    cap: 20,
    stk: 0,
    flavor: "特种部队用的大容量背包。背负系统经过优化，满载时也能保持重心稳定。"
  },
  {
    id: "bp5",
    n: "远征背包",
    lv: 5,
    rar: "orange",
    cap: 25,
    stk: 0,
    flavor: "长距离行动的首选。有独立的睡袋仓、水袋仓和快取仓，可以快速拿取常用物品。"
  },
  {
    id: "bp6",
    n: "指挥背包",
    lv: 6,
    rar: "red",
    cap: 30,
    stk: 0,
    flavor: "指挥官的公文包式背包。除了储物，还能展开一块便携式战术地图板。"
  },
  {
    id: "bp7",
    n: "超导背包",
    lv: 7,
    rar: "gold",
    cap: 35,
    stk: 0,
    flavor: "二里缘实验室的空间折叠技术。外部尺寸没有明显增大，内部容量却超过常规设计的上限。"
  },
  {
    id: "bp8",
    n: "Incredible 背包",
    lv: 8,
    rar: "inc",
    cap: 40,
    stk: 0,
    flavor: "布雯·叶的整活背包。贵金属框架、宝石镶嵌、超导层——它的第一功能其实是\"展示\"，第二功能才是\"装东西\"。"
  }
];

ASAKA.chestRigs = [
  {
    id: "cr0",
    n: "无胸挂",
    lv: 0,
    rar: "common",
    cap: 0,
    stk: 0,
    flavor: "口袋凑合一下。"
  },
  {
    id: "cr1",
    n: "简易胸挂",
    lv: 1,
    rar: "common",
    cap: 4,
    stk: 0,
    flavor: "帆布胸挂，四个弹匣袋。能装下最基本的弹药和一两件小补给。"
  },
  {
    id: "cr2",
    n: "突击胸挂",
    lv: 2,
    rar: "green",
    cap: 6,
    stk: 0,
    flavor: "标准突击胸挂。多个弹匣袋 + 一个医疗袋 + 一个杂物袋，是前线步兵的标配。"
  },
  {
    id: "cr3",
    n: "战术胸挂",
    lv: 3,
    rar: "blue",
    cap: 8,
    stk: 0,
    flavor: "模块化战术胸挂。可以自己调整弹匣袋和杂物袋的位置，弹药、投掷物、医疗品都能各归其位。"
  },
  {
    id: "cr4",
    n: "重型胸挂",
    lv: 4,
    rar: "yellow",
    cap: 10,
    stk: 0,
    flavor: "满载弹药的胸挂。多弹匣袋 + 手雷袋 + 大型杂物袋，能维持一场高强度交火。"
  },
  {
    id: "cr5",
    n: "突击队胸挂",
    lv: 5,
    rar: "orange",
    cap: 12,
    stk: 0,
    flavor: "特种部队用的大容量胸挂。带快速释放扣，紧急情况下可以一键卸下。"
  },
  {
    id: "cr6",
    n: "指挥胸挂",
    lv: 6,
    rar: "red",
    cap: 14,
    stk: 0,
    flavor: "指挥官带这么多弹药干嘛。"
  },
  {
    id: "cr7",
    n: "超导胸挂",
    lv: 7,
    rar: "gold",
    cap: 16,
    stk: 0,
    flavor: "二里缘实验室产物。织物内嵌超导网络，能把胸挂上的重量均匀分散到肩部和腰部。"
  },
  {
    id: "cr8",
    n: "Incredible 胸挂",
    lv: 8,
    rar: "inc",
    cap: 18,
    stk: 0,
    flavor: "布雯·叶同款。贵金属胸挂配宝石扣——它的作用是\"让别人一眼看见你\"。"
  }
];

ASAKA.consumables = [
  {
    id: "bandage",
    n: "绷带",
    cls: "heal",
    rar: "common",
    heal: 16,
    stopBleed: true,
    stk: 8,
    useTime: 2,
    flavor: "标准的医用纱布卷，宽 5cm、长 4m。用于包扎四肢或躯干表面的小伤口。它能止住出血，但对深层损伤和骨折没有任何作用。"
  },
  {
    id: "medkit",
    n: "急救包",
    cls: "heal",
    rar: "green",
    heal: 38,
    stopBleed: true,
    stk: 4,
    useTime: 3.5,
    flavor: "单兵急救包（IFAK）。内含止血敷料、绷带、止血带和一小袋止血粉。能处理中度伤口，对骨折和多处创伤则力不从心。"
  },
  {
    id: "surgery",
    n: "手术包",
    cls: "heal",
    rar: "blue",
    heal: 65,
    fixLimbs: true,
    stk: 2,
    useTime: 6,
    flavor: "野战外科手术包。包含局部麻醉剂、手术刀、缝合线和固定夹板。它能让断裂的肢体恢复正常——但这需要时间，而战场上的时间很贵。"
  },
  {
    id: "painkiller",
    n: "止痛药",
    cls: "heal",
    rar: "green",
    heal: 6,
    buff: "noPain",
    stk: 6,
    useTime: 1.5,
    flavor: "口服型中枢镇痛药。能短时间压制疼痛感，让伤口不至于影响行动。它不治疗任何东西——只是让你暂时感觉不到自己已经废了。"
  },
  {
    id: "stim",
    n: "兴奋剂",
    cls: "heal",
    rar: "yellow",
    heal: 10,
    buff: "speed",
    stk: 4,
    useTime: 1,
    flavor: "战地兴奋剂。注射后几分钟内明显提升移动速度和反应速度。代价是药效结束后会有一段时间的疲惫——在战场上通常等不到那时候。"
  },
  {
    id: "medgel",
    n: "医用凝胶",
    cls: "heal",
    rar: "blue",
    heal: 28,
    fixLimbOne: true,
    stk: 4,
    useTime: 3,
    flavor: "外用型医用凝胶。涂抹在伤口处后，凝胶中的凝血因子和生长因子会加速组织愈合。可以修复一处断裂肢体，但无法处理多处创伤。"
  },
  {
    id: "adrenaline",
    n: "肾上腺素",
    cls: "heal",
    rar: "orange",
    heal: 50,
    buff: "noPain",
    stk: 3,
    useTime: 2.5,
    flavor: "自动注射型肾上腺素笔。在休克的边缘把自己拉回来。心率和血压会骤然提升，止血和止痛同时进行。副作用是之后会有一段明显的虚脱期。"
  },
  {
    id: "nanomed",
    n: "纳米医疗包",
    cls: "heal",
    rar: "red",
    heal: 999,
    fixLimbs: true,
    stk: 1,
    useTime: 5,
    flavor: "二里缘实验室流出的实验医疗包。内部是一小管含纳米机器人的生理盐水，注射后纳米机器人会在血管内自动修补组织。理论上能让人从\"只剩一口气\"恢复到\"能继续战斗\"。"
  },
  {
    id: "blood_bag",
    n: "血浆袋",
    cls: "heal",
    rar: "green",
    heal: 20,
    stopBleed: true,
    stk: 4,
    useTime: 3,
    flavor: "O 型通用血浆袋，约 250ml。在失血过多时用来维持循环血量。它不能治愈伤口，只是\"把人从休克边缘拉回来\"。需要配合止血措施才有意义。"
  },
  {
    id: "trauma_kit",
    n: "创伤急救包",
    cls: "heal",
    rar: "orange",
    heal: 80,
    stopBleed: true,
    fixLimbs: true,
    stk: 2,
    useTime: 5.5,
    flavor: "高级创伤急救包。内含胸封、止血带、骨折夹板、引流针和缝合设备。它能同时处理大出血、骨折和张力性气胸——这三种情况里任何一项都能让人死在战场上。"
  },
  {
    id: "energy",
    n: "能量饮料",
    cls: "heal",
    rar: "common",
    heal: 5,
    buff: "stamina",
    stk: 8,
    useTime: 1,
    flavor: "高糖 + 咖啡因的功能饮料。它能补充一点体力，让你在长距离移动时不会过早疲劳。它没有任何医疗作用——只是让你感觉\"还能再跑一段\"。"
  },
  {
    id: "stim_cp",
    n: "耦合补充剂",
    cls: "coupling",
    rar: "yellow",
    coupling: 45,
    stk: 4,
    useTime: 2,
    flavor: "Prazer 专用的耦合补充剂。注射后 P 空间与个体的耦合强度会短时间回升，使耦合能槽重新充盈。对人类完全无效——人类没有 P 空间耦合。"
  },
  {
    id: "armorplate",
    n: "陶瓷插板",
    cls: "armor",
    rar: "green",
    repairPlate: 30,
    stk: 4,
    useTime: 2.5,
    flavor: "备用陶瓷插板。当胸前的插板被击中、出现裂纹后，更换一块新的可以恢复防护能力。它不是\"修\"，而是\"换\"。"
  },
  {
    id: "repairkit",
    n: "护甲修理包",
    cls: "armor",
    rar: "blue",
    repairPlate: 60,
    stk: 3,
    useTime: 4,
    flavor: "陶瓷插板修复套件。内含粘合剂、修补粉和小型加压工具。能让受损插板恢复大约六成的防护能力——虽然不如换新板，但不用把整块板丢掉。"
  },
  {
    id: "increpair",
    n: "纳米修复仪",
    cls: "armor",
    rar: "gold",
    repairPlate: 999,
    stk: 1,
    useTime: 5,
    flavor: "二里缘实验室流出的纳米修复仪。它能在分子层面重新排列陶瓷晶体结构，把一块快要碎裂的插板恢复到出厂状态。只能使用一次。"
  }
];

ASAKA.nades = [
  {
    id: "flash",
    n: "闪光弹",
    rar: "green",
    fuse: 2,
    radius: 250,
    effect: "flash",
    damage: 22,
    stk: 6,
    flavor: "9 孔式爆震闪光弹。引信触发后 2 秒，弹体内的镁粉爆燃产生约 180 分贝的声响和 800 万坎德拉的强光。对无防护目标能造成数秒的致盲和眩晕，对戴了战术耳机的目标效果会明显下降。"
  },
  {
    id: "smoke",
    n: "烟雾弹",
    rar: "green",
    fuse: 1.5,
    radius: 200,
    effect: "smoke",
    duration: 14,
    stk: 6,
    flavor: "红磷或六氯乙烷发烟罐。点燃后持续 14 秒喷出浓密的白烟，能有效遮挡可见光——但热成像瞄具依然可以看穿。常用于掩护转移或阻断对方视线。"
  },
  {
    id: "stun",
    n: "震撼弹",
    rar: "blue",
    fuse: 2,
    radius: 220,
    effect: "stun",
    duration: 6,
    damage: 45,
    stk: 6,
    flavor: "爆震弹。它不靠破片，而是靠冲击波和巨响造成暂时的平衡感丧失和耳鸣。室内使用时效果尤其明显——墙壁会把冲击波反射回来，让整个房间都\"震一下\"。"
  },
  {
    id: "frag",
    n: "破片手雷",
    rar: "blue",
    fuse: 3,
    radius: 200,
    effect: "frag",
    damage: 380,
    stk: 6,
    flavor: "经典防御型破片手雷。钢制外壳在爆炸时碎裂成数百枚高速破片。有效杀伤半径约 5 米，破片能飞散到 15 米外。投掷后必须立刻寻找掩体——它的爆炸不分敌我。"
  },
  {
    id: "incendiary",
    n: "燃烧瓶",
    rar: "yellow",
    fuse: 2,
    radius: 180,
    effect: "fire",
    damage: 300,
    stk: 4,
    flavor: "铝热剂/凝固汽油型燃烧瓶。落地后弹体破裂，燃烧剂附着在物体表面持续燃烧。它的直接杀伤半径有限，但燃烧区能持续封锁一条通道——燃烧中的敌人会持续掉血，同时暴露位置。"
  },
  {
    id: "emp",
    n: "EMP 弹",
    rar: "red",
    fuse: 2.5,
    radius: 260,
    effect: "stun",
    duration: 8,
    damage: 80,
    stk: 3,
    flavor: "电磁脉冲弹。通过爆燃压缩磁通量产生瞬间强电磁脉冲。它能干扰电子设备——夜视仪、瞄具、通信设备——同时造成短时间的感觉混乱。对人体的直接伤害有限。"
  },
  {
    id: "he_43",
    n: "高爆榴弹",
    rar: "blue",
    fuse: 1.2,
    radius: 260,
    effect: "frag",
    damage: 620,
    onlyLauncher: true,
    stk: 4,
    flavor: "43mm 高爆榴弹。装药为高爆混合炸药，外壳可碎裂成大量破片。相比手雷，它的杀伤半径更大、破片速度更高。落点 3 米内的目标基本没有生还可能。"
  },
  {
    id: "thermo_43",
    n: "温压弹",
    rar: "orange",
    fuse: 1.5,
    radius: 360,
    effect: "thermo",
    damage: 1400,
    onlyLauncher: true,
    stk: 3,
    flavor: "43mm 温压弹。起爆后先抛洒一层可燃云雾，随后引燃形成高温高压的爆轰云。它对封闭空间内的目标杀伤极其恐怖——冲击波、高温和缺氧会同时作用。室外使用时威力会明显减弱。"
  }
];

ASAKA.valuables = [
  {
    id: "v_scrap",
    n: "废铁",
    rar: "common",
    base: 25,
    stk: 20,
    flavor: "从建筑废墟里拆下来的铁皮、螺栓和钢筋头。回收站按重量收购。"
  },
  {
    id: "v_rag",
    n: "旧布",
    rar: "common",
    base: 12,
    stk: 20,
    flavor: "褪色的粗棉布，边缘磨得起毛。可能是谁的衣服，也可能是块窗帘。"
  },
  {
    id: "v_paper",
    n: "旧报纸",
    rar: "common",
    base: 15,
    stk: 20,
    flavor: "油墨已经发黄，日期模糊不清。上面有一段关于\"沙城贸易禁令\"的报道——那是一百多年前的事了。"
  },
  {
    id: "v_can",
    n: "罐头",
    rar: "common",
    base: 35,
    stk: 10,
    flavor: "军用压缩口粮罐头，标签早已撕掉。内容物大概率是豆子或肉酱。"
  },
  {
    id: "v_wire",
    n: "铜线卷",
    rar: "common",
    base: 60,
    stk: 10,
    flavor: "从墙里剥出来的铜线，粗细不一，被绕成一团。五金店和黑市都收。"
  },
  {
    id: "v_battery",
    n: "旧电池组",
    rar: "green",
    base: 120,
    stk: 8,
    flavor: "工业用铅酸电池组。外壳有裂痕，但还能测出残余电量。"
  },
  {
    id: "v_chip",
    n: "电路板",
    rar: "green",
    base: 180,
    stk: 8,
    flavor: "从报废终端里拆出的集成电路板。板载元件大多还能用——只是\"能用的那块\"已经被割走了。"
  },
  {
    id: "v_tool",
    n: "多功能工具",
    rar: "green",
    base: 150,
    stk: 4,
    flavor: "折叠式多功能工具。钳子、螺丝刀、开瓶器、小刀——野外求生必备，也是二手市场上的热货。"
  },
  {
    id: "v_lighter",
    n: "金属打火机",
    rar: "green",
    base: 110,
    stk: 4,
    flavor: "黄铜打火机，表面刻着一只猫爪——这是某位 Prazer 工匠的手艺。"
  },
  {
    id: "v_watch",
    n: "机械手表",
    rar: "blue",
    base: 320,
    stk: 2,
    flavor: "老式机械表。指针停在三点十七分——不一定是停摆，也可能只是没上弦。"
  },
  {
    id: "v_camera",
    n: "老式相机",
    rar: "blue",
    base: 400,
    stk: 2,
    flavor: "胶片时代的旁轴相机。快门还能按，取景器里有一张没拍完的卷——谁会知道里面是什么画面。"
  },
  {
    id: "v_radio",
    n: "便携电台",
    rar: "blue",
    base: 480,
    stk: 2,
    flavor: "军用短波电台。能收到几个频段——大多是杂音和一段不断重复的普勒语祷文。"
  },
  {
    id: "v_medal",
    n: "勋章",
    rar: "yellow",
    base: 880,
    stk: 1,
    flavor: "旧式的军功章。背面刻着一个名字和一个日期，日期已经不太看得清。"
  },
  {
    id: "v_necklace",
    n: "银项链",
    rar: "yellow",
    base: 750,
    stk: 1,
    flavor: "银质项链，坠子是一只猫爪，是之间流传的样式——现在很少有活着的人还戴着它。"
  },
  {
    id: "v_ring",
    n: "金戒指",
    rar: "yellow",
    base: 900,
    stk: 1,
    flavor: "素圈金戒指，内圈刻着两个普勒语单词。读起来大概是\"永远\"和\"回来\"。"
  },
  {
    id: "v_ring2",
    n: "翡翠戒指",
    rar: "orange",
    base: 1800,
    stk: 1,
    flavor: "翡翠镶金戒指，成色极好。戒圈内侧沾了一点干涸的血迹——不是新血。"
  },
  {
    id: "v_gem",
    n: "蓝宝石",
    rar: "orange",
    base: 2200,
    stk: 1,
    flavor: "未镶嵌的蓝宝石原石，约 4 克拉。光线打进去，会折射出一种很冷的蓝。"
  },
  {
    id: "v_chiprare",
    n: "加密芯片",
    rar: "orange",
    base: 2600,
    stk: 1,
    flavor: "军用级加密存储芯片。接口是旧的，但加密方式很新——里面装的东西，恐怕不是普通人能看的。"
  },
  {
    id: "v_coin",
    n: "沙城金币",
    rar: "red",
    base: 3800,
    stk: 1,
    flavor: "二里缘家族铸造的金币，正面是一只猫的侧影，背面是一棵树。曾经在整片大陆流通。"
  },
  {
    id: "v_art",
    n: "油画残片",
    rar: "red",
    base: 5000,
    stk: 1,
    flavor: "从一幅大画上割下的一角。画的是金色沙城——高塔、泉水、街道。画的边缘有明显的烧焦痕迹。"
  },
  {
    id: "v_relic",
    n: "家族遗物",
    rar: "gold",
    base: 12000,
    stk: 1,
    flavor: "一枚嵌着宝石的银牌，背后刻着一整段普勒语家训。几乎没人能完整读懂。"
  },
  {
    id: "v_idol",
    n: "兽耳神像",
    rar: "inc",
    base: 40000,
    stk: 1,
    flavor: "勒耶教神像，约 30cm 高，用整块白玉雕成。兽耳、兽尾、覆耳羽清晰可辨——是\"愿力\"的具象化表达。"
  },
  {
    id: "v_core",
    n: "Assee 核心",
    rar: "inc",
    base: 65000,
    stk: 1,
    flavor: "过强 Prazer 死后留下的 Assee 容器残骸。它已经碎了，但碎片表面仍在缓慢流动着淡蓝色的微光——P 空间与它之间的耦合，还没有完全断开。"
  }
];

ASAKA.enemyTypes = {
  grunt: {
    n: "尼珀斯尔·士兵",
    hp: 75,
    wpn: "p9",
    side: null,
    shell: "hs1",
    visor: "hv0",
    ear: "he0",
    fiber: "vf1",
    plate: "vp0",
    bp: "bp1",
    cr: "cr1",
    acc: 0.55,
    rng: 520,
    react: 0.5,
    spd: 118,
    col: "#8a5a5a",
    pen: 0,
    amt: 1
  },
  rifle: {
    n: "尼珀斯尔·步枪兵",
    hp: 100,
    wpn: "ar556",
    side: "p9",
    shell: "hs2",
    visor: "hv2",
    ear: "he2",
    fiber: "vf2",
    plate: "vp2",
    bp: "bp2",
    cr: "cr2",
    acc: 0.68,
    rng: 780,
    react: 0.4,
    spd: 120,
    col: "#9a6a4a",
    pen: 3,
    amt: 2
  },
  smg: {
    n: "尼珀斯尔·突击兵",
    hp: 85,
    wpn: "smg45",
    side: "p9",
    shell: "hs2",
    visor: "hv2",
    ear: "he2",
    fiber: "vf2",
    plate: "vp2",
    bp: "bp1",
    cr: "cr2",
    acc: 0.6,
    rng: 420,
    react: 0.32,
    spd: 158,
    col: "#a05050",
    pen: 1,
    amt: 2
  },
  sniper: {
    n: "尼珀斯尔·狙击手",
    hp: 68,
    wpn: "sr762",
    side: "p9",
    shell: "hs3",
    visor: "hv3",
    ear: "he3",
    fiber: "vf2",
    plate: "vp3",
    bp: "bp2",
    cr: "cr1",
    acc: 0.86,
    rng: 1400,
    react: 0.9,
    spd: 82,
    col: "#6a5a8a",
    pen: 6,
    amt: 3
  },
  elite: {
    n: "尼珀斯尔·精锐步兵",
    hp: 160,
    wpn: "ak762",
    side: "deagle",
    shell: "hs4",
    visor: "hv4",
    ear: "he4",
    fiber: "vf4",
    plate: "vp4",
    bp: "bp3",
    cr: "cr4",
    acc: 0.82,
    rng: 920,
    react: 0.28,
    spd: 144,
    col: "#c04a4a",
    elite: true,
    pen: 5,
    amt: 4
  },
  super: {
    n: "大陆银行·重装警卫",
    hp: 240,
    wpn: "lmg58",
    side: "deagle",
    shell: "hs5",
    visor: "hv5",
    ear: "he5",
    fiber: "vf5",
    plate: "vp5",
    bp: "bp4",
    cr: "cr5",
    acc: 0.84,
    rng: 1000,
    react: 0.22,
    spd: 150,
    col: "#c04040",
    elite: true,
    super: true,
    pen: 5,
    amt: 5
  },
  leader: {
    n: "[尼珀斯尔工业部领导]",
    hp: 460,
    wpn: "gm94",
    side: "deagle",
    shell: "hs6",
    visor: "hv6",
    ear: "he6",
    fiber: "vf6",
    plate: "vp6",
    bp: "bp5",
    cr: "cr6",
    acc: 0.88,
    rng: 1100,
    react: 0.24,
    spd: 126,
    col: "#d0a050",
    boss: true,
    pen: 3,
    amt: 6,
    bossSkills: ["shieldwall", "missiles", "overload"]
  },
  yukino_b: {
    n: "二里缘 雪乃",
    hp: 340,
    wpn: "rail",
    side: "rsh",
    shell: "hs5",
    visor: "hv5",
    ear: "he5",
    fiber: "vf5",
    plate: "vp5",
    bp: "bp6",
    cr: "cr6",
    acc: 0.9,
    rng: 1000,
    react: 0.26,
    spd: 150,
    col: "#c9a274",
    boss: true,
    prazer: true,
    pen: 3,
    amt: 6,
    bossSkills: ["money", "frostnova"]
  },
  krona_b: {
    n: "黑奈 契",
    hp: 300,
    wpn: "ak762",
    side: "r38",
    shell: "hs4",
    visor: "hv4",
    ear: "he4",
    fiber: "vf4",
    plate: "vp4",
    bp: "bp3",
    cr: "cr3",
    acc: 0.92,
    rng: 700,
    react: 0.2,
    spd: 230,
    col: "#c0d4e8",
    boss: true,
    prazer: true,
    pen: 5,
    amt: 6,
    meleeDmg: 380,
    meleeRange: 95,
    bossSkills: ["shadowstep", "howl"]
  }
};

ASAKA.aiTypes = {
  rookie: {
    hp: 95,
    acc: 0.44,
    spd: 180,
    wpn: "p9",
    side: null,
    shell: "hs1",
    visor: "hv0",
    ear: "he0",
    fiber: "vf1",
    plate: "vp0",
    bp: "bp1",
    cr: "cr1",
    aggr: 0.4,
    loot: 0.9,
    col: "#5a8a6a",
    pen: 0,
    amt: 2,
    n: "未知团体成员"
  },
  veteran: {
    hp: 120,
    acc: 0.74,
    spd: 210,
    wpn: "ar556",
    side: "smg45",
    shell: "hs3",
    visor: "hv3",
    ear: "he3",
    fiber: "vf3",
    plate: "vp3",
    bp: "bp3",
    cr: "cr3",
    aggr: 0.75,
    loot: 0.55,
    col: "#8a7a4a",
    pen: 3,
    amt: 3,
    n: "未知团体精锐成员"
  },
  elite_ai: {
    hp: 150,
    acc: 0.88,
    spd: 230,
    wpn: "ak762",
    side: "deagle",
    shell: "hs4",
    visor: "hv4",
    ear: "he4",
    fiber: "vf4",
    plate: "vp4",
    bp: "bp4",
    cr: "cr4",
    aggr: 0.92,
    loot: 0.42,
    col: "#8a4a7a",
    pen: 5,
    amt: 4,
    n: "未知团体特别成员"
  }
};

ASAKA.characters = {
  kate: {
    name: "凯特",
    prazer: true,
    A: 3,
    age: 21,
    hp: 150,
    speed: 232,
    fur: "#ff9ec4",
    fur2: "#ffe3ef",
    eye: "#ffb733",
    weapon: "sr762",
    sidearm: "p9",
    voicePitch: 1.35,
    skills: ["jump", "aimbuff"]
  },
  lingna: {
    name: "玲娜",
    prazer: true,
    A: 3,
    age: 23,
    hp: 150,
    speed: 236,
    fur: "#ffb066",
    fur2: "#fff2e0",
    eye: "#ff7fb0",
    weapon: "ar556",
    sidearm: "smg45",
    voicePitch: 1.15,
    skills: ["dash", "suppress"]
  },
  captain: {
    name: "队长",
    prazer: false,
    A: 0,
    age: 29,
    hp: 115,
    speed: 252,
    fur: "#5a6b7c",
    fur2: "#2c3540",
    eye: "#7fd0ff",
    weapon: "ar556",
    sidearm: "p9",
    voicePitch: 0.85,
    skills: ["drone", "rally"]
  },
  buwen: {
    name: "布雯·叶",
    prazer: false,
    A: 0,
    age: 20,
    hp: 230,
    speed: 106,
    fur: "#c8e05a",
    fur2: "#eef7c0",
    eye: "#5ee0a0",
    weapon: "sg12",
    sidearm: "p9",
    voicePitch: 1.05,
    skills: ["shield", "taunt"],
    heavyArmor: true
  },
  yukino: {
    name: "二里缘雪乃",
    prazer: true,
    A: 10,
    age: 27,
    hp: 190,
    speed: 240,
    fur: "#c9a274",
    fur2: "#f4e6d4",
    eye: "#3a5a8a",
    weapon: "scarl",
    sidearm: "rsh",
    voicePitch: 1.1,
    skills: ["money", "frostnova"],
    neutral: true,
    nonPlayable: true
  },
  krona: {
    name: "黑奈契",
    prazer: true,
    A: 4,
    age: 19,
    hp: 170,
    speed: 250,
    fur: "#c0d4e8",
    fur2: "#eef6ff",
    eye: "#7fd8ff",
    weapon: "ak762",
    sidearm: "r38",
    voicePitch: 1.2,
    skills: ["shadowstep", "howl"],
    neutral: true,
    nonPlayable: true
  }
};

ASAKA.initialLoadout = {
  kate: {
    main: "sr762",
    attach: [
      {
        k: "sight",
        id: "s_scope4"
      },
      {
        k: "muzzle",
        id: "m_sup"
      },
      {
        k: "grip",
        id: "h_bipod"
      },
      {
        k: "mag",
        id: "g_ext"
      }
    ],
    helmetShell: "hs3",
    helmetVisor: "hv3",
    helmetEar: "he3",
    vestFiber: "vf4",
    vestPlate: "vp4",
    backpack: "bp3",
    chestRig: "cr3",
    bag: [
      {
        id: "bandage",
        qty: 3
      },
      {
        id: "medkit",
        qty: 1
      },
      {
        id: "armorplate",
        qty: 2
      },
      {
        id: "repairkit",
        qty: 1
      }
    ],
    pocket: [
      {
        id: "bandage",
        qty: 1
      }
    ],
    safe: [
      {
        id: "surgery",
        qty: 1
      }
    ],
    chest: [
      {
        id: "frag",
        qty: 2
      },
      {
        id: "smoke",
        qty: 1
      }
    ]
  },
  lingna: {
    main: "ar556",
    attach: [
      {
        k: "sight",
        id: "s_holo"
      },
      {
        k: "muzzle",
        id: "m_comp"
      },
      {
        k: "grip",
        id: "h_ang"
      },
      {
        k: "mag",
        id: "g_ext"
      }
    ],
    helmetShell: "hs3",
    helmetVisor: "hv3",
    helmetEar: "he3",
    vestFiber: "vf4",
    vestPlate: "vp4",
    backpack: "bp3",
    chestRig: "cr3",
    bag: [
      {
        id: "bandage",
        qty: 3
      },
      {
        id: "medkit",
        qty: 1
      },
      {
        id: "armorplate",
        qty: 2
      },
      {
        id: "repairkit",
        qty: 1
      }
    ],
    pocket: [
      {
        id: "bandage",
        qty: 1
      }
    ],
    safe: [
      {
        id: "surgery",
        qty: 1
      }
    ],
    chest: [
      {
        id: "frag",
        qty: 2
      },
      {
        id: "smoke",
        qty: 1
      }
    ]
  },
  captain: {
    main: "ar556",
    attach: [
      {
        k: "sight",
        id: "s_red"
      },
      {
        k: "muzzle",
        id: "m_comp"
      },
      {
        k: "grip",
        id: "h_vert"
      }
    ],
    helmetShell: "hs3",
    helmetVisor: "hv3",
    helmetEar: "he3",
    vestFiber: "vf4",
    vestPlate: "vp4",
    backpack: "bp3",
    chestRig: "cr3",
    bag: [
      {
        id: "bandage",
        qty: 3
      },
      {
        id: "medkit",
        qty: 1
      },
      {
        id: "armorplate",
        qty: 2
      },
      {
        id: "repairkit",
        qty: 1
      }
    ],
    pocket: [
      {
        id: "bandage",
        qty: 1
      }
    ],
    safe: [
      {
        id: "surgery",
        qty: 1
      }
    ],
    chest: [
      {
        id: "frag",
        qty: 2
      },
      {
        id: "smoke",
        qty: 1
      }
    ]
  },
  buwen: {
    main: "sg12",
    attach: [
      {
        k: "sight",
        id: "s_red"
      },
      {
        k: "muzzle",
        id: "m_brk"
      },
      {
        k: "grip",
        id: "h_vert"
      },
      {
        k: "mag",
        id: "g_ext"
      }
    ],
    helmetShell: "hs4",
    helmetVisor: "hv4",
    helmetEar: "he4",
    vestFiber: "vf5",
    vestPlate: "vp5",
    backpack: "bp4",
    chestRig: "cr4",
    bag: [
      {
        id: "bandage",
        qty: 3
      },
      {
        id: "medkit",
        qty: 1
      },
      {
        id: "armorplate",
        qty: 2
      },
      {
        id: "repairkit",
        qty: 1
      }
    ],
    pocket: [
      {
        id: "bandage",
        qty: 1
      }
    ],
    safe: [
      {
        id: "surgery",
        qty: 1
      }
    ],
    chest: [
      {
        id: "frag",
        qty: 2
      },
      {
        id: "smoke",
        qty: 1
      }
    ]
  }
};

ASAKA.maps = {
  factory: {
    seed: "ASAKA_FACTORY_V1",
    boss: "leader",
    desc: "西北工业区的一座旧化工厂。尼珀斯尔军工复合体在这里生产弹药和轻武器。",
    story: "【Asaka 大陆 · 西北工业区】\n\n锈迹斑斑的钢门被风推得吱呀作响。厂房之间横着一道道灰色的蒸汽管道，远处有一座还在冒烟的烟囱。\n\n「进去以后别乱碰东西。」队长把弹匣扣紧，指尖蹭过枪身，「尼珀斯尔在这地方留了不止一层守卫。」\n\n沿着围墙向前，能看到几处被烧过的痕迹——上一次有人闯进来，是在三个月前。\n\n远处传来一阵金属摩擦的响动。",
    label: "NF-17C"
  },
  desert: {
    seed: "ASAKA_DESERT_V1",
    label: "陲延镇",
    boss: "krona_b",
    desc: "大陆南缘的荒漠小镇。沙尘暴周期性来袭，黑奈家族残部就在这一带活动。",
    story: "【Asaka 大陆 · 南缘荒漠】\n\n沙暴的余波还未散尽，天际一片朦胧。干涸的河床上堆着几具被风沙掩埋了一半的骨架，看不出是人还是牲口。\n\n「这种鬼地方……」布雯喘着粗气，装甲里传出沉闷的摩擦声。\n\n「安静点。」玲娜举起手，「沙子会把声音带得很远。」\n\n远处的废墟里，似乎有什么东西动了一下。"
  },
  lab: {
    seed: "ASAKA_LAB_V1",
    boss: "yukino_b",
    desc: "大陆银行名义下的一处地下研究设施。电梯直达 B1，但没人知道下面还有几层。",
    story: "【大陆银行 · 地下研究设施 B1 层】\n\n电梯门缓缓打开。走廊里的灯只亮了一半，另一半在无声地闪。\n\n「这里太安静了。」玲娜低声说，「连通风扇都不转。」\n\n「有东西还在这里。」布雯的声音从装甲后面闷闷地传出来，「我听到了……像是有人在数数。」\n\n队长没有回头：「合同上写的是『回收样本』。其他的，不需要知道。」",
    label: "大陆银行·地下区域B1"
  }
};

ASAKA.tasks = {
  default: [
    {
      id: "kill",
      text: "击杀 {N} 名敌人",
      target: 8
    },
    {
      id: "loot",
      text: "搜刮 {N} 个容器",
      target: 6
    },
    {
      id: "survive",
      text: "存活 {N} 秒",
      target: 180
    },
    {
      id: "boss",
      text: "击败区域 BOSS",
      target: 1
    },
    {
      id: "extract",
      text: "安全撤离",
      target: 1
    }
  ],
  story: {
    factory: {
      chapter: 1,
      code: "C1",
      title: "第一章 · 锈蚀回响",
      location: "尼珀斯尔工厂",
      intro: "尼珀斯尔军工复合体在西北工业区生产弹药与轻武器。大陆银行需要一份内部账本，而你，需要活着拿到它。",
      missions: [
        {
          id: "c1_infiltrate",
          name: "潜入工厂",
          desc: "进入工厂核心区，击杀 6 名尼珀斯尔守卫",
          type: "kill",
          target: 6,
          reward: 800,
          rewardText: "信用点 x800"
        },
        {
          id: "c1_intel",
          name: "回收情报",
          desc: "搜刮 4 个容器，寻找加密账本残页",
          type: "loot",
          target: 4,
          reward: 1200,
          rewardText: "加密数据芯片 x1"
        },
        {
          id: "c1_boss",
          name: "执行领导",
          desc: "找到并击败尼珀斯尔领导，夺取外骨骼控制权",
          type: "boss",
          target: 1,
          reward: 3000,
          rewardText: "外骨骼残骸 + 信用点 x3000"
        },
        {
          id: "c1_exfil",
          name: "安全撤离",
          desc: "带出所有战利品，从任意撤离点撤离",
          type: "extract",
          target: 1,
          reward: 500,
          rewardText: "额外信用点 x500"
        }
      ],
      bonus: [
        {
          id: "c1_bonus_noAlarm",
          name: "无声渗透",
          desc: "不在工厂主控区触发警报",
          reward: 1500
        },
        {
          id: "c1_bonus_fullLoot",
          name: "满载而归",
          desc: "带出价值超过 5000 信用点的物品",
          reward: 2000
        }
      ]
    },
    desert: {
      chapter: 2,
      code: "C2",
      title: "第二章 · 沙之挽歌",
      location: "边陲小镇",
      intro: "黑奈契——黑奈家族的最后种子。她在南缘荒漠中游荡，为家族复仇。大陆银行对她的存在感到不安。",
      missions: [
        {
          id: "c2_hunt",
          name: "追踪黑奈",
          desc: "击杀 5 名黑奈残部，追踪黑奈契的踪迹",
          type: "kill",
          target: 5,
          reward: 1000,
          rewardText: "信用点 x1000"
        },
        {
          id: "c2_artifacts",
          name: "家族遗物",
          desc: "在黑奈家族旧址搜刮 5 个容器",
          type: "loot",
          target: 5,
          reward: 1800,
          rewardText: "家族遗物 x1"
        },
        {
          id: "c2_boss",
          name: "终结复仇",
          desc: "击败黑奈契，回收虚妄素样本",
          type: "boss",
          target: 1,
          reward: 5000,
          rewardText: "虚妄素样本 + 信用点 x5000"
        },
        {
          id: "c2_exfil",
          name: "穿越沙暴",
          desc: "在沙尘暴结束前从南侧撤离点撤离",
          type: "extract",
          target: 1,
          reward: 800,
          rewardText: "额外信用点 x800"
        }
      ],
      bonus: [
        {
          id: "c2_bonus_noStorm",
          name: "风暴中的舞者",
          desc: "在沙尘暴期间完成击杀",
          reward: 1500
        },
        {
          id: "c2_bonus_sniper",
          name: "远距终结",
          desc: "用狙击枪击杀黑奈契",
          reward: 2500
        }
      ]
    },
    lab: {
      chapter: 3,
      code: "C3",
      title: "第三章 · 深渊层",
      location: "大陆银行·地下研究所",
      intro: "电梯直达 B1，但没人知道下面还有几层。二里缘雪乃守着大陆银行的核心秘密——Assee 容器的量产工艺。",
      missions: [
        {
          id: "c3_breach",
          name: "突破防线",
          desc: "清除研究所内 8 名警卫",
          type: "kill",
          target: 8,
          reward: 1500,
          rewardText: "信用点 x1500"
        },
        {
          id: "c3_research",
          name: "研究资料",
          desc: "搜刮 6 个容器，回收研究资料",
          type: "loot",
          target: 6,
          reward: 2500,
          rewardText: "研究资料 x1"
        },
        {
          id: "c3_boss",
          name: "面对雪乃",
          desc: "击败二里缘雪乃，夺取 RAIL-9 原型机",
          type: "boss",
          target: 1,
          reward: 8000,
          rewardText: "RAIL-9 原型机 + 信用点 x8000"
        },
        {
          id: "c3_exfil",
          name: "出口",
          desc: "乘主电梯撤离",
          type: "extract",
          target: 1,
          reward: 1000,
          rewardText: "额外信用点 x1000"
        }
      ],
      bonus: [
        {
          id: "c3_bonus_stealth",
          name: "幽灵行动",
          desc: "不被研究所自动防御系统锁定",
          reward: 2500
        },
        {
          id: "c3_bonus_sample",
          name: "样本收集者",
          desc: "在撤离前将 Assee 样本放入安全箱",
          reward: 4000
        }
      ]
    }
  },
  challenges: [
    {
      id: "ch_pistol_only",
      name: "手枪艺术家",
      desc: "仅使用手枪击杀 5 名敌人",
      reward: 2000,
      rewardText: "信用点 x2000"
    },
    {
      id: "ch_no_heal",
      name: "铁人",
      desc: "不使用任何医疗物品完成撤离",
      reward: 3500,
      rewardText: "信用点 x3500"
    },
    {
      id: "ch_speed",
      name: "疾风",
      desc: "在 240 秒内完成撤离",
      reward: 2500,
      rewardText: "信用点 x2500"
    },
    {
      id: "ch_headshot",
      name: "一枪毙命",
      desc: "爆头击杀 3 名敌人",
      reward: 1500,
      rewardText: "信用点 x1500"
    },
    {
      id: "ch_lone",
      name: "孤狼",
      desc: "单人模式完成撤离",
      reward: 1000,
      rewardText: "信用点 x1000"
    },
    {
      id: "ch_boss_rush",
      name: "雷霆一击",
      desc: "在 120 秒内击败区域 BOSS",
      reward: 4000,
      rewardText: "信用点 x4000"
    }
  ],
  daily: [
    {
      id: "d_kill",
      text: "击杀 {N} 名敌人",
      target: 15,
      reward: 600
    },
    {
      id: "d_loot",
      text: "搜刮 {N} 个容器",
      target: 10,
      reward: 800
    },
    {
      id: "d_extract",
      text: "成功撤离 {N} 次",
      target: 3,
      reward: 1000
    },
    {
      id: "d_headshot",
      text: "爆头击杀 {N} 名敌人",
      target: 5,
      reward: 1200
    },
    {
      id: "d_boss",
      text: "击败 {N} 个区域 BOSS",
      target: 2,
      reward: 2000
    }
  ]
};

ASAKA.chatLines = {
  kate: [
    "队长，这边我盯着呢。",
    "唔……这种破地方的味道好难闻。",
    "前面好像有人。别乱动。",
    "嗯，找到了。……哼，才不是夸你。",
    "别离我太远，我耳朵再好用也救不了作死的。",
    "弹药还剩多少？我这儿不太多了。",
    "……你刚才是不是在偷看我？"
  ],
  lingna: [
    "保持队形。",
    "前面那个掩体位置不错，我来架。",
    "你走前面，我掩护。",
    "有动静。大概二十米外，右边。",
    "……按你说的办。",
    "注意补给。这一带应该有物资点。",
    "不要恋战。任务第一。"
  ],
  captain: [
    "推进。",
    "注意警戒。",
    "按计划走，别乱。",
    "还有几个目标，别漏了。",
    "别贪，撤得及时才是好汉。",
    "保持距离，别散开。",
    "听着——我不想把谁留在这。"
  ],
  buwen: [
    "我的装甲很硬！",
    "冲——呃，等等我。",
    "我走得慢，别落下我啊。",
    "有人要掩护吗？我挡前面。",
    "呼……我喘口气。",
    "这些子弹打不动我！",
    "别把我当摆设啊！"
  ]
};

ASAKA.killStreakTiers = [
  {
    n: 3,
    txt: "三 杀"
  },
  {
    n: 5,
    txt: "五 杀 · 无 双"
  },
  {
    n: 8,
    txt: "八 杀 · 屠 戮"
  },
  {
    n: 12,
    txt: "十 二 杀 · 传 说"
  }
];

ASAKA.events = [
  {
    id: "supply",
    name: "物资空投",
    dur: 20,
    text: "电台：检测到物资空投！位置已标记。",
    onStart: {
      kind: "spawnContainers",
      p: {
        count: 3,
        radiusMin: 300,
        radiusMax: 600,
        tier: "red"
      }
    }
  },
  {
    id: "praze",
    name: "P 空间波动",
    dur: 15,
    text: "电台：警告！发生P 空间异常波动事件，预计持续约15秒。",
    onStart: {
      kind: "prazeWave",
      p: {
        radius: 900,
        confuse: 5
      }
    },
    onTick: {
      kind: "prazeCoupling",
      p: {
        rate: 15
      }
    }
  },
  {
    id: "sandstorm",
    dur: 25,
    visionMul: 0.55,
    text: "电台：扬沙天气，能见度可能降低，请加强戒备。",
    name: "扬沙"
  }
];

ASAKA.difficulty = {
  easy: {
    enemyDmg: 0.65,
    enemyAcc: 0.62,
    enemyHp: 0.75,
    enemyAgg: 0.6,
    eliteCount: 0,
    superCount: 0,
    aiCount: 1,
    lootBonus: 0,
    lootCount: 26,
    enemyCount: 10,
    label: "安全状态"
  },
  normal: {
    enemyDmg: 1,
    enemyAcc: 0.82,
    enemyHp: 1,
    enemyAgg: 1,
    eliteCount: 1,
    superCount: 0,
    aiCount: 2,
    lootBonus: 0.08,
    lootCount: 30,
    enemyCount: 14,
    label: "常规状态"
  },
  hard: {
    enemyDmg: 1.4,
    enemyAcc: 0.95,
    enemyHp: 1.3,
    enemyAgg: 1.3,
    eliteCount: 2,
    superCount: 0,
    aiCount: 2,
    lootBonus: 0.22,
    lootCount: 32,
    enemyCount: 16,
    label: "戒备状态"
  },
  nightmare: {
    enemyDmg: 1.8,
    enemyAcc: 1.05,
    enemyHp: 1.55,
    enemyAgg: 1.65,
    eliteCount: 3,
    superCount: 1,
    aiCount: 2,
    lootBonus: 0.4,
    lootCount: 34,
    enemyCount: 18,
    label: "紧急状态"
  }
};

ASAKA.killDrops = {
  chance: 0.6,
  always: [
    {
      kind: "ammo",
      fromWeapon: true,
      min: 15,
      max: 40
    }
  ],
  table: [
    {
      roll: [0, 0.22],
      item: {
        kind: "cons",
        id: "bandage",
        min: 1,
        max: 3
      }
    },
    {
      roll: [0.22, 0.4],
      item: {
        kind: "cons",
        id: "armorplate",
        min: 1,
        max: 1
      }
    },
    {
      roll: [0.4, 0.55],
      item: {
        kind: "cons",
        id: "medkit",
        min: 1,
        max: 1
      }
    },
    {
      roll: [0.55, 0.7],
      item: {
        kind: "valuable",
        pool: ["v_scrap", "v_wire", "v_paper", "v_can", "v_chip", "v_battery"]
      }
    }
  ],
  bossAlways: [
    {
      kind: "cons",
      id: "nanomed",
      min: 1,
      max: 1
    }
  ]
};

ASAKA.rarity = [
  {
    key: "common",
    col: "rgba(235,242,250,.7)",
    name: "C-1"
  },
  {
    key: "green",
    col: "#5fd47a",
    name: "C-2"
  },
  {
    key: "blue",
    col: "#4aa8ff",
    name: "C-3"
  },
  {
    key: "yellow",
    col: "#ffd93d",
    name: "C-4"
  },
  {
    key: "orange",
    col: "#ff9a3c",
    name: "C-5"
  },
  {
    key: "red",
    col: "#ff5252",
    name: "C-6"
  },
  {
    key: "bronze",
    col: "#cd7f32",
    name: "FANTASTIC"
  },
  {
    key: "silver",
    col: "#cfd8e3",
    name: "AWESOME"
  },
  {
    key: "gold",
    col: "#ffcc33",
    name: "TERRIFIC"
  },
  {
    key: "inc",
    name: "INCREDIBLE",
    col: "#eaf6ff"
  }
];

ASAKA.valueTable = {
  common: 80,
  green: 200,
  blue: 500,
  yellow: 1200,
  orange: 2800,
  red: 6000,
  bronze: 4000,
  silver: 9000,
  gold: 20000,
  inc: 50000
};

ASAKA.scripts = {
  onItemValue: function(it, baseValue){ return baseValue; },
  onTick: function(G, dt){},
  onHitZones: function(zones){ return zones; },
  onArmorAbsorb: function(ctx){ return ctx; },
  onCouplingAbsorb: function(ctx){ return ctx; },
  onExplosionDamage: function(ctx){ return ctx; },
  onFireTick: function(ctx){ return ctx; },
  onPlayerDowned: function(G, player){},
  onEnemyDefeated: function(G, enemy, fromPlayer){},
  onTaskProgress: function(G, taskId, amount){ return amount; },
  onWeaponFire: function(G, weapon, isPlayer){},
  onItemGenerate: function(item, tier){ return item; },
  onLootGenerate: function(loot, tier, isCorpse, enemy){ return loot; },
  onDifficultyModify: function(DI, difficultyKey){ return DI; },
  onDamageNumber: function(dmg, isPlayer, part){ return dmg; },
  onEnemyTick: function(enemy, dt){},
  onAITick: function(ai, dt){},
  onPlayerDamage: function(G, dmg, owner, part){ return dmg; },
  onSkillUse: function(G, player, skill, idx){ return true; },
  onReloadStart: function(G, player, weapon){ return true; },
  onNadeExplode: function(G, nade){ return true; },
  onHUDUpdate: function(G){},
  onGameEnd: function(G, success){},
  onTrainSettings: function(G, settings){ return settings; },
  onPlayerHit: function(ctx){ return ctx; },
  onAIDecide: function(ai, player){ return null; },
  onSkillExecute: function(G, owner, skillDef, detail){ return detail; },
  onBulletHit: function(G, bullet, hx, hy, effect){ return true; },
  onEventStart: function(G, eventDef){ return true; },
  onKillDropGenerate: function(G, enemy, item){ return item; }
};

console.log('[ASAKA] data.js 已加载');
