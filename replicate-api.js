// ai-generate.js - 前端 AI 图片生成功能（Seedream 5.0 lite）

// 本地开发模式：局域网/localhost 走本地代理 8089，线上走 Edge Function
const IS_LOCAL_DEV = location.hostname === 'localhost' || location.hostname === '127.0.0.1' || /^192\.168\./.test(location.hostname) || /^10\./.test(location.hostname) || /^172\.(1[6-9]|2\d|3[01])\./.test(location.hostname);
const API_BASE = IS_LOCAL_DEV ? `http://192.168.2.107:8089` : '';

const AI_CONFIG = {
  MAX_IMAGE_SIZE: 1024,   // 图片最大尺寸
  JPEG_QUALITY: 0.9,      // JPEG 压缩质量
};

// Prompt 模板：让 Seedream 保持猫咪外观，cosplay 到性格插画的场景/服装
const AI_PROMPT = "参考图1是一只猫咪的真实照片，参考图2是一只穿着特定服装、处于特定场景中的猫咪插画。请生成一张新图片：将图1中猫咪的真实外观（品种、毛色、花纹、眼睛颜色、脸型）完整保留，让它穿上图2中的服装，放入图2中的场景，同时参考图2中猫咪的表情和神态。最终效果要像是图1的猫咪在cosplay图2的角色。保持高质量、可爱、适合社交媒体分享的画风。白色背景。";

// 将图片压缩并转为 base64 data URL
function compressImageToDataURL(source) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.naturalWidth;
      let height = img.naturalHeight;

      // 按比例缩放到最大尺寸内
      if (width > AI_CONFIG.MAX_IMAGE_SIZE || height > AI_CONFIG.MAX_IMAGE_SIZE) {
        const scale = Math.min(AI_CONFIG.MAX_IMAGE_SIZE / width, AI_CONFIG.MAX_IMAGE_SIZE / height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', AI_CONFIG.JPEG_QUALITY));
    };
    img.onerror = () => reject(new Error('Failed to load image'));

    if (typeof source === 'string') {
      img.src = source;
    } else if (source instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => { img.src = e.target.result; };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(source);
    }
  });
}

// 读取用户上传的猫咪照片到 base64
function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

// 点击按钮弹出文件选择（先清空旧值，确保重选同一文件也能触发）
function triggerAIUpload() {
  const fileInput = document.getElementById('cat-photo-input');
  fileInput.value = '';
  fileInput.click();
}

// 初始化照片上传：选完文件直接开始生成
let _photoUploadInited = false;
function initPhotoUpload() {
  if (_photoUploadInited) return;
  _photoUploadInited = true;

  const fileInput = document.getElementById('cat-photo-input');
  if (!fileInput) return;

  fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('请上传图片文件');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('图片文件过大，请上传 10MB 以内的图片');
      return;
    }

    uploadedCatPhotoFile = file;
    uploadedCatPhoto = await readFileAsDataURL(file);

    // 选完直接开始生成
    generateAIImage();
  });
}

