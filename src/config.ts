/**
 * SBTI API 配置
 * 配置AI图像生成API
 */

// 默认API配置
export const DEFAULT_API_CONFIG = {
  // API端点URL
  apiEndpoint: '',

  // API密钥（可选）
  apiKey: '',

  // 是否启用API生成
  enableAPI: false,

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

// 构建AI图像生成请求
export const buildImageRequest = (
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

  // 如果提供了自定义提示词，使用它；否则使用默认提示词
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

export default {
  DEFAULT_API_CONFIG,
  loadApiConfig,
  saveApiConfig,
  buildImageRequest,
};
