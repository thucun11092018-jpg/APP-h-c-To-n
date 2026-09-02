import React, { useState } from 'react';
import { Gamepad2, ExternalLink } from 'lucide-react';
import { FileData } from '../App';

export default function GameSection({ games }: { games: FileData[] }) {
  const [selectedGame, setSelectedGame] = useState<FileData | null>(null);

  if (!games || games.length === 0) {
    return (
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mb-6 rotate-3">
          <Gamepad2 className="text-slate-400" size={40} />
        </div>
        <h2 className="text-2xl font-bold text-violet-950 mb-2">Chưa có Game tương tác</h2>
        <p className="text-slate-500 max-w-md">Giáo viên chưa thiết lập game cho bài giảng này. Vui lòng quay lại sau nhé!</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Left Column: Content */}
        <div className="flex-1 min-w-0 space-y-6 w-full">
          {!selectedGame ? (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl shadow-sm border border-stone-200 min-h-[500px] text-center">
              <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-6">
                <Gamepad2 className="text-orange-400" size={40} />
              </div>
              <h2 className="text-2xl font-bold text-violet-950 mb-2">Chưa chọn game</h2>
              <p className="text-slate-500 max-w-sm">Hãy chọn một game từ danh sách bên phải để bắt đầu chơi.</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-16 bg-white rounded-3xl shadow-sm border border-stone-200 min-h-[500px] text-center">
              <div className="w-24 h-24 bg-orange-100 text-orange-500 rounded-3xl flex items-center justify-center mb-8 rotate-3">
                <Gamepad2 size={48} />
              </div>
              <h2 className="text-3xl font-black text-violet-950 mb-4">{selectedGame.name}</h2>
              <p className="text-slate-600 mb-10 max-w-md">Giáo viên đã chuẩn bị trò chơi này để ôn tập kiến thức. Nhấn vào nút bên dưới để mở game trong tab mới nhé!</p>
              
              <a 
                href={selectedGame.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-orange-500 hover:bg-orange-600 text-white px-10 py-5 rounded-2xl font-bold text-xl transition-all hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Chơi Game Ngay <ExternalLink size={24} />
              </a>
            </div>
          )}
        </div>

        {/* Right Column: List */}
        <div className="w-full md:w-80 lg:w-96 shrink-0 md:sticky md:top-6">
          <div className="bg-stone-50 p-6 rounded-3xl border border-stone-100">
            <h2 className="text-lg font-bold text-violet-950 mb-4 flex items-center gap-2">
              <Gamepad2 className="text-orange-500" size={20} />
              Danh sách game
            </h2>
            <div className="space-y-3 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
              {games.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setSelectedGame(g)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-left border ${
                    selectedGame?.id === g.id 
                      ? 'bg-orange-50 border-orange-300 shadow-sm ring-1 ring-orange-300' 
                      : 'bg-white border-stone-200 hover:border-orange-300 hover:shadow-sm'
                  }`}
                >
                  <div className={`p-3 rounded-xl transition-colors ${
                    selectedGame?.id === g.id ? 'bg-orange-100 text-orange-700' : 'bg-stone-50 text-slate-500'
                  }`}>
                    <Gamepad2 size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-bold truncate ${
                      selectedGame?.id === g.id ? 'text-orange-800' : 'text-slate-700'
                    }`}>{g.name}</h3>
                    <p className="text-xs text-slate-500 truncate">Kích vào để chọn</p>
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
