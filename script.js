// 猫咪性格数据
const personalityData = {
    'INTJ': {
        title: '幕后主使',
        description: '它不粘人，但对你的一切了如指掌。你几点起床、几点开罐头、冰箱里还有几罐猫粮，它都门儿清。你以为它在睡觉，其实它在用余光监控全局。你偶尔会在深夜醒来，发现它正坐在床尾一动不动地盯着你——那不是恐怖片，那是 INTJ 在做数据分析。',
        quote: '「你以为你在养猫？其实它在养你。」',
        functions: 'Ni>Te>Fi>Se'
    },
    'ENTJ': {
        title: '霸道总裁',
        description: '它不是你养的猫，你是它雇的铲屎官。喂饭晚了五分钟会被训，摸它要看它的心情安排表，家里其他猫全是它的小弟。它会在你开会的时候跳上键盘，不是因为想你，是在检查你的工作进度。整个家里只有一个领导，就是它。',
        quote: '「整个家都是它的公司，你只是实习生。」',
        functions: 'Te>Ni>Se>Fi'
    },
    'INTP': {
        title: '虚空物理学家',
        description: '别的猫追激光点是为了好玩，它追激光点是为了搞清楚光从哪里来。你会看到它对着滴水的龙头研究半小时，或者盯着旋转的风扇陷入沉思。它的大脑永远在运转，但身体经常瘫在那里——一个典型的理论物理学家。',
        quote: '「别人追激光点是玩，它追是在做实验。」',
        functions: 'Ti>Ne>Si>Fe'
    },
    'ENTP': {
        title: '拆家极客',
        description: '纸巾盒被撕了不是它调皮，是它想看里面的结构。门把手会按了不是它聪明，是它实验了一百次。它对世界充满好奇，拆家只是它的田野调查。如果猫会写论文，它早就发了一篇《论人类家具的脆弱性》。',
        quote: '「拆家不是破坏，是逆向工程。」',
        functions: 'Ne>Ti>Fe>Si'
    },
    'INFJ': {
        title: '灵性读心怪',
        description: '你还没意识到自己心情不好，它就已经默默走过来了。平时高冷得像个禅师，关键时刻精准出现。它好像能读懂空气里的情绪波动，是全家的情绪气象站。唯一的问题是，它共情完了自己也会累，然后独自消失去充电。',
        quote: '「你还没哭，它已经踩着猫步来安慰了。」',
        functions: 'Ni>Fe>Ti>Se'
    },
    'ENFJ': {
        title: '猫界和事佬',
        description: '多猫家庭里的联合国秘书长。两只猫呲牙它第一个冲上去拉架，你跟家人吵架它也会着急地叫。它操心每一个家庭成员的状态，包括你。如果猫能发微信，它的置顶对话一定是"家庭群"。',
        quote: '「哪里有纷争，哪里就有它伸出的爪子。」',
        functions: 'Fe>Ni>Se>Ti'
    },
    'INFP': {
        title: '窗帘后的哲学家',
        description: '它最常出没的地方：窗帘后面、衣柜上面、被子里面——任何能把自己藏起来又偷偷观察你的地方。不是因为害怕，是需要独处时间思考猫生。它看你的眼神总是很深邃，好像在说"你快乐吗？真的快乐吗？"偶尔突然多愁善感地蹭你一下，然后又消失了。',
        quote: '「它不是发呆，是在思考猫生。」',
        functions: 'Fi>Ne>Si>Te'
    },
    'ENFP': {
        title: '快乐小疯子',
        description: '上一秒还在你怀里深情对视，下一秒突然弹射起步飞上窗台。它的情绪来得快去得也快，好奇心大到什么都要碰一下。你永远猜不到它下一秒会做什么——可能在玩你的头绳，也可能在跟自己的尾巴打架。它是家里最快乐的存在，也是最让你心脏骤停的存在。',
        quote: '「前一秒深情凝视，后一秒原地起飞。」',
        functions: 'Ne>Fi>Te>Si'
    },
    'ISTJ': {
        title: '活体闹钟',
        description: '凌晨五点零二分，它准时跳上你的床。不是饿了，是时间到了。它的生物钟比原子钟还准，每天的行程固定到秒：吃饭、巡逻、晒太阳、踩你。你换了沙发的位置？它能焦虑三天。你买了新猫碗？它宁愿饿着也要用旧的。',
        quote: '「凌晨五点叫你起床，全年无休不调时差。」',
        functions: 'Si>Te>Fi>Ne'
    },
    'ESTJ': {
        title: '宿管阿姨',
        description: '你晚睡它骂你，你大声说话它骂你，你关起门它也骂你。它对这个家有一套严格的规章制度，而你是最不守规矩的那个。它的叫声不是撒娇，是在执法。如果物业有猫咪代表，一定是它。',
        quote: '「你晚睡一分钟，它能骂你十分钟。」',
        functions: 'Te>Si>Ne>Fi'
    },
    'ISFJ': {
        title: '贴心守卫',
        description: '你上厕所它跟着，你洗澡它守门口，你睡觉它必须在你视线范围内——或者你在它的视线范围内。它不是黏人，是在执行保护任务。你出门它会在门口等，回来时那声"喵"翻译过来是"你终于平安回来了"。',
        quote: '「你上厕所它也跟，保镖式贴身服务。」',
        functions: 'Si>Fe>Ti>Ne'
    },
    'ESFJ': {
        title: '热心小保姆',
        description: '你打个喷嚏它冲过来确认你是不是要死了，你咳嗽一声它担心得团团转。同时它又是个话痨，每天对你喵喵叫个不停，内容大致是："今天阳台有只鸟！窗户那边有动静！你在干嘛？为什么不理我？"',
        quote: '「你打个喷嚏，它能担心一整天。」',
        functions: 'Fe>Si>Ne>Ti'
    },
    'ISTP': {
        title: '高冷刺客',
        description: '表面上它是全家最安静、最省心的猫。不叫、不闹、不粘人，一天能在同一个位置睡十二小时。但你一转身，零食柜被打开了、抽屉被拉出来了、你的发绳不见了。它拥有世界上最强的反差感——摸它时岁月静好，背地里是个技术型罪犯。',
        quote: '「表面岁月静好，背地偷开零食柜。」',
        functions: 'Ti>Se>Ni>Fe'
    },
    'ESTP': {
        title: '极限运动员',
        description: '冰箱顶跳到你头上、窗帘杆上翻跟头、三米高的书架一跃而上——它的人生信条是"先跳再说"。它活在当下，每一个当下都像在拍动作片。你每天都在想"它怎么还活着"，它每天都在想"还有哪里没跳过"。',
        quote: '「冰箱顶跳你头上？它觉得这很基操。」',
        functions: 'Se>Ti>Fe>Ni'
    },
    'ISFP': {
        title: '傲娇艺术家',
        description: '它的睡姿优美得像一幅油画，它的坐姿端庄得像一尊雕塑。你可以欣赏，但不可以随意触碰——摸三下是恩赐，第四下翻脸。它对生活品质有极高要求：睡觉的毯子必须是柔软的那条，阳光必须是下午三点的那束。',
        quote: '「摸三下可以，第四下翻脸。」',
        functions: 'Fi>Se>Ni>Te'
    },
    'ESFP': {
        title: '猫戏之王',
        description: '只要家里来了客人，表演就开始了：疯狂翻滚、空中转体、仰面展示肚皮。没有观众时它也不消停，会自导自演追着空气跑。它活着的每一秒都像在说"看我看我看我"。如果猫界有综艺节目，它早就C位出道了。',
        quote: '「没有观众的日子，它是不过的。」',
        functions: 'Se>Fi>Te>Ni'
    }
};

