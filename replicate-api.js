// replicate-api.js - 前端 AI 图片生成功能

// 本地开发模式：localhost 时走本地代理 8089，线上走 Edge Function
const IS_LOCAL_DEV = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
const API_BASE = IS_LOCAL_DEV ? 'http://localhost:8089' : '';

const AI_CONFIG = {
  POLL_INTERVAL: 3000,    // 轮询间隔 3 秒
  MAX_POLL_TIME: 300000,  // 最大等待时间 5 分钟
  MAX_IMAGE_SIZE: 1024,   // 图片最大尺寸
  JPEG_QUALITY: 0.9,      // JPEG 压缩质量
};

const AI_PROMPT = "Use the cat from image 2, apply the costume, scene, and expression from image 1. The cat's appearance must be exactly the same as image 2.";

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

// 初始化照片上传功能
let _photoUploadInited = false;
function initPhotoUpload() {
  if (_photoUploadInited) return;
  _photoUploadInited = true;

  const fileInput = document.getElementById('cat-photo-input');
  const preview = document.getElementById('cat-photo-preview');
  const previewImg = document.getElementById('cat-photo-preview-img');
  const uploadArea = document.getElementById('cat-photo-upload-area');
  const generateBtn = document.getElementById('ai-generate-btn');

  if (!fileInput) return;

  fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      alert('请上传图片文件');
      return;
    }

    // 验证文件大小（10MB 以内）
    if (file.size > 10 * 1024 * 1024) {
      alert('图片文件过大，请上传 10MB 以内的图片');
      return;
    }

    uploadedCatPhotoFile = file;

    // 显示预览
    const dataURL = await readFileAsDataURL(file);
    uploadedCatPhoto = dataURL;
    previewImg.src = dataURL;
    preview.style.display = 'block';
    uploadArea.classList.add('has-photo');
    generateBtn.disabled = false;
  });

  // 点击上传区域触发文件选择
  uploadArea.addEventListener('click', () => {
    fileInput.click();
  });

  // 拖拽上传
  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
  });

  uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('drag-over');
  });

  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      // 触发 file input 的 change 事件
      const dt = new DataTransfer();
      dt.items.add(file);
      fileInput.files = dt.files;
      fileInput.dispatchEvent(new Event('change'));
    }
  });
}

// 提交生成任务
async function submitGeneration(prompt, inputImages) {
  const response = await fetch(`${API_BASE}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: prompt,
      input_images: inputImages,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || error.detail || 'Failed to submit generation');
  }

  return response.json();
}

// 轮询生成状态
function pollStatus(predictionId) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const poll = async () => {
      if (Date.now() - startTime > AI_CONFIG.MAX_POLL_TIME) {
        reject(new Error('Generation timed out'));
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/api/status/${predictionId}`);
        if (!response.ok) throw new Error('Failed to check status');
        const data = await response.json();

        if (IS_LOCAL_DEV) {
          // 本地代理直接返回 Replicate 原始响应
          if (data.status === 'succeeded') {
            resolve(data);
            return;
          }
          if (data.status === 'failed') {
            reject(new Error(data.error || 'Generation failed'));
            return;
          }
        } else {
          if (data.status === 'succeeded') {
            resolve(data);
            return;
          }
          if (data.status === 'failed') {
            reject(new Error(data.error || 'Generation failed'));
            return;
          }
        }

        updateAIStatus(data.status === 'processing' ? 'AI 正在创作中...' : '正在排队等待...');
        setTimeout(poll, AI_CONFIG.POLL_INTERVAL);
      } catch (error) {
        reject(error);
      }
    };

    poll();
  });
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

  const generateBtn = document.getElementById('ai-generate-btn');
  const loadingSection = document.getElementById('ai-loading');
  const resultSection = document.getElementById('ai-result');
  const errorSection = document.getElementById('ai-error');

  // 切换 UI 状态
  generateBtn.disabled = true;
  generateBtn.style.display = 'none';
  loadingSection.style.display = 'block';
  resultSection.style.display = 'none';
  errorSection.style.display = 'none';

  try {
    updateAIStatus('正在压缩图片...');

    // 将性格结果图转为压缩的 base64 data URL
    const personalityImageUrl = await compressImageToDataURL(`cat_icon/${currentPersonalityType}.png`);

    // 将用户上传的猫咪照片压缩
    const catPhotoUrl = await compressImageToDataURL(uploadedCatPhotoFile);

    updateAIStatus('正在提交生成任务...');

    // 提交生成任务
    // input_images[0] (image 1): 性格结果图（包含装扮场景）
    // input_images[1] (image 2): 用户猫咪照片（包含猫咪真实外观）
    const prediction = await submitGeneration(AI_PROMPT, [personalityImageUrl, catPhotoUrl]);

    updateAIStatus('正在排队等待...');

    // 轮询状态直到完成
    const result = await pollStatus(prediction.id);

    // 显示生成结果
    const resultImg = document.getElementById('ai-result-image');
    resultImg.src = result.output;
    loadingSection.style.display = 'none';
    resultSection.style.display = 'block';
  } catch (error) {
    console.error('AI generation error:', error);
    loadingSection.style.display = 'none';
    errorSection.style.display = 'block';
    const errorMsg = document.getElementById('ai-error-message');
    if (errorMsg) {
      errorMsg.textContent = error.message || 'AI 生成失败，请稍后重试';
    }
  } finally {
    generateBtn.disabled = !uploadedCatPhoto;
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

// 下载 AI 生成的图片
function downloadAIImage() {
  const img = document.getElementById('ai-result-image');
  if (!img || !img.src) return;

  const link = document.createElement('a');
  link.href = img.src;
  link.download = `${catName}-${currentPersonalityType}-AI.png`;
  link.click();
}

// 从错误状态重试
function retryAI() {
  const generateBtn = document.getElementById('ai-generate-btn');
  const errorSection = document.getElementById('ai-error');

  errorSection.style.display = 'none';
  generateBtn.style.display = '';
  generateBtn.disabled = !uploadedCatPhoto;
}
