import React, { useState, useEffect } from 'react';
import { loadApiConfig, saveApiConfig, getFullApiUrl, APIFormat } from './config';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [baseUrl, setBaseUrl] = useState('https://yunwu.ai');
  const [apiEndpoint, setApiEndpoint] = useState('/v1/chat/completions');
  const [apiKey, setApiKey] = useState('');
  const [enableAPI, setEnableAPI] = useState(false);
  const [apiFormat, setApiFormat] = useState<APIFormat>('openai');
  const [enableCanvasPreview, setEnableCanvasPreview] = useState(true);
  const [saved, setSaved] = useState(false);

  // 加载配置
  useEffect(() => {
    if (isOpen) {
      const config = loadApiConfig();
      setBaseUrl(config.baseUrl);
      setApiEndpoint(config.apiEndpoint);
      setApiKey(config.apiKey);
      setEnableAPI(config.enableAPI);
      setApiFormat(config.apiFormat);
      setEnableCanvasPreview(config.enableCanvasPreview);
      setSaved(false);
    }
  }, [isOpen]);

  // 保存配置
  const handleSave = () => {
    saveApiConfig({
      baseUrl,
      apiEndpoint,
      apiKey,
      enableAPI,
      apiFormat,
      enableCanvasPreview,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // 测试API连接
  const testConnection = async () => {
    try {
      const fullUrl = getFullApiUrl();
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {},
      });
      if (response.ok) {
        alert('API连接成功！');
      } else {
        alert(`API返回错误: ${response.status}`);
      }
    } catch (error) {
      alert(`连接失败: ${error}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 shadow-2xl border border-white/10 animate-modal-in overflow-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 标题 */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-black text-white">
            API设置
          </h3>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all"
          >
            ✕
          </button>
        </div>

        {/* API开关 */}
        <div className="mb-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              className={`w-14 h-8 rounded-full transition-all duration-300 ${
                enableAPI ? 'bg-pink-500' : 'bg-white/20'
              }`}
              onClick={() => setEnableAPI(!enableAPI)}
            >
              <div
                className={`w-6 h-6 bg-white rounded-full shadow-lg transform transition-all duration-300 mt-1 ${
                  enableAPI ? 'translate-x-7' : 'translate-x-1'
                }`}
              ></div>
            </div>
            <span className="text-white font-semibold">启用AI图像生成API</span>
          </label>
          <p className="text-white/40 text-sm mt-2">
            开启后可使用AI生成专属SBTI图片
          </p>
        </div>

        {/* API配置 */}
        <div className="space-y-4">
          {/* API基础地址 */}
          <div>
            <label className="block text-white/80 text-sm mb-2">
              API基础地址
            </label>
            <input
              type="url"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://yunwu.ai"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-pink-500/50 transition-colors"
            />
            <p className="text-white/40 text-xs mt-1">
              输入你的API服务地址（如 https://yunwu.ai）
            </p>
          </div>

          {/* API端点 */}
          <div>
            <label className="block text-white/80 text-sm mb-2">
              API端点
            </label>
            <input
              type="text"
              value={apiEndpoint}
              onChange={(e) => setApiEndpoint(e.target.value)}
              placeholder="/v1/chat/completions"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-pink-500/50 transition-colors"
            />
            <p className="text-white/40 text-xs mt-1">
              API端点路径（如 /v1/chat/completions）
            </p>
          </div>

          {/* 完整URL预览 */}
          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <p className="text-white/50 text-xs mb-1">完整API地址：</p>
            <p className="text-pink-400 text-sm font-mono break-all">
              {getFullApiUrl()}
            </p>
          </div>

          {/* API密钥 */}
          <div>
            <label className="block text-white/80 text-sm mb-2">
              API密钥
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="输入API密钥"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-pink-500/50 transition-colors"
            />
            <p className="text-white/40 text-xs mt-1">
              如API需要认证，输入密钥
            </p>
          </div>

          {/* API格式选择 */}
          <div>
            <label className="block text-white/80 text-sm mb-2">
              API格式
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setApiFormat('openai')}
                className={`py-3 px-4 rounded-xl font-semibold transition-all ${
                  apiFormat === 'openai'
                    ? 'bg-pink-500 text-white shadow-lg'
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                OpenAI格式
              </button>
              <button
                onClick={() => setApiFormat('custom')}
                className={`py-3 px-4 rounded-xl font-semibold transition-all ${
                  apiFormat === 'custom'
                    ? 'bg-purple-500 text-white shadow-lg'
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                自定义格式
              </button>
            </div>
            <p className="text-white/40 text-xs mt-2">
              {apiFormat === 'openai'
                ? '使用 OpenAI/DALL-E 兼容的图片生成格式'
                : '使用 Chat Completions 格式（如 Nano Banana 等多模态模型）'}
            </p>
          </div>

          {/* Canvas预览开关 */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                className={`w-14 h-8 rounded-full transition-all duration-300 ${
                  enableCanvasPreview ? 'bg-purple-500' : 'bg-white/20'
                }`}
                onClick={() => setEnableCanvasPreview(!enableCanvasPreview)}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full shadow-lg transform transition-all duration-300 mt-1 ${
                    enableCanvasPreview ? 'translate-x-7' : 'translate-x-1'
                  }`}
                ></div>
              </div>
              <span className="text-white font-medium">启用Canvas即时预览</span>
            </label>
            <p className="text-white/40 text-sm mt-2">
              API不可用时，显示照片合成预览
            </p>
          </div>
        </div>

        {/* 测试按钮 */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={testConnection}
            className="flex-1 py-3 rounded-xl font-semibold transition-all bg-white/10 text-white hover:bg-white/20"
          >
            测试连接
          </button>
        </div>

        {/* API格式说明 */}
        <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
          <p className="text-white/80 text-sm font-semibold mb-2">API格式要求</p>
          {apiFormat === 'openai' ? (
            <>
              <p className="text-white/50 text-xs mb-2">
                OpenAI/DALL-E 格式的POST请求：
              </p>
              <pre className="text-white/60 text-xs bg-black/30 p-3 rounded-lg overflow-x-auto">
{`POST ${apiEndpoint}
Authorization: Bearer <API_KEY>
Content-Type: application/json

{
  "model": "dall-e-3",
  "prompt": "你的AI生成提示词",
  "n": 1,
  "size": "1024x1024"
}`}
              </pre>
              <p className="text-white/50 text-xs mt-2">
                响应格式: {"{ data: [{ url: '...' }] }"} 或 {"{ data: [{ b64_json: '...' }] }"}
              </p>
            </>
          ) : (
            <>
              <p className="text-white/50 text-xs mb-2">
                Chat Completions 格式（Nano Banana 等）：
              </p>
              <pre className="text-white/60 text-xs bg-black/30 p-3 rounded-lg overflow-x-auto">
{`POST ${apiEndpoint}
Authorization: Bearer <API_KEY>
Content-Type: application/json

{
  "model": "nano-banana-2",
  "messages": [{
    "role": "user",
    "content": [
      {"type": "text", "text": "生成图片的提示词"},
      {"type": "image_url", "image_url": {"url": "data:image/..."}}
    ]
  }]
}`}
              </pre>
              <p className="text-white/50 text-xs mt-2">
                响应格式: {"{ choices: [{ message: { content: 'url或base64' }}] }"}
              </p>
            </>
          )}
        </div>

        {/* 保存按钮 */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSave}
            className="flex-1 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
          >
            {saved ? '已保存' : '保存设置'}
          </button>
          <button
            onClick={onClose}
            className="px-6 py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
