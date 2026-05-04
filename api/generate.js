// Vercel Serverless Function - CMBTI AI 图片生成代理（火山方舟 Seedream 5.0 lite）
// 环境变量：ARK_API_KEY

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
        response_format: 'b64_json',
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
    if (imgData && imgData.b64_json) {
      imageOutput = `data:image/jpeg;base64,${imgData.b64_json}`;
    } else if (imgData && imgData.url) {
      imageOutput = imgData.url;
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
