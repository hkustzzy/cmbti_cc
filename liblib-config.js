// LiblibAI API 配置文件 - Kontext 图生图模型
// 基于官方文档: https://liblibai.feishu.cn/wiki/UAMVw67NcifQHukf8fpccgS5n6d

const LIBLIB_CONFIG = {
    // ============ 认证信息 (必填) ============
    // 在 liblib.art 个人中心 → 开发者设置 获取
    ACCESS_KEY: 'CONFIGURED_VIA_ENV',
    SECRET_KEY: 'CONFIGURED_VIA_ENV',

    // ============ API 配置 ============
    BASE_URL: 'https://openapi.liblibai.cloud',

    // Kontext 图生图模板 UUID
    TEMPLATE_UUID: '1c0a9712b3d84e1b8a9f49514a46d88c',

    // ============ 生成参数 (基于官方示例) ============
    GENERATE_PARAMS: {
        // 上传的图片必须是网络可访问的 URL
        sourceImage: '', // 将在运行时动态设置

        // 提示词 - 描述想要的效果 (会与融合提示词组合)
        prompt: 'filmfotos, cute cat, masterpiece, best quality, finely detail, highres, 8k, beautiful and aesthetic, no watermark',

        // 生成图片数量 (1-4)
        imgCount: 1
    },

    // ============ 轮询配置 ============
    POLLING: {
        // 轮询间隔 (毫秒)
        interval: 2000,

        // 最大轮询次数 (避免无限等待)
        maxAttempts: 60,

        // 超时时间 (毫秒)
        timeout: 120000
    }
};

// 导出配置
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LIBLIB_CONFIG;
}
