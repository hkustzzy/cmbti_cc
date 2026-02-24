// LiblibAI API 代理服务器
// 解决浏览器 CORS 跨域问题

const http = require('http');
const https = require('https');
const crypto = require('crypto');

// 从 liblib-config.js 读取配置
const ACCESS_KEY = '***REDACTED_ACCESS_KEY***';
const SECRET_KEY = '***REDACTED_SECRET_KEY***';
const BASE_URL = 'openapi.liblibai.cloud';

console.log('🔑 使用的密钥:');
console.log('   AccessKey:', ACCESS_KEY);
console.log('   SecretKey:', SECRET_KEY.substring(0, 10) + '...');

// 生成签名
function generateSignature(uri, timestamp, nonce) {
    const content = `${uri}&${timestamp}&${nonce}`;
    console.log('🔐 签名内容:', content);
    console.log('🔐 SecretKey 长度:', SECRET_KEY.length);

    const hmac = crypto.createHmac('sha1', SECRET_KEY);
    hmac.update(content, 'utf8');
    const base64Digest = hmac.digest('base64');
    console.log('📝 签名(Raw Base64):', base64Digest);

    const signature = base64Digest
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

    console.log('📝 生成签名(Base64URL):', signature);
    return signature;
}

// 生成 UUID (不带连字符)
function generateUUID() {
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// 转发请求到 LiblibAI
function proxyRequest(clientReq, clientRes, uri, body) {
    const timestamp = Date.now().toString();
    const nonce = generateUUID();
    const signature = generateSignature(uri, timestamp, nonce);

    console.log(`📤 转发请求: ${uri}`);
    console.log(`   完整 URL: https://${BASE_URL}${uri}`);
    console.log(`   Timestamp: ${timestamp}`);
    console.log(`   Nonce: ${nonce}`);
    console.log(`   AccessKey: ${ACCESS_KEY}`);
    console.log(`   Signature: ${signature}`);
    console.log(`   原始请求体:`, body || '(空)');

    // 使用阿里云 API 网关标准格式 (小写 x-ca- 前缀)
    const options = {
        hostname: BASE_URL,
        port: 443,
        path: uri,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-ca-key': ACCESS_KEY,
            'x-ca-signature': signature,
            'x-ca-signature-nonce': nonce,
            'x-ca-timestamp': timestamp
        }
    };

    console.log('📋 最终请求头:', JSON.stringify(options.headers, null, 2));

    const apiReq = https.request(options, (apiRes) => {
        let data = '';

        apiRes.on('data', (chunk) => {
            data += chunk;
        });

        apiRes.on('end', () => {
            console.log(`✅ API 响应 (${apiRes.statusCode}):`, data.substring(0, 200));

            // 设置 CORS 响应头
            clientRes.writeHead(apiRes.statusCode, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            });
            clientRes.end(data);
        });
    });

    apiReq.on('error', (error) => {
        console.error('❌ API 请求失败:', error.message);
        clientRes.writeHead(500, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        });
        clientRes.end(JSON.stringify({ error: error.message }));
    });

    // 只在有内容时才写入 body
    if (body && body !== '{}') {
        apiReq.write(body);
    }
    apiReq.end();
}

// 创建代理服务器
const server = http.createServer((req, res) => {
    // 处理 CORS 预检请求
    if (req.method === 'OPTIONS') {
        res.writeHead(200, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        res.end();
        return;
    }

    // 只处理 POST 请求
    if (req.method !== 'POST') {
        res.writeHead(405, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({ error: 'Method not allowed' }));
        return;
    }

    // 读取请求体
    let requestBody = '';
    req.on('data', (chunk) => {
        requestBody += chunk;
    });

    req.on('end', () => {
        // 根据请求路径转发到对应的 API 端点
        const url = req.url;

        if (url === '/api/upload/signature') {
            // 获取 OSS 上传签名
            proxyRequest(req, res, '/api/generate/upload/signature', requestBody);
        } else if (url === '/api/kontext/img2img') {
            // Kontext 图生图
            proxyRequest(req, res, '/api/generate/kontext/img2img', requestBody);
        } else if (url === '/api/status') {
            // 查询生成状态
            proxyRequest(req, res, '/api/generate/status', requestBody);
        } else {
            res.writeHead(404, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify({ error: 'Not found' }));
        }
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log('🚀 LiblibAI 代理服务器已启动');
    console.log(`📡 监听端口: http://localhost:${PORT}`);
    console.log('');
    console.log('支持的端点:');
    console.log('  POST /api/upload/signature   - 获取 OSS 上传签名');
    console.log('  POST /api/kontext/img2img    - Kontext 图生图');
    console.log('  POST /api/status             - 查询生成状态');
    console.log('');
    console.log('✅ 准备就绪,等待请求...');
});
