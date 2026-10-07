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
  _charMap: {
    kate: '../image/Kate_wm.png',
    lingna: '../image/Lingna_wm.png',
    captain: null,
    buwen: '../image/BuwenYe_wm.png'
  },
  _bossMap: {
    yukino_b: '../image/NirienYukino_wm.png',
    krona_b: '../image/KronaChi_wm.png'
  },
  characterPortrait: function(id){
    const map = ASAKA.assets._charMap || {};
    if (Object.prototype.hasOwnProperty.call(map, id)) return map[id];
    return 'ch_' + String(id) + '.png';
  },
  enemyPortrait: function(id){
    return 'enemy_' + String(id) + '.png';
  },
  bossPortrait: function(id){
    const map = ASAKA.assets._bossMap || {};
    if (Object.prototype.hasOwnProperty.call(map, id)) return map[id];
    return 'boss_' + String(id) + '.png';
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
    flavor: "短后坐枪管摆动式半自动手枪，闭膛待击。9×19mm 帕拉贝鲁姆，双排 15 发弹匣。大陆上几乎所有警队和后勤兵的标准配枪——便宜、皮实。"
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
    flavor: "单双动混合击发的六发转轮。.38 特种弹，弹巢靠抛壳杆一发一发退出。没有弹匣、没有保险，唯一的优点是不会卡壳。"
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
    flavor: "导气式旋转闭锁半自动手枪，.50 AE 大口径。枪重近两公斤，握在手里像一块砖。后坐力极其夸张，射速完全取决于射手的腕力。"
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
    flavor: "9×19mm 帕拉贝鲁姆，全金属被甲圆头弹。"
  },
  ".38": {
    cal: ".38",
    n: ".38 特种弹",
    pen: 1,
    eMul: 1,
    rar: "common",
    tier: 0,
    flavor: ".38 Special，转轮时代的经典弹种。"
  },
  ".50AE": {
    cal: ".50AE",
    n: ".50AE 弹",
    pen: 3,
    eMul: 1,
    rar: "blue",
    tier: 2,
    flavor: ".50 Action Express，为沙漠之鹰系列设计的大口径手枪弹。"
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
      flavor: "膨胀腔式消音器。"
    }
  ],
  sight: [
    {
      id: "s_red",
      n: "红点瞄准镜",
      rar: "green",
      d: {
        spr: -0.16
      },
      flavor: "单点反射式红点瞄准镜。"
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
      flavor: "在标准弹匣基础上加长 50%。"
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
      flavor: "最基础的握把。"
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
    flavor: "标准的医用纱布卷。"
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
    flavor: "9 孔式爆震闪光弹。"
  }
];

ASAKA.valuables = [
  {
    id: "v_scrap",
    n: "废铁",
    rar: "common",
    base: 25,
    stk: 20,
    flavor: "从建筑废墟里拆下来的铁皮。"
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
  }
};

ASAKA.initialLoadout = {
  kate: {
    main: "sr762",
    attach: [
      {
        k: "sight",
        id: "s_red"
      },
      {
        k: "muzzle",
        id: "m_sup"
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
    helmetShell: "hs0",
    helmetVisor: "hv0",
    helmetEar: "he0",
    vestFiber: "vf0",
    vestPlate: "vp0",
    backpack: "bp0",
    chestRig: "cr0",
    bag: [],
    pocket: [],
    safe: [],
    chest: []
  }
};

ASAKA.maps = {
  factory: {
    seed: "ASAKA_FACTORY_V1",
    boss: "leader",
    desc: "西北工业区的一座旧化工厂。",
    label: "NF-17C"
  }
};

ASAKA.tasks = {
  default: [
    {
      id: "kill",
      text: "击杀 {N} 名敌人",
      target: 8
    }
  ]
};

ASAKA.chatLines = {
  kate: [
    "队长，这边我盯着呢。"
  ]
};

ASAKA.killStreakTiers = [
  {
    n: 3,
    txt: "三 杀"
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
  table: [],
  bossAlways: []
};

ASAKA.rarity = [
  {
    key: "common",
    col: "rgba(235,242,250,.7)",
    name: "C-1"
  }
];

ASAKA.valueTable = {
  common: 80
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
