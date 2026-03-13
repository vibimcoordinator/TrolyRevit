
import React, { useState, useMemo } from 'react';
import { REVIT_SHORTCUT_GROUPS, REVIT_SHORTCUTS, MANUAL_URLS, BIM_INFO_CATEGORIES } from '../constants';

interface SidebarProps {
  onShortcutClick: (cmd: string) => void;
  onOpenPdf: (url: string, page?: string) => void;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onShortcutClick, onOpenPdf, onClose }) => {
  const [expandedManuals, setExpandedManuals] = useState<Record<string, boolean>>({
    '01': false,
    '02': false,
    '03': false,
    'BIM': false,
    'TMP': false
  });
  
  const [shortcutSearch, setShortcutSearch] = useState('');

  const toggleManual = (id: string) => {
    setExpandedManuals(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredShortcuts = useMemo(() => {
    const term = shortcutSearch.trim().toLowerCase();
    if (!term) return [];
    
    return REVIT_SHORTCUTS.filter(s => {
       const keyMatch = s.key.toLowerCase().includes(term);
       const cmdMatch = s.command.toLowerCase().includes(term);
       const descMatch = s.description.toLowerCase().includes(term);
       return keyMatch || cmdMatch || descMatch;
    });
  }, [shortcutSearch]);

  const manuals = [
    {
      id: '01',
      title: 'Revit VCC - Tập 1',
      subtitle: 'Dựng hình & Kỹ thuật',
      color: 'bg-emerald-600',
      isSplit: true,
      chapters: [
          { name: 'B1. Giới thiệu', url: MANUAL_URLS.REVIT_01_BAI_1 },
          { name: 'B2. Lưới & Cột', url: MANUAL_URLS.REVIT_01_BAI_2 },
          { name: 'B3. Tường Cửa', url: MANUAL_URLS.REVIT_01_BAI_3 },
          { name: 'B4. Sàn Dầm', url: MANUAL_URLS.REVIT_01_BAI_4 },
          { name: 'B5. Vách Kính', url: MANUAL_URLS.REVIT_01_BAI_5 },
          { name: 'B6. Mái', url: MANUAL_URLS.REVIT_01_BAI_6 },
          { name: 'B7. Trần NT', url: MANUAL_URLS.REVIT_01_BAI_7 },
          { name: 'B8. Thang', url: MANUAL_URLS.REVIT_01_BAI_8 },
          { name: 'B9. Family', url: MANUAL_URLS.REVIT_01_BAI_9 },
      ]
    },
    {
      id: '02',
      title: 'Revit VCC - Tập 2',
      subtitle: 'Quản lý & Hồ sơ',
      color: 'bg-amber-600',
      isSplit: true,
      chapters: [
          { name: 'B1. Hình chiếu', url: MANUAL_URLS.REVIT_02_BAI_1 },
          { name: 'B2. Dim & Text', url: MANUAL_URLS.REVIT_02_BAI_2 },
          { name: 'B3. Tag & 2D', url: MANUAL_URLS.REVIT_02_BAI_3 },
          { name: 'B4. Hiển thị', url: MANUAL_URLS.REVIT_02_BAI_4 },
          { name: 'B5. Thống kê', url: MANUAL_URLS.REVIT_02_BAI_5 },
          { name: 'B6. Dàn trang', url: MANUAL_URLS.REVIT_02_BAI_6 },
          { name: 'B7. Phối hợp', url: MANUAL_URLS.REVIT_02_BAI_7 },
          { name: 'B8. Thông tin', url: MANUAL_URLS.REVIT_02_BAI_8 },
      ]
    },
    {
      id: '03',
      title: 'Revit 2018 Basic',
      subtitle: 'Thực chiến & Cơ bản',
      color: 'bg-[#003d73]',
      isSplit: true,
      chapters: [
          { name: 'B1. Giới thiệu', url: MANUAL_URLS.REVIT_2018_BAI_1 },
          { name: 'B2. Trục & Lưới', url: MANUAL_URLS.REVIT_2018_BAI_2 },
          { name: 'B3. Tường Cửa', url: MANUAL_URLS.REVIT_2018_BAI_3 },
          { name: 'B4. Trần Sàn', url: MANUAL_URLS.REVIT_2018_BAI_4 },
          { name: 'B5. Cột Dầm', url: MANUAL_URLS.REVIT_2018_BAI_5 },
          { name: 'B6. Vách kính', url: MANUAL_URLS.REVIT_2018_BAI_6 },
          { name: 'B7. Mái', url: MANUAL_URLS.REVIT_2018_BAI_7 },
          { name: 'B8. Cầu thang', url: MANUAL_URLS.REVIT_2018_BAI_8 },
          { name: 'B9. Lan can', url: MANUAL_URLS.REVIT_2018_BAI_9 },
          { name: 'B10. Nội thất', url: MANUAL_URLS.REVIT_2018_BAI_10 },
          { name: 'B11. Family', url: MANUAL_URLS.REVIT_2018_BAI_11 },
          { name: 'B12. Địa hình', url: MANUAL_URLS.REVIT_2018_BAI_12 },
          { name: 'B13. Browser', url: MANUAL_URLS.REVIT_2018_BAI_13 },
          { name: 'B14. Ghi chú', url: MANUAL_URLS.REVIT_2018_BAI_14 },
          { name: 'B15. Thống kê', url: MANUAL_URLS.REVIT_2018_BAI_15 },
          { name: 'B16. Render', url: MANUAL_URLS.REVIT_2018_BAI_16 },
          { name: 'B17. In ấn', url: MANUAL_URLS.REVIT_2018_BAI_17 },
      ]
    },
    {
      id: 'BIM',
      title: 'TCVN 14177:2024',
      subtitle: 'Tiêu chuẩn BIM VN',
      color: 'bg-indigo-600',
      isSplit: true,
      chapters: [
          { name: 'Phần 1: Nguyên tắc', url: MANUAL_URLS.TCVN_14177_1 },
          { name: 'Phần 2: Chuyển giao', url: MANUAL_URLS.TCVN_14177_2 },
      ]
    },
    {
      id: 'TMP',
      title: 'H.Dẫn dùng Template',
      subtitle: 'Quy trình & Tự động hóa',
      color: 'bg-rose-600',
      isSplit: true,
      chapters: [
          { name: '1. Cây thư mục', url: MANUAL_URLS.TEMPLATE_00 },
          { name: '2. Load & Update Family', url: MANUAL_URLS.TEMPLATE_01 },
          { name: '3. Tạo Sheet hàng loạt', url: MANUAL_URLS.TEMPLATE_02 },
          { name: '4. Tạo View hàng loạt', url: MANUAL_URLS.TEMPLATE_03 },
          { name: '5. Viewport & Title', url: MANUAL_URLS.TEMPLATE_04 },
          { name: '6. Sheet Name/Number', url: MANUAL_URLS.TEMPLATE_05 },
          { name: '7. Legend & Mặt cắt sàn', url: MANUAL_URLS.TEMPLATE_06 },
          { name: '8. Load View vào Sheet', url: MANUAL_URLS.TEMPLATE_07 },
          { name: '9. Bổ cửa đi/cửa sổ', url: MANUAL_URLS.TEMPLATE_08 },
          { name: '10. Ký hiệu Trần/Tường/Sàn', url: MANUAL_URLS.TEMPLATE_09 },
      ]
    },
    {
      id: 'ERR',
      title: 'Troubleshooting',
      subtitle: 'Lỗi thường gặp',
      color: 'bg-red-600',
      url: MANUAL_URLS.REVIT_ERRORS,
      topics: ['Lỗi hiển thị', 'Sự cố Card đồ họa']
    }
  ];

  const handleExplainShortcut = (shortcut: typeof REVIT_SHORTCUTS[0]) => {
    const prompt = `Giải thích lệnh tắt "${shortcut.key}" (${shortcut.command}) trong Revit: Tác dụng là gì và cách sử dụng cơ bản?`;
    onShortcutClick(prompt);
    if (onClose) onClose();
  };

  const handleSearchOnline = (term: string) => {
    const prompt = `Tra cứu lệnh tắt và hướng dẫn thực hiện cho: "${term}" trong Revit. \n\nYêu cầu: \n1. Kiểm tra dữ liệu nội bộ trước.\n2. Nếu KHÔNG thấy, hãy TỰ ĐỘNG tìm kiếm Internet để có câu trả lời chính xác nhất.`;
    onShortcutClick(prompt);
    if (onClose) onClose();
  };

  const executeSearch = () => {
    if (!shortcutSearch.trim()) return;
    if (filteredShortcuts.length === 0) {
        handleSearchOnline(shortcutSearch);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
        executeSearch();
    }
  };

  const handleBIMInfoClick = (cat: typeof BIM_INFO_CATEGORIES[0]) => {
    const prompt = `Hãy liệt kê các thông tin (parameters) bắt buộc phải nhập cho đối tượng ${cat.name} theo tiêu chuẩn BIM VCC.`;
    onShortcutClick(prompt);
    if (onClose) onClose();
  };

  return (
    <div className="flex flex-col h-full bg-[#004B8D] w-[280px] sm:w-80 text-white border-r border-white/10 shadow-xl overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-white/10 bg-[#003d73] flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-base sm:text-lg font-black flex items-center gap-2 tracking-tighter uppercase italic">
            <span className="w-1.5 h-5 sm:w-2 sm:h-6 bg-[#ee0033] skew-x-[-15deg]"></span>
            BIM INSIGHT
          </h2>
          <p className="text-[8px] sm:text-[9px] text-blue-300 mt-0.5 font-bold uppercase tracking-widest italic opacity-70">Th.S Lê Ngọc Giang</p>
        </div>
        
        <div className="flex items-center gap-2">
            <a 
                href="https://www.youtube.com/@DaotaoRevitNangcao" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 text-white/80 hover:bg-[#FF0000] hover:text-white transition-all shadow-sm"
                title="Youtube Đào tạo Revit Nâng cao"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
            </a>
            <button 
                onClick={onClose}
                className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 text-white/60 hover:text-white"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto custom-scrollbar p-3 sm:p-4 space-y-4 sm:space-y-5">
        <div className="space-y-2 pt-1">
          <h3 className="text-[9px] sm:text-[10px] font-black text-blue-300 uppercase tracking-widest px-1 border-b border-white/10 pb-1.5 mb-1.5">Tra nhanh phím tắt</h3>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white/40 group-focus-within:text-[#ee0033] transition-colors"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            <input 
                type="text" 
                value={shortcutSearch}
                onChange={(e) => setShortcutSearch(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder='Nhập lệnh (VD: "dầm", "copy")...'
                className="w-full bg-black/20 border border-white/10 rounded-lg py-2 pl-8 pr-8 text-[11px] text-white placeholder-white/30 focus:outline-none focus:border-[#ee0033] focus:bg-black/30 transition-all shadow-inner"
            />
          </div>

          <div className="flex flex-col gap-1.5 mt-2 min-h-[100px] max-h-[250px] overflow-y-auto custom-scrollbar bg-black/10 rounded-lg p-1.5 border border-white/5 shadow-inner">
             {shortcutSearch.trim() === '' ? (
                 <div className="flex flex-col items-center justify-center h-full py-6 text-white/30 gap-2 select-none">
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                     <p className="text-[9px] text-center px-4">Nhập tên lệnh và nhấn Enter để tìm kiếm</p>
                 </div>
             ) : filteredShortcuts.length > 0 ? (
                 filteredShortcuts.map((s, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-md bg-white/5 border border-white/5 hover:bg-white/10 group animate-fade-in">
                        <div className="flex items-center gap-2 min-w-0">
                            <span className="bg-[#ee0033] text-white text-[11px] font-black px-1.5 py-0.5 rounded shadow-sm min-w-[32px] text-center">{s.key}</span>
                            <div className="min-w-0 border-l border-white/10 pl-2">
                                <div className="text-[10px] font-bold text-white truncate">{s.command}</div>
                                <div className="text-[9px] text-blue-200 truncate">{s.description}</div>
                            </div>
                        </div>
                    </div>
                 ))
             ) : (
                 <div className="flex flex-col items-center justify-center h-full py-4 text-center px-2 animate-fade-in">
                     <p className="text-[10px] font-bold text-white mb-1">Không có trong dữ liệu Offline</p>
                     <button onClick={() => handleSearchOnline(shortcutSearch)} className="w-full px-3 py-2 bg-[#005fa3] hover:bg-[#006bb8] text-white text-[9px] font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg border border-white/10 group">
                        <span>Tìm kiếm trên Internet</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                     </button>
                 </div>
             )}
          </div>
        </div>

        <div className="space-y-2 sm:space-y-3">
          <h3 className="text-[9px] sm:text-[10px] font-black text-blue-300 uppercase tracking-widest px-1">Tài liệu nguồn</h3>
          <div className="flex flex-col gap-2">
            {manuals.map((m) => {
              const isExpanded = expandedManuals[m.id];
              const hasChapters = m.isSplit && m.chapters && m.chapters.length > 0;
              return (
                <div key={m.id} className="bg-white/5 rounded-xl border border-white/10 overflow-hidden transition-all hover:bg-white/10">
                  <button 
                    onClick={() => {
                        if (hasChapters) toggleManual(m.id);
                        else if (m.url) { onOpenPdf(m.url); if (onClose) onClose(); }
                    }}
                    className="w-full flex items-center justify-between p-4 sm:p-3.5 text-left group active:bg-white/10"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg ${m.color} flex items-center justify-center font-black text-[9px] sm:text-[10px] shadow-lg flex-shrink-0`}>{m.id}</div>
                        <div className="min-w-0">
                            <div className="text-[9px] sm:text-[10px] font-black uppercase text-white leading-none truncate">{m.title}</div>
                            <div className="text-[8px] sm:text-[9px] text-blue-300 font-bold truncate">{m.subtitle}</div>
                        </div>
                    </div>
                    {hasChapters && (
                        <div className={`transition-transform duration-200 text-white/40 group-hover:text-white ${isExpanded ? 'rotate-180' : ''}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                        </div>
                    )}
                  </button>
                  {hasChapters && isExpanded && (
                     <div className="bg-black/20 p-2 border-t border-white/5 animate-in slide-in-from-top-2 duration-200">
                         <div className="grid grid-cols-2 gap-1.5">
                             {m.chapters!.map((chap, idx) => (
                                 <button key={idx} onClick={() => { onOpenPdf(chap.url); if (onClose) onClose(); }} className={`px-3 py-3 sm:px-2 sm:py-2 rounded-md ${m.color} bg-opacity-20 hover:bg-opacity-80 border border-white/5 hover:border-white/20 text-[10px] sm:text-[10px] font-bold text-left transition-all truncate flex items-center gap-2`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${m.color} bg-opacity-100 flex-shrink-0`}></div>
                                    <span className="truncate">{chap.name.split('. ')[1] || chap.name}</span>
                                 </button>
                             ))}
                         </div>
                     </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-2 sm:space-y-3 pt-1">
          <h3 className="text-[9px] sm:text-[10px] font-black text-white uppercase tracking-widest px-1 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ee0033]"></span>
            TIÊU CHUẨN VCC
          </h3>
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
            {BIM_INFO_CATEGORIES.slice(0, 4).map((cat, idx) => (
              <button key={idx} onClick={() => handleBIMInfoClick(cat)} className="flex flex-col items-center justify-center p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-white/5 border border-white/5 hover:border-[#ee0033]/40 hover:bg-white/10 transition-all group">
                <span className="text-base sm:text-lg mb-0.5 sm:mb-1">{cat.icon}</span>
                <span className="text-[8px] sm:text-[9px] font-bold text-center text-blue-50 truncate w-full">{cat.name.split(' (')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-4 bg-[#003d73] border-t border-white/10 flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white flex items-center justify-center border border-[#ee0033] flex-shrink-0">
           <span className="text-[10px] sm:text-xs font-black text-[#ee0033]">VCC</span>
        </div>
        <div className="min-w-0">
          <div className="text-[7px] sm:text-[8px] font-black text-white uppercase truncate">Viettel Construction</div>
          <div className="text-[6px] sm:text-[7px] text-blue-400 font-bold uppercase tracking-widest truncate">BIM Insight v4.3</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
