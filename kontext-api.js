// LiblibAI Kontext 图生图 API 集成
// 基于官方文档: https://liblibai.feishu.cn/wiki/UAMVw67NcifQHukf8fpccgS5n6d

// 注意: uploadedCatPhoto 和 uploadedCatPhotoFile 在 script.js 中定义

// ============ 1. 照片上传功能 ============
function initPhotoUpload() {
    const uploadInput = document.getElementById('cat-photo-upload');
    const uploadArea = document.getElementById('upload-area');
    const placeholder = uploadArea.querySelector('.upload-placeholder');
    const preview = document.getElementById('uploaded-preview');
    const previewImage = document.getElementById('preview-image');
    const generateBtn = document.getElementById('btn-generate-ai');

    uploadInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(event) {
                uploadedCatPhoto = event.target.result;
                uploadedCatPhotoFile = file; // 保存原始文件对象
                previewImage.src = uploadedCatPhoto;
                placeholder.style.display = 'none';
                preview.style.display = 'block';
                generateBtn.disabled = false;
            };
            reader.readAsDataURL(file);
        }
    });
}

// ============ 2. 生成 AI 图片 (主入口) ============
async function generateAIImage() {
    // 显示加载状态
    document.getElementById('ai-loading').style.display = 'block';
    document.getElementById('ai-result').style.display = 'none';
    document.getElementById('btn-generate-ai').disabled = true;

    try {
        console.log('🎨 开始 AI 生成流程...');

        // Step 1: 获取或上传性格测试结果图片
        console.log('📤 步骤 1: 获取性格测试结果图片...');
        const resultImageSrc = document.getElementById('result-image').src;
        let personalityImageUrl;

        // 根据当前性格类型，使用对应的网络图片
        // 暂时使用官方示例的图片作为性格模板
        const personalityTemplateImages = {
            'ISFJ': 'https://liblibai-online.liblib.cloud/img/081e9f07d9bd4c2ba090efde163518f9/7c1cc38e-522c-43fe-aca9-07d5420d743e.png',
            'ISFP': 'https://liblibai-online.liblib.cloud/img/081e9f07d9bd4c2ba090efde163518f9/7c1cc38e-522c-43fe-aca9-07d5420d743e.png',
            'ESFP': 'https://liblibai-online.liblib.cloud/img/081e9f07d9bd4c2ba090efde163518f9/7c1cc38e-522c-43fe-aca9-07d5420d743e.png',
            'ESFJ': 'https://liblibai-online.liblib.cloud/img/081e9f07d9bd4c2ba090efde163518f9/7c1cc38e-522c-43fe-aca9-07d5420d743e.png',
        };

        // 默认使用 ISFJ 的图片
        personalityImageUrl = personalityTemplateImages[currentPersonalityType] ||
                              'https://liblibai-online.liblib.cloud/img/081e9f07d9bd4c2ba090efde163518f9/7c1cc38e-522c-43fe-aca9-07d5420d743e.png';

        console.log('📌 使用性格模板图片:', personalityImageUrl);

        // Step 2: 获取用户上传的猫咪照片
        console.log('📤 步骤 2: 获取用户猫咪照片 URL...');
        let catPhotoUrl;

        if (uploadedCatPhotoFile) {
            // 上传用户照片到 OSS
            try {
                catPhotoUrl = await uploadImageToOSS(uploadedCatPhotoFile, `cat_photo_${Date.now()}`);
                console.log('✅ 用户猫咪照片上传成功:', catPhotoUrl);
            } catch (uploadError) {
                console.warn('⚠️ 上传失败，使用测试图片:', uploadError);
                // 上传失败，使用测试图片
                catPhotoUrl = 'https://liblibai-models.oss-cn-beijing.aliyuncs.com/img/9f9178b9593b4ba7b42739c77b1b4958/459c890fe76a4426e060f208392b27df70685f99465d596731bcd37c8d91c06b.jpg';
            }
        } else {
            // 没有上传，使用测试图片
            catPhotoUrl = 'https://liblibai-models.oss-cn-beijing.aliyuncs.com/img/9f9178b9593b4ba7b42739c77b1b4958/459c890fe76a4426e060f208392b27df70685f99465d596731bcd37c8d91c06b.jpg';
            console.log('📌 没有上传图片，使用测试猫咪图片:', catPhotoUrl);
        }

        // Step 3: 调用 Kontext 图生图 API（使用两张图片）
        console.log('🚀 步骤 3: 调用 Kontext API 生成图片...');
        const result = await callKontextAPI(personalityImageUrl, catPhotoUrl);
        console.log('✅ AI 生成完成!', result);

        // 显示生成结果
        document.getElementById('ai-loading').style.display = 'none';
        document.getElementById('ai-result').style.display = 'block';
        document.getElementById('ai-generated-image').src = result.imageUrl;
        document.getElementById('btn-generate-ai').disabled = false;

    } catch (error) {
        console.error('❌ AI 生成失败:', error);
        document.getElementById('ai-loading').style.display = 'none';
        document.getElementById('btn-generate-ai').disabled = false;

        let errorMessage = 'AI 生成失败~ 😿\n\n';

        if (error.message.includes('ACCESS_KEY')) {
            errorMessage += '请先配置 ACCESS_KEY 和 SECRET_KEY\n\n';
            errorMessage += '获取方式:\n';
            errorMessage += '1. 访问 https://www.xingliu.art/\n';
            errorMessage += '2. 登录账号\n';
            errorMessage += '3. 个人中心 → 开发者设置\n';
            errorMessage += '4. 复制 AccessKey 和 SecretKey';
        } else {
            errorMessage += error.message;
            errorMessage += '\n\n请查看浏览器控制台 (F12) 了解详细错误信息';
        }

        alert(errorMessage);
    }
}

