// EdgeOne Edge Function - AI 图片生成（火山方舟 Seedream 5.0 lite）
// POST /api/generate

export async function onRequest(context) {
  // 处理 CORS 预检请求
  if (context.request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  if (context.request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  const ARK_API_KEY = context.env.ARK_API_KEY;
  if (!ARK_API_KEY) {
    return new Response(JSON.stringify({ error: 'Server configuration error: missing ARK_API_KEY' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  try {
    const body = await context.request.json();
    const { prompt, images } = body;

    if (!prompt || !images || !Array.isArray(images) || images.length === 0) {
      return new Response(JSON.stringify({ error: 'Missing required fields: prompt, images' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    // 调用火山方舟 Seedream 5.0 lite API（同步接口）
    const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ARK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'doubao-seedream-5-0-260128',
        prompt: prompt,
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
      return new Response(JSON.stringify({
        error: 'AI 生成失败，请稍后重试',
        detail: errorData,
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    const result = await response.json();

    // 检查是否有错误
    if (result.error) {
      return new Response(JSON.stringify({
        error: result.error.message || 'Seedream API error',
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    // 提取生成的图片
    const imgData = result.data && result.data[0];
    let imageOutput;
    if (imgData && imgData.b64_json) {
      imageOutput = `data:image/jpeg;base64,${imgData.b64_json}`;
    } else if (imgData && imgData.url) {
      imageOutput = imgData.url;
    }

    if (!imageOutput) {
      return new Response(JSON.stringify({ error: 'No image in response' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    // 返回统一格式
    return new Response(JSON.stringify({
      status: 'succeeded',
      output: imageOutput,
      usage: result.usage || {},
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}
