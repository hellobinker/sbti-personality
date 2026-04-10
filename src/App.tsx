import { useState, useEffect } from 'react';
import { SBTI_TYPES, getTypeByCode, SBTIType } from './sbti-types';
import { SBTI_QUESTIONS, calculateResult } from './sbti-questions';
import { loadApiConfig, buildImageRequest, parseOpenAIResponse } from './config';
import SettingsModal from './SettingsModal';
import './App.css';

type Page = 'home' | 'test' | 'result' | 'types';

function App() {
  const [page, setPage] = useState<Page>('home');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<SBTIType | null>(null);
  const [selectedType, setSelectedType] = useState<SBTIType | null>(null);
  const [showTypeDetail, setShowTypeDetail] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Photo generation states
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [userPhotoFile, setUserPhotoFile] = useState<File | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [usingAPI, setUsingAPI] = useState(false);

  // 测试中
  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);

    if (currentQuestion < SBTI_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // 测试完成
      const resultCode = calculateResult(newAnswers);
      const resultType = getTypeByCode(resultCode);
      setResult(resultType || null);
      setPage('result');
    }
  };

  // 重新测试
  const resetTest = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
    setPage('test');
  };

  // 返回首页
  const goHome = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
    setPage('home');
  };

  // 查看人格详情
  const viewTypeDetail = (type: SBTIType) => {
    setSelectedType(type);
    setShowTypeDetail(true);
  };

  // 处理照片上传
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('图片大小不能超过10MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setUserPhoto(event.target?.result as string);
        setUserPhotoFile(file);
        setGeneratedImage(null);
        setGenerationError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // 打开生成照片弹窗
  const openPhotoModal = () => {
    setShowPhotoModal(true);
    setUserPhoto(null);
    setUserPhotoFile(null);
    setGeneratedImage(null);
    setGenerationError(null);
  };

  // 使用AI生成专属SBTI图片
  const generateSBTIImage = async () => {
    if (!userPhotoFile || !result) return;

    setIsGenerating(true);
    setGenerationError(null);
    setUsingAPI(false);

    try {
      // 加载API配置
      const apiConfig = loadApiConfig();
      const traitsText = result.traits.join('、');

      // 将文件转换为base64
      const base64 = await fileToBase64(userPhotoFile);

      // 构建AI提示词
      const aiPrompt = `Convert this person into a Q-version anime chibi style character representing "${result.name}" (${result.code}) personality type.
Style: cute chibi anime illustration, big head, small body, large expressive eyes, pastel colors.
Character traits: ${traitsText}
Humor vibe: ${result.humor}
Keep facial features recognizable but stylized in anime chibi format.
Background: colorful gradient with floating elements and cute decorations.`;

      // 如果启用了自定义API，尝试调用
      if (apiConfig.enableAPI && apiConfig.apiEndpoint) {
        try {
          const requestBody = buildImageRequest(
            base64,
            {
              code: result.code,
              name: result.name,
              title: result.title,
              traits: result.traits,
              humor: result.humor,
            },
            aiPrompt,
            apiConfig.apiFormat
          );

          const headers: Record<string, string> = {
            'Content-Type': 'application/json',
          };

          if (apiConfig.apiKey) {
            headers['Authorization'] = `Bearer ${apiConfig.apiKey}`;
          }

          const response = await fetch(apiConfig.apiEndpoint, {
            method: 'POST',
            headers,
            body: JSON.stringify(requestBody),
          });

          if (response.ok) {
            const data = await response.json();

            // 优先尝试OpenAI格式解析
            let imageUrl: string | null = null;

            if (apiConfig.apiFormat === 'openai') {
              imageUrl = parseOpenAIResponse(data);
            }

            // 如果OpenAI解析失败，尝试其他格式
            if (!imageUrl) {
              if (typeof data === 'string') {
                imageUrl = data.startsWith('data:') || data.startsWith('http')
                  ? data
                  : `data:image/png;base64,${data}`;
              } else if (data.imageUrl) {
                imageUrl = data.imageUrl;
              } else if (data.image) {
                imageUrl = data.image.startsWith('data:') || data.image.startsWith('http')
                  ? data.image
                  : `data:image/png;base64,${data.image}`;
              } else if (data.url) {
                imageUrl = data.url;
              } else if (data.result) {
                imageUrl = data.result;
              }
            }

            if (imageUrl) {
              setGeneratedImage(imageUrl);
              setUsingAPI(true);
              setIsGenerating(false);
              return;
            }
          } else {
            console.log('API返回错误:', response.status);
          }
        } catch (apiError) {
          console.log('API调用失败:', apiError);
        }
      }

      // 如果API不可用或未启用，检查是否允许Canvas预览
      if (apiConfig.enableCanvasPreview || !apiConfig.enableAPI) {
        const { generateCustomSBTI } = await import('./imageGenerator');
        const resultImage = await generateCustomSBTI(
          userPhotoFile,
          result.name,
          traitsText,
          result.humor
        );
        setGeneratedImage(resultImage);
      } else {
        setGenerationError('API生成失败且Canvas预览已禁用，请检查API配置');
      }
    } catch (error) {
      console.error('生成失败:', error);
      setGenerationError('图片生成失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  // 将File转换为base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // 下载生成的图片
  const downloadGeneratedImage = () => {
    if (!generatedImage) return;

    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `SBTI_${result?.code}_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 关闭弹窗时清理状态
  const closePhotoModal = () => {
    setShowPhotoModal(false);
    setUserPhoto(null);
    setUserPhotoFile(null);
    setGeneratedImage(null);
    setGenerationError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      {/* 背景装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* 首页 */}
      {page === 'home' && (
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
          {/* Logo */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 mb-4 drop-shadow-lg">
              SBTI
            </h1>
            <p className="text-2xl md:text-3xl text-white/90 font-bold mb-2">
              Silly Big Personality Test
            </p>
            <p className="text-lg text-white/60">
              傻乎乎的大人格测试
            </p>
          </div>

          {/* 介绍 */}
          <div className="max-w-2xl text-center mb-12 animate-slide-up">
            <p className="text-white/80 text-lg leading-relaxed mb-6">
              还在测MBTI？太正经了！来试试这个专门为当代年轻人设计的
              <span className="text-pink-400 font-bold"> 梗向人格测试</span>
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <span className="px-4 py-2 bg-white/10 rounded-full text-white/80 text-sm">27种人格类型</span>
              <span className="px-4 py-2 bg-white/10 rounded-full text-white/80 text-sm">31道趣味题目</span>
              <span className="px-4 py-2 bg-white/10 rounded-full text-white/80 text-sm">Q版动漫风格</span>
            </div>
          </div>

          {/* 按钮 */}
          <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <button
              onClick={() => setPage('test')}
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-xl rounded-2xl shadow-2xl hover:shadow-pink-500/50 transform hover:scale-105 transition-all duration-300"
            >
              开始测试 →
            </button>
            <button
              onClick={() => setPage('types')}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold text-xl rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              查看全部人格
            </button>
          </div>

          {/* 人格预览 */}
          <div className="mt-16 max-w-5xl animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <p className="text-white/60 text-center mb-6 text-sm">热门人格预览</p>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 gap-3">
              {SBTI_TYPES.slice(0, 18).map((type, index) => (
                <div
                  key={type.code}
                  className="group cursor-pointer"
                  onClick={() => viewTypeDetail(type)}
                >
                  <div className="relative">
                    <img
                      src={type.image}
                      alt={type.name}
                      className="w-full aspect-square object-cover rounded-xl border-2 border-transparent group-hover:border-white/50 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl"
                      style={{ backgroundColor: `${type.color}20` }}
                    />
                  </div>
                  <p className="text-xs text-white/60 mt-1 text-center truncate group-hover:text-white transition-colors">
                    {type.code}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 警告 */}
          <div className="mt-12 text-center text-white/40 text-sm animate-slide-up" style={{ animationDelay: '0.7s' }}>
            ⚠️ 本测试仅供娱乐，请勿当真 | 不适用于招聘、相亲等严肃场合
          </div>

          {/* 关注提示 */}
          <div className="mt-12 w-full max-w-2xl bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 animate-slide-up" style={{ animationDelay: '0.9s' }}>
            <p className="text-white/80 text-center mb-4">
              关注作者获取更多有趣内容
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {/* 小红书 */}
              <a
                href="https://www.xiaohongshu.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full hover:bg-white/20 transition-all duration-300 group"
              >
                <span className="text-lg">📕</span>
                <span className="text-white/80 text-sm group-hover:text-white">小红书</span>
              </a>

              {/* 尾盘哥 */}
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full">
                <span className="text-lg">📊</span>
                <span className="text-white/80 text-sm">尾盘哥</span>
              </div>

              {/* 半卷财书公众号 */}
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full">
                <span className="text-lg">📖</span>
                <span className="text-white/80 text-sm">半卷财书</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 测试页 */}
      {page === 'test' && (
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8">
          {/* 进度条 */}
          <div className="w-full max-w-2xl mb-8">
            <div className="flex justify-between text-white/60 text-sm mb-2">
              <span>问题 {currentQuestion + 1} / {SBTI_QUESTIONS.length}</span>
              <span>{Math.round(((currentQuestion + 1) / SBTI_QUESTIONS.length) * 100)}%</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-500 ease-out rounded-full"
                style={{ width: `${((currentQuestion + 1) / SBTI_QUESTIONS.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* 问题卡片 */}
          <div className="w-full max-w-2xl bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/10 animate-card-in">
            <h2 className="text-2xl md:text-3xl text-white font-bold text-center mb-8">
              {SBTI_QUESTIONS[currentQuestion].question}
            </h2>

            <div className="space-y-4">
              {SBTI_QUESTIONS[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className="w-full p-4 bg-white/5 hover:bg-white/15 border border-white/10 hover:border-pink-500/50 rounded-xl text-white text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-pink-500/20 group"
                >
                  <span className="text-pink-400 font-bold mr-3 group-hover:text-pink-300">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option.text}
                </button>
              ))}
            </div>
          </div>

          {/* 返回按钮 */}
          <button
            onClick={goHome}
            className="mt-8 text-white/40 hover:text-white text-sm transition-colors"
          >
            ← 返回首页
          </button>
        </div>
      )}

      {/* 结果页 */}
      {page === 'result' && result && (
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
          <div className="text-center mb-8 animate-bounce-in">
            <p className="text-white/60 text-lg mb-2">你的SBTI人格是</p>
          </div>

          {/* 结果卡片 */}
          <div className={`w-full max-w-4xl bg-gradient-to-br ${result.bgGradient} rounded-3xl p-8 md:p-12 shadow-2xl animate-card-in`}>
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* 图片 */}
              <div className="flex-shrink-0">
                <img
                  src={result.image}
                  alt={result.name}
                  className="w-48 h-48 md:w-64 md:h-64 rounded-2xl shadow-2xl border-4 border-white/20"
                />
              </div>

              {/* 信息 */}
              <div className="flex-1 text-center md:text-left text-white">
                <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                  <h2 className="text-5xl md:text-6xl font-black">{result.code}</h2>
                </div>
                <h3 className="text-3xl font-bold mb-2">{result.name}</h3>
                <p className="text-xl text-white/80 mb-4">{result.title}</p>
                <p className="text-white/90 leading-relaxed mb-6">{result.description}</p>

                {/* 特质标签 */}
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
                  {result.traits.map((trait, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white/20 rounded-full text-sm"
                    >
                      {trait}
                    </span>
                  ))}
                </div>

                {/* 幽默描述 */}
                <div className="bg-black/20 rounded-xl p-4">
                  <p className="text-white/80 italic">{result.humor}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 animate-slide-up">
            <button
              onClick={resetTest}
              className="px-8 py-4 bg-white text-purple-900 font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              再测一次 🔄
            </button>
            <button
              onClick={openPhotoModal}
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              生成我的专属图 ✨
            </button>
            <button
              onClick={() => setPage('types')}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold text-lg rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              查看全部人格
            </button>
            <button
              onClick={goHome}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold text-lg rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              返回首页
            </button>
          </div>

          {/* 分享提示 */}
          <div className="mt-8 text-white/40 text-sm animate-fade-in">
            💡 提示：可以截图分享到朋友圈，让朋友们也来测测
          </div>

          {/* 关注提示 */}
          <div className="mt-8 w-full max-w-2xl bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-indigo-500/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10 animate-slide-up">
            <p className="text-white/90 text-center text-lg font-bold mb-4">
              🎉 感谢使用 SBTI 测试！
            </p>
            <p className="text-white/70 text-center mb-6">
              关注作者获取更多有趣测试和内容
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* 小红书 */}
              <a
                href="https://www.xiaohongshu.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-red-500 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg group-hover:scale-110 transition-transform">
                  📕
                </div>
                <div className="text-center">
                  <p className="text-white font-semibold text-sm">小红书</p>
                  <p className="text-white/50 text-xs">搜索「SBTI测试」</p>
                </div>
              </a>

              {/* 尾盘哥 */}
              <a
                href="#"
                className="flex flex-col items-center gap-2 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg group-hover:scale-110 transition-transform">
                  📊
                </div>
                <div className="text-center">
                  <p className="text-white font-semibold text-sm">尾盘哥</p>
                  <p className="text-white/50 text-xs">股市收盘分析</p>
                </div>
              </a>

              {/* 半卷财书公众号 */}
              <a
                href="#"
                className="flex flex-col items-center gap-2 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg group-hover:scale-110 transition-transform">
                  📖
                </div>
                <div className="text-center">
                  <p className="text-white font-semibold text-sm">半卷财书</p>
                  <p className="text-white/50 text-xs">公众号</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 全部人格页 */}
      {page === 'types' && (
        <div className="relative z-10 min-h-screen px-4 py-12">
          <div className="max-w-6xl mx-auto">
            {/* 标题 */}
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                全部人格类型
              </h2>
              <p className="text-white/60">点击任意人格查看详情</p>
            </div>

            {/* 人格网格 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {SBTI_TYPES.map((type, index) => (
                <div
                  key={type.code}
                  onClick={() => viewTypeDetail(type)}
                  className="group cursor-pointer bg-white/5 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/15 border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <img
                    src={type.image}
                    alt={type.name}
                    className="w-full aspect-square object-cover rounded-xl mb-3 group-hover:shadow-lg transition-shadow"
                  />
                  <div className="text-center">
                    <p className="text-2xl font-black text-white mb-1">{type.code}</p>
                    <p className="text-white/80 text-sm">{type.name}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* 返回按钮 */}
            <div className="text-center mt-12">
              <button
                onClick={goHome}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold text-lg rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                ← 返回首页
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 照片生成弹窗 */}
      {showPhotoModal && result && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={closePhotoModal}
        >
          <div
            className="w-full max-w-2xl bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 md:p-10 shadow-2xl border border-white/10 animate-modal-in overflow-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <h3 className="text-3xl font-black text-white mb-2">
                生成你的专属SBTI形象
              </h3>
              <p className="text-white/60">
                上传你的照片，生成专属的{result.name}风格Q版卡通形象
              </p>
            </div>

            {/* 人格信息预览 */}
            <div className="flex items-center justify-center gap-4 mb-6 p-4 bg-white/5 rounded-xl">
              <img
                src={result.image}
                alt={result.name}
                className="w-16 h-16 rounded-xl"
              />
              <div className="text-left">
                <p className="text-2xl font-black text-white">{result.code}</p>
                <p className="text-white/70">{result.name}</p>
              </div>
            </div>

            {/* 照片上传区域 */}
            <div className="mb-6">
              {!userPhoto ? (
                <label className="block w-full p-12 border-2 border-dashed border-white/20 rounded-2xl cursor-pointer hover:border-pink-500/50 hover:bg-pink-500/5 transition-all duration-300">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
                      <span className="text-4xl">📷</span>
                    </div>
                    <p className="text-white font-semibold mb-2">点击上传照片</p>
                    <p className="text-white/50 text-sm">支持 JPG、PNG 格式，最大 10MB</p>
                  </div>
                </label>
              ) : (
                <div className="relative">
                  <img
                    src={userPhoto}
                    alt="用户照片"
                    className="w-full max-h-80 object-contain rounded-2xl"
                  />
                  <button
                    onClick={() => {
                      setUserPhoto(null);
                      setUserPhotoFile(null);
                    }}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            {/* 错误提示 */}
            {generationError && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-center">
                {generationError}
              </div>
            )}

            {/* 生成结果 */}
            {generatedImage && (
              <div className="mb-6">
                <p className="text-white/80 text-center mb-3 font-semibold">✨ 生成的专属图片</p>
                <div className="relative">
                  <img
                    src={generatedImage}
                    alt="生成的SBTI图片"
                    className="w-full rounded-2xl shadow-lg"
                  />
                </div>
                {/* AI增强提示 */}
                <div className="mt-4 p-4 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-xl border border-pink-500/30">
                  <p className="text-white/80 text-sm mb-2 flex items-center gap-2">
                    <span>💡</span>
                    <span>想要更精美的AI生成效果？</span>
                  </p>
                  <button
                    onClick={() => {
                      const prompt = `Convert this person into a Q-version anime chibi style character representing "${result.name}" (${result.code}) personality type. Style: cute chibi anime illustration, big head, small body, large expressive eyes, pastel colors. Character traits: ${result.traits.join('、')}. Humor vibe: ${result.humor}. Keep facial features recognizable but stylized in anime chibi format. Background: colorful gradient with floating elements and cute decorations.`;
                      navigator.clipboard.writeText(prompt);
                      alert('AI提示词已复制到剪贴板！\n\n你可以在 Midjourney、DALL-E、Stable Diffusion 等AI图像生成工具中使用这个提示词。');
                    }}
                    className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    <span>🎨</span>
                    <span>复制AI提示词（用于其他AI工具）</span>
                  </button>
                </div>
              </div>
            )}

            {/* 操作按钮 */}
            <div className="flex flex-col sm:flex-row gap-3">
              {!generatedImage ? (
                <button
                  onClick={generateSBTIImage}
                  disabled={!userPhoto || isGenerating}
                  className={`flex-1 py-4 font-bold text-lg rounded-2xl transition-all duration-300 ${
                    userPhoto && !isGenerating
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                      : 'bg-white/10 text-white/40 cursor-not-allowed'
                  }`}
                >
                  {isGenerating ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin">⚙️</span>
                      AI生成中...
                    </span>
                  ) : (
                    '🎨 生成专属图片'
                  )}
                </button>
              ) : (
                <button
                  onClick={downloadGeneratedImage}
                  className="flex-1 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  ⬇️ 下载图片
                </button>
              )}
              <button
                onClick={closePhotoModal}
                className="flex-1 py-4 bg-white/10 text-white font-bold text-lg rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                关闭
              </button>
            </div>

            {/* 提示 */}
            <p className="mt-4 text-white/40 text-xs text-center">
              💡 提示：生成效果取决于照片质量和角度，正脸照片效果更佳
            </p>
          </div>
        </div>
      )}

      {/* 人格详情弹窗 */}
      {showTypeDetail && selectedType && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowTypeDetail(false)}
        >
          <div
            className="w-full max-w-3xl bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 md:p-10 shadow-2xl border border-white/10 animate-modal-in overflow-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* 图片 */}
              <div className="flex-shrink-0">
                <img
                  src={selectedType.image}
                  alt={selectedType.name}
                  className="w-40 h-40 md:w-52 md:h-52 rounded-2xl shadow-xl"
                />
              </div>

              {/* 信息 */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                  <h3 className="text-4xl font-black text-white">{selectedType.code}</h3>
                </div>
                <h4 className="text-2xl font-bold text-white/90 mb-1">{selectedType.name}</h4>
                <p className="text-lg text-white/60 mb-4">{selectedType.title}</p>
                <p className="text-white/80 leading-relaxed mb-4">{selectedType.description}</p>

                {/* 特质 */}
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                  {selectedType.traits.map((trait, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full text-sm"
                      style={{ backgroundColor: `${selectedType.color}30`, color: selectedType.color }}
                    >
                      {trait}
                    </span>
                  ))}
                </div>

                {/* 幽默描述 */}
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-white/70 italic">{selectedType.humor}</p>
                </div>
              </div>
            </div>

            {/* 关闭按钮 */}
            <button
              onClick={() => setShowTypeDetail(false)}
              className="mt-6 w-full py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
            >
              关闭
            </button>
          </div>
        </div>
      )}

      {/* 设置按钮 - 固定在右下角 */}
      <button
        onClick={() => setShowSettings(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center"
        title="API设置"
      >
        ⚙️
      </button>

      {/* API设置弹窗 */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
}

export default App;