// ============ 3. HMAC-SHA1 签名生成 ============
async function generateSignature(uri, timestamp, nonce, secretKey) {
    // 签名内容: uri + "&" + timestamp + "&" + nonce
    const content = `${uri}&${timestamp}&${nonce}`;

    // 使用 HMAC-SHA1 生成签名
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secretKey);
    const contentData = encoder.encode(content);

    const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-1' },
        false,
        ['sign']
    );

    const signature = await crypto.subtle.sign('HMAC', cryptoKey, contentData);

    // 转换为 Base64URL (去除 padding '=')
    const base64 = btoa(String.fromCharCode(...new Uint8Array(signature)));
    const base64url = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    return base64url;
}

// ============ 4. 上传图片到 OSS ============
async function uploadImageToOSS(file, fileName) {
    const config = LIBLIB_CONFIG;

    if (!config.ACCESS_KEY || config.ACCESS_KEY === 'YOUR_ACCESS_KEY_HERE') {
        throw new Error('请先在 liblib-config.js 中配置 ACCESS_KEY 和 SECRET_KEY');
    }

    // 4.1 获取 OSS 上传签名 (通过代理服务器)
    const signatureUrl = 'http://localhost:3000/api/upload/signature';

    console.log('📝 请求 OSS 签名...', { fileName });

    const signatureResponse = await fetch(signatureUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            fileName: fileName
        })
    });

    if (!signatureResponse.ok) {
        const errorText = await signatureResponse.text();
        console.error('❌ 获取 OSS 签名失败:', errorText);
        throw new Error(`获取 OSS 签名失败 (${signatureResponse.status})\n${errorText.substring(0, 200)}`);
    }

    const ossData = await signatureResponse.json();

    // 检查 API 返回 code
    if (ossData.code !== 0) {
        console.error('❌ OSS 签名 API 错误:', ossData);
        throw new Error(`OSS 签名 API 错误: ${ossData.msg}`);
    }

    console.log('✅ 获取 OSS 签名成功:', ossData);

    if (!ossData.data || !ossData.data.host) {
        throw new Error('OSS 签名响应缺少必要字段');
    }

    const data = ossData.data;

    // 4.2 上传文件到 OSS
    const formData = new FormData();
    formData.append('key', data.key);
    formData.append('policy', data.policy);
    formData.append('OSSAccessKeyId', data.accessKeyId);
    formData.append('signature', data.signature);
    formData.append('callback', data.callback || '');
    formData.append('file', file);

    console.log('📤 上传文件到 OSS...', { host: data.host, key: data.key });

    const uploadResponse = await fetch(data.host, {
        method: 'POST',
        body: formData
    });

    if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error('❌ 上传到 OSS 失败:', errorText);
        throw new Error(`上传到 OSS 失败 (${uploadResponse.status})\n${errorText.substring(0, 200)}`);
    }

    const uploadResult = await uploadResponse.json();
    console.log('✅ 文件上传成功:', uploadResult);

    return uploadResult.url || uploadResult.imageUrl;
}

