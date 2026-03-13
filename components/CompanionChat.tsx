
import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../geminiService';

interface CompanionMessage {
  role: 'user' | 'model';
  content: string;
}

const CompanionChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<CompanionMessage[]>([
    { role: 'model', content: '👋 Tôi là trợ lý tra cứu nhanh. Bạn cần giải thích thuật ngữ hoặc lệnh tắt nào?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      // Focus input khi mở
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setIsLoading(true);

    // Placeholder cho model response
    setMessages(prev => [...prev, { role: 'model', content: '' }]);

    await geminiService.sendCompanionMessage(userMsg, (chunk) => {
      setMessages(prev => {
        const newMsgs = [...prev];
        const lastMsg = newMsgs[newMsgs.length - 1];
        if (lastMsg.role === 'model') {
          lastMsg.content = chunk;
        }
        return newMsgs;
      });
    });

    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  const formatContent = (content: string, isUser: boolean) => {
    const parts = content.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const text = part.slice(2, -2);
        if (isUser) {
           return <strong key={index} className="font-bold text-white underline decoration-white/30 underline-offset-2">{text}</strong>;
        }
        return (
          <strong key={index} className="font-bold text-[#ee0033] bg-red-50 px-1 py-0.5 rounded border border-red-100 mx-0.5">
            {text}
          </strong>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="fixed bottom-24 sm:bottom-36 right-6 z-[120] flex flex-col items-end pointer-events-none">
      
      {/* Cửa sổ Chat */}
      <div 
        className={`pointer-events-auto bg-white w-80 sm:w-96 h-[380px] sm:h-[450px] rounded-2xl shadow-2xl border border-slate-200 flex flex-col mb-4 transition-all duration-300 origin-bottom-right transform ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4 pointer-events-none'}`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-3 rounded-t-2xl flex items-center justify-between text-white shadow-md">
           <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              </div>
              <div>
                 <h3 className="text-xs font-black uppercase tracking-wider">Tra cứu nhanh</h3>
                 <p className="text-[9px] text-slate-300">Companion AI</p>
              </div>
           </div>
           <button 
             onClick={() => setMessages([{ role: 'model', content: '👋 Sẵn sàng hỗ trợ tra cứu nhanh.' }])}
             className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
             title="Xóa hội thoại"
           >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
           </button>
        </div>

        {/* Messages */}
        <div className="flex-grow overflow-y-auto p-3 space-y-3 bg-slate-50 custom-scrollbar">
           {messages.map((msg, idx) => (
             <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-[12px] shadow-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-[#004B8D] text-white rounded-br-none' 
                      : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none'
                  }`}
                >
                  {msg.role === 'model' && msg.content === '' && isLoading ? (
                     <div className="flex gap-1 py-1">
                        <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce"></span>
                        <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                        <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                     </div>
                  ) : (
                    <div className="whitespace-pre-wrap">{formatContent(msg.content, msg.role === 'user')}</div>
                  )}
                </div>
             </div>
           ))}
           <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 bg-white border-t border-slate-100 rounded-b-2xl">
           <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Nhập từ khóa, lệnh tắt..."
                className="w-full bg-slate-100 border-none rounded-xl py-2.5 pl-3 pr-10 text-xs text-slate-800 focus:ring-2 focus:ring-[#004B8D]/20 focus:bg-white transition-all shadow-inner"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="absolute right-1 top-1 p-1.5 bg-[#004B8D] text-white rounded-lg hover:bg-[#003d73] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
           </div>
        </div>
      </div>

      {/* Nút Toggle (FAB) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`pointer-events-auto group flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 ${isOpen ? 'bg-slate-700 rotate-90' : 'bg-[#ee0033] animate-bounce-slow'}`}
        title={isOpen ? "Đóng Companion" : "Mở Trợ lý tra cứu nhanh"}
      >
         {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
         ) : (
            <div className="relative">
               <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
               <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping"></span>
            </div>
         )}
      </button>

    </div>
  );
};

export default CompanionChat;
