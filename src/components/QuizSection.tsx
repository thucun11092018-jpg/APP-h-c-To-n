import React, { useState } from 'react';
import { Difficulty, Question } from '../types';
import { Settings, Play, AlertCircle, CheckCircle, XCircle, FileQuestion } from 'lucide-react';
import { motion } from 'motion/react';

export default function QuizSection({ questions }: { questions: Question[] }) {
  const [step, setStep] = useState<'setup' | 'playing' | 'result'>('setup');
  
  // Setup state
  const [setupMode, setSetupMode] = useState<'count' | 'percentage'>('count');
  
  // Count Mode
  const [countMC, setCountMC] = useState<number>(10);
  const [countTF, setCountTF] = useState<number>(5);
  const [countSA, setCountSA] = useState<number>(5);

  // Percentage Mode
  const [percentNB, setPercentNB] = useState<number>(40);
  const [percentTH, setPercentTH] = useState<number>(40);
  const [percentVD, setPercentVD] = useState<number>(20);
  
  // Test state
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  
  const startQuiz = () => {
    let finalQuestions: Question[] = [];
    const getRand = (arr: Question[], n: number) => [...arr].sort(() => 0.5 - Math.random()).slice(0, n);

    if (setupMode === 'count') {
      const allMC = questions.filter(q => q.type === 'Trắc nghiệm nhiều lựa chọn' || !q.type);
      const allTF = questions.filter(q => q.type === 'Trắc nghiệm đúng sai');
      const allSA = questions.filter(q => q.type === 'Trắc nghiệm trả lời ngắn');

      finalQuestions = [
        ...getRand(allMC.length >= countMC ? allMC : questions, countMC),
        ...getRand(allTF.length >= countTF ? allTF : questions, countTF),
        ...getRand(allSA.length >= countSA ? allSA : questions, countSA)
      ].slice(0, countMC + countTF + countSA);
    } else {
      const reqNB = Math.round((22 * percentNB) / 100);
      const reqTH = Math.round((22 * percentTH) / 100);
      let reqVD = 22 - reqNB - reqTH;
      if (reqVD < 0) reqVD = 0; 

      const availableNB = questions.filter(q => q.difficulty === 'Nhận biết');
      const availableTH = questions.filter(q => q.difficulty === 'Thông hiểu');
      const availableVD = questions.filter(q => q.difficulty === 'Vận dụng');

      finalQuestions = [
        ...getRand(availableNB.length >= reqNB ? availableNB : questions, reqNB),
        ...getRand(availableTH.length >= reqTH ? availableTH : questions, reqTH),
        ...getRand(availableVD.length >= reqVD ? availableVD : questions, reqVD)
      ].slice(0, 22);
    }
    
    finalQuestions = finalQuestions.sort(() => 0.5 - Math.random());
    
    setActiveQuestions(finalQuestions);
    setAnswers({});
    setCurrentQIndex(0);
    setStep('playing');
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mb-6">
          <FileQuestion className="text-slate-400" size={40} />
        </div>
        <h2 className="text-2xl font-bold text-violet-950 mb-2">Chưa có câu hỏi</h2>
        <p className="text-slate-500 max-w-md">Giáo viên chưa tải lên câu hỏi nào cho bài giảng này. Vui lòng quay lại sau nhé!</p>
      </div>
    );
  }

  const handleSelectAnswer = (optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [activeQuestions[currentQIndex].id]: optionIndex }));
  };

  const handleNext = () => {
    if (currentQIndex < activeQuestions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      setStep('result');
    }
  };

  const handlePrev = () => {
    if (currentQIndex > 0) {
      setCurrentQIndex(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    activeQuestions.forEach(q => {
      if (answers[q.id] === q.correctAnswerIndex) correct++;
    });
    return correct;
  };

  if (step === 'setup') {
    return (
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-stone-100">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
            <Settings size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-violet-950">Cấu hình bài kiểm tra</h2>
            <p className="text-slate-500">Tự tạo bài luyện tập theo mức độ mong muốn</p>
          </div>
        </div>

        <div className="flex bg-stone-100 p-1 rounded-xl mb-8">
          <button 
            onClick={() => setSetupMode('count')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${setupMode === 'count' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Chọn theo số câu
          </button>
          <button 
            onClick={() => setSetupMode('percentage')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${setupMode === 'percentage' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Chọn theo phần trăm
          </button>
        </div>

        {setupMode === 'count' ? (
          <div className="space-y-6">
            <p className="text-sm font-medium text-slate-600 mb-2">Chọn số lượng câu hỏi cho từng loại:</p>
            {[{ label: 'Trắc nghiệm nhiều lựa chọn', val: countMC, setter: setCountMC }, 
              { label: 'Trắc nghiệm đúng sai', val: countTF, setter: setCountTF }, 
              { label: 'Trắc nghiệm trả lời ngắn', val: countSA, setter: setCountSA }].map(lvl => (
              <div key={lvl.label} className="flex items-center justify-between p-4 bg-stone-50 rounded-xl border border-stone-100">
                <span className="font-medium text-slate-700">{lvl.label}</span>
                <div className="flex items-center gap-4">
                  <button onClick={() => lvl.setter(Math.max(0, lvl.val - 1))} className="w-10 h-10 rounded-full bg-white border border-stone-200 flex items-center justify-center text-slate-600 font-bold hover:bg-stone-100 hover:text-violet-600 transition-colors shadow-sm">-</button>
                  <span className="w-8 text-center font-bold text-lg text-violet-950">{lvl.val}</span>
                  <button 
                    onClick={() => lvl.setter(lvl.val + 1)} 
                    className="w-10 h-10 rounded-full bg-white border border-stone-200 flex items-center justify-center text-slate-600 font-bold hover:bg-stone-100 hover:text-violet-600 transition-colors shadow-sm"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
            <div className="pt-4 border-t border-stone-100 flex justify-between items-center px-2">
              <span className="text-slate-600 font-bold uppercase tracking-wider text-sm">Tổng số câu:</span>
              <span className="text-violet-600 text-2xl font-black">{countMC + countTF + countSA}</span>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="p-5 bg-stone-50 rounded-xl border border-stone-100">
              <label className="block font-bold text-slate-700 mb-2">Thông tin bài thi</label>
              <p className="text-slate-600 text-sm">Tổng số câu hỏi được cố định là <strong className="text-violet-600">22 câu</strong> (gồm 12 nhiều lựa chọn, 4 đúng sai, 6 trả lời ngắn).</p>
            </div>
            
            <div className="p-5 border-2 border-dashed border-stone-200 rounded-xl space-y-5 bg-white">
              <p className="font-bold text-slate-700 mb-2">Tỉ lệ phân bổ mức độ (%)</p>
              {[{ label: 'Nhận biết', val: percentNB, setter: setPercentNB }, 
                { label: 'Thông hiểu', val: percentTH, setter: setPercentTH }, 
                { label: 'Vận dụng', val: percentVD, setter: setPercentVD }].map(lvl => (
                <div key={lvl.label} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg border border-stone-100">
                  <span className="w-24 text-slate-700 font-medium">{lvl.label}</span>
                  <div className="flex items-center gap-3">
                    <button onClick={() => lvl.setter(Math.max(0, lvl.val - 5))} className="w-8 h-8 rounded bg-white border border-stone-200 flex items-center justify-center text-slate-600 font-bold hover:bg-stone-100 hover:text-violet-600 transition-colors">-</button>
                    <div className="relative">
                      <input 
                        type="number"
                        min="0" max="100"
                        value={lvl.val}
                        onChange={(e) => {
                          const v = parseInt(e.target.value);
                          if (!isNaN(v)) lvl.setter(v);
                        }}
                        className="w-16 text-center font-bold text-violet-950 bg-white border border-stone-200 py-1.5 rounded-lg focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">%</span>
                    </div>
                    <button onClick={() => lvl.setter(Math.min(100, lvl.val + 5))} className="w-8 h-8 rounded bg-white border border-stone-200 flex items-center justify-center text-slate-600 font-bold hover:bg-stone-100 hover:text-violet-600 transition-colors">+</button>
                  </div>
                </div>
              ))}
              
              <div className={`mt-4 p-3 rounded-lg text-sm font-bold text-center ${percentNB + percentTH + percentVD === 100 ? 'bg-orange-50 text-orange-700' : 'bg-red-50 text-red-600'}`}>
                Tổng tỉ lệ hiện tại: {percentNB + percentTH + percentVD}% 
                {percentNB + percentTH + percentVD !== 100 && ' (Vui lòng điều chỉnh để tổng = 100%)'}
              </div>
            </div>
          </div>
        )}

        <button 
          onClick={startQuiz}
          disabled={setupMode === 'percentage' && (percentNB + percentTH + percentVD !== 100)}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-stone-300 disabled:cursor-not-allowed text-white p-4 rounded-xl font-bold text-lg transition-colors mt-8 shadow-md"
        >
          <Play size={20} fill="currentColor" />
          Bắt đầu làm bài
        </button>
      </div>
    );
  }

  if (step === 'playing') {
    const currentQuestion = activeQuestions[currentQIndex];
    const selectedAnswer = answers[currentQuestion.id];

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-stone-100">
          <span className="font-semibold text-slate-600">Câu {currentQIndex + 1} / {activeQuestions.length}</span>
          <span className="px-3 py-1 bg-stone-100 text-slate-600 text-xs font-bold rounded-full uppercase tracking-wider">
            {currentQuestion.difficulty}
          </span>
        </div>

        <motion.div 
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-violet-950 leading-relaxed math-content">
              {currentQuestion.text}
            </h3>
            {currentQuestion.type && (
              <span className="ml-4 px-3 py-1 bg-violet-50 text-violet-700 text-xs font-bold rounded-lg border border-violet-100 whitespace-nowrap">
                {currentQuestion.type}
              </span>
            )}
          </div>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelectAnswer(index)}
                className={`w-full text-left p-5 rounded-xl border-2 transition-all font-medium math-content ${
                  selectedAnswer === index 
                    ? 'border-violet-600 bg-violet-50 text-violet-800'
                    : 'border-stone-100 hover:border-stone-300 text-slate-700'
                }`}
              >
                <span className="inline-block w-8 h-8 text-center leading-7 rounded-full bg-white border border-stone-200 mr-3 shadow-sm">
                  {['A', 'B', 'C', 'D'][index]}
                </span>
                {option}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="flex justify-between">
          <button 
            onClick={handlePrev}
            disabled={currentQIndex === 0}
            className="px-6 py-3 rounded-xl font-semibold text-slate-600 hover:bg-stone-100 disabled:opacity-50 transition-colors"
          >
            Quay lại
          </button>
          <button 
            onClick={handleNext}
            className="px-8 py-3 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
          >
            {currentQIndex === activeQuestions.length - 1 ? 'Nộp bài' : 'Câu tiếp theo'}
          </button>
        </div>
      </div>
    );
  }

  // Result Step
  const score = calculateScore();
  const percentage = Math.round((score / activeQuestions.length) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-10 rounded-3xl shadow-sm border border-stone-100 text-center">
        <h2 className="text-3xl font-extrabold text-violet-950 mb-4">Kết Quả Bài Kiểm Tra</h2>
        <div className="inline-flex flex-col items-center justify-center w-40 h-40 rounded-full border-8 border-blue-100 mb-6">
          <span className="text-4xl font-black text-blue-600">{score}/{activeQuestions.length}</span>
          <span className="text-slate-500 font-medium">{percentage}%</span>
        </div>
        <p className="text-lg text-slate-600 max-w-md mx-auto mb-8">
          {percentage >= 80 ? 'Xuất sắc! Bạn đã nắm rất vững kiến thức về Mệnh đề.' :
           percentage >= 50 ? 'Khá tốt! Hãy xem lại các câu sai để củng cố kiến thức nhé.' :
           'Bạn cần ôn tập lại lý thuyết bài Mệnh đề kỹ hơn.'}
        </p>
        <button 
          onClick={() => setStep('setup')}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold shadow-md transition-all active:scale-95"
        >
          Làm bài mới
        </button>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-bold text-violet-950 px-2">Chi tiết đáp án:</h3>
        {activeQuestions.map((q, i) => {
          const isCorrect = answers[q.id] === q.correctAnswerIndex;
          return (
            <div key={q.id} className={`p-6 rounded-2xl border ${isCorrect ? 'bg-green-50/30 border-green-200' : 'bg-red-50/30 border-red-200'}`}>
              <div className="flex gap-4">
                <div className="mt-1">
                  {isCorrect ? <CheckCircle className="text-green-500" /> : <XCircle className="text-red-500" />}
                </div>
                <div>
                  <p className="font-semibold text-violet-950 mb-3">Câu {i + 1}: {q.text}</p>
                  <p className="text-sm text-slate-600 mb-2">
                    <span className="font-medium">Bạn chọn: </span>
                    <span className={isCorrect ? 'text-green-700 font-medium' : 'text-red-600 line-through'}>
                      {answers[q.id] !== undefined ? q.options[answers[q.id]] : 'Không trả lời'}
                    </span>
                  </p>
                  {!isCorrect && (
                    <p className="text-sm text-green-700 font-medium mb-3">
                      Đáp án đúng: {q.options[q.correctAnswerIndex]}
                    </p>
                  )}
                  <div className="mt-3 text-sm bg-white p-3 rounded-lg border border-stone-100 text-slate-600">
                    <span className="font-bold text-slate-700">Giải thích: </span>{q.explanation}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
