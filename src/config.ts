/**
 * SBTI API 配置
 * 配置AI图像生成API - 支持OpenAI格式和自定义API
 */

// API类型
export type APIFormat = 'openai' | 'custom';

// 默认API配置
export const DEFAULT_API_CONFIG = {
  // API基础URL（如 https://yunwu.ai）
  baseUrl: 'https://yunwu.ai',

  // API端点路径（如 /v1/images/generations）
  apiEndpoint: '/v1/images/generations',

  // API密钥
  apiKey: '',

  // 是否启用API生成
  enableAPI: false,

  // API格式类型
  apiFormat: 'openai' as APIFormat,

  // 备用Canvas预览（API不可用时）
  enableCanvasPreview: true,
};

// 从localStorage加载配置
export const loadApiConfig = (): typeof DEFAULT_API_CONFIG => {
  try {
    const saved = localStorage.getItem('sbti_api_config');
    if (saved) {
      return { ...DEFAULT_API_CONFIG, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('加载配置失败:', e);
  }
  return DEFAULT_API_CONFIG;
};

// 保存配置到localStorage
export const saveApiConfig = (config: Partial<typeof DEFAULT_API_CONFIG>): void => {
  try {
    const current = loadApiConfig();
    const updated = { ...current, ...config };
    localStorage.setItem('sbti_api_config', JSON.stringify(updated));
  } catch (e) {
    console.error('保存配置失败:', e);
  }
};

// 构建完整的API URL
export const getFullApiUrl = (): string => {
  const config = loadApiConfig();
  const baseUrl = config.baseUrl.replace(/\/$/, ''); // 移除末尾斜杠
  const endpoint = config.apiEndpoint.replace(/^\//, ''); // 移除开头斜杠
  return `${baseUrl}/${endpoint}`;
};

// 构建OpenAI格式的图像生成请求
export const buildOpenAIImageRequest = (
  userPhotoBase64: string,
  personality: {
    code: string;
    name: string;
    title: string;
    traits: string[];
    humor: string;
  },
  customPrompt?: string
): object => {
  const traitsText = personality.traits.join('、');

  // 构建提示词
  const prompt = customPrompt || `Convert this person into a Q-version anime chibi style character representing "${personality.name}" (${personality.code}) personality type.
Style: cute chibi anime illustration, big head, small body, large expressive eyes, pastel colors.
Character traits: ${traitsText}
Humor vibe: ${personality.humor}
Keep facial features recognizable but stylized in anime chibi format.
Background: colorful gradient with floating elements and cute decorations.`;

  // OpenAI格式请求
  return {
    model: "dall-e-3",
    prompt: prompt,
    n: 1,
    size: "1024x1024",
    response_format: "url",
  };
};

// 构建自定义格式的图像生成请求
export const buildCustomImageRequest = (
  userPhotoBase64: string,
  personality: {
    code: string;
    name: string;
    title: string;
    traits: string[];
    humor: string;
  },
  customPrompt?: string
): object => {
  const traitsText = personality.traits.join('、');

  const prompt = customPrompt || `Convert this person into a Q-version anime chibi style character representing "${personality.name}" (${personality.code}) personality type.
Style: cute chibi anime illustration, big head, small body, large expressive eyes, pastel colors.
Character traits: ${traitsText}
Humor vibe: ${personality.humor}
Keep facial features recognizable but stylized in anime chibi format.
Background: colorful gradient with floating elements and cute decorations.`;

  return {
    image: userPhotoBase64,
    prompt: prompt,
    personality: personality,
    negative_prompt: "realistic, photo, 3d render, deformed, ugly, bad quality",
    style: "chibi_anime",
    size: "1024x1024",
  };
};

// 构建AI图像生成请求（根据API格式选择）
export const buildImageRequest = (
  userPhotoBase64: string,
  personality: {
    code: string;
    name: string;
    title: string;
    traits: string[];
    humor: string;
  },
  customPrompt?: string,
  apiFormat: APIFormat = 'openai'
): object => {
  if (apiFormat === 'openai') {
    return buildOpenAIImageRequest(userPhotoBase64, personality, customPrompt);
  } else {
    return buildCustomImageRequest(userPhotoBase64, personality, customPrompt);
  }
};

// 解析OpenAI格式的响应
export const parseOpenAIResponse = (data: any): string | null => {
  // OpenAI标准响应格式: { data: [{ url: "..." }] }
  if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
    if (data.data[0].url) {
      return data.data[0].url;
    }
    // 或者 base64 格式: { data: [{ b64_json: "..." }] }
    if (data.data[0].b64_json) {
      return `data:image/png;base64,${data.data[0].b64_json}`;
    }
  }
  return null;
};

export default {
  DEFAULT_API_CONFIG,
  loadApiConfig,
  saveApiConfig,
  getFullApiUrl,
  buildImageRequest,
  buildOpenAIImageRequest,
  buildCustomImageRequest,
  parseOpenAIResponse,
};
