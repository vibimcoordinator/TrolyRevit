
export interface QuizLink {
  title: string;
  url: string;
  session: number;
}

export const QUIZ_LINKS: QuizLink[] = [
  // Buổi 1
  { session: 1, title: "Trắc nghiệm từ vựng chuyên ngành - Bộ môn kiến trúc", url: "https://forms.gle/DA6nhqsBQXTHZJuS6" },
  { session: 1, title: "Trắc nghiệm từ vựng chuyên ngành - Bộ môn kết cấu", url: "https://forms.gle/gqNnn9p4ifEeHpWD9" },
  { session: 1, title: "Trắc nghiệm từ vựng chuyên ngành - Bộ môn MEP", url: "https://forms.gle/T38E7Xb5ywYprgLQ9" },
  { session: 1, title: "Trắc nghiệm Công cụ Dựng hình Revit (Kiến trúc & Kết cấu)", url: "https://forms.gle/eipUrdb8fn24KbFw8" },
  { session: 1, title: "Trắc nghiệm Các lệnh Ẩn/Hiện và Quản lý Đồ họa", url: "https://forms.gle/RvJ3qqcMgW1Vtacq8" },
  { session: 1, title: "Bài kiểm tra thực hành lưới trục, dựng cột", url: "https://forms.gle/yyHk483zw1QhVZB1A" },
  { session: 1, title: "Bài tập thực hành Lưới trục - Cao độ - Hiển thị", url: "https://forms.gle/3qj8EerYqmbe9EGdA" },
  
  // Buổi 2
  { session: 2, title: "Trắc nghiệm từ vựng chuyên ngành cơ bản trong revit", url: "https://forms.gle/H7f9wLqH8a65bqnc8" },
  { session: 2, title: "Trắc nghiệm công cụ dựng hình Modify", url: "https://forms.gle/eipUrdb8fn24KbFw8" },
  { session: 2, title: "Trắc nghiệm ẩn hiện đối tượng QUẢN LÝ ẨN/HIỆN (VISIBILITY) TRONG REVIT", url: "https://forms.gle/sjRVnBBR5CuFTayf6" },
  { session: 2, title: "Bài kiểm tra trắc nghiệm KỸ NĂNG SELECT, MODIFY & JOIN GEOMETRY", url: "https://forms.gle/LvqWg3PZJPhzDeVNA" },
  { session: 2, title: "Bài kiểm tra trắc nghiệm Select - Assembly code", url: "https://forms.gle/koLLE2S1pcmUjo1r5" },
  
  // Buổi 3
  { session: 3, title: "Kiểm tra Từ vựng Tiếng Anh chuyên ngành Revit (Cơ bản)", url: "https://forms.gle/wF4XtxtoYTxvceQs5" },
  { session: 3, title: "Trắc nghiệm công cụ dựng hình (Cột - Dầm - Sàn - Tường)", url: "https://forms.gle/1FVgn7cN2sHv2ExM8" },
  { session: 3, title: "Trắc nghiệm hiệu chỉnh thông số trong bảng Properties của Cột - Dầm - Sàn - Tường.", url: "https://forms.gle/qDfKsasWaUSZESxM7" },
  
  // Buổi 4
  { session: 4, title: "Trắc nghiệm từ vựng Từ vựng Revit Family", url: "https://forms.gle/DjcaA8bJnBSm5t25A" },
  { session: 4, title: "Trắc nghiệm Revit Family & Parameters", url: "https://forms.gle/ngQ96JcWozvqiX156" },
  { session: 4, title: "Trắc nghiệm sử dụng Family Template (Chuyên Sâu)", url: "https://forms.gle/uAzPx65WpzaEYab96" },
  
  // Buổi 5
  { session: 5, title: "Trắc nghiệm Tọa độ trong revit (Project base point và Survey point)", url: "https://forms.gle/4gapLBXRWXbYByXDA" },
  { session: 5, title: "Trắc nghiệm quản lý và hiển thị file link trong Revit", url: "https://forms.gle/HF6ExZzZGkiRXbHS6" },
  { session: 5, title: "Trắc nghiệm copy/Monitor trong collaborate", url: "https://forms.gle/TtxrhSY9K3Wg3UrH7" },
  
  // Buổi 6
  { session: 6, title: "Trắc nghiệm từ vựng chuyên ngành : Chủ đề Schedule", url: "https://forms.gle/xVKCwCmufKopYsD26" },
  { session: 6, title: "Trắc nghiệm về công cụ Schedule", url: "https://forms.gle/EoeoyQhEoUXRNJKY6" },
  { session: 6, title: "Trắc nghiệm về Project parameter", url: "https://forms.gle/iF4TepX6jYEpg1wy5" },
  { session: 6, title: "Trắc nghiệm về Share parameter", url: "https://forms.gle/cT1r6k6gtKXNmdj77" },
  
  // Buổi 7
  { session: 7, title: "Trắc nghiệm từ vựng chuyên ngành : Door - Window - Roof", url: "https://forms.gle/EyuDAVXEfBM5pHPa7" },
  { session: 7, title: "Trắc nghiệm về công cụ Roof", url: "https://forms.gle/NPbUSm2KBMftFdpf7" },
  { session: 7, title: "Trắc nghiệm về cửa đi – cửa sổ", url: "https://forms.gle/haqqMizUaKaHd7UR7" },
  { session: 7, title: "Trắc nghiệm về thang - stair", url: "https://forms.gle/Vz38jVEqjQPg3Dyz8" },
  
  // Buổi 8
  { session: 8, title: "Trắc nghiệm từ vựng chuyên ngành : Revit MEP - Phần Pipe", url: "https://forms.gle/juexEkhGmBi76JhG8" },
  { session: 8, title: "Trắc nghiệm về pipe setting", url: "https://forms.gle/8TGQcLzfsV93Hziv6" },
  { session: 8, title: "Trắc nghiệm về công cụ dựng hình pipe", url: "https://forms.gle/Ss1AtpTvn6AUVhh28" },
  { session: 8, title: "Trắc nghiệm về quản lý hệ thống pipe", url: "https://forms.gle/tC5DdPcp2rvrx2pJ6" },
  
  // Buổi 9
  { session: 9, title: "Từ vựng chuyên ngành Rebar", url: "https://forms.gle/MNZnvFSLLnBYUNoDA" },
  { session: 9, title: "Thiết lập rebar cover và Rebar Type", url: "https://forms.gle/9Xv425EiDfna9haY7" },
  { session: 9, title: "Dựng mô hình Rebar cho Cột - Dầm - Móng", url: "https://forms.gle/gwGKoo6vMgPDuyBH7" },
  { session: 9, title: "Dựng mô hình Rebar cho sàn - hiển thị thép", url: "https://forms.gle/tg4jcyk3pfp4Hk9k7" },
  
  // Buổi 10
  { session: 10, title: "Từ vựng chuyên ngành Room - Ceiling", url: "https://forms.gle/R3TrVkgtXAiQmVyGA" },
  { session: 10, title: "Công cụ Wall", url: "https://forms.gle/n8atMMnViy45tf418" },
  { session: 10, title: "Công cụ Room", url: "https://forms.gle/osUffPEZf56piSXx5" },
  { session: 10, title: "Công cụ Ceiling", url: "https://forms.gle/Xmi7nY86QdvqcQHE7" },
  
  // Buổi 11
  { session: 11, title: "Từ vựng chuyên ngành HVAC và Duct System", url: "https://forms.gle/ukkXqXdup2PgCG9t8" },
  { session: 11, title: "Thiết lập Duct system", url: "https://forms.gle/Pf5Yu68GPCq1UhNe6" },
  { session: 11, title: "Dựng mô hình Duct - HVAC", url: "https://forms.gle/YnovkNKWwzj19A6i9" },
  { session: 11, title: "Dựng mô hình cable Tray conduit", url: "https://forms.gle/Qx4rmawgXDFb12sJA" },
  
  // Buổi 12
  { session: 12, title: "Từ vựng chuyên ngành file central, file link, view template", url: "https://forms.gle/6WSsUJ98DoYEcrts6" },
  { session: 12, title: "Tạo và cài đặt file central", url: "https://forms.gle/metSjk86tewp5q3X9" },
  { session: 12, title: "Thiết lập hiển thị cho file link", url: "https://forms.gle/ueHyL13YgThsd5ez5" },
  { session: 12, title: "Graphic display setting và Halftone", url: "https://forms.gle/ELcJygeWFowPv5KU7" },
  
  // Buổi 13
  { session: 13, title: "View Template & Quản lý hiển thị trong bảng VG", url: "https://forms.gle/PNrbX9bBLeW6ydsCA" },
  { session: 13, title: "Từ vựng chuyên ngành sheet, Legend, drafting view, view on sheet", url: "https://forms.gle/HL4qkpNwGvYUK4t9A" },
  { session: 13, title: "Tạo và quản lý sheet", url: "https://forms.gle/eoP4kiTmjZK2eVsn9" },
  { session: 13, title: "Add và quản lý view trong sheet", url: "https://forms.gle/qwncxKX2Gduxu2Vz5" },
  { session: 13, title: "Drafting view", url: "https://forms.gle/Y9oLm7znMg5QnCXg8" },
  { session: 13, title: "Legend", url: "https://forms.gle/AEkqZPGmw3Md6CNF6" },

  // Buổi 14
  { session: 14, title: "Trắc nghiệm về tạo và hiệu chỉnh dim", url: "https://forms.gle/UEBvQrUj5U36Xdrf6" },
  { session: 14, title: "Trắc nghiệm công cụ tag đối tượng/element", url: "https://forms.gle/5cP8S2bMVbBMAGuj6" },
  { session: 14, title: "Trắc nghiệm thao tác dim tường, dim thang , hiệu chỉnh dim", url: "https://forms.gle/bPNGGoDLAzj6zw9K6" },
  { session: 14, title: "Trắc nghiệm tag hàng loạt cho từng category cụ thể", url: "https://forms.gle/rvJjeJ9cyyZT1dut9" },

  // Buổi 15
  { session: 15, title: "Trắc nghiệm về Line, symbol, line weigth, hatch trong revit", url: "https://forms.gle/N56FrqQ9Fju21ezv6" },
  { session: 15, title: "Trắc nghiệm công cụ quản lý hiển thị để kiểm soát mô hình", url: "https://forms.gle/Xae3YSHL48FRVVdL8" },
  { session: 15, title: "Trắc nghiệm công cụ check, kiểm tra xung đột trong revit", url: "https://forms.gle/2uJ7vCSjqBswee926" },

  // Buổi 16
  { session: 16, title: "Trắc nghiệm family detail item, generic annotation", url: "https://forms.gle/qRiJE5sfPLtiQgjm7" },
  { session: 16, title: "Trắc nghiệm về các parameter quan trọng cho cột- dầm - sàn - cửa - tường", url: "https://forms.gle/VhP1cxaCvK5euMiE7" },
];
