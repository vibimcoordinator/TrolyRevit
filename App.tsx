
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Message } from './types';
import { geminiService, SourceMode } from './geminiService';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import Sidebar from './components/Sidebar';
import CompanionChat from './components/CompanionChat';
import { MANUAL_URLS } from './constants';

interface ExtendedMessage extends Message {
  groundingMetadata?: any;
}

interface TocSection {
  title: string;
  items: string[];
}

interface TocItem {
  name: string;
  page?: string;
  url: string;
  sections?: TocSection[]; // Cấu trúc mới 3 cấp
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<ExtendedMessage[]>([
    {
      role: 'model',
      content: '🏗️ Chào đồng nghiệp! Tôi là **BIM Assistant**.\n\nBạn cần hỗ trợ gì về kỹ thuật hoặc quy trình BIM hôm nay?',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSource, setActiveSource] = useState<SourceMode>('all');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [currentPdfPage, setCurrentPdfPage] = useState<string | null>(null);
  const [manualPage, setManualPage] = useState<string>('');
  const [pdfViewMode, setPdfViewMode] = useState<'split' | 'full'>('split');
  const [showPageSplash, setShowPageSplash] = useState(false);
  const [isTocOpen, setIsTocOpen] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [tocSearch, setTocSearch] = useState('');
  const [collapsedItems, setCollapsedItems] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, pdfUrl]);

