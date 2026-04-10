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

  // API端点路径（如 /v1/chat/completions）
  apiEndpoint: '/v1/chat/completions',

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

// 构建自定义格式的图像生成请求（Chat Completions 格式）
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

  // Chat Completions 格式
  return {
    model: "nano-banana-2",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: prompt
          },
          {
            type: "image_url",
            image_url: {
              url: userPhotoBase64
            }
          }
        ]
      }
    ],
    max_tokens: 2048,
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

// 解析Chat Completions格式的响应（用于 Nano Banana 等模型）
export const parseChatCompletionsResponse = (data: any): string | null => {
  // Chat completions 返回格式: { choices: [{ message: { content: "..." } }] }
  // 可能是图片URL、base64或文本描述
  if (data?.choices && Array.isArray(data.choices) && data.choices.length > 0) {
    const content = data.choices[0]?.message?.content;

    if (content) {
      // 如果是完整的 data URL（base64图片）
      if (content.startsWith('data:image')) {
        return content;
      }
      // 如果是完整的 http URL
      if (content.startsWith('http')) {
        return content;
      }
      // 尝试解析JSON（可能是 { url: "...", ... } 或 { image_url: "...", ... }）
      try {
        const parsed = JSON.parse(content);
        if (parsed.url) return parsed.url;
        if (parsed.image_url) return parsed.image_url;
        if (parsed.image) return parsed.image.startsWith('data:') ? parsed.image : `data:image/png;base64,${parsed.image}`;
        if (parsed.b64_json) return `data:image/png;base64,${parsed.b64_json}`;
      } catch (e) {
        // 不是JSON，直接返回内容
        return content;
      }
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
  parseChatCompletionsResponse,
};