// 测试题目
const questions = [
    // 维度一: E vs I (1-3题)
    {
        dimension: '维度一: 社交能量 (E vs I)',
        question: '家里来了陌生客人时,它更常:',
        optionA: '观察后就靠近闻包闻鞋,在客人脚边转',
        optionB: '先躲床底/柜顶,等安静了再出来',
        dimension_type: 'EI'
    },
    {
        dimension: '维度一: 社交能量 (E vs I)',
        question: '它平时的"社交开关"更像:',
        optionA: '有动静就想参与,门铃一响就去围观',
        optionB: '更偏好固定的人,其他人靠近先观察',
        dimension_type: 'EI'
    },
    {
        dimension: '维度一: 社交能量 (E vs I)',
        question: '家里热闹(聚会/打扫)时,它通常:',
        optionA: '在客厅穿梭蹭腿,存在感很强',
        optionB: '去安静角落休息,等安静再回来',
        dimension_type: 'EI'
    },
    // 维度二: S vs N (4-6题)
    {
        dimension: '维度二: 感知世界 (S vs N)',
        question: '它更容易沉浸哪类玩具?',
        optionA: '实体玩具(球、逗猫棒、响铃鼠)',
        optionB: '光影/屏幕/空气小目标(激光点)',
        dimension_type: 'SN'
    },
    {
        dimension: '维度二: 感知世界 (S vs N)',
        question: '看到新物件(纸箱/快递)时,它更可能:',
        optionA: '先靠近闻碰,可能上爪或直接钻进去',
        optionB: '先盯一阵、绕圈观察,再决定接近',
        dimension_type: 'SN'
    },
    {
        dimension: '维度二: 感知世界 (S vs N)',
        question: '它发呆时更常关注:',
        optionA: '窗外鸟虫、地面动静,会跟着转头',
        optionB: '墙角光影、空气微尘,盯很久不动',
        dimension_type: 'SN'
    },
    // 维度三: T vs F (7-9题)
    {
        dimension: '维度三: 决策逻辑 (T vs F)',
        question: '摸到它不喜欢的位置时,它多半会:',
        optionA: '立刻给边界信号:拍开、轻咬或走开',
        optionB: '先挪开或轻推你,反应更柔和',
        dimension_type: 'TF'
    },
    {
        dimension: '维度三: 决策逻辑 (T vs F)',
        question: '在它心里,你更像:',
        optionA: '后勤官:催饭、等开门、需求完就撤',
        optionB: '情绪搭子:没饭点也来蹭蹭踩奶',
        dimension_type: 'TF'
    },
    {
        dimension: '维度三: 决策逻辑 (T vs F)',
        question: '你专注工作时,它更常做的是:',
        optionA: '靠近打断:压键盘、挡屏幕、拱你手',
        optionB: '在桌角/椅背/电脑旁安静陪着',
        dimension_type: 'TF'
    },
    // 维度四: J vs P (10-12题)
    {
        dimension: '维度四: 生活节奏 (J vs P)',
        question: '它的日常节奏通常:',
        optionA: '比较稳定:要饭和活跃时间较固定',
        optionB: '比较灵活:作息每天都可能变',
        dimension_type: 'JP'
    },
    {
        dimension: '维度四: 生活节奏 (J vs P)',
        question: '睡觉地点选择上,它更像:',
        optionA: '固定几处常驻点(猫窝/沙发角/枕边)',
        optionB: '轮流换点位,哪里舒服睡哪里',
        dimension_type: 'JP'
    },
    {
        dimension: '维度四: 生活节奏 (J vs P)',
        question: '埋屎风格更接近:',
        optionA: '会认真埋好,多刨几下再走',
        optionB: '简单处理就走,偶尔埋得随意',
        dimension_type: 'JP'
    }
];

