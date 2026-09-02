import React, { useState } from 'react';
import { Download, FileText, Check, AlertCircle, X } from 'lucide-react';
import { FileData } from '../App';

export default function WorksheetSection({ worksheets }: { worksheets: FileData[] }) {
  const [selectedWs, setSelectedWs] = useState<FileData | null>(null);
  
  // Interactive state
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  // Handle switching worksheet
  const handleSelectWs = (ws: FileData) => {
    setSelectedWs(ws);
    setAnswers({});
    setSubmitted(false);
  };

  if (!worksheets || worksheets.length === 0) {
    return (
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mb-6">
          <FileText className="text-slate-400" size={40} />
        </div>
        <h2 className="text-2xl font-bold text-violet-950 mb-2">Chưa có phiếu học tập</h2>
        <p className="text-slate-500 max-w-md">Giáo viên chưa tải lên phiếu học tập nào cho bài giảng này. Vui lòng quay lại sau nhé!</p>
      </div>
    );
  }

  const isInteractive = selectedWs?.zones && selectedWs.zones.length > 0;

  const handleSubmit = () => {
    if (!selectedWs?.zones) return;
    let correct = 0;
    selectedWs.zones.forEach(zone => {
      const studentAns = answers[zone.id] || (zone.type === 'checkbox' ? 'false' : '');
      if (studentAns.trim().toLowerCase() === zone.correctAnswer.trim().toLowerCase()) {
        correct++;
      }
    });
    setScore({ correct, total: selectedWs.zones.length });
    setSubmitted(true);
  };

  const dropzoneLabels = React.useMemo(() => {
    if (!selectedWs?.zones) return [];
    const labels = selectedWs.zones.filter(z => z.type === 'dropzone').map(z => z.correctAnswer).filter(Boolean);
    return Array.from(new Set(labels)).sort(() => Math.random() - 0.5);
  }, [selectedWs]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Left Column: Content Viewer */}
        <div className="flex-1 min-w-0 space-y-6 w-full">
          {!selectedWs ? (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl shadow-sm border border-stone-200 min-h-[600px] text-center">
              <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-6">
                <FileText className="text-orange-400" size={40} />
              </div>
              <h2 className="text-2xl font-bold text-violet-950 mb-2">Chưa chọn phiếu học tập</h2>
              <p className="text-slate-500 max-w-sm">Hãy chọn một phiếu học tập từ danh sách bên phải để xem nội dung chi tiết hoặc tải về.</p>
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
                <div>
                  <h2 className="text-xl font-bold text-violet-950 flex items-center gap-2">
                    Phiếu Học Tập: {selectedWs.name}
                    {isInteractive && <span className="text-xs bg-violet-100 text-violet-700 px-2 py-1 rounded-md font-bold">Phiếu Tương Tác</span>}
                  </h2>
                  <p className="text-sm text-slate-600 mt-1">
                    {isInteractive ? 'Điền đáp án trực tiếp vào ô trống trên phiếu học tập bên dưới.' : 'Xem chi tiết hoặc tải phiếu học tập về máy để làm bài.'}
                  </p>
                </div>
                <div className="flex gap-3">
                  {isInteractive && (
                    <button 
                      onClick={handleSubmit}
                      disabled={submitted}
                      className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-colors shadow-sm shrink-0 ${
                        submitted ? 'bg-stone-100 text-slate-400' : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      <Check size={18} /> Chấm Điểm
                    </button>
                  )}
                  <a 
                    href={selectedWs.url}
                    download={selectedWs.name}
                    className="flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-xl font-bold transition-colors shadow-sm shrink-0"
                  >
                    <Download size={18} />
                    Tải Xuống
                  </a>
                </div>
              </div>

              {submitted && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 flex flex-col items-center justify-center">
                  <h3 className="text-xl font-bold text-violet-950 mb-2">Kết quả làm bài</h3>
                  <div className="text-4xl font-black text-blue-600 mb-2">
                    {score.correct} <span className="text-2xl text-slate-400">/ {score.total}</span>
                  </div>
                  <p className="text-slate-600 font-medium">Bạn đã trả lời đúng {Math.round((score.correct / score.total) * 100)}% câu hỏi.</p>
                  <button 
                    onClick={() => { setAnswers({}); setSubmitted(false); }}
                    className="mt-4 px-6 py-2 bg-stone-100 hover:bg-stone-200 text-slate-700 font-bold rounded-lg transition-colors"
                  >
                    Làm lại
                  </button>
                </div>
              )}

              <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden min-h-[600px] flex flex-col relative">
                {selectedWs.name.toLowerCase().endsWith('.pdf') ? (
                  <iframe 
                    src={selectedWs.url} 
                    className="w-full flex-1 min-h-[800px] border-none" 
                    title="Nội dung phiếu học tập" 
                  />
                ) : (
                  <div className="flex-1 p-8 bg-stone-50 flex flex-col items-center overflow-auto">
                    <div className="relative w-full max-w-4xl bg-white shadow-sm rounded-sm">
                      <img 
                        src={selectedWs.url} 
                        alt="Nội dung phiếu học tập" 
                        className="w-full h-auto rounded-sm block pointer-events-none" 
                      />
                      
                      {isInteractive && selectedWs.zones?.map(zone => {
                        const val = answers[zone.id] || (zone.type === 'checkbox' ? 'false' : '');
                        const isCorrect = submitted && val.trim().toLowerCase() === zone.correctAnswer.trim().toLowerCase();
                        const isWrong = submitted && !isCorrect;
                        
                        return (
                          <div 
                            key={zone.id}
                            className="absolute"
                            style={{
                              left: `${zone.x}%`,
                              top: `${zone.y}%`,
                              width: `${zone.width}%`,
                              height: `${zone.height}%`,
                            }}
                          >
                            {zone.type === 'text' ? (
                              <input 
                                type="text"
                                value={val}
                                onChange={(e) => !submitted && setAnswers({...answers, [zone.id]: e.target.value})}
                                readOnly={submitted}
                                className={`w-full h-full p-1 text-sm md:text-base font-bold text-center border-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                                  isCorrect ? 'border-orange-500 bg-orange-50 text-orange-700' :
                                  isWrong ? 'border-rose-500 bg-rose-50 text-rose-700' :
                                  'border-blue-300 bg-blue-50/50 text-blue-900'
                                }`}
                              />
                            ) : zone.type === 'checkbox' ? (
                              <button
                                onClick={() => !submitted && setAnswers({...answers, [zone.id]: val === 'true' ? 'false' : 'true'})}
                                disabled={submitted}
                                className={`w-full h-full flex items-center justify-center border-2 rounded-sm transition-colors ${
                                  val === 'true' 
                                    ? (isCorrect ? 'bg-orange-500 border-orange-600 text-white' : isWrong ? 'bg-rose-500 border-rose-600 text-white' : 'bg-blue-600 border-blue-700 text-white')
                                    : (isWrong && zone.correctAnswer === 'true' ? 'bg-rose-100 border-rose-500' : 'bg-white/80 border-stone-400')
                                }`}
                              >
                                {val === 'true' && <Check size={16} strokeWidth={4} />}
                              </button>
                            ) : (
                              <div
                                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                onDrop={(e) => {
                                  e.preventDefault();
                                  if (submitted) return;
                                  const data = e.dataTransfer.getData('text/plain');
                                  if (data) setAnswers({...answers, [zone.id]: data});
                                }}
                                className={`w-full h-full flex items-center justify-center border-2 rounded-sm transition-colors overflow-hidden ${
                                  !val ? 'border-dashed border-amber-400 bg-amber-50/50' :
                                  isCorrect ? 'border-orange-500 bg-orange-50 text-orange-700' :
                                  isWrong ? 'border-rose-500 bg-rose-50 text-rose-700' :
                                  'border-amber-500 bg-amber-100 text-amber-900 shadow-inner'
                                }`}
                              >
                                {val ? (
                                  <div className="flex items-center gap-1">
                                    <span className="font-bold text-xs md:text-sm px-1 text-center leading-tight truncate">{val}</span>
                                    {!submitted && (
                                      <button 
                                        onClick={(e) => { e.stopPropagation(); setAnswers({...answers, [zone.id]: ''}); }}
                                        className="p-1 hover:bg-amber-200 rounded-full text-amber-600 hover:text-amber-800 transition-colors"
                                      >
                                        <X size={14} />
                                      </button>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-amber-400/50 text-[10px] md:text-xs font-bold uppercase tracking-wider">Kéo thả</span>
                                )}
                              </div>
                            )}
                            
                            {/* Hiển thị đáp án đúng nếu làm sai */}
                            {isWrong && zone.type !== 'checkbox' && (
                              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-rose-600 text-white text-xs font-bold px-2 py-1 rounded-md z-10 shadow-md">
                                Đáp án: {zone.correctAnswer}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Word Bank for Drag and Drop */}
                    {dropzoneLabels.length > 0 && (
                      <div className="mt-8 w-full max-w-4xl p-6 bg-white rounded-2xl shadow-sm border border-stone-200">
                        <h4 className="font-bold text-violet-950 mb-4 flex items-center gap-2">
                           <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">↓</span>
                           Kéo các từ dưới đây và thả vào ô trống tương ứng:
                        </h4>
                        <div className="flex flex-wrap gap-3">
                          {dropzoneLabels.map(label => {
                             const isUsed = Object.values(answers).includes(label);
                             return (
                                <div
                                  key={label}
                                  draggable={!submitted}
                                  onDragStart={(e) => e.dataTransfer.setData('text/plain', label)}
                                  className={`px-4 py-2 rounded-xl font-bold border-2 transition-all select-none ${
                                     submitted ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'
                                  } ${
                                     isUsed ? 'bg-stone-50 border-stone-200 text-stone-400 opacity-50' : 'bg-white border-amber-300 text-amber-700 shadow-sm hover:shadow-md hover:border-amber-400'
                                  }`}
                                >
                                  {label}
                                </div>
                             )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Right Column: List */}
        <div className="w-full md:w-80 lg:w-96 shrink-0 md:sticky md:top-6">
          <div className="bg-stone-50 p-6 rounded-3xl border border-stone-100">
            <h2 className="text-lg font-bold text-violet-950 mb-4 flex items-center gap-2">
              <FileText className="text-orange-500" size={20} />
              Danh sách phiếu học tập
            </h2>
            <div className="space-y-3 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
              {worksheets.map((ws) => (
                <button
                  key={ws.id}
                  onClick={() => handleSelectWs(ws)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-left border ${
                    selectedWs?.id === ws.id 
                      ? 'bg-orange-50 border-orange-300 shadow-sm ring-1 ring-orange-300' 
                      : 'bg-white border-stone-200 hover:border-orange-300 hover:shadow-sm'
                  }`}
                >
                  <div className={`p-3 rounded-xl transition-colors ${
                    selectedWs?.id === ws.id ? 'bg-orange-100 text-orange-700' : 'bg-stone-50 text-slate-500'
                  }`}>
                    <FileText size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-bold truncate ${
                      selectedWs?.id === ws.id ? 'text-orange-800' : 'text-slate-700'
                    }`}>{ws.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {ws.zones && ws.zones.length > 0 && (
                        <span className="text-[10px] bg-violet-600 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                          Tương tác
                        </span>
                      )}
                      <p className="text-xs text-slate-500 truncate">Kích vào để xem</p>
                    </div>
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
