// EdgeOne Edge Function - 代理 Replicate 生成的图片
// GET /api/image/proxy?url=https://replicate.delivery/...

export async function onRequest(context) {
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
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const url = new URL(context.request.url);
    const imageUrl = url.searchParams.get('url');

    if (!imageUrl) {
      return new Response('Missing url parameter', { status: 400 });
    }

    // 只允许代理 Replicate 的图片域名
    const parsedUrl = new URL(imageUrl);
    if (!parsedUrl.hostname.endsWith('replicate.delivery') && !parsedUrl.hostname.endsWith('replicate.com')) {
      return new Response('Forbidden: only replicate domains allowed', { status: 403 });
    }

    // 从 Replicate CDN 获取图片
    const response = await fetch(imageUrl);

    if (!response.ok) {
      return new Response('Failed to fetch image', { status: response.status });
    }

    // 透传图片内容，添加缓存头
    return new Response(response.body, {
      status: 200,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'image/png',
        'Cache-Control': 'public, max-age=86400',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Image proxy error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