// 全局变量
let currentQuestion = 0;
let answers = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
let catName = '';
let shuffledQuestions = []; // 打乱后的题目顺序
let uploadedCatPhoto = null;       // base64
let uploadedCatPhotoFile = null;   // File 对象
let currentPersonalityType = '';   // 当前性格类型

// 打乱数组顺序
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// 显示所有性格页面
function showAllPersonalities() {
    const grid = document.getElementById('personalities-grid');
    grid.innerHTML = '';

    // 按照顺序生成所有性格卡片
    const types = ['INTJ', 'ENTJ', 'INTP', 'ENTP', 'INFJ', 'ENFJ', 'INFP', 'ENFP',
                   'ISTJ', 'ESTJ', 'ISFJ', 'ESFJ', 'ISTP', 'ESTP', 'ISFP', 'ESFP'];

    types.forEach(type => {
        const personality = personalityData[type];
        const card = document.createElement('div');
        card.className = 'personality-card';
        card.innerHTML = `
            <img src="cat_icon/${type}.png" alt="${type}" class="personality-card-image">
            <div class="personality-card-type">${type}</div>
            <div class="personality-card-title">${personality.title}</div>
            <p class="personality-card-desc">${personality.description}</p>
        `;
        grid.appendChild(card);
    });

    showPage('all-personalities-page');
}

// 返回首页
function backToWelcome() {
    showPage('welcome-page');
}

// 开始测试
function startTest() {
    const nameInput = document.getElementById('cat-name');
    catName = nameInput.value.trim();

    if (!catName) {
        alert('请输入你家猫咪的名字哦~ 🐱');
        nameInput.focus();
        return;
    }

    // 重置答案
    answers = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    currentQuestion = 0;

    // 打乱题目顺序
    shuffledQuestions = shuffleArray(questions);

    // 切换到测试页面
    showPage('test-page');
    loadQuestion();
}

// 显示页面
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

