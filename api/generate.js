// Vercel Serverless Function - CMBTI AI 图片生成代理（火山方舟 Seedream 5.0 lite）
// 环境变量：ARK_API_KEY, JSONBIN_KEY

const JSONBIN_ID = '69f89346856a682189a4e9aa';

// 异步存日志，不阻塞响应
async function logToJsonBin(record) {
  try {
    const key = process.env.JSONBIN_KEY;
    if (!key) return;

    // 读取现有记录
    const getResp = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_ID}/latest`, {
      headers: { 'X-Master-Key': key },
    });
    const data = await getResp.json();
    const records = (data.record && data.record.records) || [];

    // 追加新记录（最多保留 500 条）
    records.push(record);
    if (records.length > 500) records.splice(0, records.length - 500);

    // 写回
    await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_ID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': key,
      },
      body: JSON.stringify({ records }),
    });
  } catch (e) {
    console.error('[logToJsonBin] error:', e.message);
  }
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ARK_API_KEY = process.env.ARK_API_KEY;
  if (!ARK_API_KEY) {
    return res.status(500).json({ error: 'Missing ARK_API_KEY' });
  }

  try {
    const { prompt, images } = req.body;

    if (!prompt || !images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ error: 'Missing required fields: prompt, images' });
    }

    console.log(`[generate] prompt: ${prompt.substring(0, 60)}..., images: ${images.length}, sizes: ${images.map(i => Math.round(i.length/1024) + 'KB').join(', ')}`);

    const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ARK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'doubao-seedream-5-0-260128',
        prompt,
        image: images,
        size: '2K',
        sequential_image_generation: 'disabled',
        response_format: 'url',
        stream: false,
        watermark: false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Seedream API error:', response.status, errorData);
      return res.status(response.status).json({ error: 'AI 生成失败，请稍后重试' });
    }

    const result = await response.json();

    if (result.error) {
      return res.status(500).json({ error: result.error.message || 'Seedream API error' });
    }

    const imgData = result.data && result.data[0];
    let imageOutput;
    if (imgData && imgData.url) {
      // 打印 URL 到日志，方便在 Vercel Logs 里查看生成的图片（URL 24小时有效）
      console.log(`[generate] 生成成功! 图片URL: ${imgData.url}`);

      // 异步存到 JSONBin（不阻塞响应）
      logToJsonBin({
        time: new Date().toISOString(),
        imageUrl: imgData.url,
        prompt: prompt.substring(0, 100),
      });

      // 下载图片转 base64 返回给前端（解决跨域）
      const imgResp = await fetch(imgData.url);
      const imgBuf = await imgResp.arrayBuffer();
      const base64 = Buffer.from(imgBuf).toString('base64');
      imageOutput = `data:image/jpeg;base64,${base64}`;
    } else if (imgData && imgData.b64_json) {
      console.log(`[generate] 生成成功! (base64)`);
      imageOutput = `data:image/jpeg;base64,${imgData.b64_json}`;
    }

    if (!imageOutput) {
      return res.status(500).json({ error: 'No image in response' });
    }

    return res.status(200).json({
      status: 'succeeded',
      output: imageOutput,
      usage: result.usage || {},
    });
  } catch (error) {
    console.error('Function error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
