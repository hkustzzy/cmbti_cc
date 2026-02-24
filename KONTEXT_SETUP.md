# 🎨 Kontext 图生图 API 集成指南

## ✅ 已完成的工作

根据官方文档 (https://liblibai.feishu.cn/wiki/UAMVw67NcifQHukf8fpccgS5n6d) 实现了完整的 LiblibAI Kontext API 集成:

1. ✅ **HMAC-SHA1 签名认证** - 使用 Web Crypto API 实现
2. ✅ **图片上传到 OSS** - 先获取签名,再上传文件
3. ✅ **Kontext 图生图调用** - 使用模板 UUID 1c0a9712b3d84e1b8a9f49514a46d88c
4. ✅ **异步轮询结果** - 每 2 秒轮询一次,最多 60 次
5. ✅ **错误处理和日志** - 详细的控制台日志输出

---

## 📝 配置步骤

### 步骤 1: 获取 API 密钥

1. 访问 **https://www.xingliu.art/**
2. 登录你的账号
3. 进入 **个人中心 → 开发者设置**
4. 获取以下信息:
   - **AccessKey** (类似: `LTAI5tF...`)
   - **SecretKey** (类似: `3xK9m2P...`)

### 步骤 2: 填写配置文件

编辑 `liblib-config.js`:

```javascript
const LIBLIB_CONFIG = {
    // ============ 认证信息 (必填) ============
    ACCESS_KEY: '粘贴你的 AccessKey',
    SECRET_KEY: '粘贴你的 SecretKey',

    // 其他配置已预设好,无需修改
    // ...
};
```

---

## 🧪 测试步骤

### 1. 启动代理服务器 (新增 - 必需!)

由于浏览器 CORS 跨域限制,需要先启动代理服务器:

```bash
cd /Users/ziyuanzhao/Documents/code/cmbti_cc
node proxy-server.js
```

你会看到:
```
🚀 LiblibAI 代理服务器已启动
📡 监听端口: http://localhost:3000
✅ 准备就绪,等待请求...
```

**保持这个窗口运行,不要关闭!**

### 2. 启动 Web 服务器 (新开一个终端窗口)

```bash
cd /Users/ziyuanzhao/Documents/code/cmbti_cc
python3 -m http.server 8000
```

### 3. 打开网站

在浏览器访问: **http://localhost:8000**

### 3. 完成测试并查看结果页

1. 输入猫咪名字
2. 完成 12 道测试题
3. 进入结果页面

### 4. 上传猫咪照片并生成

1. 点击 **"点击上传猫咪照片"**
2. 选择一张猫咪照片 (JPG/PNG)
3. 点击 **"生成专属形象"** 按钮
4. 等待 20-40 秒

### 5. 查看控制台日志 (F12)

打开浏览器开发者工具,查看详细流程:

```
🎨 开始 AI 生成流程...
📤 步骤 1: 上传猫咪照片到 OSS...
📝 请求 OSS 签名...
✅ 获取 OSS 签名成功
📤 上传文件到 OSS...
✅ 文件上传成功: https://...
📤 步骤 2: 处理模板图片...
🚀 步骤 3: 调用 Kontext API 生成图片...
✅ Kontext API 响应: {generateUuid: "..."}
⏳ 开始轮询生成状态...
🔄 轮询第 1 次...
📊 生成状态: PROCESSING
🔄 轮询第 2 次...
📊 生成状态: PROCESSING
...
✅ 生成成功! {imageUrl: "...", pointsCost: 12}
```

---

## 🔧 API 工作流程

完整的 API 调用流程如下:

```
1. 用户上传猫咪照片
   ↓
2. 调用 /api/generate/upload/signature
   获取 OSS 上传凭证
   ↓
3. 上传图片到 OSS
   获得图片 URL
   ↓
4. 调用 /api/generate/kontext/img2img
   提交生成任务 (猫咪照片 + 模板图)
   ↓
5. 获取 generateUuid
   ↓
6. 轮询 /api/generate/status
   每 2 秒查询一次
   ↓
7. 状态变为 SUCCESS
   获取生成的图片 URL
   ↓
8. 显示在页面上
```

---

## 🐛 常见问题

### 问题 1: "请先配置 ACCESS_KEY 和 SECRET_KEY"

**原因**: 没有在 `liblib-config.js` 中填写密钥

**解决**:
1. 访问 https://www.xingliu.art/
2. 个人中心 → 开发者设置
3. 复制 AccessKey 和 SecretKey
4. 填写到 `liblib-config.js` 中

---

### 问题 2: "获取 OSS 签名失败 (403)"

**原因**: AccessKey 或 SecretKey 错误,或签名计算错误

**解决**:
1. 检查密钥是否正确复制 (注意空格)
2. 查看控制台的详细错误信息
3. 确认账号有生成权限

---

### 问题 3: "上传到 OSS 失败"

**原因**: OSS 上传参数错误

**解决**:
1. 查看控制台的完整错误信息
2. 检查图片格式 (支持 JPG/PNG)
3. 检查图片大小 (建议 < 5MB)

---

### 问题 4: "Kontext API 错误 (400)"

**原因**: 请求参数错误

**可能原因**:
- 图片 URL 无效
- 模板 UUID 错误
- 参数格式不正确

**解决**:
1. 查看控制台中的请求参数
2. 确认图片 URL 可访问
3. 检查 `liblib-config.js` 中的参数设置

---

### 问题 5: "生成超时,请稍后重试"

**原因**:
- 生成时间过长 (超过 2 分钟)
- 网络连接不稳定

**解决**:
1. 检查网络连接
2. 等待一段时间后重试
3. 可以在 `liblib-config.js` 中调整超时时间:
   ```javascript
   POLLING: {
       interval: 2000,      // 轮询间隔 (毫秒)
       maxAttempts: 90,     // 增加最大轮询次数
       timeout: 180000      // 超时时间 3 分钟
   }
   ```

---

### 问题 6: "模板图片无法访问"

**原因**: 本地服务器路径的图片无法被 LiblibAI 访问

**解决方案 A** (推荐): 将模板图片也上传到 OSS
1. 在 `generateAIImage()` 中添加模板图片上传逻辑
2. 使用上传后的 URL

**解决方案 B**: 使用公网可访问的图片 URL
1. 将模板图片上传到图床 (如 imgur, 七牛云)
2. 修改 `cat_icon/` 路径为实际 URL

---

## 📊 API 参数说明

### 生成参数 (liblib-config.js)

```javascript
GENERATE_PARAMS: {
    // 模型版本
    model: 'pro',  // 'pro' (标准) 或 'max' (高质量,更贵)

    // 提示词 - 描述想要的效果
    prompt: '保持猫咪的样貌...',

    // 图片比例
    aspectRatio: '2:3',  // '1:1', '2:3', '3:2', '3:4', '4:3', '9:16', '16:9'

    // 引导系数 (1-20)
    guidance_scale: 3.5,  // 越高越贴近提示词,建议 3-7

    // 生成图片数量 (1-4)
    imgCount: 1
}
```

### 轮询配置

```javascript
POLLING: {
    interval: 2000,      // 轮询间隔 (毫秒)
    maxAttempts: 60,     // 最大轮询次数
    timeout: 120000      // 超时时间 (毫秒)
}
```

---

## 💰 费用说明

根据文档:
- **pro 模型**: 约 10-15 点数/张
- **max 模型**: 约 20-30 点数/张

每次生成会在控制台显示消耗的点数:
```
✅ 生成成功! {imageUrl: "...", pointsCost: 12}
```

---

## 📞 需要帮助?

如果遇到问题,请提供以下信息:

1. **浏览器控制台的完整日志** (F12 → Console)
2. **具体的错误信息**
3. **使用的图片格式和大小**

我会立即帮你调试! 🚀

---

## 🎯 下一步优化建议

1. **将模板图片上传到 OSS** - 避免本地路径问题
2. **添加进度条** - 显示具体的生成进度
3. **支持多张生成** - 一次生成 2-4 张供选择
4. **历史记录** - 保存之前生成的结果
5. **参数调整 UI** - 允许用户调整 guidance_scale 等参数