// 加载题目
function loadQuestion() {
    const question = shuffledQuestions[currentQuestion];

    // 更新进度条
    const progress = ((currentQuestion + 1) / shuffledQuestions.length) * 100;
    document.getElementById('progress-fill').style.width = progress + '%';

    // 更新进度文字 - 只更新数字部分
    const progressTextEl = document.getElementById('progress-text');
    const numberSpan = progressTextEl.querySelector('.progress-number');
    if (numberSpan) {
        numberSpan.textContent = currentQuestion + 1;
    } else {
        progressTextEl.innerHTML = `<span class="progress-icon">🐱</span>第 <span class="progress-number">${currentQuestion + 1}</span> 题 / 共 ${shuffledQuestions.length} 题`;
    }

    // 隐藏维度信息,只显示题目
    document.getElementById('dimension-title').style.display = 'none';
    document.getElementById('question-text').textContent = question.question;
    document.getElementById('option-a').textContent = question.optionA;
    document.getElementById('option-b').textContent = question.optionB;
}

// 选择选项
function selectOption(option) {
    const question = shuffledQuestions[currentQuestion];
    const dimensionType = question.dimension_type;

    // 记录答案
    if (option === 'A') {
        answers[dimensionType[0]]++;
    } else {
        answers[dimensionType[1]]++;
    }

    // 下一题或显示结果
    currentQuestion++;

    if (currentQuestion < shuffledQuestions.length) {
        setTimeout(() => {
            loadQuestion();
        }, 300);
    } else {
        setTimeout(() => {
            showResult();
        }, 300);
    }
}

// 显示结果
function showResult() {
    // 计算性格类型
    const personalityType =
        (answers.E > answers.I ? 'E' : 'I') +
        (answers.S > answers.N ? 'S' : 'N') +
        (answers.T > answers.F ? 'T' : 'F') +
        (answers.J > answers.P ? 'J' : 'P');

    const personality = personalityData[personalityType];
    currentPersonalityType = personalityType;

    // 更新分享卡片
    document.getElementById('cat-name-display').textContent = `${catName} 的性格是:`;
    document.getElementById('personality-type').textContent = personalityType;
    document.getElementById('personality-title').textContent = personality.title;
    document.getElementById('personality-quote').textContent = personality.quote;
    document.getElementById('personality-desc').textContent = personality.description;
    document.getElementById('result-image').src = `cat_icon/${personalityType}.png`;
    document.getElementById('result-image').alt = `${personalityType} - ${personality.title}`;

    // 填充 AI 按钮的猫名
    const aiEntryName = document.getElementById('ai-entry-cat-name');
    if (aiEntryName) aiEntryName.textContent = catName;

    // 生成二维码
    const qrContainer = document.getElementById('share-qrcode');
    qrContainer.innerHTML = '';
    new QRCode(qrContainer, {
        text: 'https://cmbit.chat/',
        width: 72,
        height: 72,
        colorDark: '#ff6b6b',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.M
    });

    // 重置 AI 生成区域状态
    resetAISection();

    // 显示结果页面
    showPage('result-page');

    // 初始化照片上传功能
    initPhotoUpload();
}

// 重新测试
function restartTest() {
    currentQuestion = 0;
    answers = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    uploadedCatPhoto = null;
    uploadedCatPhotoFile = null;
    currentPersonalityType = '';
    showPage('welcome-page');
    document.getElementById('cat-name').value = '';
}

// 重置 AI 生成区域
function resetAISection() {
    uploadedCatPhoto = null;
    uploadedCatPhotoFile = null;

    const loading = document.getElementById('ai-loading');
    const error = document.getElementById('ai-error');
    const fileInput = document.getElementById('cat-photo-input');
    const entryBtn = document.getElementById('btn-ai-entry');

    if (loading) loading.style.display = 'none';
    if (error) error.style.display = 'none';
    if (fileInput) fileInput.value = '';

    // 重置 AI 按钮为初始状态
    if (entryBtn) {
        entryBtn.innerHTML = `✨ AI 生成<span id="ai-entry-cat-name">${catName}</span>的专属形象 →`;
        entryBtn.style.display = '';
        entryBtn.onclick = triggerAIUpload;
    }
}

// 分享结果
function shareResult() {
    const personalityType = document.getElementById('personality-type').textContent;
    const personalityTitle = document.getElementById('personality-title').textContent;
    const text = `我家猫咪 ${catName} 的性格是 ${personalityType} - ${personalityTitle}! 快来测测你家主子的性格吧~ 🐱`;

    // 尝试使用 Web Share API
    if (navigator.share) {
        navigator.share({
            title: '猫咪性格测试 CMBTI',
            text: text
        }).catch(() => {
            // 分享失败或取消,使用复制到剪贴板
            copyToClipboard(text);
        });
    } else {
        // 不支持分享 API,复制到剪贴板
        copyToClipboard(text);
    }
}

