# 如何找到 LiblibAI "图片模型v2" 的 API 信息

## 🎯 最准确的方法:抓包

### 步骤 1: 打开开发者工具

1. 访问 https://www.xingliu.art/
2. 按 **F12** 打开开发者工具
3. 点击 **Network (网络)** 标签
4. 勾选 **Preserve log (保留日志)**

### 步骤 2: 进行一次真实测试

1. 在网站上选择 **"图片模型v2"**
2. 上传你的猫咪照片
3. 上传一张模板图
4. 点击生成

### 步骤 3: 查看 API 请求

在 Network 标签中:

1. 找到 **类型为 "fetch" 或 "xhr"** 的请求
2. 查看请求 URL,通常是:
   - `https://api.liblib.art/...`
   - 或 `https://www.xingliu.art/api/...`

3. 点击该请求,查看:

   **Headers (请求头):**
   ```
   Authorization: Bearer sk-xxxxx
   或
   X-API-Key: xxxxx
   ```

   **Request Payload (请求体):**
   ```json
   {
     "model": "???",  // 这就是模型ID!
     "image": "...",
     "reference_image": "...",  // 或其他名字
     ...
   }
   ```

### 步骤 4: 记录以下信息

把这些信息发给我:

```
1. API URL:
   完整的请求地址

2. 请求头 (Headers):
   Authorization 的格式

3. 请求体 (Request Payload):
   完整的 JSON 结构

4. 响应 (Response):
   返回数据的格式
```

## 📸 需要截图的地方

请截图给我:
1. Network 标签中的请求列表
2. 请求的 Headers
3. 请求的 Payload
4. 响应的 Response

---

## 🔍 常见的 LiblibAI API 格式

根据类似服务,可能的格式:

### 格式 A: 标准格式
```json
{
  "model": "universal-image-v2",
  "images": [
    "base64图1",
    "base64图2"
  ],
  "prompt": "提示词"
}
```

### 格式 B: 分离格式
```json
{
  "model_id": "img2img-v2",
  "input_image": "猫咪照片base64",
  "control_image": "模板图base64",
  "prompt": "提示词"
}
```

### 格式 C: URL 格式
```json
{
  "task_type": "image_variation",
  "source_image": "图片URL",
  "reference_images": ["模板URL"],
  "parameters": {...}
}
```

---

## 💡 如果找不到文档

你也可以:
1. 在星流 AI 网站上找 **"开发者"** 或 **"API"** 入口
2. 查看个人中心是否有 **API Key 管理**
3. 联系客服询问 API 文档地址

---

把抓包的信息发给我,我立即帮你实现! 🚀
