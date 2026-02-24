// EdgeOne Edge Function - 提交 AI 图片生成任务
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
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const REPLICATE_API_TOKEN = context.env.REPLICATE_API_TOKEN;
  if (!REPLICATE_API_TOKEN) {
    return new Response(JSON.stringify({ error: 'Server configuration error: missing API token' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await context.request.json();
    const { prompt, input_images } = body;

    if (!prompt || !input_images || !Array.isArray(input_images) || input_images.length === 0) {
      return new Response(JSON.stringify({ error: 'Missing required fields: prompt, input_images' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 调用 Replicate flux-2-pro API
    const response = await fetch('https://api.replicate.com/v1/models/black-forest-labs/flux-2-pro/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: {
          prompt: prompt,
          input_images: input_images,
          aspect_ratio: '1:1',
          resolution: '1 MP',
          output_format: 'png',
          output_quality: 90,
          safety_tolerance: 5,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Replicate API error:', response.status, errorData);
      return new Response(JSON.stringify({
        error: 'Failed to create prediction',
        detail: errorData,
      }), {
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const prediction = await response.json();

    return new Response(JSON.stringify({
      id: prediction.id,
      status: prediction.status,
    }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}
