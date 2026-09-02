import React, { useState, useRef, useEffect } from 'react';
import { X, Check, Plus, Trash2 } from 'lucide-react';
import { FileData } from '../App';
import { InteractiveZone, ZoneType } from '../types';

export default function InteractiveWorksheetBuilder({ 
  worksheet, 
  onSave, 
  onCancel 
}: { 
  worksheet: FileData; 
  onSave: (zones: InteractiveZone[]) => void; 
  onCancel: () => void;
}) {
  const [zones, setZones] = useState<InteractiveZone[]>(worksheet.zones || []);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  
  const handleAddZone = (type: ZoneType) => {
    const newZone: InteractiveZone = {
      id: Date.now().toString(),
      x: 10,
      y: 10,
      width: type === 'text' ? 20 : 5,
      height: type === 'text' ? 5 : 5,
      type,
      correctAnswer: type === 'checkbox' ? 'false' : '',
    };
    setZones([...zones, newZone]);
    setSelectedZoneId(newZone.id);
  };

  const handleUpdateZone = (id: string, updates: Partial<InteractiveZone>) => {
    setZones(zones.map(z => z.id === id ? { ...z, ...updates } : z));
  };

  const handleDeleteZone = (id: string) => {
    setZones(zones.filter(z => z.id !== id));
    if (selectedZoneId === id) setSelectedZoneId(null);
  };

  // Logic for simple dragging (using percentages to be responsive)
  const handleMouseDown = (e: React.MouseEvent, zone: InteractiveZone) => {
    e.stopPropagation();
    setSelectedZoneId(zone.id);
    
    if (!imgRef.current) return;
    
    const imgRect = imgRef.current.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const startZoneX = zone.x;
    const startZoneY = zone.y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      
      const dxPercent = (dx / imgRect.width) * 100;
      const dyPercent = (dy / imgRect.height) * 100;
      
      handleUpdateZone(zone.id, {
        x: Math.max(0, Math.min(100 - zone.width, startZoneX + dxPercent)),
        y: Math.max(0, Math.min(100 - zone.height, startZoneY + dyPercent)),
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const selectedZone = zones.find(z => z.id === selectedZoneId);

  return (
    <div className="fixed inset-0 bg-stone-900/80 z-50 flex flex-col">
      <div className="bg-white p-4 flex justify-between items-center shadow-md">
        <div>
          <h2 className="text-xl font-bold text-violet-950">Chế độ Tạo Phiếu Tương Tác</h2>
          <p className="text-sm text-slate-500">Thêm các ô điền từ hoặc checkbox lên trên phiếu học tập</p>
        </div>
        <div className="flex gap-4 items-center">
          <button 
            onClick={() => handleAddZone('text')}
            className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-bold hover:bg-blue-100"
          >
            <Plus size={18} /> Ô điền từ (Text)
          </button>
          <button 
            onClick={() => handleAddZone('checkbox')}
            className="flex items-center gap-2 bg-orange-50 text-orange-700 px-4 py-2 rounded-lg font-bold hover:bg-orange-100"
          >
            <Plus size={18} /> Ô Checkbox
          </button>
          <button 
            onClick={() => handleAddZone('dropzone')}
            className="flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-lg font-bold hover:bg-amber-100"
          >
            <Plus size={18} /> Ô Ghép cột (Kéo thả)
          </button>
          <div className="w-px h-8 bg-stone-200 mx-2"></div>
          <button 
            onClick={onCancel}
            className="px-4 py-2 text-slate-500 hover:text-slate-800 font-bold"
          >
            Hủy
          </button>
          <button 
            onClick={() => onSave(zones)}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-lg font-bold shadow-sm"
          >
            <Check size={18} /> Lưu Tương Tác
          </button>
        </div>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        {/* Workspace */}
        <div className="flex-1 p-8 overflow-auto flex justify-center items-start bg-stone-100">
          <div className="relative shadow-xl w-full max-w-4xl bg-white rounded-sm">
            <img 
              ref={imgRef}
              src={worksheet.url} 
              alt="Worksheet" 
              className="w-full h-auto block rounded-sm pointer-events-none"
            />
            {zones.map(zone => (
              <div 
                key={zone.id}
                onMouseDown={(e) => handleMouseDown(e, zone)}
                className={`absolute border-2 cursor-move flex items-center justify-center text-xs font-bold shadow-sm ${
                  selectedZoneId === zone.id 
                    ? 'border-violet-500 bg-violet-500/30 z-10' 
                    : 'border-blue-500 bg-blue-500/20'
                }`}
                style={{
                  left: `${zone.x}%`,
                  top: `${zone.y}%`,
                  width: `${zone.width}%`,
                  height: `${zone.height}%`,
                }}
              >
                {zone.type === 'text' ? 'Text' : zone.type === 'checkbox' ? '✔' : 'Kéo thả'}
                
                {/* Resize Handle */}
                <div 
                  className="absolute -bottom-1 -right-1 w-3 h-3 bg-violet-600 rounded-full cursor-se-resize"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setSelectedZoneId(zone.id);
                    if (!imgRef.current) return;
                    const imgRect = imgRef.current.getBoundingClientRect();
                    const startX = e.clientX;
                    const startY = e.clientY;
                    const startW = zone.width;
                    const startH = zone.height;
                    
                    const handleMouseMove = (moveEvent: MouseEvent) => {
                      const dx = moveEvent.clientX - startX;
                      const dy = moveEvent.clientY - startY;
                      const dxPercent = (dx / imgRect.width) * 100;
                      const dyPercent = (dy / imgRect.height) * 100;
                      handleUpdateZone(zone.id, {
                        width: Math.max(1, startW + dxPercent),
                        height: Math.max(1, startH + dyPercent)
                      });
                    };
                    const handleMouseUp = () => {
                      document.removeEventListener('mousemove', handleMouseMove);
                      document.removeEventListener('mouseup', handleMouseUp);
                    };
                    document.addEventListener('mousemove', handleMouseMove);
                    document.addEventListener('mouseup', handleMouseUp);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Sidebar settings */}
        {selectedZone && (
          <div className="w-80 bg-white border-l border-stone-200 p-6 flex flex-col shadow-lg z-20">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-violet-950">Cài đặt ô</h3>
              <button onClick={() => setSelectedZoneId(null)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4 flex-1">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Loại ô</label>
                <div className="px-3 py-2 bg-stone-100 rounded-lg text-sm text-slate-600 font-medium capitalize">
                  {selectedZone.type === 'text' ? 'Điền từ (Text)' : selectedZone.type === 'checkbox' ? 'Hộp kiểm (Checkbox)' : 'Ghép cột (Kéo thả)'}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Đáp án đúng</label>
                {selectedZone.type === 'text' || selectedZone.type === 'dropzone' ? (
                  <input 
                    type="text"
                    value={selectedZone.correctAnswer}
                    onChange={(e) => handleUpdateZone(selectedZone.id, { correctAnswer: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="Nhập đáp án chính xác..."
                  />
                ) : (
                  <select 
                    value={selectedZone.correctAnswer}
                    onChange={(e) => handleUpdateZone(selectedZone.id, { correctAnswer: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    <option value="false">Sai (Không chọn)</option>
                    <option value="true">Đúng (Phải chọn)</option>
                  </select>
                )}
                <p className="text-xs text-slate-500 mt-2">Hệ thống sẽ dùng đáp án này để chấm điểm tự động.</p>
              </div>
            </div>
            
            <button 
              onClick={() => handleDeleteZone(selectedZone.id)}
              className="mt-6 flex items-center justify-center gap-2 w-full py-3 bg-rose-50 text-rose-600 rounded-xl font-bold hover:bg-rose-100 transition-colors"
            >
              <Trash2 size={18} /> Xóa ô này
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