  useEffect(() => {
    if (showPageSplash) {
      const timer = setTimeout(() => setShowPageSplash(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [showPageSplash]);

  // Xử lý tự động đóng TOC khi click vào PDF (iframe)
  useEffect(() => {
    const handleIframeClick = () => {
      // Khi focus chuyển sang iframe, window sẽ nhận sự kiện blur
      // Chúng ta kiểm tra xem activeElement có phải là iframe không
      if (document.activeElement?.tagName === 'IFRAME') {
        setIsTocOpen(false);
      }
    };

    window.addEventListener('blur', handleIframeClick);
    return () => {
      window.removeEventListener('blur', handleIframeClick);
    };
  }, []);

  const currentToc = useMemo(() => {
    if (!pdfUrl) return null;
    
    const normalize = (url: string) => url.split('?')[0].replace('/view', '').replace('/preview', '').split('#')[0];
    const currentNormalized = normalize(pdfUrl);
    const checkMatch = (urls: string[]) => urls.some(u => normalize(u) === currentNormalized);

    const revit01Urls = Object.values(MANUAL_URLS).slice(0, 9);
    const revit02Urls = Object.values(MANUAL_URLS).slice(9, 17);
    const revit2018Urls = Object.values(MANUAL_URLS).slice(17, 34);
    const revitErrorsUrls = [MANUAL_URLS.REVIT_ERRORS];
    const tcvnUrls = [MANUAL_URLS.TCVN_14177_1, MANUAL_URLS.TCVN_14177_2];

    // CẤU TRÚC DỮ LIỆU MỚI: sections[{ title: "Cấp 2", items: ["Cấp 3 (Trang XX)", ...] }]
    if (checkMatch(revit01Urls)) {
      return {
        title: "Sổ tay Revit - Tập 1",
        color: "bg-emerald-600",
        items: [
          { 
    name: 'BÀI 01. GIỚI THIỆU VỀ REVIT', 
    page: 'Trang 06', 
    url: MANUAL_URLS.REVIT_01_BAI_1, 
    sections: [
        { 
            title: "1. BIM LÀ GÌ? WHY REVIT?", 
            items: [
                "B.I.M - MÔ HÌNH THÔNG TIN (Trang 06) ",
                "REVIT & B.I.M (Trang 07) ",
                "C.A.D PROCESS (Trang 08) ", 
                "B.I.M PROCESS (Trang 09) ", 
                "ƯU THẾ CỦA B.I.M (Trang 10) ",
                "WHY REVIT? (Trang 12) "
            ] 
        },
        { 
            title: "2. CÀI ĐẶT REVIT & TEMPLATE", 
            items: [
                "YÊU CẦU CẤU HÌNH (Trang 13) ", 
                "CÀI ĐẶT PHẦN MỀM (Trang 14) ", 
                "CÀI ĐẶT TEMPLATE & THƯ VIỆN (Trang 15) ",
                "THIẾT LẬP FILE LOCATIONS (Trang 16) "
            ] 
        },
        { 
            title: "3. GIAO DIỆN & THAO TÁC", 
            items: [
                "TẠO FILE MỚI (Trang 17) ",
                "MÀN HÌNH LÀM VIỆC (Trang 18) ",
                "CÁC TAB TRÊN THANH RIBBON (Trang 19) ",
                "ĐỔI MÀU NỀN (Trang 20) ",
                "VỊ TRÍ PROPERTIES & PROJECT BROWSER (Trang 21) ",
                "CÁC THAO TÁC CƠ BẢN - LƯU FILE (Trang 22) ",
                "XEM BẢN VẼ & PHỐI CẢNH (Trang 23) ",
                "SECTION BOX & ẨN/HIỆN ĐỐI TƯỢNG (Trang 24) ",
                "CHỌN ĐỐI TƯỢNG & FILTER (Trang 25) ",
                "INSERT FILE CAD (Trang 27) "
            ] 
        }
    ]
},
          { 
            name: 'BÀI 02. HỆ ĐỊNH VỊ & CỘT', page: 'Trang 28', url: MANUAL_URLS.REVIT_01_BAI_2, 
            sections: [
                { 
                    title: "1. LƯỚI TRỤC (GRID)", 
                    items: [
                        "HIỂN THỊ PROJECT BASE POINT (Trang 28)", 
                        "LỆNH GRID (GR) - VẼ TRỤC (Trang 29)", 
                        "LỆNH COPY (CO) - SAO CHÉP TRỤC (Trang 30)",
                        "LỆNH DIMENSION (DI) - ĐƯỜNG KÍCH THƯỚC (Trang 31)",
                        "LỆNH MOVE (MV) - DI CHUYỂN TRỤC (Trang 32)",
                        "HIỆU CHỈNH BONG BÓNG TRỤC (Trang 33)",
                        "LỆNH NGẮT TRỤC & PROPAGATE EXTENTS (Trang 34)"
                    ] 
                },
                { 
                    title: "2. CAO ĐỘ (LEVEL)", 
                    items: [
                        "LỆNH LEVEL (LL) - TẠO CAO ĐỘ (Trang 35)", 
                        "TẠO MẶT BẰNG MỚI (FLOOR PLAN) (Trang 36)", 
                        "HIỆU CHỈNH DẤU CAO ĐỘ HỆ MÉT (Trang 37)",
                        "CHỈNH SỬA UNIT FORMAT & FAMILY (Trang 38)"
                    ] 
                },
                { 
                    title: "3. VẼ CỘT", 
                    items: [
                        "LOAD THƯ VIỆN CỘT (STRUCTURAL COLUMN) (Trang 39)",
                        "BỐ TRÍ CỘT THỦ CÔNG & HÀNG LOẠT (AT GRIDS) (Trang 40)",
                        "HIỆU CHỈNH CAO ĐỘ & BIẾN VẬT LIỆU (TYPE) (Trang 41)",
                        "GÁN VẬT LIỆU BTCT & HATCH MẶT CẮT (Trang 42)",
                        "LỆNH ALIGN (AL) - CANH GIÓNG CỘT (Trang 43)"
                    ] 
                }
            ]
          },
          { 
    name: 'BÀI 03. TƯỜNG - CỬA - PHÒNG', 
    page: 'Trang 44', 
    url: MANUAL_URLS.REVIT_01_BAI_3, 
    sections: [
        { 
            title: "1. VẼ TƯỜNG", 
            items: [
                "CẤU TẠO VÀ VẬT LIỆU TƯỜNG (Trang 44)(Pos 01)", 
                "THIẾT LẬP ĐƯỜNG GIÓNG VÀ CHI TIẾT HIỂN THỊ (Trang 46)(Pos 03)", 
                "CÁC DẠNG NÉT VẼ VÀ LỆNH PICK LINES (Trang 47)(Pos 04)",
                "ĐỊNH VỊ TƯỜNG BẰNG DIM KÍCH THƯỚC (Trang 49)(Pos 06)",
                "CAO ĐỘ TƯỜNG VÀ LỆNH ATTACH TOP/BASE (Trang 50)(Pos 07)",
                "LỆNH EDIT PROFILE TƯỜNG (Trang 51)(Pos 08)"
            ] 
        },
        { 
            title: "2. NHÓM LỆNH MODIFY", 
            items: [
                "LỆNH MOVE, ROTATE, ALIGN, COPY (Trang 52)(Pos 09)", 
                "OFFSET, TRIM, EXTEND, MIRROR, SPLIT (Trang 53)(Pos 10)", 
                "LỆNH ARRAY, PIN VÀ SCALE (Trang 54)(Pos 11)"
            ] 
        },
        { 
            title: "3. CỬA & PHÒNG", 
            items: [
                "VẼ CỬA ĐI VÀ CỬA SỔ (WINDOW) (Trang 55)(Pos 12)",
                "BỐ TRÍ CỬA VÀ LỖ MỞ TƯỜNG (WALL OPENING) (Trang 56)(Pos 13)",
                "MẸO CHIA ĐỀU ĐỐI TƯỢNG VỚI LỆNH EQ (Trang 58)(Pos 15)",
                "COPY VÀ PASTE ĐỐI TƯỢNG LÊN CÁC TẦNG (Trang 60)(Pos 17)",
                "TẠO VÀ QUẢN LÝ THÔNG TIN PHÒNG (ROOM) (Trang 61)(Pos 18)",
                "CHIA PHÒNG VÀ ĐỔ MÀU PHÂN KHU (Trang 62)(Pos 19)",
                "HIỂN THỊ DIỆN TÍCH VÀ MÀU SẮC PHÒNG (Trang 63)(Pos 20)"
            ] 
        }
    ]
},
{ 
    name: 'BÀI 04. SÀN & DẦM. ĐỊA HÌNH', 
    page: 'Trang 65', 
    url: MANUAL_URLS.REVIT_01_BAI_4, 
    sections: [
        { 
            title: "1. SÀN (FLOOR)", 
            items: [
                "CẤU TẠO LỚP SÀN VÀ HATCH GẠCH (Trang 65)(Pos 01)", 
                "PHÂN BIỆT HATCH DRAFTING VÀ MODEL (Trang 66)(Pos 02)", 
                "VẼ BIÊN DẠNG SÀN VÀ LỖ MỞ (Trang 67)(Pos 03)",
                "CANH MỐC LÁT GẠCH (ALIGN) VÀ SPLIT FACE (Trang 68)(Pos 04)",
                "THẢ DẤU CAO ĐỘ HỆ MÉT (SPOT ELEVATION) (Trang 69)(Pos 05)",
                "LỆNH SHAFT - ĐỤC LỖ SÀN XUYÊN TẦNG (Trang 70)(Pos 06)"
            ] 
        },
        { 
            title: "2. VẼ DẦM (BEAM)", 
            items: [
                "THIẾT LẬP MẶT BẰNG DẦM (STRUCTURAL PLAN) (Trang 71)(Pos 07)", 
                "SỬ DỤNG VIEW TEMPLATE QUẢN LÝ HIỂN THỊ (Trang 72)(Pos 08)", 
                "LOAD FAMILY VÀ BỐ TRÍ DẦM (Trang 73)(Pos 09)",
                "HIỆU CHỈNH CAO ĐỘ VÀ BIẾN VẬT LIỆU DẦM (Trang 74)(Pos 10)"
            ] 
        },
        { 
            title: "3. ĐỊA HÌNH (TOPOGRAPHY)", 
            items: [
                "TẠO ĐỊA HÌNH TỪ ĐIỂM HOẶC FILE AUTOCAD (Trang 75)(Pos 11)",
                "THIẾT LẬP ĐƯỜNG ĐỒNG MỨC VÀ NHÃN CAO ĐỘ (Trang 76)(Pos 12)",
                "CẮT, NHẬP VÀ GÁN VẬT LIỆU ĐỊA HÌNH (Trang 77)(Pos 13)",
                "SAN NỀN (BUILDING PAD) VÀ RANH ĐẤT (Trang 78)(Pos 14)"
            ] 
        }
    ]
},
  { 
    name: 'BÀI 05. VÁCH KÍNH. LAM', 
    page: 'Trang 79', 
    url: MANUAL_URLS.REVIT_01_BAI_5, 
    sections: [
        { 
            title: "1. VÁCH KÍNH (CURTAIN WALL)", 
            items: [
                "LỆNH VẼ VÁCH KÍNH & AUTOMATICALLY EMBED (Trang 79)(Pos 01)", 
                "CHIA KHOẢNG KHUNG ĐỐ (GRID LINE) (Trang 80)(Pos 02)", 
                "THIẾT LẬP MULLION (ĐỐ KÍNH) (Trang 81)(Pos 03)",
                "THAY ĐỔI LOẠI ĐỐ KÍNH (Trang 82)(Pos 04)",
                "THAY ĐỔI PANO KÍNH (CURTAIN PANEL) (Trang 83)(Pos 05)",
                "CÁC LỆNH HIỆU CHỈNH ĐỐ KÍNH (Trang 84)(Pos 06)"
            ] 
        },
        { 
            title: "2. LAM TRANG TRÍ (LOUVER)", 
            items: [
                "TẠO LAM TRANG TRÍ TỪ CURTAIN WALL (Trang 85)(Pos 07)", 
                "THIẾT LẬP KHOẢNG CÁCH LAM (Trang 86)(Pos 08)", 
                "VẼ TIẾT DIỆN LOUVER (FAMILY PROFILE) (Trang 87)(Pos 09)"
            ] 
        }
    ]
  },
  { 
    name: 'BÀI 06. MÁI', 
    page: 'Trang 88', 
    url: MANUAL_URLS.REVIT_01_BAI_6, 
    sections: [
        { 
            title: "1. VẼ MÁI (ROOF)", 
            items: [
                "ĐẶT CẤU TẠO MÁI (Trang 88)(Pos 01)", 
                "VẼ BIÊN DẠNG MÁI DỐC (ROOF BY FOOTPRINT) (Trang 89)(Pos 02)", 
                "CÁC KIỂU MÁI: MÁI CHỮ A, MÁI TỨ DIỆN (Trang 90)(Pos 03)",
                "ĐỊNH NGHĨA ĐỘ DỐC (DEFINE SLOPE) (Trang 91)(Pos 04)",
                "MÁI BẰNG VÀ LỚP BÊ TÔNG CHỐNG THẤM (Trang 92)(Pos 05)",
                "VẼ MÁI THEO TIẾT DIỆN (ROOF BY EXTRUSION) (Trang 93)(Pos 06)"
            ] 
        },
        { 
            title: "2. CHI TIẾT MÁI & LỆNH JOIN", 
            items: [
                "LỆNH JOIN/UNJOIN ROOF (KẾT NỐI MÁI) (Trang 94)(Pos 07)", 
                "VẼ SÊ-NÔ VÀ DIỀM MÁI (FASCIA & GUTTER) (Trang 95)(Pos 08)", 
                "LỆNH JOIN GEOMETRY (GIAO CẮT ĐỐI TƯỢNG) (Trang 96)(Pos 09)",
                "SWITCH JOIN ORDER (ĐỔI THỨ TỰ ƯU TIÊN) (Trang 97)(Pos 10)"
            ] 
        }
    ]
  },
  { 
    name: 'BÀI 07. TRẦN & CHI TIẾT NỘI THẤT', 
    page: 'Trang 98', 
    url: MANUAL_URLS.REVIT_01_BAI_7, 
    sections: [
        { 
            title: "1. VẼ TRẦN (CEILING)", 
            items: [
                "THÊM MẶT BẰNG TRẦN (CEILING PLANS) (Trang 98)(Pos 01)", 
                "LỆNH SKETCH CEILING VÀ CẤU TẠO TRẦN (Trang 99)(Pos 02)", 
                "CANH MỐC XƯƠNG TRẦN (Trang 100)(Pos 03)",
                "VẼ TRẦN GIẬT CẤP (MODEL IN-PLACE) (Trang 101)(Pos 04)"
            ] 
        },
        { 
            title: "2. THƯ VIỆN NỘI THẤT (COMPONENT)", 
            items: [
                "LOAD FAMILY THƯ VIỆN NỘI THẤT (Trang 104)(Pos 07)", 
                "BỐ TRÍ ĐỒ ĐẠC (COMPONENT) (Trang 105)(Pos 08)", 
                "CÁC NGUỒN TẢI THƯ VIỆN: REVIT CITY, BIM OBJECT (Trang 111)(Pos 14)",
                "NHÓM ĐỐI TƯỢNG (GROUP) (Trang 112)(Pos 15)"
            ] 
        }
    ]
  },
  { 
    name: 'BÀI 08. THANG. RAM. LAN CAN', 
    page: 'Trang 113', 
    url: MANUAL_URLS.REVIT_01_BAI_8, 
    sections: [
        { 
            title: "1. CẦU THANG (STAIR)", 
            items: [
                "THIẾT LẬP THÔNG SỐ BẬC THANG (Trang 113)(Pos 01)", 
                "VẼ THANG THẲNG VÀ THANG ĐỔI CHIỀU (Trang 114)(Pos 02)", 
                "HIỆU CHỈNH CHIẾU NGHỈ (LANDING) (Trang 115)(Pos 03)",
                "CẤU TẠO MẶT BẬC VÀ MŨI BẬC (Trang 117)(Pos 05)"
            ] 
        },
        { 
            title: "2. ĐƯỜNG DỐC & LAN CAN", 
            items: [
                "VẼ ĐƯỜNG DỐC (RAMP) (Trang 120)(Pos 08)", 
                "VẼ LAN CAN (RAILING) (Trang 121)(Pos 09)", 
                "CHỈNH SỬA BALUSTER VÀ TOP RAIL (Trang 122)(Pos 10)",
                "GÁN LAN CAN VÀO THANG/MÁI (PICK HOST) (Trang 123)(Pos 11)"
            ] 
        }
    ]
  },
  { 
    name: 'BÀI 09. MODEL IN-PLACE & FAMILY', 
    page: 'Trang 124', 
    url: MANUAL_URLS.REVIT_01_BAI_9, 
    sections: [
        { 
            title: "1. MODEL IN-PLACE", 
            items: [
                "MODEL IN-PLACE LÀ GÌ? (Trang 124)(Pos 01)", 
                "KHỐI ĐÙN (EXTRUSION) (Trang 125)(Pos 02)", 
                "KHỐI HÒA TRỘN (BLEND) (Trang 126)(Pos 03)",
                "KHỐI XOAY TRÒN (REVOLVE) (Trang 127)(Pos 04)",
                "KHỐI CHẠY THEO ĐƯỜNG DẪN (SWEEP) (Trang 128)(Pos 05)",
                "KHỐI RỖNG (VOID FORMS) (Trang 130)(Pos 07)"
            ] 
        },
        { 
            title: "2. TẠO FAMILY CƠ BẢN", 
            items: [
                "QUY TRÌNH TẠO FAMILY (Trang 131)(Pos 08)", 
                "MẶT PHẲNG THAM CHIẾU (REF PLANE) (Trang 132)(Pos 09)", 
                "GÁN BIẾN THÔNG SỐ (PARAMETERS) (Trang 133)(Pos 10)",
                "CÁC LOẠI HÀM SỐ TRONG FAMILY (Trang 134)(Pos 11)"
            ] 
        }
    ]
  },
        ] as TocItem[]
      };
    }
    if (checkMatch(revit02Urls)) {
      return {
        title: "Sổ tay Revit - Tập 2",
        color: "bg-amber-600",
        items: [
  { 
    name: 'BÀI 01. QUẢN LÝ HÌNH CHIẾU', 
    page: 'Trang 06', 
    url: MANUAL_URLS.REVIT_02_BAI_1, 
    sections: [
        { 
            title: "1. QUẢN LÝ VIEW TRONG PROJECT BROWSER", 
            items: [
                "THIẾT LẬP BỘ LỌC HÌNH CHIẾU (BROWSER ORGANIZATION) (Trang 06)(Pos 01)", 
                "PHÂN LOẠI VIEW THEO BỘ MÔN (DISCIPLINE) (Trang 08)(Pos 03)", 
                "TẠO THÔNG SỐ QUẢN LÝ VIEW TỰ CHỌN (Trang 09)(Pos 04)"
            ] 
        },
        { 
            title: "2. CÁC LOẠI HÌNH CHIẾU 2D & 3D", 
            items: [
                "LỆNH CẮT MẶT CẮT (SECTION) (Trang 10)(Pos 05)", 
                "TRÍCH CHI TIẾT (CALLOUT) (Trang 12)(Pos 07)", 
                "TẠO VIEW TRÍCH ĐO (DRAFTING VIEW) (Trang 14)(Pos 09)",
                "QUẢN LÝ VIEW NHÌN 3D VÀ SECTION BOX (Trang 15)(Pos 10)"
            ] 
        }
    ]
  },
  { 
    name: 'BÀI 02. KÍCH THƯỚC VÀ GHI CHÚ', 
    page: 'Trang 18', 
    url: MANUAL_URLS.REVIT_02_BAI_2, 
    sections: [
        { 
            title: "1. ĐƯỜNG KÍCH THƯỚC (DIMENSION)", 
            items: [
                "THIẾT LẬP KIỂU DIM (DIMENSION TYPE) (Trang 18)(Pos 01)", 
                "CÁC LỆNH DIM PHỔ BIẾN (ALIGNED, LINEAR, ANGULAR) (Trang 20)(Pos 03)", 
                "HIỆU CHỈNH CHỮ SỐ VÀ KÝ HIỆU DIM (Trang 22)(Pos 05)"
            ] 
        },
        { 
            title: "2. GHI CHÚ CHỮ (TEXT & LEADER)", 
            items: [
                "TẠO VÀ CHỈNH SỬA TEXT (Trang 24)(Pos 07)", 
                "QUẢN LÝ ĐƯỜNG DẪN (LEADER) (Trang 25)(Pos 08)", 
                "GHI CHÚ CHI TIẾT CẤU TẠO (INSULATION & DETAIL LINE) (Trang 27)(Pos 10)"
            ] 
        }
    ]
  },
  { 
    name: 'BÀI 03. TAG VÀ FAMILY 2D', 
    page: 'Trang 30', 
    url: MANUAL_URLS.REVIT_02_BAI_3, 
    sections: [
        { 
            title: "1. THẺ GHI CHÚ (TAG)", 
            items: [
                "TAG THEO DANH MỤC (TAG BY CATEGORY) (Trang 30)(Pos 01)", 
                "THIẾT LẬP THÔNG SỐ HIỂN THỊ TRONG TAG (LABEL) (Trang 32)(Pos 03)", 
                "TAG VẬT LIỆU (MATERIAL TAG) (Trang 34)(Pos 05)"
            ] 
        },
        { 
            title: "2. FAMILY CHÚ THÍCH (ANNOTATION FAMILY)", 
            items: [
                "TẠO KÝ HIỆU CAO ĐỘ (ELEVATION SYMBOL) (Trang 36)(Pos 07)", 
                "TẠO KÝ HIỆU MẶT CẮT VÀ TRỤC (Trang 38)(Pos 09)", 
                "KÝ HIỆU CHI TIẾT NỘI THẤT (Trang 40)(Pos 11)"
            ] 
        }
    ]
  },
  { 
    name: 'BÀI 04. QUẢN LÝ HIỂN THỊ', 
    page: 'Trang 42', 
    url: MANUAL_URLS.REVIT_02_BAI_4, 
    sections: [
        { 
            title: "1. VISIBILITY/GRAPHICS (VG)", 
            items: [
                "LỆNH VG - QUẢN LÝ HIỂN THỊ ĐỐI TƯỢNG (Trang 42)(Pos 01)", 
                "BỘ LỌC HIỂN THỊ (FILTERS) (Trang 45)(Pos 04)", 
                "THIẾT LẬP NÉT VẼ (LINE STYLES & LINE WEIGHTS) (Trang 48)(Pos 07)"
            ] 
        },
        { 
            title: "2. VIEW TEMPLATE", 
            items: [
                "TẠO VÀ ÁP DỤNG VIEW TEMPLATE (Trang 50)(Pos 09)", 
                "QUẢN LÝ ĐỘ TRONG SUỐT VÀ MÀU SẮC THEO BỘ MÔN (Trang 52)(Pos 11)", 
                "HIỆU CHỈNH VÙNG NHÌN (VIEW RANGE) (Trang 54)(Pos 13)"
            ] 
        }
    ]
  },
  { 
    name: 'BÀI 05. THỐNG KÊ (SCHEDULES)', 
    page: 'Trang 56', 
    url: MANUAL_URLS.REVIT_02_BAI_5, 
    sections: [
        { 
            title: "1. BẢNG THỐNG KÊ ĐỐI TƯỢNG", 
            items: [
                "TẠO BẢNG THỐNG KÊ (SCHEDULE/QUANTITIES) (Trang 56)(Pos 01)", 
                "LỌC VÀ SẮP XẾP DỮ LIỆU (FILTERING & SORTING) (Trang 58)(Pos 03)", 
                "ĐỊNH DẠNG CỘT VÀ TÍNH TOÁN TỔNG CỘNG (Trang 60)(Pos 05)"
            ] 
        },
        { 
            title: "2. THỐNG KÊ VẬT LIỆU (MATERIAL TAKEOFF)", 
            items: [
                "TÍNH TOÁN KHỐI LƯỢNG VẬT LIỆU (Trang 62)(Pos 07)", 
                "THỐNG KÊ DIỆN TÍCH PHÒNG VÀ DANH MỤC BẢN VẼ (Trang 64)(Pos 09)", 
                "XUẤT DỮ LIỆU SANG EXCEL (Trang 66)(Pos 11)"
            ] 
        }
    ]
  },
  { 
    name: 'BÀI 06. DÀN TRANG VÀ XUẤT FILE', 
    page: 'Trang 68', 
    url: MANUAL_URLS.REVIT_02_BAI_6, 
    sections: [
        { 
            title: "1. DÀN TRANG (SHEET)", 
            items: [
                "TẠO KHUNG TÊN (TITLE BLOCK) (Trang 68)(Pos 01)", 
                "BỐ TRÍ VIEW VÀO BẢN VẼ (Trang 70)(Pos 03)", 
                "QUẢN LÝ SỐ HIỆU VÀ TÊN BẢN VẼ (Trang 72)(Pos 05)"
            ] 
        },
        { 
            title: "2. IN ẤN VÀ XUẤT FILE", 
            items: [
                "XUẤT BẢN VẼ SANG PDF (Trang 74)(Pos 07)", 
                "XUẤT FILE CAD (DWG) CHUẨN LỚP LAYER (Trang 76)(Pos 09)", 
                "XUẤT HÌNH ẢNH CHẤT LƯỢNG CAO (IMAGE EXPORT) (Trang 78)(Pos 11)"
            ] 
        }
    ]
  },
  { 
    name: 'BÀI 07. PHỐI HỢP (COLLABORATION)', 
    page: 'Trang 80', 
    url: MANUAL_URLS.REVIT_02_BAI_7, 
    sections: [
        { 
            title: "1. LÀM VIỆC NHÓM (WORKSHARING)", 
            items: [
                "THIẾT LẬP FILE TRUNG TÂM (CENTRAL FILE) (Trang 80)(Pos 01)", 
                "QUẢN LÝ WORKSET (Trang 82)(Pos 03)", 
                "LỆNH SYNCHRONIZE VÀ RELOAD LATEST (Trang 84)(Pos 05)"
            ] 
        },
        { 
            title: "2. LIÊN KẾT DỰ ÁN (LINK REVIT)", 
            items: [
                "LINK CÁC BỘ MÔN (AR-ST-MEP) (Trang 86)(Pos 07)", 
                "KIỂM TRA XUNG ĐỘT (INTERFERENCE CHECK) (Trang 88)(Pos 09)", 
                "COPY/MONITOR - THEO DÕI THAY ĐỔI (Trang 90)(Pos 11)"
            ] 
        }
    ]
  },
  { 
    name: 'BÀI 08. QUẢN LÝ THÔNG TIN', 
    page: 'Trang 92', 
    url: MANUAL_URLS.REVIT_02_BAI_8, 
    sections: [
        { 
            title: "1. THÔNG SỐ DỰ ÁN (PARAMETERS)", 
            items: [
                "PROJECT PARAMETERS VÀ SHARED PARAMETERS (Trang 92)(Pos 01)", 
                "GÁN THÔNG TIN CHO ĐỐI TƯỢNG (Trang 94)(Pos 03)", 
                "QUẢN LÝ THÔNG TIN DỰ ÁN (PROJECT INFORMATION) (Trang 96)(Pos 05)"
            ] 
        },
        { 
            title: "2. CÔNG CỤ NÂNG CAO", 
            items: [
                "PHÂN CHIA GIAI ĐOẠN (PHASING) (Trang 98)(Pos 07)", 
                "PHƯƠNG ÁN THIẾT KẾ (DESIGN OPTIONS) (Trang 100)(Pos 09)", 
                "KIỂM TRA VÀ TỐI ƯU FILE DỰ ÁN (Trang 102)(Pos 11)"
            ] 
        }
    ]
  }
] as TocItem[]
      };
    }
    if (checkMatch(revit2018Urls)) {
      return {
        title: "Revit 2018 Thực chiến",
        color: "bg-[#003d73]",
        items: [
{ 
    
    name: 'Bài 1. Giới thiệu chung', 
    page: 'Trang 10', 
    url: MANUAL_URLS.REVIT_2018_BAI_1, 
    sections: [
        { 
            title: "1. TẠO HỆ TRỤC ĐỊNH VỊ", 
            items: [
                "Lệnh Grid (GR) - Vẽ trục thẳng và cong (Trang 26)(pos 02)",
                "Hiệu chỉnh tên và ẩn hiện bong bóng trục (Trang 26)(pos 02)",
                "Thay đổi chiều dài và khóa 2D/3D cho trục (Trang 26)(pos 02)",
                "Lệnh Copy (CO) - Sao chép hệ trục (Trang 27)(pos 03)",
                "Lệnh Aligned Dimension (DI) - Ghi kích thước trục (Trang 28)(pos 04)",
                "Lệnh Move (MV) - Di chuyển trục (Trang 28)(pos 04)"
            ] 
        },
        { 
            title: "2. CAO TRÌNH (LEVELS)", 
            items: [
                "Lệnh Level (LL) - Tạo cao trình trên mặt đứng (Trang 29)(pos 05)",
                "Hiệu chỉnh tên tầng và giá trị cao độ (Trang 29)(pos 05)",
                "Tạo mặt bằng sàn (Floor Plan) từ cao trình (Trang 30)(pos 06)"
            ] 
        },
        { 
            title: "3. CÁC LỖI THƯỜNG GẶP", 
            items: [
                "Xử lý lỗi mất trục trên mặt bằng (Trang 31)(pos 07)",
                "Quản lý hiển thị đầu trục 2D và 3D (Trang 31)(pos 07)"
            ] 
        }
    ] 
},
{ 
    
name: 'BÀI 2. TRỤC ĐỊNH VỊ', 
    page: 'Trang 25', 
    url: MANUAL_URLS.REVIT_2018_BAI_2, 
    sections: [
        { 
            title: "1. TẠO HỆ TRỤC ĐỊNH VỊ", 
            items: [
                "Lệnh Grid (GR) - Vẽ trục thẳng và cong (Trang 26)(pos 02)",
                "Hiệu chỉnh tên và ẩn hiện bong bóng trục (Trang 26)(pos 02)",
                "Thay đổi chiều dài và khóa 2D/3D cho trục (Trang 26)(pos 02)",
                "Lệnh Copy (CO) - Sao chép hệ trục (Trang 27)(pos 03)",
                "Lệnh Aligned Dimension (DI) - Ghi kích thước trục (Trang 28)(pos 04)",
                "Lệnh Move (MV) - Di chuyển trục (Trang 28)(pos 04)"
            ] 
        },
        { 
            title: "2. CAO TRÌNH (LEVELS)", 
            items: [
                "Lệnh Level (LL) - Tạo cao trình trên mặt đứng (Trang 29)(pos 05)",
                "Hiệu chỉnh tên tầng và giá trị cao độ (Trang 29)(pos 05)",
                "Tạo mặt bằng sàn (Floor Plan) từ cao trình (Trang 30)(pos 06)"
            ] 
        },
        { 
            title: "3. CÁC LỖI THƯỜNG GẶP", 
            items: [
                "Xử lý lỗi mất trục trên mặt bằng (Trang 31)(pos 07)",
                "Quản lý hiển thị đầu trục 2D và 3D (Trang 31)(pos 07)"
            ] 
        }
    ] 
},
{ 
    name: 'BÀI 03. TƯỜNG - CỬA', 
    page: 'Trang 33', 
    url: MANUAL_URLS.REVIT_2018_BAI_3, 
    sections: [
        { 
            title: "1. BỐ TRÍ TƯỜNG", 
            items: [
                "KHỞI TẠO LOẠI TƯỜNG VÀ DUPLICATE (Trang 34)(pos 02)",
                "CÀI ĐẶT CẤU TẠO LỚP VẬT LIỆU (Trang 35)(pos 03)",
                "THIẾT LẬP CHIỀU CAO VÀ ĐƯỜNG GIÓNG (Trang 36)(pos 04)",
                "CÁC THAO TÁC VẼ TƯỜNG CƠ BẢN (Trang 37)(pos 05)",
                "LỆNH EDIT PROFILE - CHỈNH SỬA BIÊN DẠNG (Trang 41)(pos 09)"
            ] 
        },
        { 
            title: "2. BỐ TRÍ CỬA ĐI & CỬA SỔ", 
            items: [
                "THAO TÁC ĐẶT CỬA ĐI (DOOR) (Trang 52)(pos 20)",
                "HIỆU CHỈNH KÍCH THƯỚC CỬA (Trang 53)(pos 21)",
                "THIẾT LẬP CAO ĐỘ BỆ CỬA SỔ (SILL HEIGHT) (Trang 55)(pos 23)",
                "SAO CHÉP CỬA SANG CÁC TẦNG (PASTE ALIGNED) (Trang 55)(pos 23)"
            ] 
        }
    ] 
},
{ 
    name: 'Bài 4. Trần sàn Phòng', 
    page: 'Trang 57', 
    url: MANUAL_URLS.REVIT_2018_BAI_4, 
    sections: [
      { 
        title: 'Nội dung chính', 
        items: [
          'Thiết lập cấu tạo lớp Sàn và Duplicate loại mới (Trang 58)(pos 02)', 
          'Vẽ biên dạng sàn và đục lỗ mở sàn (Trang 60)(pos 04)', 
          'Lệnh Shaft Opening - Đục lỗ sàn xuyên tầng (Trang 61)(pos 05)',
          'Vẽ Trần (Ceiling): Automatic vs Sketch Ceiling (Trang 62)(pos 06)',
          'Cấu tạo và cao độ hệ trần (Trang 64)(pos 08)',
          'Tạo Phòng (Room) và gắn Tag tên phòng (Trang 65)(pos 09)',
          'Đổ màu mặt bằng sơ đồ khu vực (Color Scheme) (Trang 67)(pos 11)'
        ] 
      }
    ] 
  },
  { 
    name: 'Bài 5. Cột dầm', 
    page: 'Trang 69', 
    url: MANUAL_URLS.REVIT_2018_BAI_5, 
    sections: [
      { 
        title: 'Nội dung chính', 
        items: [
          'Bố trí Cột kiến trúc và Cột kết cấu (CL) (Trang 69)(pos 01)', 
          'Load Family cột bê tông cốt thép từ thư viện (Trang 70)(pos 02)', 
          'Bố trí cột hàng loạt tại giao điểm trục (At Grids) (Trang 71)(pos 03)',
          'Hiệu chỉnh cao độ đỉnh và chân cột (Trang 73)(pos 05)',
          'Vẽ Dầm (Beam) và thiết lập cao độ đặt dầm (Trang 76)(pos 08)',
          'Lệnh Join Geometry xử lý giao cắt Dầm - Cột - Sàn (Trang 78)(pos 10)'
        ] 
      }
    ] 
  },
  { 
    name: 'Bài 6. Vách kính Lam Chi tiết tường', 
    page: 'Trang 80', 
    url: MANUAL_URLS.REVIT_2018_BAI_6, 
    sections: [
      { 
        title: 'Nội dung chính', 
        items: [
          'Khởi tạo vách kính Curtain Wall và Automatically Embed (Trang 81)(pos 02)', 
          'Thiết lập lưới đố kính (Curtain Grid) (Trang 83)(pos 04)', 
          'Gán thanh đố (Mullion) vào hệ lưới (Trang 85)(pos 06)',
          'Thay thế tấm kính bằng Cửa đi vách kính đặc thù (Trang 88)(pos 09)',
          'Vẽ Lam trang trí (Louver) từ Curtain Wall (Trang 91)(pos 12)',
          'Vẽ Phào chỉ (Wall Sweep) và Ron tường (Reveal) (Trang 96)(pos 17)',
          'Tạo Family Profile cho tiết diện phào chỉ trang trí (Trang 100)(pos 21)'
        ] 
      }
    ] 
  },
  { 
    name: 'Bài 7. Mái mái kính Chi tiết mái', 
    page: 'Trang 104', 
    url: MANUAL_URLS.REVIT_2018_BAI_7, 
    sections: [
      { 
        title: 'Nội dung chính', 
        items: [
          'Vẽ Mái dốc theo biên dạng (Roof by Footprint) (Trang 105)(pos 02)', 
          'Định nghĩa độ dốc (Define Slope) cho các cạnh mái (Trang 107)(pos 04)', 
          'Vẽ Mái theo tiết diện đứng (Roof by Extrusion) (Trang 109)(pos 06)',
          'Lệnh Attach Top/Base gắn đỉnh tường vào mái (Trang 111)(pos 08)',
          'Vẽ Sê-nô máng xối (Gutter) và Diềm mái (Fascia) (Trang 114)(pos 13)',
          'Tạo hệ Vì kèo mái bằng Beam System (Trang 116)(pos 15)'
        ] 
      }
    ] 
  },
  { 
    name: 'Bài 8. Cầu thang', 
    page: 'Trang 117', 
    url: MANUAL_URLS.REVIT_2018_BAI_8, 
    sections: [
      { 
        title: 'Nội dung chính', 
        items: [
          'Thiết lập Cao bậc, Rộng bậc và Số bậc thang (Trang 118)(pos 02)', 
          'Vẽ thang thẳng, thang chữ L và chữ U (Trang 120)(pos 04)', 
          'Vẽ thang tròn xoắn và thang xẻ bậc (Trang 124)(pos 08)',
          'Hiệu chỉnh Chiếu nghỉ (Landing) và Vế thang (Run) (Trang 128)(pos 12)',
          'Thiết kế chi tiết cấu tạo Mặt bậc, Đối bậc, Mũi bậc (Trang 134)(pos 18)',
          'Chỉnh sửa ký hiệu ngắt thang và hiển thị mặt bằng (Trang 137)(pos 21)'
        ] 
      }
    ] 
  },
  { 
    name: 'Bài 9. Ram Lan can', 
    page: 'Trang 139', 
    url: MANUAL_URLS.REVIT_2018_BAI_9, 
    sections: [
      { 
        title: 'Nội dung chính', 
        items: [
          'Vẽ đường dốc (Ramp) và cài đặt độ dốc 1/x (Trang 140)(pos 02)', 
          'Vẽ Lan can (Railing) theo đường dẫn Sketch (Trang 144)(pos 06)',
          'Hiệu chỉnh cấu tạo Thanh đứng (Baluster Placement) (Trang 147)(pos 09)',
          'Hiệu chỉnh cấu tạo Thanh ngang và Tay vịn (Top Rail) (Trang 150)(pos 12)',
          'Lệnh Pick Host gán lan can vào thang hoặc sàn (Trang 153)(pos 15)'
        ] 
      }
    ] 
  },
  { 
    name: 'Bài 10. Vật dụng Chi tiết đặc biệt', 
    page: 'Trang 154', 
    url: MANUAL_URLS.REVIT_2018_BAI_10, 
    sections: [
      { 
        title: 'Nội dung chính', 
        items: [
          'Bố trí Vật dụng nội thất (Component - CM) (Trang 155)(pos 02)', 
          'Quản lý nhóm đối tượng (Group - GP) (Trang 159)(pos 06)', 
          'Vẽ chữ 3D (Model Text) và chi tiết trang trí (Trang 164)(pos 11)',
          'Khái niệm vẽ Model In-place cho cấu kiện đặc thù (Trang 167)(pos 14)',
          'Các lệnh tạo khối 3D: Extrusion, Blend, Revolve, Sweep (Trang 170)(pos 17)',
          'Sử dụng khối rỗng (Void Forms) để đục cắt khối (Trang 177)(pos 24)'
        ] 
      }
    ] 
  },
  { 
    name: 'Bài 11. Family căn bản', 
    page: 'Trang 179', 
    url: MANUAL_URLS.REVIT_2018_BAI_11, 
    sections: [
      { 
        title: 'Nội dung chính', 
        items: [
          'Thiết lập đường dẫn thư viện Family Template (Trang 180)(pos 02)', 
          'Nguyên lý mặt phẳng tham chiếu (Reference Plane) (Trang 183)(pos 05)', 
          'Gán biến kích thước (Dimension Parameter) (Trang 187)(pos 09)',
          'Quản lý biến Vật liệu và biến Hiển thị (Trang 191)(pos 13)',
          'Sử dụng các Hàm toán học cơ bản trong Family (Trang 194)(pos 16)',
          'Kỹ thuật lồng Family (Nested Family) (Trang 197)(pos 19)'
        ] 
      }
    ] 
  },
  { 
    name: 'Bài 12. Chèn file Vẽ địa hình', 
    page: 'Trang 199', 
    url: MANUAL_URLS.REVIT_2018_BAI_12, 
    sections: [
      { 
        title: 'Nội dung chính', 
        items: [
          'Link CAD vs Import CAD và quản lý tệp liên kết (Trang 200)(pos 02)', 
          'Chèn file Ảnh tham chiếu (Image) (Trang 203)(pos 05)', 
          'Tạo địa hình (Toposurface) từ điểm Point (Trang 205)(pos 07)',
          'Tạo địa hình tự động từ file AutoCAD 3D (Trang 207)(pos 09)',
          'San nền bằng Building Pad (Trang 211)(pos 13)',
          'Cắt, nhập và chia vùng địa hình (Subregion) (Trang 212)(pos 14)'
        ] 
      }
    ] 
  },
  { 
    name: 'Bài 13. Hình chiếu Cây thư mục', 
    page: 'Trang 213', 
    url: MANUAL_URLS.REVIT_2018_BAI_13, 
    sections: [
      { 
        title: 'Nội dung chính', 
        items: [
          'Quản lý vùng nhìn View Range (Trang 214)(pos 02)', 
          'Tạo mặt cắt (Section) và trích chi tiết (Callout) (Trang 218)(pos 06)', 
          'Tạo bản vẽ ghi chú 2D (Drafting View) (Trang 225)(pos 13)',
          'Thiết lập Cây thư mục dự án (Browser Organization) (Trang 230)(pos 18)',
          'Quản lý hiển thị đối tượng với VG và Filters (Trang 235)(pos 23)',
          'Sử dụng View Template chuẩn hóa hồ sơ (Trang 240)(pos 28)'
        ] 
      }
    ] 
  },
  { 
    name: 'Bài 14. Ghi chú bản vẽ', 
    page: 'Trang 242', 
    url: MANUAL_URLS.REVIT_2018_BAI_14, 
    sections: [
      { 
        title: 'Nội dung chính', 
        items: [
          'Các loại đường kích thước (Dimension): Aligned, Linear, Angular (Trang 243)(pos 02)', 
          'Ghi chú chữ (Text) và quản lý đường dẫn (Leader) (Trang 247)(pos 06)', 
          'Ghi chú cao độ (Spot Elevation) và tọa độ điểm (Trang 252)(pos 11)',
          'Ghi chú độ dốc (Spot Slope) cho mái và ram dốc (Trang 256)(pos 15)',
          'Tạo chi tiết 2D với Detail Line và Filled Region (Trang 261)(pos 20)',
          'Sử dụng các ký hiệu chú thích (Annotation Symbols) (Trang 268)(pos 27)',
          'Hiệu chỉnh đơn vị cao độ về mét trong Family Editor (Trang 273)(pos 32)'
        ] 
      }
    ] 
  },
  { 
    name: 'Bài 15. Thống kê', 
    page: 'Trang 275', 
    url: MANUAL_URLS.REVIT_2018_BAI_15, 
    sections: [
      { 
        title: 'Nội dung chính', 
        items: [
          'Tạo bảng thống kê đối tượng (Schedule/Quantities) (Trang 276)(pos 02)', 
          'Thống kê chi tiết Cửa đi và Cửa sổ (Trang 280)(pos 06)', 
          'Lọc và sắp xếp dữ liệu (Filter, Sorting & Grouping) (Trang 284)(pos 10)',
          'Định dạng bảng và tính toán tổng cộng khối lượng (Trang 288)(pos 14)',
          'Thống kê diện tích phòng và diện tích sàn (Trang 291)(pos 17)',
          'Xuất khối lượng vật liệu (Material Takeoff) (Trang 294)(pos 20)',
          'Cộng gộp khối lượng các vật liệu cùng nhóm (Trang 295)(pos 21)'
        ] 
      }
    ] 
  },
  { 
    name: 'Bài 16. Phối cảnh Render', 
    page: 'Trang 296', 
    url: MANUAL_URLS.REVIT_2018_BAI_16, 
    sections: [
      { 
        title: 'Nội dung chính', 
        items: [
          'Thiết lập hình chiếu phối cảnh song song & điểm tụ (Trang 297)(pos 02)', 
          'Lưu góc nhìn và khóa View phối cảnh (Trang 297)(pos 02)', 
          'Tạo mặt cắt phối cảnh 3D với Section Box (Trang 298)(pos 03)',
          'Kỹ thuật tách lớp đối tượng để diễn họa (Trang 299)(pos 04)',
          'Quản lý vật liệu (Materials) và thư viện ảnh Map (Trang 310)(pos 15)',
          'Thiết lập ánh sáng mặt trời và ánh sáng nhân tạo (Trang 320)(pos 25)',
          'Kết xuất hình ảnh với Render in Cloud và Render Local (Trang 330)(pos 35)',
          'Tải và xử lý hậu kỳ ảnh Render không nền (Trang 334)(pos 39)'
        ] 
      }
    ] 
  },
  { 
    name: 'Bài 17. Dàn trang In ấn Xuất file', 
    page: 'Trang 335', 
    url: MANUAL_URLS.REVIT_2018_BAI_17, 
    sections: [
      { 
        title: 'Nội dung chính', 
        items: [
          'Tạo Family khung tên (Title Block) các khổ giấy (Trang 336)(pos 02)', 
          'Thêm Label thông tin dự án vào khung tên (Trang 340)(pos 06)', 
          'Quy trình dàn trang bản vẽ (Sheets) (Trang 345)(pos 11)',
          'Quản lý danh sách bản vẽ tự động (Sheet List) (Trang 350)(pos 16)',
          'Thiết lập in ấn hàng loạt sang PDF (Trang 353)(pos 19)',
          'Xuất hồ sơ sang định dạng DWG chuẩn Layer (Trang 355)(pos 21)',
          'Xuất bảng thống kê sang định dạng Excel (.txt) (Trang 357)(pos 23)'
        ] 
      }
    ] 
  },
        ] as TocItem[]
      };
    }
if (checkMatch(revitErrorsUrls)) {
    return {
      title: "Tổng hợp Lỗi thường gặp",
      color: "bg-red-600",
      items: [
        {
          name: "CHƯƠNG 1. LỖI CÀI ĐẶT & KÍCH HOẠT",
          page: "Trang 08",
          url: MANUAL_URLS.REVIT_ERRORS,
          sections: [
            {
              title: "1. LỖI KHI CÀI ĐẶT PHẦN MỀM",
              items: [
                "Máy đủ cấu hình vẫn không cài được (Win 7 SP1) (Trang 08) [cite: 5]",
                "Gỡ bỏ phiên bản cũ không sạch/Xung đột (Trang 09) [cite: 6]",
                "Lỗi không hiển thị nút Install (Trang 10) [cite: 6]",
                "Lỗi giải nén/Virus chặn file cài đặt (Trang 11) [cite: 7]",
                "Lỗi đường dẫn cài đặt quá dài/có dấu (Trang 12) [cite: 7]",
                "Lỗi đòi thêm đĩa khi cài bằng ổ ảo (Trang 13) [cite: 8]",
                "Hư file cài đặt Microsoft Visual C++ (Trang 14) [cite: 8]"
              ]
            },
            {
              title: "2. LỖI KÍCH HOẠT & LIÊN KẾT",
              items: [
                "Lỗi Registration-Activation (0015.111) (Trang 15) [cite: 9]",
                "Tường lửa chặn file Crack (X-Force) (Trang 16) [cite: 9]",
                "Lỗi chuyển file Revit qua Robot Structural Analysis (Trang 17) [cite: 10]",
                "Lỗi mất thư viện (Content) khi cài không Internet (Trang 18-19) [cite: 10, 11]"
              ]
            }
          ]
        },
        {
          name: "CHƯƠNG 2. LỖI THIẾT LẬP & GIAO DIỆN",
          page: "Trang 21",
          url: MANUAL_URLS.REVIT_ERRORS,
          sections: [
            {
              title: "1. GIAO DIỆN NGƯỜI DÙNG",
              items: [
                "Mất View Cube / Dịch chuyển vị trí (Trang 24-25) [cite: 13, 14]",
                "Mất thanh công cụ Ribbon (Trang 26) [cite: 14]",
                "Mất thanh Dockbar dưới màn hình (Trang 27) [cite: 15]",
                "Mất thanh Properties & Project Browser (Trang 28) [cite: 15]",
                "Mất Video hướng dẫn (Flash Player) (Trang 23) [cite: 13]"
              ]
            },
            {
              title: "2. CẤU HÌNH HỆ THỐNG",
              items: [
                "Revit không nhận Card màn hình (Trang 21) [cite: 12]",
                "Lỗi hiển thị cấu kiện do Driver Card (Trang 54) [cite: 28]",
                "A360 báo lỗi thời gian hệ thống (Trang 32) [cite: 17]",
                "Render iCloud / Vray báo lỗi tài khoản (Trang 33-34) [cite: 18]"
              ]
            }
          ]
        },
        {
          name: "CHƯƠNG 3. LỖI DỰNG HÌNH & HIỂN THỊ",
          page: "Trang 39",
          url: MANUAL_URLS.REVIT_ERRORS,
          sections: [
            {
              title: "1. LỖI CẤU KIỆN & CÔNG CỤ",
              items: [
                "Dầm bị hở một đoạn (Offset) (Trang 39) [cite: 21]",
                "Lỗi bố trí thép bằng Extension (Trang 40) [cite: 21]",
                "Cắt đoạn dư của dầm (By Face) (Trang 42) [cite: 22]",
                "Lỗi không thể chọn cột ở mặt bằng (View Range) (Trang 45) [cite: 24]",
                "Nét Hatch tường đi xuyên qua cột (Join Geometry) (Trang 48) [cite: 25]",
                "Lưới trục không hiện ở các tầng (Trang 51-52) [cite: 27]"
              ]
            },
            {
              title: "2. QUẢN LÝ HIỂN THỊ",
              items: [
                "Không thấy nét khuất của dầm (Discipline) (Trang 44) [cite: 23]",
                "Lỗi không chỉnh được Visibility Graphic (View Template) (Trang 46) [cite: 24]",
                "Không thấy các lớp cấu tạo tường (Detail Level) (Trang 47) [cite: 25]",
                "Nét thép không đậm lên (Thin Lines) (Trang 57) [cite: 30]",
                "Mất mặt đứng Elevation / Mặt cắt Section (Trang 56-58) [cite: 29, 30]",
                "Break line không ẩn được nét (Wireframe) (Trang 59) [cite: 31]"
              ]
            }
          ]
        },
        {
          name: "CHƯƠNG 4. THỦ THUẬT & XUẤT HỒ SƠ",
          page: "Trang 36",
          url: MANUAL_URLS.REVIT_ERRORS,
          sections: [
            {
              title: "1. WORKSHARING & LIÊN KẾT",
              items: [
                "Không mở/điều chỉnh được file Workset (Trang 36-37) [cite: 19, 20]",
                "Lưới trục kiến trúc và kết cấu khác nhau (Trang 63) [cite: 33]",
                "Link CAD vào Revit bị khung quá lớn (Trang 49) [cite: 26]",
                "Lỗi Steel Connection không liên kết được (Trang 35) [cite: 19]"
              ]
            },
            {
              title: "2. XUẤT BẢN HỒ SƠ",
              items: [
                "Lỗi Font chữ khi in PDF (Trang 55) [cite: 29]",
                "Tag thép sàn ra số lẻ (Area Reinforcement) (Trang 64) [cite: 33]",
                "Lỗi gộp nhiều bản vẽ thành 1 file PDF (Trang 71) [cite: 37]",
                "Xuất AutoCAD ra nhiều file liên kết (External Ref) (Trang 72) [cite: 37]",
                "Lỗi phân tách bản thống kê làm 2 bảng (Trang 73) [cite: 38]"
              ]
            }
          ]
        }
      ]
    };
  }
    if (checkMatch([MANUAL_URLS.TCVN_14177_1])) {
      return {
        title: "TCVN 14177-1:2024",
        color: "bg-blue-700",
        items: [
          { name: 'Phạm vi áp dụng', page: 'Trang 11', url: MANUAL_URLS.TCVN_14177_1 },
          { name: 'Thuật ngữ & Định nghĩa', page: 'Trang 12', url: MANUAL_URLS.TCVN_14177_1 },
          { name: 'Quản lý thông tin', page: 'Trang 13', url: MANUAL_URLS.TCVN_14177_1 },
          { name: 'Xác định yêu cầu thông tin', page: 'Trang 17', url: MANUAL_URLS.TCVN_14177_1 },
          { name: 'Chu kỳ chuyển giao', page: 'Trang 20', url: MANUAL_URLS.TCVN_14177_1 },
          { name: 'CDE - Môi trường dữ liệu chung', page: 'Trang 33', url: MANUAL_URLS.TCVN_14177_1 },
        ]
      };
    }
    if (checkMatch([MANUAL_URLS.TCVN_14177_2])) {
      return {
        title: "TCVN 14177-2:2024",
        color: "bg-indigo-700",
        items: [
          { name: 'Phạm vi áp dụng', page: 'Trang 11', url: MANUAL_URLS.TCVN_14177_2 },
          { name: 'Quá trình quản lý thông tin', page: 'Trang 14', url: MANUAL_URLS.TCVN_14177_2 },
          { name: '5.1 Đánh giá nhu cầu', page: 'Trang 14', url: MANUAL_URLS.TCVN_14177_2 },
          { name: '5.2 Hồ sơ yêu cầu', page: 'Trang 18', url: MANUAL_URLS.TCVN_14177_2 },
          { name: '5.3 Hồ sơ đề xuất', page: 'Trang 21', url: MANUAL_URLS.TCVN_14177_2 },
          { name: '5.4 Thỏa thuận', page: 'Trang 25', url: MANUAL_URLS.TCVN_14177_2 },
          { name: '5.5 Huy động', page: 'Trang 29', url: MANUAL_URLS.TCVN_14177_2 },
          { name: '5.6 Hợp tác tạo lập thông tin', page: 'Trang 31', url: MANUAL_URLS.TCVN_14177_2 },
          { name: '5.7 Chuyển giao mô hình', page: 'Trang 33', url: MANUAL_URLS.TCVN_14177_2 },
          { name: '5.8 Kết thúc dự án', page: 'Trang 35', url: MANUAL_URLS.TCVN_14177_2 },
        ]
      };
    }
    return null;
  }, [pdfUrl]);

  const filteredTocItems = useMemo(() => {
    if (!currentToc) return [];
    if (!tocSearch.trim()) return currentToc.items;
    const term = tocSearch.toLowerCase();
    
    // Logic search mới hỗ trợ 3 cấp
    return currentToc.items.filter(item => {
      const nameMatch = item.name.toLowerCase().includes(term);
      const sectionMatch = item.sections?.some(sec => 
          sec.title.toLowerCase().includes(term) || 
          sec.items.some(sub => sub.toLowerCase().includes(term))
      );
      return nameMatch || sectionMatch;
    });
  }, [currentToc, tocSearch]);

  const handleSourceChange = (mode: SourceMode) => {
    if (mode === activeSource) return;
    setActiveSource(mode);
    geminiService.setSourceMode(mode);
    
    let notifyText = '';
    if (mode === 'focused') {
        notifyText = '🎯 Đã chuyển sang chế độ: **Revit Thực Chiến**. Tôi sẽ ưu tiên phân tích dữ liệu chuyên sâu từ tài liệu Revit 2018 Thực chiến để giải quyết vấn đề thực tế.';
    } else if (mode === 'errors') {
        notifyText = '⚠️ Đã chuyển sang chế độ: **Xử lý Lỗi thường gặp**. Tôi sẽ tập trung vào chẩn đoán và hướng dẫn khắc phục các sự cố phổ biến trong Revit.';
    } else {
        notifyText = '🌐 Đã chuyển sang chế độ: **Tất cả nguồn**. Tôi sẽ kết hợp kiến thức từ Sổ tay VCC và tiêu chuẩn BIM Việt Nam (TCVN 14177:2024).';
    }

    const notifyMsg: ExtendedMessage = {
      role: 'model',
      content: notifyText,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, notifyMsg]);
  };

  const handleSendMessage = async (content: string, image?: string) => {
    const userMessage: ExtendedMessage = {
      role: 'user',
      content,
      image,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    if (window.innerWidth < 1024) setIsSidebarOpen(false);

    let modelResponse: ExtendedMessage = {
      role: 'model',
      content: '',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, modelResponse]);

    await geminiService.sendMessage(content, (chunk, metadata) => {
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last.role === 'model') {
          return [...prev.slice(0, -1), { 
            ...last, 
            content: chunk,
            groundingMetadata: metadata || last.groundingMetadata 
          }];
        }
        return prev;
      });
    }, image);

    setIsLoading(false);
  };

