import React, { useState } from 'react';
import { Play, Pause, CheckCircle, XCircle, MonitorPlay, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FileData } from '../App';

const MOCK_QUESTIONS = [
  { time: 5, text: 'Mệnh đề là gì?', options: ['Một câu hỏi', 'Một câu khẳng định đúng hoặc sai', 'Một câu cảm thán'], correct: 1 },
  { time: 15, text: 'Câu "Trời ơi!" có phải mệnh đề không?', options: ['Có', 'Không'], correct: 1 },
];

export default function VideoSection({ videos }: { videos: FileData[] }) {
  const [selectedVideo, setSelectedVideo] = useState<FileData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeQuestion, setActiveQuestion] = useState<any>(null);
  const [answeredState, setAnsweredState] = useState<'correct' | 'incorrect' | null>(null);

  // Giả lập video chạy
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !activeQuestion && selectedVideo) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const nextTime = prev + 1;
          const question = MOCK_QUESTIONS.find((q) => q.time === nextTime);
          if (question) {
            setIsPlaying(false);
            setActiveQuestion(question);
          }
          if (nextTime >= 30) {
            setIsPlaying(false);
            return 30; // Stop after 30s
          }
          return nextTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, activeQuestion, selectedVideo]);

  const handleAnswer = (index: number) => {
    if (index === activeQuestion.correct) {
      setAnsweredState('correct');
      setTimeout(() => {
        setActiveQuestion(null);
        setAnsweredState(null);
        setIsPlaying(true);
      }, 2000);
    } else {
      setAnsweredState('incorrect');
    }
  };

  if (!videos || videos.length === 0) {
    return (
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mb-6">
          <MonitorPlay className="text-slate-400" size={40} />
        </div>
        <h2 className="text-2xl font-bold text-violet-950 mb-2">Chưa có Video bài giảng</h2>
        <p className="text-slate-500 max-w-md">Giáo viên chưa tải lên video tương tác nào cho bài giảng này. Vui lòng quay lại sau nhé!</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Left Column: Video Player */}
        <div className="flex-1 min-w-0 space-y-6 w-full">
          {!selectedVideo ? (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl shadow-sm border border-stone-200 min-h-[500px] text-center">
              <div className="w-20 h-20 bg-violet-50 rounded-full flex items-center justify-center mb-6">
                <MonitorPlay className="text-violet-400" size={40} />
              </div>
              <h2 className="text-2xl font-bold text-violet-950 mb-2">Chưa chọn video</h2>
              <p className="text-slate-500 max-w-sm">Hãy chọn một video từ danh sách bên phải để xem và trả lời câu hỏi tương tác.</p>
            </div>
          ) : (
            <>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
                <h2 className="text-xl font-bold text-violet-950">Video Tương Tác: {selectedVideo.name}</h2>
                <p className="text-sm text-slate-600 mt-1">Xem video và trả lời các câu hỏi xuất hiện trên màn hình để kiểm tra sự tập trung.</p>
              </div>

              <div className="relative aspect-video bg-stone-900 rounded-2xl overflow-hidden shadow-xl ring-1 ring-stone-200">
                {/* Mock Video Element */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-violet-900 to-stone-900">
                  <div className="text-center opacity-50">
                    <MonitorPlay size={64} className="mx-auto text-violet-400 mb-4" />
                    <p className="text-white font-medium tracking-widest uppercase">Video Bài Giảng</p>
                  </div>
                </div>

                {/* Video Controls / Progress */}
                <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center gap-4">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    disabled={!!activeQuestion || currentTime >= 30}
                    className="p-3 bg-violet-600 hover:bg-violet-500 text-white rounded-full transition-colors disabled:opacity-50"
                  >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                  
                  <div className="flex-1 h-2 bg-stone-700 rounded-full overflow-hidden relative">
                    <div 
                      className="absolute left-0 top-0 bottom-0 bg-violet-500 transition-all duration-1000 ease-linear"
                      style={{ width: `${(currentTime / 30) * 100}%` }}
                    />
                    {MOCK_QUESTIONS.map((q, i) => (
                      <div 
                        key={i} 
                        className="absolute top-0 bottom-0 w-2 bg-yellow-400 rounded-full"
                        style={{ left: `${(q.time / 30) * 100}%`, transform: 'translateX(-50%)' }}
                      />
                    ))}
                  </div>
                  <div className="text-white text-sm font-mono">{currentTime}s / 30s</div>
                </div>

                {/* Question Overlay */}
                <AnimatePresence>
                  {activeQuestion && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.05 }}
                      className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
                    >
                      <div className="bg-white p-8 rounded-2xl max-w-md w-full shadow-2xl">
                        <h3 className="text-xl font-bold text-violet-950 mb-6">{activeQuestion.text}</h3>
                        <div className="space-y-3">
                          {activeQuestion.options.map((opt: string, idx: number) => (
                            <button
                              key={idx}
                              onClick={() => handleAnswer(idx)}
                              className="w-full text-left px-5 py-3 rounded-xl border-2 border-stone-100 hover:border-violet-500 hover:bg-violet-50 transition-all font-medium text-slate-700"
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                        
                        {answeredState && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mt-6 p-4 rounded-xl flex items-center gap-3 ${
                              answeredState === 'correct' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {answeredState === 'correct' ? <CheckCircle /> : <XCircle />}
                            <p className="font-semibold">
                              {answeredState === 'correct' ? 'Chính xác! Tiếp tục video...' : 'Chưa đúng, hãy thử lại!'}
                            </p>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <div className="bg-violet-50 p-6 rounded-2xl border border-violet-100">
                <h4 className="font-bold text-violet-900 mb-2">💡 Hướng dẫn:</h4>
                <p className="text-violet-800/80 leading-relaxed text-sm">
                  Tính năng Video Tương Tác cho phép giáo viên chèn các câu hỏi trắc nghiệm ngay tại các mốc thời gian quan trọng của video. 
                  Học sinh bắt buộc phải trả lời đúng để tiếp tục xem.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Right Column: List */}
        <div className="w-full md:w-80 lg:w-96 shrink-0 md:sticky md:top-6">
          <div className="bg-stone-50 p-6 rounded-3xl border border-stone-100">
            <h2 className="text-lg font-bold text-violet-950 mb-4 flex items-center gap-2">
              <Play className="text-violet-500" size={20} fill="currentColor" />
              Danh sách video
            </h2>
            <div className="space-y-3 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
              {videos.map((v) => (
                <button
                  key={v.id}
                  onClick={() => {
                    setSelectedVideo(v);
                    setCurrentTime(0);
                    setIsPlaying(false);
                    setActiveQuestion(null);
                    setAnsweredState(null);
                  }}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-left border ${
                    selectedVideo?.id === v.id 
                      ? 'bg-violet-50 border-violet-300 shadow-sm ring-1 ring-violet-300' 
                      : 'bg-white border-stone-200 hover:border-violet-300 hover:shadow-sm'
                  }`}
                >
                  <div className={`p-3 rounded-xl transition-colors ${
                    selectedVideo?.id === v.id ? 'bg-violet-100 text-violet-700' : 'bg-stone-50 text-slate-500'
                  }`}>
                    <Play size={20} fill="currentColor" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-bold truncate ${
                      selectedVideo?.id === v.id ? 'text-violet-800' : 'text-slate-700'
                    }`}>{v.name}</h3>
                    <p className="text-xs text-slate-500 truncate">Kích vào để xem</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
