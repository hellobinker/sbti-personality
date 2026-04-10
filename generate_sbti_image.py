#!/usr/bin/env python3
"""
SBTI AI Image Generator
使用AI模型生成用户专属的Q版卡通SBTI形象
"""

import os
import sys
import json
import base64
import time
from pathlib import Path

# 添加项目路径
sys.path.insert(0, str(Path(__file__).parent))

def generate_sbti_image(user_photo_base64: str, personality: dict) -> dict:
    """
    生成SBTI专属图片

    Args:
        user_photo_base64: 用户照片的base64编码
        personality: 人格信息字典，包含 code, name, title, traits, humor

    Returns:
        包含生成结果的字典
    """
    try:
        # 解码用户照片
        if ',' in user_photo_base64:
            user_photo_base64 = user_photo_base64.split(',')[1]

        image_data = base64.b64decode(user_photo_base64)

        # 保存用户照片
        timestamp = int(time.time())
        user_photo_path = f"/workspace/sbti-personality-test/public/user_photos/{timestamp}_user.png"

        with open(user_photo_path, 'wb') as f:
            f.write(image_data)

        # 构建AI提示词
        traits_text = '、'.join(personality.get('traits', []))
        code = personality.get('code', '')
        name = personality.get('name', '')
        humor = personality.get('humor', '')
        title = personality.get('title', '')

        # 详细的Q版动漫风格提示词
        prompt = f"""Transform this person into an adorable Q-version chibi anime character representing "{name}" ({code}) personality type.

Character Details:
- Personality: {title}
- Traits: {traits_text}
- Humor vibe: {humor}

Style Requirements:
- Cute chibi anime illustration style
- Big expressive head, small body
- Large sparkling eyes with highlights
- Soft pastel color palette
- Rosy cheeks and small mouth
- Fluffy hair with cute accessories
- Casual cute outfit matching personality

Background:
- Colorful gradient (purple to pink to blue)
- Floating sparkles and hearts
- Soft bokeh effect
- Add subtle personality-themed elements (books for intellectuals, coffee for social butterflies, etc.)

The character should look happy and cute while reflecting the {name} personality traits.
Keep facial features recognizable but fully stylized in anime chibi format.
High quality, detailed, professional anime art."""

        return {
            'success': True,
            'user_photo_url': f'/user_photos/{timestamp}_user.png',
            'prompt': prompt,
            'message': '照片已保存，请使用AI工具生成图片'
        }

    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }

def main():
    """命令行入口"""
    if len(sys.argv) < 3:
        print("Usage: python generate_sbti_image.py <base64_image> <personality_json>")
        print("Example: python generate_sbti_image.py '<base64>' '{\"code\":\"CTRL\",\"name\":\"拿捏者\",...}'")
        sys.exit(1)

    user_photo = sys.argv[1]
    personality = json.loads(sys.argv[2])

    result = generate_sbti_image(user_photo, personality)
    print(json.dumps(result, ensure_ascii=False))

if __name__ == '__main__':
    main()
