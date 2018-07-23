'use strict';
var   portrait={

    culturalLeve: 20,

    chart_id:1,
    CID_MODEL:1,//手机型号
    CPL_DVM_BRAD:2,//品牌类型
    CPL_DVM_HF:3,//硬件特性
    CPL_DVM_ISP:4,//运营商
    CPL_DVM_OS:5,//操作系统
    CPL_DVM_PUPR:6,//设备价值
    CPL_DVM_RESO:7,//分辨率
    CPL_DVM_SCSIZE:8,//屏幕尺寸
    CPL_DVM_TIME:9,//手机上市时间
    CPL_DVM_TYPE:10,//设备分类
    FIM_FISM_CONL_CIR_MONTH:214,//月消费能力预测
    FIM_FISM_CONL_CIR_YEAR:215,//年消费能力预测
    FIM_FISM_INCL_MONTH:216,//月收入能力预测
    FIM_FISM_INCL_YEAR:217,//年收入能力预测
    WORK_ADDR_COOR:218,//工作地址(名称-坐标)
    HOME_ADDR_COOR:219,//常住地址(名称-坐标)
    TRIP_TYPE:220,//通勤方式预测
    TRIP_DISTANCE:221,//通勤距离
    LBS_BAIDU_POI:222,//日常活动场所
    CPL_HHM_CHILD_HC:11,//是否有子女预测
    CPL_HHM_CHILD_CHLI:12,//子女阶段
    CPL_INDM_GEND_S:13,//行为性别预测
    CPL_INDM_MARR_S:14,//婚姻状态预测(置信度)
    CPL_INDM_MARR:15,//婚姻状态预测
    CPL_INDM_MARRC2:16,//婚姻状态
    CPL_INDM_LIFE:17,//人生阶段
    CPL_INDM_NATI:18,//国籍预测
    CPL_INDM_CUVA:19,//客户价值
    CPL_INDM_EDU:20,//文化水平
    CPL_INDM_AGE_C5:21,//行为年龄预测(置信度)
    CPL_INDM_VEIC_VEID:22,//有无车标识预测
    FIM_FISM_CONL_CIR:23,//消费能力水平预测(置信度)
    FIM_FISM_INCL:24,//收入能力水平预测(置信度)
    GBM_BHM_APPP_APPR_S:25,//应用使用偏好预测(偏好度)
    GBM_BHM_PURB_CONP:26,//消费偏好预测
    GBM_BHM_PURB_PREF:27,//消费品级预测(偏好度)
    GBM_BHM_PURB_PURW:28,//购买方式预测(偏好度)
    GBM_BHM_PURB_SUPR:29,//上网目的预测
    GBM_BHM_REAB_REAP:30,//阅读偏好预测
    GBM_HBM_S:31,//兴趣爱好预测(偏好度)
    SOM_OCM_CAREER:32,//职业类型预测
    FIM_PRM_FINP_FTP:33,//金融产品偏好
    TOP_APP_LIST:34,//APP前十名
    SHOPPING_APPS:35,//购物平台类APP前十名
    GBM_BHM_TOUB_TOPR:36,//旅游类应用偏好
    GBM_BHM_TOUB_TOQP:37,//旅游品质偏好
    GBM_BHM_TOUB_TOTA:38,//旅游目标偏好
    APP_HOBY_BUS:39,//公交
    APP_HOBY_TICKET:40,//票务
    APP_HOBY_TRAIN:41,//火车高铁
    APP_HOBY_FLIGHT:42,//飞机
    APP_HOBY_TAXI:43,//打车
    APP_HOBY_SPECIAL_DRIVE:44,//专车
    APP_HOBY_HIGH_BUS:45,//大巴
    APP_HOBY_OTHER_DRIVE:46,//代驾
    APP_HOBY_RENT_CAR:47,//租车
    APP_HOBY_STARS_HOTEL:48,//星级酒店
    APP_HOBY_YOUNG_HOTEL:49,//青年旅馆
    APP_HOBY_HOME_HOTEL:50,//民宿
    APP_HOBY_CONVERT_HOTEL:51,//快捷酒店
    APP_HOBY_WECHAT:52,//支付行为-微信支付
    APP_HOBY_BANK_UNIN:53,//银联支付
    APP_HOBY_ALIPAY:54,//支付行为-支付宝
    APP_HOBY_THIRD_PAY:55,//其他三方支付
    APP_HOBY_INTERNET_BANK:56,//网络银行
    APP_HOBY_FOREIGN_BANK:57,//外资银行
    APP_HOBY_MIDDLE_BANK:58,//股份制银行
    APP_HOBY_CREDIT_CARD:59,//信用卡
    APP_HOBY_CITY_BANK:60,//城市银行
    APP_HOBY_STATE_BANK:61,//国有银行
    APP_HOBY_FUTURES:62,//期货
    APP_HOBY_VIRTUAL_CURRENCY:63,//虚拟货币
    APP_HOBY_FOREX:64,//外汇
    APP_HOBY_NOBLE_METAL:65,//贵金属
    APP_HOBY_FUND:66,//基金
    APP_HOBY_COLLECTION:67,//收藏品
    APP_HOBY_STOCK:68,//股票
    APP_HOBY_ZONGHELICAI:69,//综合理财
    APP_HOBY_CAR_LOAN:70,//车贷
    APP_HOBY_DIVIDE_LOAN:71,//分期贷
    APP_HOBY_STUDENT_LOAN:72,//学生贷
    APP_HOBY_CREDIT_CARD_LOAN:73,//信用卡贷
    APP_HOBY_CASH_LOAN:74,//现金贷
    APP_HOBY_HOUSE_LOAN:75,//房贷
    APP_HOBY_P2P:76,//P2P
    APP_HOBY_LOAN_PLATFORM:77,//综合贷款平台
    APP_HOBY_SPORT_LOTTERY:78,//体彩
    APP_HOBY_WELFARE_LOTTERY:79,//福利彩票
    APP_HOBY_DOUBLE_BALL:80,//双色球
    APP_HOBY_LOTTERY:81,//综合彩票平台
    APP_HOBY_FOOTBALL_LOTTERY:82,//足彩
    APP_HOBY_MARK_SIX:83,//六合彩
    APP_HOBY_SUMMARY_LIVE:84,//综合直播
    APP_HOBY_SHORT_VIDEO:85,//短视频DIY
    APP_HOBY_SOCIAL_LIVE:86,//社交直播
    APP_HOBY_TRAVEL_LIVE:87,//旅游直播
    APP_HOBY_SUMMARY_VIDEO:88,//综合视频
    APP_HOBY_SPORTS_VIDEO:89,//体育视频
    APP_HOBY_GAME_LIVE:90,//游戏直播
    APP_HOBY_BEAUTY_LIVE:91,//美妆直播
    APP_HOBY_COS_LIVE:92,//cos直播
    APP_HOBY_SELF_PHOTO:93,//自拍美颜
    APP_HOBY_TV_LIVE:94,//电视直播
    APP_HOBY_CULTURE_LIVE:95,//文化直播
    APP_HOBY_SHOW_LIVE:96,//秀场直播
    APP_HOBY_EDU_LIVE:97,//教育直播
    APP_HOBY_SPORTS_LIVE:98,//体育直播
    APP_HOBY_STARS_LIVE:99,//明星直播
    APP_HOBY_READ_LISTEN:100,//有声小说
    APP_HOBY_SUNMMARY_NEWS:101,//综合新闻
    APP_HOBY_WOMEN_HEL_BOOK:102,//女性健康知识
    APP_HOBY_ARMY_NEWS:103,//政治军事
    APP_HOBY_CARTON_BOOK:104,//漫画绘本
    APP_HOBY_PHY_NEWS:105,//体育新闻
    APP_HOBY_FAMOUSE_BOOK:106,//文学历史
    APP_HOBY_FINCAL_NEWS:107,//财经新闻
    APP_HOBY_FINCAL_BOOK:108,//金融知识
    APP_HOBY_FUN_NEWS:109,//娱乐资讯
    APP_HOBY_EDU_MED:110,//医学教育
    APP_HOBY_KONGFU:111,//仙侠小说
    APP_HOBY_TECH_NEWS:112,//科技新闻
    APP_HOBY_LOOK_FOR_MED:113,//寻医问药
    APP_HOBY_ENCOURAGE_BOOK:114,//励志鸡汤
    APP_HOBY_CAR_INFO_NEWS:115,//汽车资讯
    APP_HOBY_HUMERIOUS:116,//幽默笑话
    APP_HOBY_CARDS_GAME:117,//麻将棋牌
    APP_HOBY_SPEED_GAME:118,//动作竞速
    APP_HOBY_ROLE_GAME:119,//角色扮演
    APP_HOBY_NET_GAME:120,//网络游戏
    APP_HOBY_RELAX_GAME:121,//休闲益智
    APP_HOBY_KONGFU_GAME:122,//武侠金庸
    APP_HOBY_GAME_VIDEO:123,//游戏视频
    APP_HOBY_TALE_GAME:124,//神话修真
    APP_HOBY_DIAMONDS_GAME:125,//宝石消除
    APP_HOBY_TRAGEDY_GAME:126,//经营策略
    APP_HOBY_OUTDOOR:127,//户外运动
    APP_HOBY_MOVIE:128,//电影
    APP_HOBY_CARTON:129,//动漫动画
    APP_HOBY_BEAUTIFUL:130,//美容美妆
    APP_HOBY_LOSE_WEIGHT:131,//健身减肥
    APP_HOBY_PHY_BOOK:132,//体育运动
    APP_HOBY_FRESH_SHOPPING:133,//生鲜配送
    APP_HOBY_WIFI:134,//蹭网达人
    APP_HOBY_CAR_PRO:135,//汽车养护
    APP_HOBY_LIFE_PAY:136,//生活缴费
    APP_HOBY_PET_MARKET:137,//宠物周边
    APP_HOBY_OUT_FOOD:138,//外卖
    APP_HOBY_FOOD:139,//美食
    APP_HOBY_PALM_MARKET:140,//掌上超市
    APP_HOBY_WOMEN_HEAL:141,//女性健康
    APP_HOBY_RECORD:142,//便签记事
    APP_HOBY_CONCEIVE:143,//孕育指导
    APP_HOBY_SHARE:144,//共享出行
    APP_HOBY_COOK_BOOK:145,//食谱菜谱
    APP_HOBY_BUY_RENT_HOUSE:146,//买房租房
    APP_HOBY_CHINESE_MEDICINE:147,//中医养生
    APP_HOBY_JOB:148,//工作招聘
    APP_HOBY_HOME_SERVICE:149,//家政服务
    APP_HOBY_KRAYOK:150,//K歌
    APP_HOBY_FAST_SEND:151,//快递邮政
    APP_HOBY_PEOPLE_RESOUSE:152,//人脉社交
    APP_HOBY_MAMA_SOCIAL:153,//妈妈社区
    APP_HOBY_GAY_SOCIAL:154,//同志社交
    APP_HOBY_HOT_SOCIAL:155,//熟人社交
    APP_HOBY_MARRY_SOCIAL:156,//婚恋交友
    APP_HOBY_CAMPUS_SOCIAL:157,//校园社交
    APP_HOBY_LOVERS_SOCIAL:158,//情侣社交
    APP_HOBY_ECY:159,//二次元
    APP_HOBY_STRANGER_SOCIAL:160,//陌生人社交
    APP_HOBY_ANONYMOUS_SOCIAL:161,//匿名社交
    APP_HOBY_CITY_SOCIAL:162,//同城交友
    APP_HOBY_FANS:163,//追星一族
    APP_HOBY_FIN:164,//金融教育
    APP_HOBY_MIDDLE:165,//中学教育
    APP_HOBY_IT:166,//IT教育
    APP_HOBY_PRIMARY:167,//小学教育
    APP_HOBY_BABY:168,//胎儿教育
    APP_HOBY_ONLINE_STUDY:169,//在线教育
    APP_HOBY_FOREIGN:170,//外语学习
    APP_HOBY_DRIVE:171,//驾考学习
    APP_HOBY_SERVANTS:172,//公务员考试
    APP_HOBY_CHILD_EDU:173,//儿童教育
    APP_HOBY_UNIVERSITY:174,//大学教育
    APP_HOBY_CAR_SHOPPING:175,//汽车专卖
    APP_HOBY_SECONDHAND_SHOPPING:176,//二手闲置
    APP_HOBY_ZONGHE_SHOPPING:177,//综合购物
    APP_HOBY_PAYBACK:178,//优惠
    APP_HOBY_DISCOUNT_MARKET:179,//品牌折扣
    APP_HOBY_BABY_SHOPPING:180,//母婴专卖
    APP_HOBY_WOMEN_SHOPPING:181,//女性购物
    APP_HOBY_REBATE_SHOPPING:182,//返利
    APP_HOBY_GROUP_BUY:183,//团购
    APP_HOBY_GLOBAL_SHOPPING:184,//海淘
    APP_HOBY_SHOPPING_GUIDE:185,//导购资讯
    APP_HOBY_SEX_SHOPPING:186,//情趣专卖
    APP_HOBY_SMOTE_OFFICE:187,//移动办公
    WORK_ADDR:188,//工作时段活动区域
    HOME_ADDR:189,//休息时段活动区域
    CPL_AGE_LEVEL:190,//行为年龄水平预测
    CPL_SEX_LEVEL:191,//行为性别水平预测
    CPL_DEVICE_LEVEL:192,//设备价值水平指数
    CPL_CPS_LEVEL:193,//客户触达稳定指数
    SOM_RNI_RSI:194,//风险人群关联指数
    FIM_NF_BCI2:195,//互金业务关注指数2
    FIM_NF_BCI3:196,//互金业务关注指数3
    FIM_NF_BPI:197,//互金业务偏好指数
    FIM_NF_BFI:198,//互金业务频度指数
    FIM_NF_BSI:199,//互金业务强度指数
    FIM_CC_BSI1:200,//信用消费规模指数1
    FIM_CC_BSI2:201,//信用消费规模指数2
    FIM_CC_BSI3:202,//信用消费规模指数3
    FIM_CC_BFI:203,//信用消费频度指数
    FIM_Pay_BPI:204,//支付行为偏好指数
    FIM_Pay_BFI:205,//支付行为频度指数
    GBM_TM_BSI:206,//出行方式规模指数
    GBM_LH_BFI:207,//民生行为频度指数
    GBM_SBH_HSI:208,//特定行为规模指数
    GBM_CBH_HSI:209,//一般行为规模指数
    SCORE:210,//总得分
    FIM_RIS_OVS:211,//逾期分
    FIM_RIS_VDS:212,//违约分
    FIM_RIS_CRS:213,//关系圈风险分

};
var audienceSource={
    community:2,
    chart_id:3,
    Prov_id:4,
    City_id:5,
    overseas_id:6,
};
var chart_id={
    basicPortrait:1, //基础画像
    communityRanking:2, //小区排名
    heatMap:3, //热力图
    customeProvince:4, //顾客来源 省
    customeCity:5, //顾客来源 市
    customeOverseas:6, //顾客来源 海外

};
var izone = {
    backgroundColor: '#fff',
    color: ["#91c7ae","#61a0a8","#7872f8","#67c9fa","#67c9fa", "#22b7d7", "#58c0a1", "#96e8d7", "#89cd91",],
    legend: {
        color: '#ccc',
        fontSize: 11
    },
    textStyle: '#FFFFFF',
    title: {
        "textStyle": {
            "color": "#eeeeee"
        },
        "subtextStyle": {
            "color": "#aaaaaa"
        }
    },
    axisPointer: {
        type: 'cross',
        crossStyle: {
            color: '#999'
        }
    },
    splitLine: {
        show: true,
        lineStyle: {
            // 使用深浅的间隔色
            color: ['#aaa', '#ddd']
        }
    },
    splitLinedashed: {
        show: true,
        lineStyle: {
            type: 'dashed'
        }
    },
    axisLine: {
        lineStyle: {
            width: 1,
            color: '#434444',
            opacity: 1
        }
    },
    axisTick: {
        show: false
    }
};
