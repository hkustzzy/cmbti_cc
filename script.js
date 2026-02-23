// 猫咪性格数据
const personalityData = {
    'INTJ': {
        title: '幕后主使',
        description: '冷淡的预言家,通过观察你的动线来精准控制开罐时间。',
        functions: 'Ni>Te>Fi>Se'
    },
    'ENTJ': {
        title: '霸道总裁',
        description: '极具侵略性的领袖,把家里所有生物(包括你)都当成下属。',
        functions: 'Te>Ni>Se>Fi'
    },
    'INTP': {
        title: '虚空物理学家',
        description: '逻辑偏执狂,会花数小时研究水滴下落或激光笔的消失路径。',
        functions: 'Ti>Ne>Si>Fe'
    },
    'ENTP': {
        title: '拆家极客',
        description: '混乱的实验者,永远不按常理出牌,拆家不是因为调皮,而是想看里面有什么。',
        functions: 'Ne>Ti>Fe>Si'
    },
    'INFJ': {
        title: '灵性导师',
        description: '情绪通灵者,平时高冷但总在你心情最差时精准出现。',
        functions: 'Ni>Fe>Ti>Se'
    },
    'ENFJ': {
        title: '和平大使',
        description: '多猫家庭的调解员,有猫打架第一个冲过去拉架,负责维持家庭秩序。',
        functions: 'Fe>Ni>Se>Ti'
    },
    'INFP': {
        title: '治愈系诗人',
        description: '敏感的隐士,躲在窗帘后发呆并拥有一套完整的人类观察学。',
        functions: 'Fi>Ne>Si>Te'
    },
    'ENFP': {
        title: '快乐小疯子',
        description: '跳跃的好奇心,前一秒在深情蹭你,后一秒突然惊跳跑酷。',
        functions: 'Ne>Fi>Te>Si'
    },
    'ISTJ': {
        title: '老派绅士',
        description: '活体闹钟,生活极其规律,任何家具位移都会触发其焦虑。',
        functions: 'Si>Te>Fi>Ne'
    },
    'ESTJ': {
        title: '宿管阿姨',
        description: '规则捍卫者,只要你在家大声说话或晚睡,它就会跑来骂街。',
        functions: 'Te>Si>Ne>Fi'
    },
    'ISFJ': {
        title: '贴心守卫',
        description: '忠诚的守卫,无论你是在洗澡还是睡觉,它必须在视线范围内。',
        functions: 'Si>Fe>Ti>Ne'
    },
    'ESFJ': {
        title: '热心小保姆',
        description: '非常关心主人和其他猫咪,只要你咳一声,就会跑过来确认你的状况,同时是个小话痨,通过持续的喵喵叫向你汇报它一天的见闻。',
        functions: 'Fe>Si>Ne>Ti'
    },
    'ISTP': {
        title: '高冷刺客',
        description: '莫得感情的杀手,不叫不闹,却能精准打开带锁的零食柜。',
        functions: 'Ti>Se>Ni>Fe'
    },
    'ESTP': {
        title: '极限运动员',
        description: '活在当下的莽夫,敢于从冰箱顶直接俯冲到你头顶的勇士。',
        functions: 'Se>Ti>Fe>Ni'
    },
    'ISFP': {
        title: '艺术家',
        description: '精致的利己主义者,睡姿极美但对抚摸有着严苛的时间限制。',
        functions: 'Fi>Se>Ni>Te'
    },
    'ESFP': {
        title: '聚光灯之王',
        description: '渴望掌声的戏精,只要家里来人就会开启疯狂翻滚表演模式。',
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
    const question = questions[currentQuestion];

    // 更新进度条
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    document.getElementById('progress-fill').style.width = progress + '%';

    // 更新进度文字 - 只更新数字部分
    const progressTextEl = document.getElementById('progress-text');
    const numberSpan = progressTextEl.querySelector('.progress-number');
    if (numberSpan) {
        numberSpan.textContent = currentQuestion + 1;
    } else {
        progressTextEl.innerHTML = `<span class="progress-icon">🐱</span>第 <span class="progress-number">${currentQuestion + 1}</span> 题 / 共 ${questions.length} 题`;
    }

    // 更新题目内容
    document.getElementById('dimension-title').textContent = question.dimension;
    document.getElementById('question-text').textContent = question.question;
    document.getElementById('option-a').textContent = question.optionA;
    document.getElementById('option-b').textContent = question.optionB;
}

// 选择选项
function selectOption(option) {
    const question = questions[currentQuestion];
    const dimensionType = question.dimension_type;

    // 记录答案
    if (option === 'A') {
        answers[dimensionType[0]]++;
    } else {
        answers[dimensionType[1]]++;
    }

    // 下一题或显示结果
    currentQuestion++;

    if (currentQuestion < questions.length) {
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

    // 更新结果页面
    document.getElementById('cat-name-display').textContent = `${catName} 的性格是:`;
    document.getElementById('personality-type').textContent = personalityType;
    document.getElementById('personality-title').textContent = personality.title;
    document.getElementById('personality-desc').textContent = personality.description;
    document.getElementById('result-image').src = `cat_icon/${personalityType}.png`;
    document.getElementById('result-image').alt = `${personalityType} - ${personality.title}`;

    // 显示结果页面
    showPage('result-page');
}

// 重新测试
function restartTest() {
    currentQuestion = 0;
    answers = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    showPage('welcome-page');
    document.getElementById('cat-name').value = '';
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

// 下载结果图片 - 方案1: 直接下载猫咪图片+文字截图提示
async function downloadResult() {
    const personalityType = document.getElementById('personality-type').textContent;
    const personalityTitle = document.getElementById('personality-title').textContent;

    // 方案: 创建一个新的canvas,手动绘制内容(避免跨域问题)
    try {
        const img = document.getElementById('result-image');

        // 创建canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // 设置canvas尺寸
        canvas.width = 800;
        canvas.height = 1000;

        // 绘制背景
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#fff5f5');
        gradient.addColorStop(1, '#ffecd2');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 加载并绘制图片
        const catImage = new Image();
        catImage.crossOrigin = 'anonymous';

        await new Promise((resolve, reject) => {
            catImage.onload = resolve;
            catImage.onerror = () => {
                // 如果加载失败,绘制占位图
                resolve();
            };
            catImage.src = img.src;
        });

        // 如果图片加载成功,绘制到canvas
        if (catImage.complete && catImage.naturalHeight !== 0) {
            // 计算图片绘制尺寸,保持原始比例
            const maxImgWidth = 600;
            const maxImgHeight = 500;
            let imgWidth = catImage.naturalWidth;
            let imgHeight = catImage.naturalHeight;

            // 按比例缩放
            const scale = Math.min(maxImgWidth / imgWidth, maxImgHeight / imgHeight);
            imgWidth = imgWidth * scale;
            imgHeight = imgHeight * scale;

            // 居中绘制
            const imgX = (canvas.width - imgWidth) / 2;
            const imgY = 80;

            ctx.drawImage(catImage, imgX, imgY, imgWidth, imgHeight);

            // 根据图片实际高度调整后续文字位置
            var textStartY = imgY + imgHeight + 60;
        } else {
            // 绘制占位矩形
            ctx.fillStyle = '#ffcccc';
            ctx.fillRect(150, 80, 500, 500);
            ctx.fillStyle = '#ff6b6b';
            ctx.font = 'bold 40px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('😺', canvas.width / 2, 350);
            var textStartY = 650;
        }

        // 绘制标题
        ctx.fillStyle = '#333';
        ctx.font = 'bold 50px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${catName} 的性格是:`, canvas.width / 2, textStartY);

        // 绘制性格类型
        ctx.fillStyle = '#ff6b6b';
        ctx.font = 'bold 80px Arial, sans-serif';
        ctx.fillText(personalityType, canvas.width / 2, textStartY + 100);

        // 绘制称号
        ctx.fillStyle = '#ff8787';
        ctx.font = 'bold 45px Arial, sans-serif';
        ctx.fillText(personalityTitle, canvas.width / 2, textStartY + 170);

        // 绘制描述
        const desc = document.getElementById('personality-desc').textContent;
        ctx.fillStyle = '#555';
        ctx.font = '28px Arial, sans-serif';

        // 文字换行
        const maxWidth = 700;
        const words = desc.split('');
        let line = '';
        let y = textStartY + 240;

        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i];
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && i > 0) {
                ctx.fillText(line, canvas.width / 2, y);
                line = words[i];
                y += 35;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, canvas.width / 2, y);

        // 调整canvas高度以适应内容
        const finalHeight = Math.max(1000, y + 80);
        if (finalHeight > canvas.height) {
            // 创建新的canvas来调整大小
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = canvas.width;
            tempCanvas.height = finalHeight;
            const tempCtx = tempCanvas.getContext('2d');
            tempCtx.drawImage(canvas, 0, 0);

            // 绘制底部水印到新canvas
            tempCtx.fillStyle = '#aaa';
            tempCtx.font = '20px Arial, sans-serif';
            tempCtx.textAlign = 'center';
            tempCtx.fillText('🐱 CMBTI 猫咪性格测试', tempCanvas.width / 2, finalHeight - 30);

            // 下载新canvas
            tempCanvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.download = `${catName}-${personalityType}-CMBTI.png`;
                link.href = url;
                link.click();
                URL.revokeObjectURL(url);
                alert('图片已保存成功! 📸');
            }, 'image/png');
        } else {
            // 绘制底部水印
            ctx.fillStyle = '#aaa';
            ctx.font = '20px Arial, sans-serif';
            ctx.fillText('🐱 CMBTI 猫咪性格测试', canvas.width / 2, canvas.height - 30);

            // 下载图片
            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.download = `${catName}-${personalityType}-CMBTI.png`;
                link.href = url;
                link.click();
                URL.revokeObjectURL(url);
                alert('图片已保存成功! 📸');
            }, 'image/png');
        }

    } catch (error) {
        console.error('下载错误:', error);
        alert('保存失败~ 😿\n建议使用截屏功能保存结果');
    }
}
