
import React, { useMemo } from 'react';
import { Message } from '../types';
import { MANUAL_URLS } from '../constants';

interface ExtendedMessage extends Message {
  groundingMetadata?: any;
}

interface ChatMessageProps {
  message: ExtendedMessage;
  onOpenPdf?: (url: string, pageLabel?: string) => void;
  onSuggestionClick?: (suggestion: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onOpenPdf, onSuggestionClick }) => {
  const isModel = message.role === 'model';

  // Tách nội dung chính và nội dung gợi ý (nếu có)
  const { mainContent, suggestions } = useMemo(() => {
    if (!isModel || !message.content) return { mainContent: message.content, suggestions: [] };
    
    const parts = message.content.split('---SUGGESTION---');
    const main = parts[0].trim();
    const suggestionPart = parts[1] ? parts[1].trim() : '';
    
    // Nếu có suggestionPart, tách theo dấu |
    const suggestionList = suggestionPart 
        ? suggestionPart.split('|').map(s => s.trim()).filter(s => s.length > 0) 
        : [];

    return { mainContent: main, suggestions: suggestionList };
  }, [message.content, isModel]);

  const renderFormattedContent = (content: string) => {
    if (!content) return null;
    
    // Tách nội dung theo mẫu 📌 Nguồn. 
    // Sử dụng capture group để giữ lại token 📌 cho bước xử lý sau
    const parts = content.split(/(📌 Nguồn:?.*(?:\r?\n|$))/gm);
    
    return parts.map((part, index) => {
      const partTrimmed = part.trim();
      if (!partTrimmed && part !== " ") return null;

      if (partTrimmed.startsWith('📌')) {
        const citationLine = partTrimmed.replace(/^📌\s*Nguồn:?\s*/i, '').trim(); 
        const citationParts = citationLine.split('|').map(p => p.trim());
        
        const manualName = citationParts[0] || "Sổ tay Revit-01";
        const bàiInfo = citationParts[1] || "Bài 1";
        const trangInfo = citationParts[2] || "Trang 1";
        
        const bàiMatch = bàiInfo.match(/Bài\s*(\d+)|B(\d+)/i);
        const bàiNum = bàiMatch ? (bàiMatch[1] || bàiMatch[2]) : '1';
        
        const nameLower = manualName.toLowerCase();
        let manualPrefix = 'REVIT_01';
        let colorClass = 'text-emerald-700 bg-emerald-50/60 border-emerald-200/50 hover:bg-emerald-100/80 hover:border-emerald-400';
        let iconBg = 'bg-emerald-600';
        let label = 'ST-01';

        if (nameLower.includes('thực chiến') || nameLower.includes('2018')) {
            manualPrefix = 'REVIT_2018';
            colorClass = 'text-[#004B8D] bg-blue-50/60 border-blue-200/50 hover:bg-blue-100/80 hover:border-blue-400';
            iconBg = 'bg-[#004B8D]';
            label = 'TC-18';
        } else if (nameLower.includes('02') || nameLower.includes('tập 2')) {
            manualPrefix = 'REVIT_02';
            colorClass = 'text-amber-700 bg-amber-50/60 border-amber-200/50 hover:bg-amber-100/80 hover:border-amber-400';
            iconBg = 'bg-amber-600';
            label = 'ST-02';
        }

        const key = `${manualPrefix}_BAI_${bàiNum}` as keyof typeof MANUAL_URLS;
        const url = MANUAL_URLS[key] || MANUAL_URLS.REVIT_01_BAI_1;

        return (
          <button 
            key={index}
            onClick={(e) => {
              e.preventDefault();
              if (onOpenPdf) onOpenPdf(url, trangInfo);
            }}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 sm:px-1.5 sm:py-0.5 ml-1 mr-1 mb-1 rounded border text-[10px] sm:text-[8.5px] font-black transition-all backdrop-blur-sm active:scale-95 hover:scale-[1.03] shadow-sm select-none ${colorClass}`}
            title={`Mở ${manualName} - ${bàiInfo}`}
          >
            <div className={`w-4 h-4 sm:w-3.5 sm:h-3.5 rounded-[3px] flex items-center justify-center text-white shadow-sm flex-shrink-0 ${iconBg}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
            </div>
            <span className="uppercase tracking-tighter opacity-90">{label} • {trangInfo}</span>
          </button>
        );
      }

      // Xử lý văn bản thường, xóa các ký tự xuống dòng ở cuối nếu ngay sau nó là một part trích dẫn
      let textContent = part;
      const nextPart = parts[index + 1];
      if (nextPart && nextPart.trim().startsWith('📌')) {
          textContent = textContent.replace(/\s+$/, ''); // Xóa khoảng trắng và xuống dòng ở cuối
      }

      const subParts = textContent.split(/(\*\*.*?\*\*|^### .*$)/gm);
      return (
        <span key={index}>
          {subParts.map((sub, i) => {
            const subTrimmed = sub.trim();
            if (!subTrimmed && sub !== " ") return null;
            if (subTrimmed.startsWith('### ')) return <div key={i} className="font-black text-[#004B8D] text-[12.5px] mt-4 mb-2 border-l-4 border-[#ee0033] pl-3 py-1 bg-slate-50/50 rounded-r-lg uppercase tracking-tight backdrop-blur-sm shadow-sm">{subTrimmed.replace('### ', '')}</div>;
            if (subTrimmed.startsWith('**') && subTrimmed.endsWith('**')) {
                const content = subTrimmed.slice(2, -2);
                // Highlight "Bước X" specifically
                if (content.toLowerCase().startsWith('bước')) {
                    return (
                        <React.Fragment key={i}>
                            <div className="h-2 w-full" />
                            <strong className="font-black text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200 shadow-sm uppercase tracking-tight text-[10px] inline-block align-middle mb-1">
                                {content}
                            </strong>
                        </React.Fragment>
                    );
                }
                return <strong key={i} className="font-bold text-[#ee0033] bg-red-50/50 px-1 py-0.5 rounded mx-0.5 border border-red-100/30">{content}</strong>;
            }

            // Xử lý URL để tạo liên kết clickable
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            
            // Regex cho mẫu YouTube đầy đủ: [Tiêu đề] (Nguồn): URL
            const youtubeFullRegex = /\[(.*?)\]\s*\((.*?)\):\s*(https?:\/\/(?:www\.)?(?:youtube\.com|youtu\.be)\/[^\s]+)/g;

            if (youtubeFullRegex.test(sub)) {
                const parts = sub.split(youtubeFullRegex);
                return (
                    <span key={i}>
                        {parts.map((part, idx) => {
                            const groupIdx = idx % 4;
                            if (groupIdx === 0) {
                                // Văn bản thường giữa các link
                                if (!part) return null;
                                if (urlRegex.test(part)) {
                                    const urlParts = part.split(urlRegex);
                                    return (
                                        <span key={idx}>
                                            {urlParts.map((urlPart, urlIdx) => {
                                                if (urlPart.match(urlRegex)) {
                                                    const isYouTube = urlPart.includes('youtube.com') || urlPart.includes('youtu.be');
                                                    if (isYouTube) {
                                                        return (
                                                            <a 
                                                                key={urlIdx} 
                                                                href={urlPart} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-2 sm:py-0.5 rounded-md bg-red-600 text-white hover:bg-red-700 transition-all shadow-sm mx-1 my-0.5 align-middle text-[11px] sm:text-[10px] font-bold group relative z-10 cursor-pointer"
                                                                title="Xem video trên YouTube"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="group-hover:scale-110 transition-transform pointer-events-none"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                                                                <span className="tracking-tighter uppercase pointer-events-none">YouTube</span>
                                                            </a>
                                                        );
                                                    }
                                                    return (
                                                        <a 
                                                            key={urlIdx} 
                                                            href={urlPart} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 hover:text-blue-800 underline break-all font-medium decoration-blue-300 underline-offset-2 relative z-10 cursor-pointer"
                                                        >
                                                            {urlPart}
                                                        </a>
                                                    );
                                                }
                                                return urlPart;
                                            })}
                                        </span>
                                    );
                                }
                                return part;
                            }
                            if (groupIdx === 1) {
                                // Bắt đầu một cụm link YouTube đầy đủ
                                const title = part;
                                const source = parts[idx + 1];
                                const url = parts[idx + 2];
                                return (
                                    <a 
                                        key={idx} 
                                        href={url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center flex-wrap gap-2 p-1.5 px-3 rounded-xl bg-red-50 border border-red-200 hover:bg-red-100 hover:border-red-400 transition-all group shadow-sm mx-1 my-1.5 align-middle relative z-10 cursor-pointer"
                                        title={`Xem video: ${title}`}
                                    >
                                        <span className="text-[12px] sm:text-[13px] font-black text-slate-800 leading-tight truncate max-w-[220px] sm:max-w-[350px] group-hover:text-red-700 transition-colors">{title}</span>
                                        <span className="text-[10px] text-slate-500 font-bold italic opacity-70 hidden sm:inline">({source})</span>
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-600 text-white text-[10px] font-black uppercase shadow-md group-hover:bg-red-700 group-hover:scale-105 transition-all">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="pointer-events-none"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                                            YOUTUBE
                                        </div>
                                    </a>
                                );
                            }
                            // idx % 4 === 2 (source) và 3 (url) đã được xử lý ở groupIdx === 1
                            return null;
                        })}
                    </span>
                );
            }

            if (urlRegex.test(sub)) {
                const urlParts = sub.split(urlRegex);
                return (
                    <span key={i}>
                        {urlParts.map((urlPart, urlIdx) => {
                            if (urlPart.match(urlRegex)) {
                                const isYouTube = urlPart.includes('youtube.com') || urlPart.includes('youtu.be');
                                if (isYouTube) {
                                    return (
                                        <a 
                                            key={urlIdx} 
                                            href={urlPart} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-2 sm:py-0.5 rounded-md bg-red-600 text-white hover:bg-red-700 transition-all shadow-sm mx-1 my-0.5 align-middle text-[11px] sm:text-[10px] font-bold group relative z-10 cursor-pointer"
                                            title="Xem video trên YouTube"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="group-hover:scale-110 transition-transform pointer-events-none"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                                            <span className="tracking-tighter uppercase pointer-events-none">YouTube</span>
                                        </a>
                                    );
                                }
                                return (
                                    <a 
                                        key={urlIdx} 
                                        href={urlPart} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 underline break-all font-medium decoration-blue-300 underline-offset-2 relative z-10 cursor-pointer"
                                    >
                                        {urlPart}
                                    </a>
                                );
                            }
                            return urlPart;
                        })}
                    </span>
                );
            }

            return <span key={i}>{sub}</span>;
          })}
        </span>
      );
    });
  };

  return (
    <div className={`flex w-full mb-3 sm:mb-4 ${isModel ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex w-full max-w-[98%] md:max-w-[90%] lg:max-w-[82%] ${isModel ? 'flex-col items-start' : 'flex-row-reverse'}`}>
        
        {/* Bong bóng chat */}
        <div className={`flex w-full ${isModel ? 'flex-row' : 'flex-row-reverse'}`}>
            <div className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shadow-md border transition-all ${isModel ? 'bg-white border-[#ee0033] mr-2 sm:mr-3' : 'bg-[#004B8D] border-[#004B8D] text-white ml-2 sm:ml-3'}`}>
            {isModel ? <span className="text-[7px] sm:text-[9px] font-black text-[#ee0033]">BIM</span> : <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
            </div>
            <div className={`p-3 sm:p-3.5 rounded-xl shadow-sm border transition-all flex-grow min-w-0 ${isModel ? 'bg-white border-slate-200 text-slate-800 rounded-tl-none' : 'bg-[#004B8D] border-[#004B8D] text-white rounded-tr-none'}`}>
            {!isModel && message.image && <div className="mb-2.5"><img src={message.image} alt="Uploaded" className="max-h-56 rounded-lg shadow-md border-2 border-white" /></div>}
            
            <div className="whitespace-pre-wrap leading-relaxed text-[13px] sm:text-[14px] break-words">
                {renderFormattedContent(isModel ? mainContent : message.content)}
            </div>
            
            <div className={`text-[7px] sm:text-[8px] mt-2.5 font-black uppercase tracking-[0.1em] flex justify-between items-center opacity-40 ${isModel ? 'text-slate-400' : 'text-blue-100'}`}>
                <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                {isModel && <div className="flex items-center gap-1.5 text-[#ee0033]">
                    <span className="w-0.5 h-0.5 rounded-full bg-[#ee0033] animate-pulse"></span>
                    VCC BIM STANDARD
                </div>}
            </div>
            </div>
        </div>

        {/* AI Chips Suggestions - Chỉ hiện khi là Model và có suggestions */}
        {isModel && suggestions.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2 ml-[calc(2rem+0.5rem)] sm:ml-[calc(2rem+0.75rem)] w-full animate-fade-in">
                {suggestions.map((sug, idx) => (
                    <button
                        key={idx}
                        onClick={() => onSuggestionClick && onSuggestionClick(sug)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 text-[11px] font-medium hover:border-[#ee0033] hover:text-[#ee0033] hover:bg-red-50/50 transition-all shadow-sm active:scale-95 group text-left"
                    >
                        <span className="text-[#ee0033]/70 group-hover:text-[#ee0033] transition-colors">
                           <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                        </span>
                        {sug}
                    </button>
                ))}
            </div>
        )}

      </div>
    </div>
  );
};

export default ChatMessage;
