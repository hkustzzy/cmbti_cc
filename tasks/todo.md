# CMBTI 结果页优化

## 变更清单

- [x] 1. 更新 `personalityData` — 改 6 个 title + 加 16 个 quote (script.js)
  - INFJ: 灵性导师 → 灵性读心怪
  - ENFJ: 和平大使 → 猫界和事佬
  - INFP: 治愈系诗人 → 窗帘后的哲学家
  - ISTJ: 老派绅士 → 活体闹钟
  - ISFP: 艺术家 → 傲娇艺术家
  - ESFP: 聚光灯之王 → 猫戏之王
  - 16 个类型全部新增 `quote` 字段

- [x] 2. 同步更新 `cmbti_v2.md` 标签文案

- [x] 3. 更新 `index.html`
  - 引入 qrcode.js CDN
  - 结果页新增 `#share-card` 紧凑布局（猫图 + 类型称号 + 金句 + 二维码+品牌水印）
  - 描述文案移到卡片外独立区域

- [x] 4. 新增 `#share-card` CSS 样式 (style.css)
  - 紧凑一屏截图友好布局
  - 金句用醒目红色
  - 二维码 + 品牌水印底部排列
  - 响应式适配

- [x] 5. 更新 `showResult()` (script.js)
  - 填充金句到 `#personality-quote`
  - 生成二维码到 `#share-qrcode`

- [x] 6. 重构 `downloadResult()` canvas 绘制 (script.js)
  - 新布局: 猫图 → 类型+称号 → 金句 → 二维码+水印
  - 尺寸 750×1000 手机屏比例
  - 新增 `drawQRCodeToCanvas()` 辅助函数
  - 新增 `roundRect()` 辅助函数

- [x] 7. 同步更新 `downloadAIImage()` 布局 (replicate-api.js)
  - 与 downloadResult 一致的新布局
  - 金句 + 二维码 + 品牌水印

## 验证步骤
- [ ] `python3 -m http.server 8000` 启动本地服务
- [ ] 完成测试流程，检查结果页显示
- [ ] 验证截图卡片一屏完整
- [ ] 验证保存图片功能（canvas 包含完整信息 + 二维码）
