
import React, { useState, useRef, useEffect } from 'react';

interface ChatInputProps {
  onSend: (message: string, image?: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const suggestions = [
    { label: '🚀 Alpha BIM?', query: 'Giới thiệu về bộ công cụ Alpha BIM cho Revit.' },
    { label: '🏗️ Vẽ dầm', query: 'Hướng dẫn sử dụng tính năng vẽ dầm nhanh.' },
    { label: '📊 Thống kê', query: 'Cách sử dụng Alpha BIM để thống kê thép.' },
    { label: '🚀 ModPlus?', query: 'Giới thiệu về bộ công cụ ModPlus.' },
    { label: '🧩 Naviate?', query: 'Giải thích về công cụ Symetri Naviate.' },
  ];

  useEffect(() => {
    // Xử lý sự kiện Paste (Ctrl + V) toàn cục cho vùng ChatInput
    const handleGlobalPaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (items) {
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') !== -1) {
            e.preventDefault();
            const blob = items[i].getAsFile();
            if (blob) {
              const reader = new FileReader();
              reader.onload = (event) => {
                setSelectedImage(event.target?.result as string);
              };
              reader.readAsDataURL(blob);
            }
            return;
          }
        }
      }
    };

    window.addEventListener('paste', handleGlobalPaste);

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'vi-VN';

