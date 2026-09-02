import React, { useState, useRef, useEffect } from 'react';
import { Bot, User, Send, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'model';
  content: string;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: 'Chào em! Cô là trợ lý AI môn Toán lớp 10. Em cần cô hỗ trợ vấn đề gì?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    
    // Check if the last message was a user message (in case of a previous error)
    const isRetry = messages.length > 0 && messages[messages.length - 1].role === 'user';
    
    if (!isRetry) {
      setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    }
    
    // We construct the history. If it's a retry, the history is everything before the last user message.
    const historyToUse = isRetry 
      ? messages.slice(0, -1).map(m => ({ role: m.role, parts: [{ text: m.content }] }))
      : messages.map(m => ({ role: m.role, parts: [{ text: m.content }] }));

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: userMessage,
          history: historyToUse
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.text || 'Có lỗi xảy ra khi kết nối với trợ lý. Vui lòng thử lại.');
      }
      
      // If it's a retry, we already have the user message in state, otherwise it was just added.
      // Now add the model response.
      setMessages(prev => {
        // Just to be perfectly safe, if isRetry was true, we ensure we don't duplicate
        const newMessages = isRetry ? prev.slice(0, -1) : prev;
        return [...newMessages, { role: 'user', content: userMessage }, { role: 'model', content: data.text }];
      });
    } catch (err: any) {
      setError(err.message || 'Lỗi kết nối');
      // If it wasn't a retry initially, but it failed, we already added the user message. 
      // It stays in the list, so the user can see what they sent.
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden flex flex-col h-[700px]">
        {/* Header */}
        <div className="bg-violet-950 p-6 flex items-center gap-4 text-white">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Bot size={28} className="text-violet-200" />
          </div>
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              Trợ lý Học tập AI <Sparkles size={18} className="text-orange-400" />
            </h2>
            <p className="text-violet-200 text-sm">Toán 10 - Sẵn sàng giải đáp mọi thắc mắc của em</p>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-stone-50 space-y-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center shadow-sm ${
                msg.role === 'user' ? 'bg-orange-500 text-white' : 'bg-violet-100 text-violet-700'
              }`}>
                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className={`max-w-[80%] rounded-2xl px-5 py-4 shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-orange-500 text-white rounded-tr-sm' 
                  : 'bg-white border border-stone-200 text-slate-700 rounded-tl-sm'
              }`}>
                <div className={`prose prose-sm max-w-none ${msg.role === 'user' ? 'prose-invert' : ''}`}>
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4">
              <div className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center bg-violet-100 text-violet-700 shadow-sm">
                <Bot size={20} />
              </div>
              <div className="bg-white border border-stone-200 rounded-2xl rounded-tl-sm px-6 py-4 shadow-sm flex items-center gap-2">
                <Loader2 size={18} className="animate-spin text-violet-500" />
                <span className="text-slate-500 font-medium">Trợ lý đang suy nghĩ...</span>
              </div>
            </div>
          )}
          {error && (
            <div className="flex justify-center">
              <div className="bg-rose-50 text-rose-600 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                <AlertCircle size={16} /> {error}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-stone-200">
          <form onSubmit={handleSend} className="relative max-w-4xl mx-auto flex items-end gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập câu hỏi của em vào đây..."
              className="flex-1 bg-stone-100 border border-stone-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-shadow"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="w-14 h-14 shrink-0 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