// ============ 5. 调用 Kontext 图生图 API ============
async function callKontextAPI(personalityImageUrl, catPhotoUrl) {
    const config = LIBLIB_CONFIG;

    // 使用 Kontext 专用端点
    const apiUrl = 'http://localhost:3000/api/kontext/img2img';

    // 创建融合提示词
    const fusionPrompt = `${config.GENERATE_PARAMS.prompt} 用第二张图片猫咪的形象和长相，套用第一张图片的服装、场景、表情和装饰元素。猫咪的长相一定要完全保留第二张图的样子，包括面部特征、毛色、体型等，同时将第一张图的风格和装扮完整应用到猫咪身上。保持高度的细节质量和艺术美感。`;

    // 构建请求体 (Kontext 格式 - 使用两张图片的 image_list)
    const requestBody = {
        templateUuid: config.TEMPLATE_UUID,
        generateParams: {
            image_list: [personalityImageUrl, catPhotoUrl],  // 第一张是性格模板，第二张是用户猫咪
            prompt: fusionPrompt,
            imgCount: config.GENERATE_PARAMS.imgCount || 1
        }
    };

    console.log('🚀 发送 Kontext API 请求:', {
        url: apiUrl,
        templateUuid: config.TEMPLATE_UUID,
        image_list: [
            '性格模板图片: ' + personalityImageUrl,
            '用户猫咪照片: ' + catPhotoUrl
        ],
        prompt: fusionPrompt
    });

    // 发送生成请求
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Kontext API 错误:', errorText);
        throw new Error(`Kontext API 错误 (${response.status})\n${errorText.substring(0, 200)}`);
    }

    const data = await response.json();
    console.log('✅ Kontext API 响应:', data);

    // 检查返回 code (0 表示成功)
    if (data.code !== 0) {
        throw new Error('API 错误: ' + (data.msg || data.message || '未知错误'));
    }

    // 获取生成任务 UUID
    const generateUuid = data.data?.generateUuid;
    if (!generateUuid) {
        throw new Error('API 未返回 generateUuid');
    }

    // 轮询获取结果
    console.log('⏳ 开始轮询生成状态...', { generateUuid });
    const result = await pollGenerationStatus(generateUuid);

    return result;
}

// ============ 6. 轮询生成状态 ============
async function pollGenerationStatus(generateUuid) {
    const config = LIBLIB_CONFIG;
    const polling = config.POLLING;

    let attempts = 0;
    const startTime = Date.now();

    while (attempts < polling.maxAttempts) {
        attempts++;

        // 检查超时
        if (Date.now() - startTime > polling.timeout) {
            throw new Error('生成超时,请稍后重试');
        }

        // 等待
        await sleep(polling.interval);

        // 请求状态 (通过代理服务器)
        const statusUrl = 'http://localhost:3000/api/status';

        console.log(`🔄 轮询第 ${attempts} 次...`);

        const response = await fetch(statusUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ generateUuid })
        });

        if (!response.ok) {
            console.error('❌ 状态查询失败:', response.status);
            continue;
        }

        const data = await response.json();
        console.log('📊 生成状态响应:', data);

        // 检查返回 code
        if (data.code !== 0) {
            console.error('❌ 状态查询错误:', data.msg);
            continue;
        }

        // 检查 data
        const generateData = data.data;
        if (!generateData) {
            console.log('⏳ 任务尚未返回数据，继续等待...');
            continue;
        }

        // 状态码: 1=成功, 2=处理中, 3=失败 (根据 API 返回)
        const status = generateData.generateStatus;
        console.log(`📊 当前状态码: ${status}`);

        // 检查是否有图片 (生成成功)
        if (generateData.images && Array.isArray(generateData.images)) {
            // 找到非 null 的图片
            const completedImage = generateData.images.find(img => img !== null && img.imageUrl);
            if (completedImage) {
                console.log('✅ 生成成功!', completedImage);
                return { imageUrl: completedImage.imageUrl };
            }
        }

        // 状态码为 1 表示成功，但没有图片数据
        if (status === 1) {
            // 成功但 images 为空，可能是旧版本返回格式
            console.error('❌ 生成完成但未返回图片');
            throw new Error('生成完成但未返回图片');
        }

        // 状态 2 = 处理中，继续等待
        console.log('⏳ 任务进行中，等待下次轮询...');
    }

    throw new Error('轮询超过最大次数,生成可能仍在进行中');
}

// ============ 7. 工具函数 ============

// 生成 UUID
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// 延迟函数
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ============ 8. UI 交互函数 ============

// 使用生成的图片
function useGeneratedImage() {
    const generatedImage = document.getElementById('ai-generated-image').src;
    document.getElementById('result-image').src = generatedImage;
    currentTemplateImage = generatedImage;
    alert('已切换为 AI 生成的专属形象! ✨');

    // 滚动到顶部查看
    document.getElementById('result-image').scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
}

// 重新生成
function regenerateAI() {
    generateAIImage();
}