      recognition.onstart = () => {
        setIsListening(true);
        setMicError(null);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput(prev => prev + (prev ? ' ' : '') + transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        if (event.error === 'not-allowed') {
          setMicError('Quyền truy cập Micro bị từ chối');
          alert('Lỗi: Quyền truy cập Micro bị chặn. \n\nHướng dẫn khắc phục:\n1. Nhấn vào biểu tượng "Ổ khóa" hoặc "Cài đặt" trên thanh địa chỉ trình duyệt.\n2. Cho phép (Allow) quyền Micro.\n3. Tải lại trang và thử lại.');
        } else if (event.error === 'no-speech') {
          // Silent error
        } else {
          setMicError(`Lỗi Micro: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      window.removeEventListener('paste', handleGlobalPaste);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleSend = (text?: string) => {
    const messageToSend = text || input;
    if ((messageToSend.trim() || selectedImage) && !isLoading) {
      onSend(messageToSend, selectedImage || undefined);
      if (!text) {
          setInput('');
          setSelectedImage(null);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleListening = async () => {
    if (!recognitionRef.current) {
      alert('Trình duyệt của bạn không hỗ trợ nhận diện giọng nói. Hãy thử Chrome hoặc Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
        alert('Tính năng giọng nói yêu cầu kết nối bảo mật (HTTPS).');
        return;
      }

      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          await navigator.mediaDevices.getUserMedia({ audio: true });
        }
        recognitionRef.current.start();
      } catch (err: any) {
        console.error('Failed to start recognition:', err);
        setIsListening(false);
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setMicError('Quyền Micro bị chặn');
          alert('Quyền truy cập Microphone bị từ chối. Vui lòng mở cài đặt trình duyệt để cho phép.');
        }
      }
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    // Reset file input so user can select the same file again if they cleared it
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const handlePasteClick = async () => {
    try {
      // Thử đọc từ Clipboard API (Chrome, Edge, Safari mới)
      const clipboardItems = await navigator.clipboard.read();
      let imageFound = false;

      for (const item of clipboardItems) {
        // Tìm các loại ảnh trong clipboard
        const imageType = item.types.find(type => type.startsWith('image/'));
        if (imageType) {
          const blob = await item.getType(imageType);
          const reader = new FileReader();
          reader.onload = (e) => {
             setSelectedImage(e.target?.result as string);
          };
          reader.readAsDataURL(blob);
          imageFound = true;
          break;
        }
      }

      if (!imageFound) {
         alert("📋 Không tìm thấy ảnh trong bộ nhớ tạm!\n\n💡 Gợi ý: Nhấn 'Windows + Shift + S' để mở Snipping Tool, chụp vùng lỗi trên Revit, sau đó nhấn nút Dán này (hoặc Ctrl + V).");
      }

    } catch (err) {
      console.error("Lỗi đọc clipboard:", err);
      // Fallback nếu trình duyệt chặn quyền đọc
      alert("⚠️ Hãy nhấn phím tắt 'Ctrl + V' để dán ảnh trực tiếp từ Snipping Tool vào ô chat.");
    }
  };

  const removeImage = () => {
      setSelectedImage(null);
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 100)}px`;
    }
  }, [input]);

  return (
    <div className="flex flex-col gap-2 sm:gap-3 w-full">
      {/* Suggestions bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
        <div className="flex gap-1.5 sm:gap-2">
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(s.query)}
              disabled={isLoading}
              className="flex-shrink-0 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-slate-50 border border-slate-200 text-[10px] sm:text-[11px] font-bold text-slate-600 hover:bg-[#ee0033]/5 hover:border-[#ee0033]/30 hover:text-[#ee0033] transition-all whitespace-nowrap shadow-sm disabled:opacity-50"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Image Preview */}
      {selectedImage && (
          <div className="relative inline-block w-fit group">
              <img src={selectedImage} alt="Preview" className="h-20 w-auto rounded-lg border border-slate-200 shadow-sm object-cover" />
              <button 
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-slate-800 text-white rounded-full flex items-center justify-center shadow-md hover:bg-[#ee0033] transition-colors"
                  title="Xóa ảnh"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
          </div>
      )}

      {/* Input bar */}
      <div className="relative flex items-end gap-1.5 sm:gap-2 bg-white border border-slate-200 rounded-xl sm:rounded-2xl p-1.5 sm:p-2 shadow-sm focus-within:ring-2 focus-within:ring-[#ee0033]/10 transition-all">
        
        {/* Microphone Button */}
        <div className="relative flex-shrink-0">
          <button
            onClick={toggleListening}
            disabled={isLoading}
            title={isListening ? "Dừng nghe" : "Nói để nhập liệu"}
            className={`w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl flex items-center justify-center transition-all ${
              isListening 
                ? 'bg-[#ee0033] text-white ring-4 ring-red-100' 
                : micError 
                ? 'bg-red-50 text-red-400 border border-red-200'
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-[#ee0033]'
            }`}
          >
            {isListening ? (
               <div className="flex gap-0.5 items-center">
                <span className="w-1 h-3 bg-white rounded-full animate-bounce"></span>
                <span className="w-1 h-5 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1 h-3 bg-white rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" sm-width="20" sm-height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
            )}
          </button>
          {micError && (
            <div className="absolute -top-10 left-0 bg-red-600 text-white text-[9px] px-2 py-1 rounded whitespace-nowrap animate-fade-in shadow-lg">
              {micError}
            </div>
          )}
        </div>

        {/* Upload Image Button (Standard File Picker) */}
        <div className="relative flex-shrink-0">
            <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/*" 
                className="hidden" 
            />
            <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                title="Tải ảnh từ máy (C:\Users\...)"
                className={`w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl flex items-center justify-center transition-all bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-[#ee0033] ${selectedImage ? 'text-[#ee0033] bg-red-50' : ''}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" sm-width="20" sm-height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            </button>
        </div>

        {/* Paste from Clipboard Button (Replaces Screenshot) */}
        <div className="relative flex-shrink-0">
            <button
                onClick={handlePasteClick}
                disabled={isLoading}
                title="Dán ảnh từ Snipping Tool (Win + Shift + S)"
                className={`w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl flex items-center justify-center transition-all bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-[#ee0033]`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" sm-width="20" sm-height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="15" y2="16"/></svg>
            </button>
        </div>

        <textarea
          ref={textareaRef}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? "Đang nghe..." : micError ? "Lỗi Micro" : selectedImage ? "Mô tả vấn đề trong ảnh..." : "Dán ảnh (Ctrl+V) hoặc hỏi..."}
          className={`flex-grow bg-transparent border-none focus:ring-0 resize-none py-2 px-0.5 text-sm max-h-[100px] sm:max-h-[120px] custom-scrollbar min-w-0 ${micError ? 'placeholder-red-300' : 'text-slate-800'}`}
          disabled={isLoading}
        />

        <button
          onClick={() => handleSend()}
          disabled={(!input.trim() && !selectedImage) || isLoading}
          className={`flex-shrink-0 w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl flex items-center justify-center transition-all shadow-md ${
            (input.trim() || selectedImage) && !isLoading
              ? 'bg-[#ee0033] text-white hover:bg-[#d4002e] hover:shadow-lg hover:scale-105 active:scale-95'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" sm-width="22" sm-height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
