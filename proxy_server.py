#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
LiblibAI API 代理服务器 (Python 版本)
基于官方示例代码实现
"""

import hmac
import hashlib
import base64
import time
import uuid
import json
from flask import Flask, request, jsonify
import requests

# API 配置
ACCESS_KEY = '***REDACTED_ACCESS_KEY***'
SECRET_KEY = '***REDACTED_SECRET_KEY***'
BASE_URL = 'https://openapi.liblibai.cloud'

app = Flask(__name__)

print('🔑 使用的密钥:')
print(f'   AccessKey: {ACCESS_KEY}')
print(f'   SecretKey: {SECRET_KEY[:10]}...')


def generate_signature(uri: str, timestamp: int, nonce: str) -> str:
    """生成签名 (基于官方示例)"""
    data = uri + "&" + str(timestamp) + "&" + str(nonce)
    print(f'🔐 签名内容: {data}')

    hmac_code = hmac.new(
        SECRET_KEY.encode(),
        data.encode(),
        hashlib.sha1
    ).digest()

    # 使用 urlsafe_b64encode 并移除尾部等号
    signature = base64.urlsafe_b64encode(hmac_code).rstrip(b'=').decode()
    print(f'📝 签名: {signature}')
    return signature


def build_url_with_signature(api_path: str) -> str:
    """构建带签名的 URL"""
    timestamp = int(time.time() * 1000)
    nonce = uuid.uuid1()  # 保留连字符
    signature = generate_signature(api_path, timestamp, nonce)

    url = f'{BASE_URL}{api_path}?AccessKey={ACCESS_KEY}&Signature={signature}&Timestamp={timestamp}&SignatureNonce={nonce}'
    return url


def proxy_request(api_path: str, body: dict = None) -> tuple:
    """转发请求到 LiblibAI"""
    url = build_url_with_signature(api_path)

    print(f'📤 转发请求:')
    print(f'   API路径: {api_path}')
    print(f'   完整URL: {url}')

    headers = {'Content-Type': 'application/json'}

    if body:
        print(f'   请求体: {body}')

    response = requests.post(url, headers=headers, json=body or {})
    print(f'✅ API 响应 ({response.status_code}): {response.text[:200]}')

    return response.status_code, response.text, response.headers


@app.route('/api/upload/signature', methods=['OPTIONS', 'POST', 'GET'])
def get_upload_signature():
    """获取 OSS 上传签名"""
    if request.method == 'OPTIONS':
        return '', 200, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
            'Access-Control-Allow-Headers': 'Content-Type'
        }

    # 获取文件名参数并打印
    file_name = None
    if request.method == 'POST':
        body = request.get_json() or {}
        file_name = body.get('fileName') or body.get('name') or body.get('filename')
        print(f'📝 请求体: {json.dumps(body, ensure_ascii=False)}')
    else:
        file_name = request.args.get('fileName') or request.args.get('name') or request.args.get('filename')

    print(f'📝 获取文件名: {file_name}')

    # 如果提供文件名，构建URL参数
    api_path = '/api/generate/upload/signature'
    if file_name:
        # 尝试不同的参数名称
        api_path = '/api/generate/upload/signature'
    else:
        # 不提供文件名，使用默认
        api_path = '/api/generate/upload/signature'

    status_code, response_text, _ = proxy_request(api_path)
    print(f'📋 API 响应完整内容: {response_text}')

    # 解析响应
    try:
        response_data = json.loads(response_text)
        # 如果是错误，打印响应
        if response_data.get('code') != 0:
            print(f'❌ API 返回错误: code={response_data.get("code")}, msg={response_data.get("msg")}')
        return jsonify(response_data), status_code, {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        }
    except json.JSONDecodeError as e:
        print(f'❌ JSON 解析错误: {e}')
        return jsonify({'error': 'Invalid JSON response'}), 500, {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        }


@app.route('/api/kontext/img2img', methods=['OPTIONS', 'POST'])
def kontext_img2img():
    """Kontext 图生图"""
    if request.method == 'OPTIONS':
        return '', 200, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    body = request.get_json() or {}
    status_code, response_text, _ = proxy_request('/api/generate/kontext/img2img', body)
    return jsonify(json.loads(response_text)), status_code, {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    }


@app.route('/api/webui/img2img', methods=['OPTIONS', 'POST'])
def webui_img2img():
    """WebUI 图生图 (官方示例端点)"""
    if request.method == 'OPTIONS':
        return '', 200, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    body = request.get_json() or {}
    status_code, response_text, _ = proxy_request('/api/generate/webui/img2img', body)

    res_data = json.loads(response_text)
    # 如果成功返回任务ID，设置 CORS 允许跨域
    if res_data.get('code') == 0 and 'data' in res_data and 'generateUuid' in res_data['data']:
        print(f'任务提交成功，UUID: {res_data["data"]["generateUuid"]}')

    return jsonify(res_data), status_code, {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    }


@app.route('/api/webui/status', methods=['OPTIONS', 'POST'])
def webui_status():
    """WebUI 查询生成状态"""
    if request.method == 'OPTIONS':
        return '', 200, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    body = request.get_json() or {}
    status_code, response_text, _ = proxy_request('/api/generate/webui/status', body)
    return jsonify(json.loads(response_text)), status_code, {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    }


@app.route('/api/status', methods=['OPTIONS', 'POST'])
def get_status():
    """查询生成状态 (通用)"""
    if request.method == 'OPTIONS':
        return '', 200, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    body = request.get_json() or {}
    status_code, response_text, _ = proxy_request('/api/generate/webui/status', body)
    return jsonify(json.loads(response_text)), status_code, {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    }


@app.route('/api/<path:path>', methods=['OPTIONS', 'POST'])
def proxy_generic(path):
    """代理通用请求"""
    if request.method == 'OPTIONS':
        return '', 200, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    status_code, response_text, _ = proxy_request(f'/api/{path}', request.get_json() or {})
    return jsonify(json.loads(response_text)), status_code, {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    }


if __name__ == '__main__':
    print('🚀 LiblibAI 代理服务器已启动 (Python 版本)')
    print('📡 监听端口: http://localhost:3000')
    print('')
    print('支持的端点:')
    print('  POST /api/webui/img2img    - WebUI 图生图 (推荐)')
    print('  POST /api/webui/status     - WebUI 查询状态')
    print('  POST /api/kontext/img2img  - Kontext 图生图')
    print('  POST /api/upload/signature - 获取上传签名')
    print('')
    print('✅ 准备就绪,等待请求...')
    print('='*50)
    app.run(host='0.0.0.0', port=3000, debug=False)