// 提交生成请求（Seedream 是同步接口，直接返回结果）
async function submitGeneration(prompt, images) {
  const response = await fetch(`${API_BASE}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, images }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || error.detail || 'Generation failed');
  }

  return response.json();
}

// 更新 AI 状态显示
function updateAIStatus(message) {
  const statusEl = document.getElementById('ai-status-text');
  if (statusEl) {
    statusEl.textContent = message;
  }
}

// 主入口：生成 AI 图片
async function generateAIImage() {
  if (!uploadedCatPhoto || !currentPersonalityType) {
    alert('请先上传猫咪照片');
    return;
  }

  const entryBtn = document.getElementById('btn-ai-entry');
  const loadingSection = document.getElementById('ai-loading');
  const errorSection = document.getElementById('ai-error');
  const resultImage = document.getElementById('result-image');

  // 切换 UI 状态
  entryBtn.style.display = 'none';
  loadingSection.style.display = 'block';
  errorSection.style.display = 'none';

  try {
    updateAIStatus('正在压缩图片...');

    // 图1: 用户猫咪照片（真实外观）
    const catPhotoDataUrl = await compressImageToDataURL(uploadedCatPhotoFile);

    // 图2: 性格结果插画（服装/场景参考）
    const personalityImageDataUrl = await compressImageToDataURL(`cat_icon/${currentPersonalityType}.png`);

    updateAIStatus('AI 正在生成中，请稍等...');

    // Seedream 同步接口，一次请求直接返回结果
    const result = await submitGeneration(AI_PROMPT, [catPhotoDataUrl, personalityImageDataUrl]);

    if (result.status !== 'succeeded' || !result.output) {
      throw new Error('生成失败，请重试');
    }

    // 替换分享卡片中的猫咪图片
    resultImage.src = result.output;

    // 保存到隐藏的 ai-result-image（downloadAIImage 备用）
    const aiResultImg = document.getElementById('ai-result-image');
    if (aiResultImg) aiResultImg.src = result.output;

    loadingSection.style.display = 'none';

    // 按钮变成"重新生成"，点击再次触发文件选择
    entryBtn.innerHTML = `🔄 重新生成<span id="ai-entry-cat-name">${catName}</span>的专属形象`;
    entryBtn.style.display = '';
    entryBtn.onclick = triggerAIUpload;
  } catch (error) {
    console.error('AI generation error:', error);
    loadingSection.style.display = 'none';
    errorSection.style.display = 'block';
    entryBtn.style.display = '';
    const errorMsg = document.getElementById('ai-error-message');
    if (errorMsg) {
      errorMsg.textContent = error.message || 'AI 生成失败，请稍后重试';
    }
  }
}

// 重新生成
function regenerateAI() {
  const generateBtn = document.getElementById('ai-generate-btn');
  const resultSection = document.getElementById('ai-result');
  const errorSection = document.getElementById('ai-error');

  generateBtn.style.display = '';
  resultSection.style.display = 'none';
  errorSection.style.display = 'none';
  generateAIImage();
}

// 下载 AI 生成的图片（canvas 绘制图片+文字信息+金句+二维码）
async function downloadAIImage() {
  const personalityType = currentPersonalityType;
  const personality = personalityData[personalityType];
  if (!personality) return;

  try {
    const aiImg = document.getElementById('ai-result-image');
    if (!aiImg || !aiImg.src) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 750;
    canvas.height = 2000; // 临时大画布，最后裁切

    // 绘制背景
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#fff5f5');
    gradient.addColorStop(1, '#ffecd2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 加载 AI 生成的图片
    const image = new Image();
    image.crossOrigin = 'anonymous';

    await new Promise((resolve) => {
      image.onload = resolve;
      image.onerror = resolve;
      image.src = aiImg.src;
    });

    let currentY = 45;

    // 绘制顶部标语
    ctx.fillStyle = '#ff8787';
    ctx.font = '500 24px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🐱 全网最火的猫咪 MBTI 测试', canvas.width / 2, currentY);
    currentY += 40;

    if (image.complete && image.naturalHeight !== 0) {
      const maxImgWidth = 400;
      const maxImgHeight = 360;
      let imgWidth = image.naturalWidth;
      let imgHeight = image.naturalHeight;
      const scale = Math.min(maxImgWidth / imgWidth, maxImgHeight / imgHeight);
      imgWidth = imgWidth * scale;
      imgHeight = imgHeight * scale;

      const imgX = (canvas.width - imgWidth) / 2;
      const padding = 10;
      ctx.fillStyle = 'white';
      roundRect(ctx, imgX - padding, currentY - padding, imgWidth + padding * 2, imgHeight + padding * 2, 20);
      ctx.fill();
      ctx.drawImage(image, imgX, currentY, imgWidth, imgHeight);
      currentY += imgHeight + 35;
    } else {
      currentY = 150;
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

    // 绘制金句
    ctx.fillStyle = '#e74c3c';
    ctx.font = 'bold 28px Arial, sans-serif';
    const quoteText = personality.quote;
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

    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = canvas.width;
    finalCanvas.height = finalHeight;
    const finalCtx = finalCanvas.getContext('2d');

    // 重绘背景
    const finalGradient = finalCtx.createLinearGradient(0, 0, 0, finalHeight);
    finalGradient.addColorStop(0, '#fff5f5');
    finalGradient.addColorStop(1, '#ffecd2');
    finalCtx.fillStyle = finalGradient;
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
    finalCtx.fillText('猫咪性格测试 · AI 生成', textX, footerY + 68);
    finalCtx.fillStyle = '#aaa';
    finalCtx.font = '14px Arial, sans-serif';
    finalCtx.fillText('扫码测你家主子', textX, footerY + 90);

    saveCanvasImage(finalCanvas, `${catName}-${personalityType}-AI-CMBTI.png`);
  } catch (error) {
    console.error('AI image download error:', error);
    alert('保存失败，请尝试长按图片保存');
  }
}

// 从错误状态重试
function retryAI() {
  const errorSection = document.getElementById('ai-error');
  const entryBtn = document.getElementById('btn-ai-entry');

  errorSection.style.display = 'none';
  if (entryBtn) entryBtn.style.display = '';
}