  const handleOpenPdf = (url: string, pageLabel?: string) => {
    let embedUrl = url;
    if (url.includes('drive.google.com')) {
      embedUrl = url.replace('/view', '/preview');
    }

    let targetPage = '';
    if (pageLabel) {
      const match = pageLabel.match(/Trang\s*(\d+)/i) || pageLabel.match(/P\.(\d+)/i) || pageLabel.match(/Page\.\s*(\d+)/i);
      if (match) {
        targetPage = match[1];
        setManualPage(targetPage);
      }
    }

    if (targetPage) {
      embedUrl = `${embedUrl.split('#')[0]}#page=${targetPage}`;
    }

    setIsSidebarOpen(false);
    setIsTocOpen(true);

    // Nếu URL giống hệt URL hiện tại, không làm gì để tránh reload iframe
    if (embedUrl === pdfUrl) {
      return;
    }

    setPdfUrl(embedUrl);
    setIsPdfLoading(true);
    setCurrentPdfPage(pageLabel || null);
    if (targetPage) setShowPageSplash(true);
  };

  const handleClosePdf = () => {
    setPdfUrl(null);
    setCurrentPdfPage(null);
    setManualPage('');
    setShowPageSplash(false);
    setTocSearch('');
    setCollapsedItems({});
  };