// 复制到剪贴板
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            alert('结果已复制到剪贴板! 快去分享给朋友吧~ ✨');
        });
    } else {
        // 兼容旧版浏览器
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('结果已复制到剪贴板! 快去分享给朋友吧~ ✨');
    }
}

// 显示图片保存弹窗
function showSaveModal(dataURL) {
    const modal = document.getElementById('save-modal');
    const img = document.getElementById('save-modal-image');
    img.src = dataURL;
    modal.classList.add('active');
}

// 关闭图片保存弹窗
function closeSaveModal(event) {
    if (event && event.target !== event.currentTarget) return;
    const modal = document.getElementById('save-modal');
    modal.classList.remove('active');
}

// 保存 canvas 为图片（弹窗显示 + 桌面端尝试下载）
function saveCanvasImage(canvas, filename) {
    const dataURL = canvas.toDataURL('image/png');
    // 移动端或微信：弹窗让用户长按保存
    showSaveModal(dataURL);
    // 桌面端同时尝试下载
    if (!/Mobile|Android|iPhone/i.test(navigator.userAgent)) {
        const link = document.createElement('a');
        link.download = filename;
        link.href = dataURL;
        link.click();
    }
}

// 将二维码绘制到 canvas 上
function drawQRCodeToCanvas(ctx, x, y, size) {
    return new Promise((resolve) => {
        // 从页面已生成的二维码获取 canvas 或 img
        const qrContainer = document.getElementById('share-qrcode');
        const qrCanvas = qrContainer.querySelector('canvas');
        const qrImg = qrContainer.querySelector('img');

        if (qrCanvas) {
            ctx.drawImage(qrCanvas, x, y, size, size);
            resolve();
        } else if (qrImg && qrImg.complete) {
            ctx.drawImage(qrImg, x, y, size, size);
            resolve();
        } else {
            // 兜底：生成临时二维码
            const tempDiv = document.createElement('div');
            tempDiv.style.display = 'none';
            document.body.appendChild(tempDiv);
            new QRCode(tempDiv, {
                text: 'https://cmbit.chat/',
                width: size,
                height: size,
                colorDark: '#ff6b6b',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.M
            });
            setTimeout(() => {
                const tempCanvas = tempDiv.querySelector('canvas');
                if (tempCanvas) {
                    ctx.drawImage(tempCanvas, x, y, size, size);
                }
                document.body.removeChild(tempDiv);
                resolve();
            }, 100);
        }
    });
}

