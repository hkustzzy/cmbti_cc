# LiblibAI API 配置指南

## 📝 如何获取 API 信息

### 步骤 1: 获取 API Key

1. 访问 https://www.xingliu.art/
2. 登录你的账号
3. 进入**个人中心** 或 **设置**
4. 找到 **API Keys** 或 **开发者选项**
5. 创建或复制你的 API Key

### 步骤 2: 找到"图片模型v2"的模型 ID

**方法 A: 查看文档**
1. 登录飞书文档: https://liblibai.feishu.cn/wiki/UAMVw67NcifQHukf8fpccgS5n6d
2. 搜索"图片模型v2"或"全能图片模型"
3. 找到对应的 `model_id`

**方法 B: 查看网络请求(推荐)**
1. 打开 https://www.xingliu.art/
2. 按 F12 打开开发者工具
3. 切换到 **Network** (网络)标签
4. 选择"图片模型v2",上传两张图片进行测试
5. 在网络请求中找到发送的 API 请求
6. 查看请求的:
   - URL (API 端点)
   - Headers (认证方式)
   - Payload (请求参数,特别是 model_id)

### 步骤 3: 填写配置

打开 `liblib-config.js` 文件,填写:

```javascript
const LIBLIB_CONFIG = {
    // 从步骤 1 获取
    API_KEY: '你的API Key',

    // 从步骤 2 获取
    API_URL: 'https://api.liblib.art/...',
    MODEL_ID: 'image-model-v2',  // 实际的模型 ID

    // 其他参数根据实际情况调整
    REFERENCE_IMAGE_PARAM: 'reference_image', // 或 style_image
};
```

## 🔍 调试方法

如果 API 调用失败:

1. 打开浏览器控制台 (F12 → Console)
2. 点击"生成专属形象"按钮
3. 查看控制台输出的错误信息和完整响应
4. 根据错误信息调整配置

## 📞 需要帮助?

把以下信息发给我:
1. 控制台的错误信息
2. Network 标签中的实际请求内容
3. API 返回的完整响应

我会帮你调试!
