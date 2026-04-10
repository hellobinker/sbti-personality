/**
 * 图片生成器 - 将用户照片与SBTI人格元素合成
 */

// 等待图片加载
const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

// 生成自定义SBTI图片
export const generateCustomSBTI = async (
  userPhotoFile: File,
  personalityName: string,
  traits: string,
  humor: string
): Promise<string> => {
  try {
    // 将File转换为base64
    const base64 = await fileToBase64(userPhotoFile);

    // 加载用户照片
    const userPhoto = await loadImage(base64);

    // 创建Canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('无法创建Canvas上下文');
    }

    // 设置画布大小
    const width = 800;
    const height = 1000;
    canvas.width = width;
    canvas.height = height;

    // 绘制渐变背景
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(0.5, '#16213e');
    gradient.addColorStop(1, '#0f3460');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // 绘制装饰圆形
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = '#e94560';
    ctx.beginPath();
    ctx.arc(650, 200, 300, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#533483';
    ctx.beginPath();
    ctx.arc(150, 800, 250, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // 绘制用户照片 (圆形裁剪)
    const photoSize = 400;
    const photoX = width / 2 - photoSize / 2;
    const photoY = 150;
    ctx.save();
    ctx.beginPath();
    ctx.arc(width / 2, photoY + photoSize / 2, photoSize / 2, 0, Math.PI * 2);
    ctx.clip();

    // 绘制照片背景
    ctx.fillStyle = '#2a2a4a';
    ctx.fillRect(photoX, photoY, photoSize, photoSize);

    // 绘制照片
    ctx.drawImage(userPhoto, photoX, photoY, photoSize, photoSize);
    ctx.restore();

    // 照片边框
    ctx.strokeStyle = '#e94560';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(width / 2, photoY + photoSize / 2, photoSize / 2 + 4, 0, Math.PI * 2);
    ctx.stroke();

    // SBTI标签背景
    ctx.fillStyle = 'rgba(233, 69, 96, 0.9)';
    roundRect(ctx, width / 2 - 80, 580, 160, 50, 25);
    ctx.fill();

    // SBTI文字
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SBTI', width / 2, 615);

    // 人格名称
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 56px sans-serif';
    ctx.fillText(personalityName, width / 2, 700);

    // 特质描述
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '24px sans-serif';

    // 分割特质为多行
    const traitLines = splitText(ctx, traits, width - 100);
    traitLines.forEach((line, index) => {
      ctx.fillText(line, width / 2, 780 + index * 35);
    });

    // 幽默语录背景
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    roundRect(ctx, 50, 880, width - 100, 80, 15);
    ctx.fill();

    // 幽默语录
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = 'italic 20px sans-serif';
    const humorLines = splitText(ctx, `"${humor}"`, width - 140);
    humorLines.forEach((line, index) => {
      ctx.fillText(line, width / 2, 920 + index * 28);
    });

    // 返回图片URL
    return canvas.toDataURL('image/png', 1.0);
  } catch (error) {
    console.error('生成失败:', error);
    throw error;
  }
};

// 文件转Base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// 圆角矩形
const roundRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
};

// 文字分行
const splitText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
  const lines: string[] = [];
  let currentLine = '';

  for (const char of text) {
    const testLine = currentLine + char;
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = char;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
};

export default {
  generateCustomSBTI,
};