  const togglePdfMode = () => {
    setPdfViewMode(prev => prev === 'split' ? 'full' : 'split');
  };

  // Memoize stable key for iframe to prevent unnecessary re-renders, but include hash for page jumps
  const iframeKey = useMemo(() => {
    if (!pdfUrl) return 'empty';
    // Bao gồm cả phần hash (#page=...) để force reload khi chuyển trang trong cùng 1 file
    return pdfUrl;
  }, [pdfUrl]);

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] overflow-hidden relative">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[105] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className={`
          fixed inset-y-0 left-0 z-[110] 
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          ${!pdfUrl ? 'lg:relative lg:translate-x-0 lg:block' : 'lg:hidden'}
      `}>
        <Sidebar 
            onShortcutClick={(cmd) => handleSendMessage(cmd)} 
            onOpenPdf={handleOpenPdf}
            onClose={() => setIsSidebarOpen(false)} 
        />
      </div>

      <main className="flex flex-grow relative h-full w-full min-w-0">
        
        {/* Chat window - 2/5 (40%) when PDF is open */}
        <div className={`flex flex-col h-full transition-all duration-300 ${pdfUrl && pdfViewMode === 'split' ? 'w-full lg:w-[40%] border-r border-slate-300' : pdfUrl && pdfViewMode === 'full' ? 'hidden' : 'w-full'}`}>
            <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-6 py-2 sm:py-3 flex flex-col sm:flex-row items-center justify-between shadow-sm flex-shrink-0 gap-4">
                <div className="flex items-center gap-2 sm:gap-6 w-full sm:w-auto">
                    <button 
                        onClick={() => setIsSidebarOpen(true)}
                        className={`w-11 h-11 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg bg-slate-50 text-slate-600 border border-slate-200 active:scale-95 transition-transform ${(!pdfUrl ? 'lg:hidden' : '')}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                    </button>
                    <span className="text-xl sm:text-2xl font-black text-[#ee0033] tracking-tighter">VCC</span>
                    <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
                    <h1 className="text-xs sm:text-sm font-black text-slate-700 uppercase tracking-tighter truncate">BIM ASSISTANT</h1>
                </div>

                <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner w-full sm:w-auto overflow-x-auto no-scrollbar">
                    <button 
                       onClick={() => handleSourceChange('all')}
                       className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all whitespace-nowrap ${activeSource === 'all' ? 'bg-white text-[#ee0033] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                       🌐 TẤT CẢ NGUỒN
                    </button>
                    <button 
                       onClick={() => handleSourceChange('focused')}
                       className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all whitespace-nowrap ${activeSource === 'focused' ? 'bg-[#004B8D] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                       🎯 REVIT THỰC CHIẾN
                    </button>
                    <button 
                       onClick={() => handleSourceChange('errors')}
                       className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all whitespace-nowrap ${activeSource === 'errors' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                       ⚠️ LỖI THƯỜNG GẶP
                    </button>
                </div>
            </header>

            <div className="flex-grow overflow-y-auto p-3 sm:p-6 custom-scrollbar relative">
                <div className="max-w-6xl mx-auto w-full relative z-10">
                    {messages.map((msg, idx) => (
                    <ChatMessage 
                        key={idx} 
                        message={msg} 
                        onOpenPdf={handleOpenPdf} 
                        onSuggestionClick={(sug) => handleSendMessage(sug)} // Thêm callback này
                    />
                    ))}
                    {isLoading && messages[messages.length - 1].content === '' && (
                    <div className="flex justify-start mb-6">
                        <div className="bg-white border border-slate-200 p-3 sm:p-4 rounded-2xl shadow-sm flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-[#ee0033] rounded-full animate-bounce"></div>
                            <div className="w-1.5 h-1.5 bg-[#ee0033] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                            <div className="w-1.5 h-1.5 bg-[#ee0033] rounded-full animate-bounce [animation-delay:0.4s]"></div>
                        </div>
                    </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            <div className="p-3 sm:p-6 bg-white border-t border-slate-200 shadow-md">
                <div className="max-w-6xl mx-auto w-full">
                    <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
                </div>
            </div>
        </div>

        {/* PDF window - 3/5 (60%) when open */}
        {pdfUrl && (
            <div className={`fixed inset-0 z-[100] lg:static lg:z-0 ${pdfViewMode === 'full' ? 'w-full' : 'lg:w-[60%]'} h-full bg-slate-800 flex flex-col border-l border-slate-300 shadow-2xl lg:shadow-none transition-all duration-300`}>
                <div className="h-16 lg:h-14 bg-slate-900 flex items-center justify-between px-4 shadow-md flex-shrink-0">
                    <div className="flex items-center gap-3 text-white overflow-hidden">
                        <button onClick={() => setIsTocOpen(!isTocOpen)} className={`p-2.5 rounded-lg transition-all ${isTocOpen ? 'bg-red-600 shadow-lg ring-2 ring-red-400/20' : 'bg-slate-700 hover:bg-slate-600'}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                        </button>
                        <span className="font-bold text-sm tracking-wide hidden sm:inline flex-shrink-0 uppercase opacity-80">DOCUMENT VIEWER</span>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                         <button 
                            onClick={() => {
                                if (iframeRef.current) {
                                    // Gửi lệnh scroll lên đầu trang nếu có thể (thường chỉ hoạt động với cùng origin, 
                                    // nhưng reload với hash #page=1 là cách chắc chắn nhất cho Drive iframe)
                                    const baseUrl = pdfUrl?.split('#')[0];
                                    if (baseUrl) setPdfUrl(`${baseUrl}#page=1&t=${Date.now()}`);
                                }
                            }} 
                            className="p-2.5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors flex items-center gap-1"
                            title="Lên đầu trang"
                         >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
                         </button>
                         <button onClick={togglePdfMode} className="p-2.5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors hidden lg:flex items-center gap-1">
                            <span className="text-[10px] font-bold uppercase">{pdfViewMode === 'split' ? 'FULL' : 'SPLIT'}</span>
                         </button>
                        <button onClick={handleClosePdf} className="h-10 sm:h-9 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2 px-4 shadow-md active:scale-95">
                            <span className="text-xs font-black uppercase">ĐÓNG</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                    </div>
                </div>

                <div className="flex-grow bg-slate-100 relative overflow-hidden flex flex-row">
                    {isTocOpen && (
                      <div className="absolute inset-y-0 left-0 w-64 sm:w-72 lg:relative lg:w-72 h-full bg-[#1e293b] border-r border-white/5 flex flex-col flex-shrink-0 animate-in slide-in-from-left duration-300 z-30 overflow-hidden shadow-2xl">
                          {currentToc ? (
                            <>
                              <div className={`p-4 ${currentToc.color} text-white shadow-lg flex-shrink-0`}>
                                  <div className="flex items-center justify-between mb-3">
                                      <h4 className="text-[11px] font-black uppercase tracking-widest">{currentToc.title}</h4>
                                      <button onClick={() => setIsTocOpen(false)} className="lg:hidden p-1 hover:bg-white/10 rounded">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                      </button>
                                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-50 hidden lg:block"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                                  </div>
                                  <div className="relative">
                                      <input type="text" value={tocSearch} onChange={(e) => setTocSearch(e.target.value)} placeholder="Tìm nội dung..." className="w-full bg-black/20 border border-white/10 rounded-md py-1.5 pl-7 pr-2 text-[10px] text-white focus:outline-none focus:ring-1 focus:ring-white/20 transition-all" />
                                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-2 top-1/2 -translate-y-1/2 text-white/30"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                                  </div>
                              </div>
                              <div className="flex-grow overflow-y-auto custom-scrollbar p-2 space-y-1 bg-[#1e293b] scroll-smooth">
                                  {filteredTocItems.map((item, idx) => {
                                    const normalize = (url: string) => url.split('?')[0].replace('/view', '').replace('/preview', '');
                                    const isActive = normalize(pdfUrl) === normalize(item.url);
                                    const isCollapsed = collapsedItems[item.url];

                                    return (
                                      <div key={idx} className="mb-1">
                                        <button 
                                          onClick={() => {
                                            if (isActive) {
                                                setCollapsedItems(prev => ({...prev, [item.url]: !prev[item.url]}));
                                            } else {
                                                handleOpenPdf(item.url);
                                                setCollapsedItems(prev => ({...prev, [item.url]: false}));
                                            }
                                          }} 
                                          className={`w-full text-left p-2.5 rounded-lg text-[11px] font-bold transition-all flex items-center justify-between border ${isActive ? `${currentToc.color} text-white border-transparent shadow-lg` : 'text-slate-400 hover:text-white border-transparent hover:bg-slate-800/50'}`}
                                        >
                                          <div className="flex items-center gap-2 min-w-0">
                                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isActive ? 'bg-white animate-pulse' : 'bg-slate-600'}`}></span>
                                            <span className="truncate">{item.name}</span>
                                          </div>
                                          {item.page && <span className={`text-[8px] px-1.5 py-0.5 rounded ml-2 flex-shrink-0 font-black ${isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-500'}`}>{item.page}</span>}
                                        </button>
                                        
                                        {/* Render Cấp 2 và Cấp 3 */}
                                        {isActive && !isCollapsed && item.sections && item.sections.length > 0 && (
                                          <div className="ml-4 mt-1 border-l border-white/10 flex flex-col gap-1 animate-in slide-in-from-top-1 duration-200 bg-black/10 rounded-r-lg py-2">
                                            {item.sections.map((sec, sIdx) => (
                                              <div key={sIdx} className="mb-2">
                                                  {/* Level 2 Title */}
                                                  <div className="text-[10px] font-bold text-blue-200 px-3 py-1 uppercase tracking-wider flex items-center gap-2">
                                                      <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                                                      {sec.title}
                                                  </div>
                                                  {/* Level 3 Items */}
                                                  {sec.items.map((subItem, subIdx) => {
                                                      // Tách nội dung và phần thông tin trang/(pos)
                                                      // Mẫu: "Nội dung (Trang XX)..."
                                                      const match = subItem.match(/^(.*?)(\s*\(Trang.*)$/);
                                                      const title = match ? match[1] : subItem;
                                                      const meta = match ? match[2] : '';

                                                      return (
                                                          <div key={subIdx} className="py-0.5 px-4 pl-6 text-[9px] text-slate-400 hover:text-white flex items-start gap-2 transition-colors cursor-default group leading-snug">
                                                              <span className="w-0.5 h-0.5 rounded-full bg-slate-600 group-hover:bg-white transition-colors mt-1.5 flex-shrink-0"></span>
                                                              <span>
                                                                  <span className="font-bold italic text-slate-300 group-hover:text-white">{title}</span>
                                                                  <span className="opacity-60 font-medium not-italic text-[8.5px]">
                                                                    {meta.split(/(\d+)/).map((part, i) => (
                                                                      /\d+/.test(part) ? <span key={i} className="text-amber-400 font-extrabold">{part}</span> : part
                                                                    ))}
                                                                  </span>
                                                              </span>
                                                          </div>
                                                      );
                                                  })}
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                              </div>
                            </>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full p-6 text-center text-slate-500 opacity-30">
                                <p className="text-[10px] font-bold uppercase tracking-widest">Không có danh mục</p>
                            </div>
                          )}
                      </div>
                    )}
                    <div className="flex-grow relative h-full bg-slate-100">
                      {isPdfLoading && (
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-50/80 backdrop-blur-sm">
                          <div className="w-12 h-12 border-4 border-slate-200 border-t-[#ee0033] rounded-full animate-spin mb-4"></div>
                          <p className="text-xs font-black text-slate-500 uppercase tracking-widest animate-pulse">Đang tải tài liệu...</p>
                          <p className="text-[10px] text-slate-400 mt-2">Vui lòng chờ trong giây lát</p>
                        </div>
                      )}
                      <iframe 
                        ref={iframeRef}
                        key={iframeKey} 
                        src={pdfUrl} 
                        className={`absolute inset-0 w-full h-full z-10 bg-slate-100 transition-opacity duration-500 pointer-events-auto ${isPdfLoading ? 'opacity-0' : 'opacity-100'}`} 
                        title="PDF Viewer" 
                        allow="autoplay; fullscreen" 
                        loading="eager"
                        onLoad={() => {
                          setIsPdfLoading(false);
                          // Tự động focus vào iframe để con lăn chuột hoạt động ngay lập tức
                          setTimeout(() => {
                            iframeRef.current?.focus();
                          }, 300);
                        }}
                      />
                    </div>
                </div>
            </div>
        )}

        {/* Companion AI Widget */}
        <CompanionChat />

      </main>
    </div>
  );
};

export default App;
