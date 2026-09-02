import React, { useState } from 'react';
import { PlaySquare, FileText, Gamepad2, GraduationCap, LayoutDashboard, UserCircle, ShieldCheck, Bot } from 'lucide-react';
import VideoSection from './components/VideoSection';
import WorksheetSection from './components/WorksheetSection';
import GameSection from './components/GameSection';
import QuizSection from './components/QuizSection';
import TeacherDashboard from './components/TeacherDashboard';
import AIAssistant from './components/AIAssistant';
import { questionBank as initialQuestions } from './data';
import { Question, StudentAccount, InteractiveZone } from './types';

export interface FileData {
  id: string;
  name: string;
  url: string;
  zones?: InteractiveZone[];
}

type Tab = 'video' | 'worksheet' | 'game' | 'quiz';
type Role = 'student' | 'teacher' | 'assistant';

export default function App() {
  const [role, setRole] = useState<Role>('student');
  const [activeTab, setActiveTab] = useState<Tab>('video');
  const [worksheets, setWorksheets] = useState<FileData[]>([]);
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [videos, setVideos] = useState<FileData[]>([]);
  const [games, setGames] = useState<FileData[]>([]);
  const [studentAccounts, setStudentAccounts] = useState<StudentAccount[]>([]);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const logoInputRef = React.useRef<HTMLInputElement>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoUrl(URL.createObjectURL(file));
    }
  };

  const studentTabs = [
    { id: 'video', label: 'Video Tương Tác', icon: PlaySquare, color: 'text-violet-500' },
    { id: 'worksheet', label: 'Phiếu Học Tập', icon: FileText, color: 'text-orange-500' },
    { id: 'game', label: 'Game Tương Tác', icon: Gamepad2, color: 'text-orange-500' },
    { id: 'quiz', label: 'Luyện Tập', icon: GraduationCap, color: 'text-blue-500' },
  ] as const;

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-violet-950 font-sans selection:bg-violet-100">
      {/* Top Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={logoInputRef} 
              onChange={handleLogoChange} 
            />
            <button 
              onClick={() => logoInputRef.current?.click()}
              title="Nhấn để thay đổi logo"
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all hover:opacity-80 hover:scale-105 overflow-hidden shrink-0 ${logoUrl ? 'bg-transparent' : 'bg-white shadow-sm border-2 border-dashed border-violet-400'}`}
            >
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-full h-full object-cover scale-[1.15]" />
              ) : (
                <LayoutDashboard className="text-violet-500" size={24} />
              )}
            </button>
            <div>
              <h1 className="font-extrabold text-lg text-violet-950 leading-tight">JOURNEY X</h1>
              <p className={`text-xs font-semibold uppercase tracking-wider ${role === 'teacher' ? 'text-violet-600' : 'text-violet-600'}`}>
                Toán 10 - Bài 1: Mệnh Đề
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Role Switcher */}
            <div className="flex bg-stone-100 p-1 rounded-lg">
              <button
                onClick={() => setRole('student')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-bold transition-all ${
                  role === 'student' ? 'bg-white shadow-sm text-violet-600' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <UserCircle size={16} /> Học sinh
              </button>
              <button
                onClick={() => setRole('teacher')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-bold transition-all ${
                  role === 'teacher' ? 'bg-white shadow-sm text-violet-600' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <ShieldCheck size={16} /> Giáo viên
              </button>
              <button
                onClick={() => setRole('assistant')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-bold transition-all ${
                  role === 'assistant' ? 'bg-white shadow-sm text-violet-600' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Bot size={16} /> Trợ lý AI
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {role === 'assistant' ? (
          <AIAssistant />
        ) : role === 'student' ? (
          <>
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-black text-violet-950 mb-3">Góc Học Tập</h2>
              <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                Hoàn thành các hoạt động học tập dưới đây để nắm vững khái niệm mệnh đề, mệnh đề phủ định và mệnh đề kéo theo.
              </p>
            </div>

            {/* Student Navigation Tabs */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {studentTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as Tab)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-200 ${
                      isActive 
                        ? 'bg-white shadow-md text-violet-950 border-2 border-transparent scale-105' 
                        : 'bg-white/50 text-slate-500 border-2 border-stone-100 hover:bg-white hover:border-stone-200'
                    }`}
                  >
                    <Icon size={18} className={isActive ? tab.color : 'text-slate-400'} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Student Tab Content Area */}
            <div className="pb-24">
              {activeTab === 'video' && <VideoSection videos={videos} />}
              {activeTab === 'worksheet' && <WorksheetSection worksheets={worksheets} />}
              {activeTab === 'game' && <GameSection games={games} />}
              {activeTab === 'quiz' && <QuizSection questions={questions} />}
            </div>
          </>
        ) : (
          /* Teacher View */
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-black text-violet-950 mb-2">Bảng điều khiển Giáo viên</h2>
              <p className="text-slate-600">Quản lý lớp học, theo dõi tiến độ và cấu hình nội dung bài giảng.</p>
            </div>
            <TeacherDashboard 
              worksheets={worksheets} 
              setWorksheets={setWorksheets} 
              questions={questions}
              setQuestions={setQuestions}
              videos={videos}
              setVideos={setVideos}
              games={games}
              setGames={setGames}
              studentAccounts={studentAccounts}
              setStudentAccounts={setStudentAccounts}
            />
          </>
        )}
      </main>
    </div>
  );
}