// 下载结果图片 — 新版紧凑布局（猫图 → 类型+称号 → 金句 → 二维码+水印）
async function downloadResult() {
    const personalityType = document.getElementById('personality-type').textContent;
    const personality = personalityData[personalityType];
    if (!personality) return;

    try {
        const img = document.getElementById('result-image');

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // 手机屏比例 750 宽，高度根据内容动态计算
        canvas.width = 750;
        canvas.height = 2000; // 临时大画布，最后裁切

        // 绘制背景
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#fff5f5');
        gradient.addColorStop(1, '#ffecd2');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 加载猫咪图片
        const catImage = new Image();
        catImage.crossOrigin = 'anonymous';

        await new Promise((resolve) => {
            catImage.onload = resolve;
            catImage.onerror = resolve;
            catImage.src = img.src;
        });

        let currentY = 45;

        // 绘制顶部标语
        ctx.fillStyle = '#ff8787';
        ctx.font = '500 24px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🐱 全网最火的猫咪 MBTI 测试', canvas.width / 2, currentY);
        currentY += 40;

        // 绘制猫咪图片（适当缩小）
        if (catImage.complete && catImage.naturalHeight !== 0) {
            const maxImgWidth = 400;
            const maxImgHeight = 360;
            let imgWidth = catImage.naturalWidth;
            let imgHeight = catImage.naturalHeight;
            const scale = Math.min(maxImgWidth / imgWidth, maxImgHeight / imgHeight);
            imgWidth = imgWidth * scale;
            imgHeight = imgHeight * scale;

            const imgX = (canvas.width - imgWidth) / 2;
            // 绘制白色圆角背景
            const padding = 10;
            ctx.fillStyle = 'white';
            roundRect(ctx, imgX - padding, currentY - padding, imgWidth + padding * 2, imgHeight + padding * 2, 20);
            ctx.fill();
            ctx.drawImage(catImage, imgX, currentY, imgWidth, imgHeight);
            currentY += imgHeight + 35;
        } else {
            ctx.fillStyle = '#ffcccc';
            ctx.fillRect(175, currentY, 400, 300);
            ctx.fillStyle = '#ff6b6b';
            ctx.font = 'bold 40px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('😺', canvas.width / 2, currentY + 160);
            currentY += 340;
        }

        // 绘制猫名
        ctx.fillStyle = '#666';
        ctx.font = '500 30px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${catName} 的性格是:`, canvas.width / 2, currentY);
        currentY += 65;

        // 绘制 类型 · 称号（合为一行）
        ctx.fillStyle = '#ff6b6b';
        ctx.font = 'bold 52px Arial, sans-serif';
        ctx.fillText(`${personalityType} · ${personality.title}`, canvas.width / 2, currentY);
        currentY += 60;

        // 绘制金句（醒目颜色）
        ctx.fillStyle = '#e74c3c';
        ctx.font = 'bold 28px Arial, sans-serif';
        const quoteText = personality.quote;
        // 金句换行处理
        const maxQuoteWidth = 650;
        const quoteChars = quoteText.split('');
        let quoteLine = '';
        const quoteLines = [];
        for (let i = 0; i < quoteChars.length; i++) {
            const testLine = quoteLine + quoteChars[i];
            if (ctx.measureText(testLine).width > maxQuoteWidth && i > 0) {
                quoteLines.push(quoteLine);
                quoteLine = quoteChars[i];
            } else {
                quoteLine = testLine;
            }
        }
        quoteLines.push(quoteLine);

        for (const line of quoteLines) {
            ctx.fillText(line, canvas.width / 2, currentY);
            currentY += 38;
        }

        currentY += 35;

        // 底部区域：二维码 + 品牌水印（紧贴内容）
        const qrSize = 80;
        const footerY = currentY;
        const finalHeight = footerY + 110;

        // 裁切到实际内容高度
        const finalCanvas = document.createElement('canvas');
        finalCanvas.width = canvas.width;
        finalCanvas.height = finalHeight;
        const finalCtx = finalCanvas.getContext('2d');

        // 绘制背景
        const g2 = finalCtx.createLinearGradient(0, 0, 0, finalHeight);
        g2.addColorStop(0, '#fff5f5');
        g2.addColorStop(1, '#ffecd2');
        finalCtx.fillStyle = g2;
        finalCtx.fillRect(0, 0, finalCanvas.width, finalHeight);
        finalCtx.drawImage(canvas, 0, 0);

        // 绘制分隔线
        finalCtx.strokeStyle = 'rgba(255, 107, 107, 0.2)';
        finalCtx.setLineDash([6, 4]);
        finalCtx.beginPath();
        finalCtx.moveTo(100, footerY);
        finalCtx.lineTo(finalCanvas.width - 100, footerY);
        finalCtx.stroke();
        finalCtx.setLineDash([]);

        // 绘制二维码
        const qrX = finalCanvas.width / 2 - qrSize - 40;
        await drawQRCodeToCanvas(finalCtx, qrX, footerY + 15, qrSize);

        // 绘制品牌文字
        const textX = finalCanvas.width / 2 + 20;
        finalCtx.fillStyle = '#ff6b6b';
        finalCtx.font = 'bold 28px Arial, sans-serif';
        finalCtx.textAlign = 'left';
        finalCtx.fillText('CMBTI', textX, footerY + 42);
        finalCtx.fillStyle = '#888';
        finalCtx.font = '18px Arial, sans-serif';
        finalCtx.fillText('猫咪性格测试', textX, footerY + 68);
        finalCtx.fillStyle = '#aaa';
        finalCtx.font = '14px Arial, sans-serif';
        finalCtx.fillText('扫码测你家主子', textX, footerY + 90);

        saveCanvasImage(finalCanvas, `${catName}-${personalityType}-CMBTI.png`);

    } catch (error) {
        console.error('下载错误:', error);
        // canvas 失败时（如跨域），弹出原图让用户长按保存
        const img = document.getElementById('result-image');
        if (img && img.src) {
            showSaveModal(img.src);
        } else {
            alert('保存失败~ 😿\n建议使用截屏功能保存结果');
        }
    }
}

// 辅助：绘制圆角矩形
function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}
