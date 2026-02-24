// EdgeOne Edge Function - 查询 AI 图片生成任务状态
// GET /api/status/[id]

export async function onRequest(context) {
  // 处理 CORS 预检请求
  if (context.request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  if (context.request.method !== 'GET') {
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
    // 从 URL 路径中获取 prediction ID
    const url = new URL(context.request.url);
    const pathParts = url.pathname.split('/');
    const predictionId = pathParts[pathParts.length - 1];

    if (!predictionId) {
      return new Response(JSON.stringify({ error: 'Missing prediction ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 查询 Replicate prediction 状态
    const response = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Replicate API error:', response.status, errorData);
      return new Response(JSON.stringify({
        error: 'Failed to get prediction status',
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

    const result = {
      id: prediction.id,
      status: prediction.status,
    };

    // 如果成功，返回生成的图片 URL
    if (prediction.status === 'succeeded' && prediction.output) {
      result.output = prediction.output;
    }

    // 如果失败，返回错误信息
    if (prediction.status === 'failed') {
      result.error = prediction.error;
    }

    return new Response(JSON.stringify(result), {
      status: 200,
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
