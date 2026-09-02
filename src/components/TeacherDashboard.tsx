import React, { useState, useRef } from 'react';
import { PieChart, Database, PlaySquare, Search, Plus, Edit2, Trash2, Users, CheckCircle, Clock, Upload, Gamepad2, Link as LinkIcon, FileText, UserPlus, Key, Layers } from 'lucide-react';
import { questionBank as initialQuestions } from '../data';
import { Question, StudentAccount, InteractiveZone } from '../types';
import { FileData } from '../App';
import InteractiveWorksheetBuilder from './InteractiveWorksheetBuilder';

type TeacherTab = 'stats' | 'questions' | 'worksheet' | 'content' | 'accounts';

export default function TeacherDashboard({
  worksheets,
  setWorksheets,
  questions,
  setQuestions,
  videos,
  setVideos,
  games,
  setGames,
  studentAccounts,
  setStudentAccounts
}: {
  worksheets: FileData[];
  setWorksheets: (v: FileData[]) => void;
  questions: Question[];
  setQuestions: (q: Question[]) => void;
  videos: FileData[];
  setVideos: (v: FileData[]) => void;
  games: FileData[];
  setGames: (v: FileData[]) => void;
  studentAccounts: StudentAccount[];
  setStudentAccounts: (a: StudentAccount[]) => void;
}) {
  const [activeTab, setActiveTab] = useState<TeacherTab>('stats');
  const [editingWorksheet, setEditingWorksheet] = useState<FileData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [newStudentName, setNewStudentName] = useState('');
  const [batchCount, setBatchCount] = useState<number>(50);
  const [accountSearch, setAccountSearch] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const worksheetInputRef = useRef<HTMLInputElement>(null);

  const filteredQuestions = questions.filter(q => 
    q.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleAddSingleAccount = () => {
    if (!newStudentName.trim()) return;
    const id = Date.now().toString();
    const newAcc: StudentAccount = {
      id,
      username: `hs${id.slice(-6)}`,
      name: newStudentName.trim(),
      password: '123'
    };
    setStudentAccounts([newAcc, ...studentAccounts]);
    setNewStudentName('');
  };

  const handleBatchCreate = () => {
    if (batchCount <= 0 || batchCount > 3000) return;
    const newAccs = Array.from({ length: batchCount }).map((_, i) => {
      const id = (Date.now() + i).toString();
      return {
        id,
        username: `hs${id.slice(-6)}${i}`,
        name: `Học sinh ${studentAccounts.length + i + 1}`,
        password: '123'
      };
    });
    setStudentAccounts([...newAccs, ...studentAccounts]);
  };

  const handleDeleteAccount = (id: string) => {
    setStudentAccounts(studentAccounts.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Teacher Navigation */}
      <div className="flex border-b border-stone-200 overflow-x-auto custom-scrollbar">
        {[
          { id: 'stats', label: 'Tổng quan lớp học', icon: PieChart },
          { id: 'accounts', label: 'Tài khoản học sinh', icon: UserPlus },
          { id: 'questions', label: 'Quản lý kho đề', icon: Database },
          { id: 'worksheet', label: 'Quản lý phiếu học tập', icon: FileText },
          { id: 'content', label: 'Cấu hình bài giảng', icon: PlaySquare },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TeacherTab)}
              className={`flex items-center gap-2 px-6 py-4 font-bold border-b-2 transition-colors ${
                isActive 
                  ? 'border-violet-600 text-violet-700' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-stone-300'
              }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="pt-2">
        {/* STATS TAB */}
        {activeTab === 'stats' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex items-start gap-4">
                <div className="p-3 bg-violet-100 text-violet-600 rounded-xl">
                  <Users size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Sĩ số tham gia</p>
                  <p className="text-3xl font-black text-violet-950">42<span className="text-lg text-slate-400 font-medium">/45</span></p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex items-start gap-4">
                <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Điểm trung bình</p>
                  <p className="text-3xl font-black text-violet-950">8.2</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex items-start gap-4">
                <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                  <Clock size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Thời lượng học (TB)</p>
                  <p className="text-3xl font-black text-violet-950">24<span className="text-lg text-slate-400 font-medium">p</span></p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-stone-100 bg-stone-50">
                <h3 className="font-bold text-violet-950">Học sinh cần chú ý (Điểm &lt; 5)</h3>
              </div>
              <div className="divide-y divide-stone-100">
                {['Nguyễn Văn A - Điểm: 4.5', 'Trần Thị B - Điểm: 3.0', 'Lê Hoàng C - Chưa làm bài'].map((student, i) => (
                  <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-stone-50 transition-colors">
                    <span className="font-medium text-slate-700">{student}</span>
                    <button className="text-violet-600 text-sm font-bold hover:underline">Nhắc nhở</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ACCOUNTS TAB */}
        {activeTab === 'accounts' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Thêm đơn lẻ */}
              <div className="bg-white p-6 border border-stone-200 rounded-2xl shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-violet-100 text-violet-600 rounded-lg">
                    <UserPlus size={20} />
                  </div>
                  <h3 className="font-bold text-violet-950">Thêm học sinh</h3>
                </div>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    placeholder="Họ tên học sinh..."
                    className="flex-1 px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                  <button
                    onClick={handleAddSingleAccount}
                    className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition-colors shrink-0"
                  >
                    Thêm
                  </button>
                </div>
              </div>

              {/* Thêm hàng loạt */}
              <div className="bg-white p-6 border border-stone-200 rounded-2xl shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                    <Users size={20} />
                  </div>
                  <h3 className="font-bold text-violet-950">Tạo tài khoản hàng loạt</h3>
                </div>
                <div className="flex gap-3 items-center">
                  <span className="text-sm font-medium text-slate-600">Số lượng:</span>
                  <input
                    type="number"
                    min="1"
                    max="3000"
                    value={batchCount}
                    onChange={(e) => setBatchCount(parseInt(e.target.value) || 0)}
                    className="w-24 px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                  <button
                    onClick={handleBatchCreate}
                    className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors"
                  >
                    Tạo nhanh
                  </button>
                </div>
              </div>
            </div>

            {/* Danh sách */}
            <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[500px]">
              <div className="p-4 border-b border-stone-100 bg-stone-50 flex items-center justify-between">
                <h3 className="font-bold text-violet-950">Danh sách tài khoản ({studentAccounts.length}/3000)</h3>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    value={accountSearch}
                    onChange={(e) => setAccountSearch(e.target.value)}
                    placeholder="Tìm theo tên hoặc user..."
                    className="w-full pl-9 pr-4 py-1.5 text-sm bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
              </div>
              
              <div className="flex-1 overflow-auto p-0">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-white sticky top-0 shadow-sm z-10">
                    <tr>
                      <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-stone-200">Họ và tên</th>
                      <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-stone-200">Tên đăng nhập</th>
                      <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-stone-200">Mật khẩu</th>
                      <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-stone-200 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {studentAccounts
                      .filter(a => a.name.toLowerCase().includes(accountSearch.toLowerCase()) || a.username.toLowerCase().includes(accountSearch.toLowerCase()))
                      .map((acc) => (
                        <tr key={acc.id} className="hover:bg-stone-50 transition-colors">
                          <td className="py-3 px-6 font-medium text-violet-950">{acc.name}</td>
                          <td className="py-3 px-6 font-mono text-sm text-violet-600">{acc.username}</td>
                          <td className="py-3 px-6 font-mono text-sm text-slate-500">{acc.password}</td>
                          <td className="py-3 px-6 text-right">
                            <button
                              onClick={() => handleDeleteAccount(acc.id)}
                              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Xóa tài khoản"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    {studentAccounts.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-slate-500">
                          Chưa có tài khoản học sinh nào. Hãy tạo mới.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* QUESTIONS TAB */}
        {activeTab === 'questions' && (
          <div className="bg-white border border-stone-200 rounded-2xl shadow-sm">
            <div className="p-6 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative max-w-md w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Tìm kiếm câu hỏi..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all text-sm font-medium"
                />
              </div>
              
              <input 
                type="file" 
                accept=".doc,.docx" 
                className="hidden" 
                ref={fileInputRef}
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    alert(`Đã tải lên tệp: ${e.target.files[0].name}.\nHệ thống đang phân tích các công thức chuẩn EQUATION (sử dụng font Cambria Math) và nhận dạng tự động cấu trúc câu hỏi...`);
                  }
                }}
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-xl font-bold transition-colors"
              >
                <Upload size={18} />
                Thêm câu hỏi
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50 text-slate-500 text-sm uppercase tracking-wider">
                    <th className="px-6 py-4 font-bold">Nội dung câu hỏi</th>
                    <th className="px-6 py-4 font-bold w-32">Độ khó</th>
                    <th className="px-6 py-4 font-bold w-32 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredQuestions.map((q, index) => (
                    <tr key={q.id} className="hover:bg-stone-50 transition-colors group">
                      <td className="px-6 py-4">
                        <p className="font-medium text-violet-950 line-clamp-2 math-content">
                          Câu {index + 1} ({q.difficulty === 'Nhận biết' ? 'NB' : q.difficulty === 'Thông hiểu' ? 'TH' : 'VD'}): {q.text}
                        </p>
                        <p className="text-sm text-slate-500 mt-1 line-clamp-1 math-content">Đáp án: {q.options[q.correctAnswerIndex]}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold uppercase ${
                          q.difficulty === 'Nhận biết' ? 'bg-orange-100 text-orange-700' :
                          q.difficulty === 'Thông hiểu' ? 'bg-orange-100 text-orange-700' :
                          'bg-rose-100 text-rose-700'
                        }`}>
                          {q.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors">
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(q.id)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredQuestions.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-6 py-12 text-center text-slate-500 font-medium">
                        Không tìm thấy câu hỏi nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* WORKSHEET TAB */}
        {activeTab === 'worksheet' && (
          <div className="bg-white border border-stone-200 rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-violet-950 mb-4 flex items-center gap-2">
              <FileText className="text-violet-500" /> Quản lý Phiếu học tập
            </h3>
            
            <div className="space-y-6 max-w-2xl">
              {worksheets.length > 0 && (
                <div className="space-y-3 mb-6">
                  {worksheets.map(ws => (
                    <div key={ws.id} className="p-4 bg-orange-50 border border-orange-200 rounded-xl text-orange-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="text-orange-500" />
                        <div>
                          <a href={ws.url} target="_blank" rel="noopener noreferrer" className="font-bold hover:underline break-all text-orange-700">
                            {ws.name} {ws.zones && ws.zones.length > 0 && <span className="ml-2 text-xs bg-violet-600 text-white px-2 py-0.5 rounded-full">Tương tác</span>}
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Only allow making interactive if it's an image, or we just allow it generally but text says Image */}
                        <button 
                          onClick={() => setEditingWorksheet(ws)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-2 text-sm font-bold"
                          title="Tạo phiếu tương tác"
                        >
                          <Layers size={18} /> <span className="hidden sm:inline">Tạo Tương tác</span>
                        </button>
                        <button 
                          onClick={() => setWorksheets(worksheets.filter(w => w.id !== ws.id))}
                          className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-100 rounded-lg transition-colors flex-shrink-0"
                          title="Xóa phiếu học tập"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                  <p className="text-sm text-slate-500">Kích vào tên phiếu để xem nội dung. Học sinh đã có thể xem và tải về các phiếu học tập này.</p>
                </div>
              )}

              <div className="space-y-4">
                <p className="text-sm text-slate-600 mb-2">Tải thêm phiếu học tập (định dạng PDF hoặc hình ảnh) để giao cho học sinh.</p>
                <input 
                  type="file" 
                  accept=".pdf,image/*" 
                  className="hidden" 
                  ref={worksheetInputRef}
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      const file = e.target.files[0];
                      const newWs = { id: Date.now().toString(), name: file.name, url: URL.createObjectURL(file) };
                      setWorksheets([...worksheets, newWs]);
                    }
                  }}
                />
                <button 
                  onClick={() => worksheetInputRef.current?.click()}
                  className="w-full py-8 border-2 border-dashed border-stone-300 text-slate-500 font-bold rounded-xl hover:border-violet-400 hover:text-violet-600 hover:bg-violet-50 transition-colors flex flex-col items-center justify-center gap-3"
                >
                  <Upload size={32} /> 
                  <span>Tải phiếu học tập lên (.pdf, .png, .jpg)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CONTENT CONFIG TAB */}
        {activeTab === 'content' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
              <h3 className="text-lg font-bold text-violet-950 mb-4 flex items-center gap-2">
                <PlaySquare className="text-violet-500" /> Cấu hình Video Tương Tác
              </h3>
              
              <div className="space-y-6">
                {videos.length > 0 && (
                  <div className="space-y-3 mb-6">
                    {videos.map(v => (
                      <div key={v.id} className="p-4 bg-violet-50 border border-violet-200 rounded-xl text-violet-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <PlaySquare className="text-violet-500" />
                          <p className="font-bold break-all text-violet-700">{v.name}</p>
                        </div>
                        <button 
                          onClick={() => setVideos(videos.filter(vid => vid.id !== v.id))}
                          className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-100 rounded-lg transition-colors flex-shrink-0"
                          title="Xóa video"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-4">
                  <p className="text-sm text-slate-600 mb-2">Tải thêm video bài giảng lên để bắt đầu chèn câu hỏi tương tác.</p>
                  <input 
                    type="file" 
                    accept="video/mp4" 
                    className="hidden" 
                    ref={videoInputRef}
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        const file = e.target.files[0];
                        const newVid = { id: Date.now().toString(), name: file.name, url: URL.createObjectURL(file) };
                        setVideos([...videos, newVid]);
                      }
                    }}
                  />
                  <button 
                    onClick={() => videoInputRef.current?.click()}
                    className="w-full py-8 border-2 border-dashed border-stone-300 text-slate-500 font-bold rounded-xl hover:border-violet-400 hover:text-violet-600 hover:bg-violet-50 transition-colors flex flex-col items-center justify-center gap-3"
                  >
                    <Upload size={32} /> 
                    <span>Tải video lên (.mp4)</span>
                  </button>
                </div>
                
                {videos.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-stone-100">
                    <p className="text-sm text-slate-600 mb-4 font-bold">Cấu hình câu hỏi (Demo hiển thị chung)</p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-stone-50 rounded-xl border border-stone-100">
                        <div>
                          <p className="font-bold text-violet-950">00:05</p>
                          <p className="text-sm text-slate-600">Câu hỏi: Mệnh đề là gì?</p>
                        </div>
                        <div className="flex gap-2">
                          <button className="text-slate-400 hover:text-violet-600"><Edit2 size={16} /></button>
                          <button className="text-slate-400 hover:text-rose-600"><Trash2 size={16} /></button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-stone-50 rounded-xl border border-stone-100">
                        <div>
                          <p className="font-bold text-violet-950">00:15</p>
                          <p className="text-sm text-slate-600">Câu hỏi: "Trời ơi!" có phải mệnh đề không?</p>
                        </div>
                        <div className="flex gap-2">
                          <button className="text-slate-400 hover:text-violet-600"><Edit2 size={16} /></button>
                          <button className="text-slate-400 hover:text-rose-600"><Trash2 size={16} /></button>
                        </div>
                      </div>
                      <button className="w-full py-3 border-2 border-dashed border-stone-200 text-slate-500 font-bold rounded-xl hover:border-violet-400 hover:text-violet-600 transition-colors flex items-center justify-center gap-2">
                        <Plus size={18} /> Thêm mốc thời gian
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
              <h3 className="text-lg font-bold text-violet-950 mb-4 flex items-center gap-2">
                <Gamepad2 className="text-orange-500" /> Cấu hình Game
              </h3>
              
              <div className="space-y-6">
                {games.length > 0 && (
                  <div className="space-y-3 mb-6">
                    {games.map(g => (
                      <div key={g.id} className="p-4 bg-orange-50 border border-orange-200 rounded-xl text-orange-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Gamepad2 className="text-orange-500" />
                          <a href={g.url} target="_blank" rel="noopener noreferrer" className="font-bold hover:underline break-all text-orange-700">
                            {g.name}
                          </a>
                        </div>
                        <button 
                          onClick={() => setGames(games.filter(gm => gm.id !== g.id))}
                          className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-100 rounded-lg transition-colors flex-shrink-0"
                          title="Xóa game"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-4">
                  <p className="text-sm text-slate-600">Nhập đường dẫn (link) của game tương tác mới (ví dụ: Wordwall, Quizizz, Blooket...).</p>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="https://..." 
                      className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all text-sm font-medium"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const val = e.currentTarget.value;
                          if (val) {
                            setGames([...games, { id: Date.now().toString(), name: val, url: val }]);
                            e.currentTarget.value = '';
                          }
                        }
                      }}
                    />
                  </div>
                  <button 
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling?.querySelector('input');
                      if (input && input.value) {
                        setGames([...games, { id: Date.now().toString(), name: input.value, url: input.value }]);
                        input.value = '';
                      }
                    }}
                    className="w-full py-3 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus size={18} /> Thêm game
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {editingWorksheet && (
        <InteractiveWorksheetBuilder 
          worksheet={editingWorksheet}
          onSave={(zones) => {
            setWorksheets(worksheets.map(ws => ws.id === editingWorksheet.id ? { ...ws, zones } : ws));
            setEditingWorksheet(null);
          }}
          onCancel={() => setEditingWorksheet(null)}
        />
      )}
    </div>
  );
}
