
import { GoogleGenAI, Chat } from "@google/genai";
import { QUIZ_LINKS } from "./src/data/quizzes";

const INTERNAL_KNOWLEDGE_BASE = `
=== NGUỒN DỮ LIỆU NỘI BỘ VCC ===

1. SỔ TAY REVIT-01: DỰNG HÌNH KIẾN TRÚC
- Bài 1 đến Bài 9: Giao diện, Hệ lưới, Cột, Tường, Cửa, Sàn, Dầm, Mái, Thang, Family căn bản.

2. SỔ TAY REVIT-02: QUẢN LÝ & HỒ SƠ
- Bài 1 đến Bài 8: View, Dim & Text, Tag, VG/Filters, Thống kê, Dàn trang, Worksharing, Quản lý dự án.

3. REVIT 2018 THỰC CHIẾN: CƠ BẢN ĐẾN NÂNG CAO
- Bài 1 đến Bài 17: Quy trình thực hiện dự án thực tế, triển khai hồ sơ kỹ thuật chuyên sâu.

4. TỔNG HỢP LỖI THƯỜNG GẶP TRONG REVIT (TROUBLESHOOTING)
- Các lỗi hiển thị, lỗi card đồ họa, mất thanh công cụ, lỗi khi in ấn, lỗi không nhìn thấy đối tượng...

5. TIÊU CHUẨN BIM VIỆT NAM (TCVN 14177:2024)
- TCVN 14177-1:2024: Khái niệm và nguyên tắc quản lý thông tin (tương đương ISO 19650-1).
- TCVN 14177-2:2024: Giai đoạn chuyển giao tài sản (tương đương ISO 19650-2).
- Các thuật ngữ cốt lõi: OIR, AIR, PIR, EIR, AIM, BIM, CDE.
- Quy trình quản lý thông tin 8 bước trong giai đoạn dự án.

6. DỮ LIỆU ASSEMBLY CODE (QUY ĐỊNH PHÂN LOẠI ĐỐI TƯỢNG)
- Quy định mã Assembly Code cho các Category: Structural Foundations, Columns, Framing, Walls, Floors, Roofs, Doors, Windows, Ceilings, Stairs, Generic Models.
- Ví dụ: ST_STRUCTURE_COLUMN (Cột kết cấu), AR_DOOR_GỖ (Cửa đi gỗ), ST_PILE_BOREDPILE (Cọc khoan nhồi)...
- YÊU CẦU: Người dùng PHẢI luôn cập nhật thông số Assembly Code cho các Type element để phục vụ thống kê và quản lý thông tin.

=== BẢNG MÃ ASSEMBLY CODE THAM CHIẾU ===
Assembly Code | Diễn giải | Category
ST_PILE_BOREDPILE | Cọc khoan nhồi | Structural Foundations
ST_PILE_DRIVENPILE | Cọc ép | Structural Foundations
ST_PILE_LARSEN | Cừ larsen | Structural Foundations
ST_PILE_BARRETTE | Cọc Barrette | Structural Foundations
ST_FOUNDATION_TOPBASE | Top Base | Structural Foundations
ST_FOUNDATION_PILECAPE | Đài cọc | Structural Foundations
ST_FOUNDATION_GROUND_PC | Đài cọc gia cường nền | Structural Foundations
ST_FOUNDATION_COLUMN | Cổ móng | Structural Columns
ST_FOUNDATION_BEAM | Dầm móng | Structural Framing
ST_FOUNDATION_WALL | Tường vây | Walls
ST_FOUNDATION_ISOLATE FOOTING | Móng đơn | Structural Foundations
ST_FOUNDATION_CONTINUOUS FOOTING | Móng băng | Structural Foundations
ST_FOUNDATION_LEAN CONCRETE | Bê tông lót | Structural Foundations
ST_FOUNDATION_FLOOR | Sàn nền | Structural Foundations
ST_FOUNDATION_BEARING WALL | Móng chân tường | Structural Foundations
ST_STRUCTURE_COLUMN | Cột kết cấu | Structural Columns
ST_STRUCTURE_BEAM | Dầm kết cấu | Structural Framing
ST_STRUCTURE_WALL | Tường vây | Walls
ST_STRUCTURE_ELEVATOR WALL | Vách thang máy | Walls
ST_STRUCTURE_GIANG_C | Trụ tường xây | Structural Columns
ST_STRUCTURE_GIANG_D | Giằng tường xây | Structural Framing
ST_STRUCTURE_GIANG_LT | Lanh Tô | Structural Framing
ST_STRUCTURE_THANG_SB | Bản thang | Floors
ST_STRUCTURE_THANG_DT | Dầm thang | Structural Framing
ST_STRUCTURE_THANG_CO | Cột thang | Structural Columns
ST_FLOOR_SÀN DỐC | Sàn dốc | Floors
ST_FLOOR_SÀN BTCT | Sàn thường | Floors
ST_FLOOR_SÀN NẤM | Sàn nấm | Floors
ST_FLOOR_SÀN HỘP | Sàn hộp | Floors
ST_FLOOR_SÀN DỰ ỨNG LỰC | Sàn căng trước | Floors
ST_STEEL_COLUMN | Cột thép | Structural Columns
ST_STEEL_BEAM | Dầm thép | Structural Framing
ST_STEEL_PURLIN | Xà gồ | Structural Framing
ST_STEEL_BRACING SYSTEM | Hệ giằng | Structural Framing
ST_STEEL_PURLIN BRACING | Xà gồ hệ giằng | Structural Framing
ST_ROOF_BÊ TÔNG | Mái đổ bê tông | Roofs
ST_ROOF_KHUNG THÉP HỘP | Hệ khung thép lợp mái ngói | Roofs
ST_WALL_VÁCH BÊ TÔNG | Vách bê tông | Walls
ST_WALL_CHÂN CƠ | Tường chân cơ | Walls
ST_WALL_THÀNH BỂ | Thành bể | Walls
ST_WALL_MÓNG GẠCH | Tường xây cho móng | Walls
ST_WALL_GẠCH LỖ | Tường xây gạch lỗ | Walls
ST_WALL_GẠCH ĐẶC | Tường xây gạch đặc | Walls
ST_WALL_GẠCH KHÔNG NUNG | Tường xây gạch không nung | Walls
ST_FORMWORK_VK | Ván khuôn | Generic Models
ST_EARTH_ĐẤT ĐÀO | Đất đào | Generic Models
ST_EARTH_ĐẤT ĐẮP | Đất đắp | Generic Models
ST_FORMWORK_GIÁO CHỐNG | Giáo chống | Generic Models
AR_DOOR_CỬA CUỐN | Cửa cuốn | Doors
AR_DOOR_CỬA THÉP | Cửa thép | Doors
AR_DOOR_CHỐNG CHÁY | Cửa chống cháy EL 60 | Doors
AR_DOOR_NHÔM XINGFA | Cửa đi nhôm kính | Doors
AR_DOOR_GỖ | Cửa đi gỗ | Doors
AR_DOOR_COMPOSITE | Cửa đi gỗ công nghiệp | Doors
AR_DOOR_KÍNH | Cửa đi kính | Doors
AR_DOOR_OPENING | Lỗ mở | Doors
AR_WINDOW_NHÔM XINGFA | Cửa sổ nhôm kính | Windows
AR_WINDOW_GỖ | Cửa sổ gỗ | Windows
AR_WINDOW_NHỰA LÕI THÉP | Cửa sổ nhựa lõi thép | Windows
AR_WINDOW_OTHER | uPVC frame window | Windows
AR_WINDOW_OPENING | Not frame window | Windows
AR_CURTAIN WALL_NHỰA LÕI THÉP | uPVC frame, reflective temper glass | Curtain Panels
AR_CURTAIN WALL_KHUNG ALU | Alumium frame | Curtain Panels
AR_CURTAIN WALL_DOOR | Glass door | Curtain Panels
AR_CURTAIN WALL_WINDOW | Glass window | Curtain Panels
AR_WALL_THẠCH CAO | Tường thạch cao | Walls
AR_WALL_PANEL | Tường panel | Walls
AR_WALL_TRÁT, SƠN NGOÀI NHÀ | Trát, Sơn hoàn thiện ngoài nhà | Walls
AR_WALL_TRÁT, SƠN TRONG NHÀ | Trát, Sơn hoàn thiện trong nhà | Walls
AR_WALL_CERAMIC CHỐNG THẤM | Gạch ốp Ceramic trong nhà, Chống thấm | Walls
AR_WALL_CERAMIC | Gạch ốp Ceramic trong nhà | Walls
AR_WALL_LOẠI KHÁC | Tường dùng liệu hoàn thiện khác | Walls
AR_WALL_GRANITE | Tường ốp đá granite | Walls
AR_WALL_NHỰA GIẢ GỖ | Tường ốp nhựa giả gỗ | Walls
AR_WALL_ĐÁ THẺ | Tường ốp đá thẻ | Walls
AR_WALL_TẤM ALU | Tường ốp tấm alumium | Walls
AR_CEILING_XƯƠNG NỔI | Trần Thạch cao xương nổi | Ceilings
AR_CEILING_XƯƠNG CHÌM | Trần Thạch cao xương chìm | Ceilings
AR_CEILING_CHỐNG ẨM_XN | Trần Thạch cao chống ẩm xương chìm | Ceilings
AR_CEILING_CHỐNG ẨM_XC | Trần Thạch cao chống ẩm xương nổi | Ceilings
AR_CEILING_NHỰA GIẢ GỖ | Trần nhựa giả gỗ | Ceilings
AR_CEILING_GỖ TỰ NHIÊN | Trần gỗ tự nhiên | Ceilings
AR_CEILING_TẤM PANEL | Trần tấm panel PU | Ceilings
AR_FLOOR_CERAMIC CHỐNG TRƠN | Sàn Gạch ceramic chống trơn | Floors
AR_FLOOR_CERAMIC | Sàn Gạch ceramic | Floors
AR_FLOOR_CERAMIC TRANG TRÍ | Sàn Gạch ceramic họa tiết trang trí | Floors
AR_FLOOR_GRANITE | Sàn Đá Granite | Floors
AR_FLOOR_MARBLE | Sàn Đá marble | Floors
AR_FLOOR_GỖ CN | Sàn Gỗ công nghiệp | Floors
AR_FLOOR_GỖ TN | Sàn Gỗ tự nhiên | Floors
AR_FLOOR_NHỰA | Sàn nhựa giả gỗ | Floors
AR_FLOOR_GRANITO | Sàn granito | Floors
AR_FLOOR_TIỂU CẢNH | Sàn tiểu cảnh | Floors
AR_FLOOR_BAN CÔNG | Sàn ban công | Floors
AR_FLOOR_BÊ TÔNG MÀI | Sàn bê tông mài bóng | Floors
NEN_FLOOR_NỀN TRONG NHÀ | Sàn nền trong nhà | Floors
NEN_FLOOR_NỀN NGOÀI NHÀ | Sàn nền ngoài nhà | Floors
SV_FLOOR_NGOÀI NHÀ | Sàn ngoài nhà | Floors
AR_FLOOR_BẬU CỬA | Sàn bậu cửa | Floors
AR_ROOF_NGÓI FUJI | Mái ngói FUJI | Roofs
AR_ROOF_NGÓI ÂM DƯƠNG | Mái ngói âm dương | Roofs
AR_ROOF_TÔN | Mái Tôn | Roofs
AR_ROOF_KÍNH | Mái Kính lấy sáng | Roofs
AR_ROOF_MÁI ALU | Mái aluminum | Roofs
AR_ROOF_GẠCH CHỐNG NÓNG | Mái lát gạch chống nóng | Roofs
AR_STAIR_THANG SẮT | Thang sắt | Stairs
AR_STAIR_THANG GỖ CN | Thang lát gỗ công nghiệp mặt bậc | Stairs
AR_STAIR_THANG GỖ TỰ NHIÊN | Thang lát gỗ tự nhiên mặt bậc | Stairs
AR_STAIR_THANG LÁT ĐÁ GRANIT | Thang lát đá granite | Stairs
AR_STAIR_THANG LÁT GẠCH CERAMIC | Thang lát gạch ceramic | Stairs
AR_STAIR_BẬC TAM CẤP | Bậc tam cấp | Stairs
AR_STAIR_RAMP | Ram dốc | Ramps
ST_GENERIC MODEL_PHEU TB | Phễu top base | Generic Models
AR_GENERIC MODEL_TRÁT CỬA ĐI | Trát cạnh cửa đi | Generic Models
AR_GENERIC MODEL_TRÁT CỬA SỔ | Trát cạnh cửa sổ | Generic Models
AR_GENERIC MODEL_PHÀO | Phào kiến trúc | Generic Models
AR_GENERIC MODEL_PHỤ KIỆN | Phụ kiện kiến trúc | Generic Models

7. THÔNG TIN CÀI ĐẶT PHẦN MỀM & TÀI NGUYÊN (REVIT 2025)
- Revit 2025.4 (Update 2025.4): https://drive.google.com/drive/folders/1ZFHtgx70B6aNZokH9_mXzBhh9BO4kpbQ?usp=drive_link
  + Hướng dẫn cài đặt: https://youtu.be/S85efvnHXI4
  + Tài liệu chi tiết: https://docs.google.com/document/d/1AcfFTdVP2CSmEegE6IBk9pJS0U52H-yE/edit?usp=drive_link
  + Ghi chú: Yêu cầu ổ C trống 30GB. Có thể mua tài khoản tại: https://gamikey.com/autodesk-revit/
- Naviswork 2025: https://drive.google.com/drive/u/1/folders/1OZpw_XH9eI841RKdowvVTjKxZUVfa0o-
- Dynamo: https://drive.google.com/drive/folders/1NIJmp1DvFb8rnoIo2d47mDVB6GUVclWo?usp=drive_link (HD: https://youtu.be/-PrHGi8B0Fc)
- Pyrevit: https://drive.google.com/drive/folders/1yLTPoln6Teqvi5LKZu6DjOYbCxPv_rl6?usp=drive_link
- Modplus: https://modplus.org/en/installer
- Bộ Add-ins (Naviate, AlphaBIM, RushForth): https://drive.google.com/drive/folders/1yLTPoln6Teqvi5LKZu6DjOYbCxPv_rl6?usp=drive_link (HD: https://youtu.be/gwIs2q98Hn8)
- Template Project: https://drive.google.com/drive/folders/1mhyE9zSQzs6klGg39eEH5NZ-TaX8R08K?usp=drive_link
- Thư viện (Library): https://drive.google.com/drive/folders/1rSPWLOyQ3_dNkkqHXf1_6hYH3Dxq1Irn?usp=drive_link
- Project mẫu: https://drive.google.com/drive/u/1/folders/1C2MnsVmnVtmKqY_IPYH9HDtCxIrLVVh4

9. HỆ THỐNG BÀI TẬP TRẮC NGHIỆM (GOOGLE FORMS)
${QUIZ_LINKS.map(q => `- Buổi ${q.session}: ${q.title} | Link: ${q.url}`).join('\n')}

10. HƯỚNG DẪN TEMPLATE & TỰ ĐỘNG HÓA (DYNAMO, RF TOOL, MODPLUS)
- Cây thư mục (Project Browser): Tổ chức theo quy tắc đặt tên (VD: 01.Mặt bằng kiến trúc). Phân loại view qua thông số "LOẠI VIEW", phân loại sheet qua thông số "HẠNG MỤC".
- Quy tắc đặt tên Family: Phải có tiền tố "VCC". Tên phải chứa thông tin vật liệu, chiều dày, tiết diện để dễ phân loại.
- Tự động hóa với RushForth Tool (RF Tool):
  + Tạo View/Sheet hàng loạt: Sử dụng "Project Setup" để import danh sách từ file Excel.
  + Quản lý Viewport: Xuất thông số Viewport X, Y ra Excel để hiệu chỉnh vị trí đồng loạt cho nhiều sheet.
- Tự động hóa với Modplus:
  + Sheet Numerator: Đánh số hiệu bản vẽ hàng loạt.
  + Search and Replace: Tìm kiếm và thay thế tên/số hiệu sheet nhanh chóng.
  + Copy Type: Sao chép các Type đối tượng giữa các dự án.
- Công cụ GHN Archi & GHN Tool:
  + AddViewToSheet: Đưa nhanh nhiều view vào sheet.
  + Floor Details: Tự động hóa tạo mặt cắt sàn trong Legend (kết hợp Generic Annotation và Legend Component).
  + Door/Window Legends: Hỗ trợ bổ chi tiết cửa đi, cửa sổ trong môi trường Legend.
- pyRevit: Sử dụng "Copy Viewports" để sao chép vị trí các Legend/Viewport giữa các bản vẽ.
- Mẹo nhỏ: Sử dụng lệnh tắt "DS" (Duplicate Sheets) để nhân bản bản vẽ nhanh khi đang mở view.

8. THƯ VIỆN VIDEO HƯỚNG DẪN CHI TIẾT
- Tự học Revit Kiến trúc (BIM.A Studio):
  + Bài 01 - BIM & REVIT: https://www.youtube.com/watch?v=v_pg5Gxc-_M
  + Bài 02 - Hệ định vị: https://www.youtube.com/watch?v=gJDYBqZB6uQ
  + Bài 03 - Tường & Cột: https://www.youtube.com/watch?v=TOb0M0mv7Po
  + Bài 04 - Cửa, Join, Room: https://www.youtube.com/watch?v=5uU2FYvztm8
  + Bài 05 - Sàn & Dầm: https://www.youtube.com/watch?v=Y63qT3kcZCw
  + Bài 06 - Trần & Nội thất: https://www.youtube.com/watch?v=Fxg01vXpcDw
  + Bài 07 - Mái & Chi tiết mái: https://www.youtube.com/watch?v=4o0do11xXY4
  + Bài 08 - Vách kính & Lam: https://www.youtube.com/watch?v=G7lPh_Yuw3E
  + Bài 09 - Thang, Ram & Lan can: https://www.youtube.com/watch?v=cjloYhWfZSM
  + Bài 10 - Trang trí ngoại thất: https://www.youtube.com/watch?v=A8E-l5HHUjk
  + Bài 11 - Bố trí thiết bị: https://www.youtube.com/watch?v=fAdCBlur8Dw
  + Bài 12 - Family cơ bản: https://www.youtube.com/watch?v=fjhqE1oWYAI
  + Bài 13 - Family cửa đi: https://www.youtube.com/watch?v=V-pKYom27M4
  + Bài 14 - Massing cơ bản: https://www.youtube.com/watch?v=1ZypZKuhTgY
  + Bài 15 - Massing nâng cao: https://www.youtube.com/watch?v=wO5x_S23iiI
  + Bài 16 - Thống kê khối lượng: https://www.youtube.com/watch?v=nPXy5UKBOi4
  + Bài 17 - Render & Video: https://www.youtube.com/watch?v=nteroURM12g
  + Bài 18 - Tạo mặt bằng: https://www.youtube.com/watch?v=GqovMUPtrWI
  + Bài 19 - Phối cảnh, Mặt đứng, Mặt cắt: https://www.youtube.com/watch?v=wD_6jn9oBQo
  + Bài 20 - Dàn trang & Xuất file: https://www.youtube.com/watch?v=ux91CM9urkw

- Chuyên sâu về Family Revit (eRSVN):
  + Bài 01 - Family là gì: https://www.youtube.com/watch?v=6hTOOBfjvtg
  + Bài 02 - Các bước tạo Family: https://www.youtube.com/watch?v=hA-mObLEOaU
  + Bài 03 - Family Parameter: https://www.youtube.com/watch?v=4XS_RN8etpg
  + Bài 04 - Reference Plane: https://www.youtube.com/watch?v=y9NPUf-S1Mc
  + Bài 05 - Giằng buộc kích thước: https://www.youtube.com/watch?v=5S66yrzy9wI
  + Bài 06 - Tạo tham số: https://www.youtube.com/watch?v=Voii9FaA4l0
  + Bài 07 - Khối Extrusion: https://www.youtube.com/watch?v=OER0SjeYpeA
  + Bài 08 - Khối Sweep: https://www.youtube.com/watch?v=B9rXWtcmXo8
  + Bài 09 - Khối Blend: https://www.youtube.com/watch?v=SaW52QKTrUQ
  + Bài 10 - Chọn Template: https://www.youtube.com/watch?v=jRto2eT4UDU
  + Bài 12 - Annotation Family: https://www.youtube.com/watch?v=EDhRcmCgyvY
  + Bài 13 - Tag Family: https://www.youtube.com/watch?v=iuztnwTzDqE
  + Bài 14 - Shared Parameter: https://www.youtube.com/watch?v=X85e2F01rXw
  + Bài 15 - Khối Void: https://www.youtube.com/watch?v=d8bFMtuii1A
  + Bài 16 - Workplane: https://www.youtube.com/watch?v=xzfOXXlJxeY
  + Bài 18 - Family Type: https://www.youtube.com/watch?v=oY1BXVPrlXQ
  + Bài 19 - Type Catalog: https://www.youtube.com/watch?v=BHO-KwWiakw
  + Bài 21 - Tham số Visible: https://www.youtube.com/watch?v=OgWopsRLiW4
  + Bài 22 - Nested Family: https://www.youtube.com/watch?v=Scpx-_mTac0
  + Bài 23 - Lệnh Array: https://www.youtube.com/watch?v=I4YZslKZBks
  + Bài 26 - Reference Line & Góc xoay: https://www.youtube.com/watch?v=yOzQQgxeTK4
  + Bài 30 - Công thức trong Family: https://www.youtube.com/watch?v=iVnVaNfnHuY
  + Bài 32 - Tạo khuôn cửa: https://www.youtube.com/watch?v=P6bgrC2KpoI
  + Bài 34 - Tạo cánh cửa: https://www.youtube.com/watch?v=REe5s82c3i0

- Cầu thang & Lan can (eRSVN):
  + Bài 02 - Thang thẳng đơn giản: https://www.youtube.com/watch?v=CugPZ6DEycQ
  + Bài 04 - Chỉnh tay thang dựng sẵn: https://www.youtube.com/watch?v=XQq-Z9BNdAU
  + Bài 06 - Connect Multi Stories: https://www.youtube.com/watch?v=fJKHrBEHvlM
  + Bài 07 - Sketch vẽ thang: https://www.youtube.com/watch?v=hXjauoSoZns
  + Bài 08 - Vẽ lan can đơn giản: https://www.youtube.com/watch?v=-H0m54x-2no
  + Bài 11 - Tay cầm lan can tường: https://www.youtube.com/watch?v=fnVLJ4i3Ls0
  + Bài 13 - Lan can chạy theo host: https://www.youtube.com/watch?v=H96wFceMZbc
  + Bài 21 - Thang bê tông toàn khối: https://www.youtube.com/watch?v=Hb3zNhbSdM8

- Revit Architecture 2019 (eRSVN):
  + Bài 12 - Phím tắt: https://www.youtube.com/watch?v=5a6aZ3YkNlg
  + Bài 20 - Tạo tầng (Level): https://www.youtube.com/watch?v=uDmSO3MFZtY
  + Bài 21 - Tạo lưới (Grid): https://www.youtube.com/watch?v=VrtH6hrduVk
  + Bài 23 - Bố trí cột: https://www.youtube.com/watch?v=ScT9XYdKGms
  + Bài 24 - Vẽ tường (Wall): https://www.youtube.com/watch?v=WVszt62aYb0
  + Bài 29 - Bố trí cửa: https://www.youtube.com/watch?v=z97MLPQBOlc
  + Bài 33 - Link Autocad: https://www.youtube.com/watch?v=zLEJlpfDTzk
  + Bài 34 - Tạo địa hình: https://www.youtube.com/watch?v=CmG1LZ_lnMk
  + Bài 44 - Vẽ sàn: https://www.youtube.com/watch?v=Z7dFSyQn8uA
  + Bài 45 - Tạo mái: https://www.youtube.com/watch?v=-RJ_0fj9Qws
  + Bài 50 - Tạo trần: https://www.youtube.com/watch?v=fIktCa_8ciQ
  + Bài 52 - Bố trí cầu thang: https://www.youtube.com/watch?v=kA_IAmUG2tw
  + Bài 57 - Tường hệ vách (Curtain Wall): https://www.youtube.com/watch?v=ea-mvJDzomQ
  + Bài 62 - Visibility Graphic: https://www.youtube.com/watch?v=EqUd9PbW4oo
  + Bài 63 - View Template: https://www.youtube.com/watch?v=8SoV5qS6k7I
  + Bài 66 - View Range: https://www.youtube.com/watch?v=R3khXE70bnU
  + Bài 71 - Tạo phòng (Room): https://www.youtube.com/watch?v=S_4Z-ZodyC8
  + Bài 75 - Bảng thống kê: https://www.youtube.com/watch?v=-9wbYZwvzeQ
  + Bài 79 - Tạo kích thước (Dim): https://www.youtube.com/watch?v=qb_mVjKAZCo
  + Bài 86 - Tạo bản vẽ (Sheet): https://www.youtube.com/watch?v=CH-uKJjMADw

- Series Revit Việt Nam (Cơ bản đến Nâng cao):
  + 1.1 Giao diện làm việc: https://www.youtube.com/watch?v=Ys5_MQPI8Bs
  + 1.3 Tạo lưới trục: https://www.youtube.com/watch?v=ue5buBO-lk8
  + 1.6 Bố trí móng: https://www.youtube.com/watch?v=VNVArr9DEWs
  + 2.1 Thiết lập sàn: https://www.youtube.com/watch?v=SwjYssC3adI
  + 2.5 Thiết lập mái: https://www.youtube.com/watch?v=p_fEi_TCfHM
  + 3.1 Thiết lập tường: https://www.youtube.com/watch?v=kIl3o4horek
  + 4.1 Thiết kế cửa đi: https://www.youtube.com/watch?v=4tETvFHL8-E
  + 5.1 Giới thiệu các loại thang: https://www.youtube.com/watch?v=A8Nwv2MMEsI
  + 8.1 Model in place: https://www.youtube.com/watch?v=1lE5A1ZrYa8
  + 12.2 Thống kê cửa: https://www.youtube.com/watch?v=E_hS4YIIFxo
  + 12.3 Thống kê gạch: https://www.youtube.com/watch?v=bxzN3rJGPKA
  + 13.1 Thiết kế địa hình: https://www.youtube.com/watch?v=GaaA_u8CJK4

- Revit MEP 2019 (eRSVN):
  + Bài 01 - Giới thiệu MEP: https://www.youtube.com/watch?v=1N9T-pssPZ0
  + Bài 05 - Liên kết mô hình: https://www.youtube.com/watch?v=388J-vPLMNA
  + Bài 09 - Bố trí ổ cắm điện: https://www.youtube.com/watch?v=PQbguike6YQ
  + Bài 13 - Thiết bị chiếu sáng: https://www.youtube.com/watch?v=yVccCzCDAM0
  + Bài 20 - Máng cáp & Ống gen: https://www.youtube.com/watch?v=jysxBvkuG5c
  + Bài 25 - Đường ống cấp khí: https://www.youtube.com/watch?v=pJO3-IACdrQ
  + Bài 33 - Đường ống nước cấp: https://www.youtube.com/watch?v=1YKiOsrjrTE
  + Bài 34 - Đường ống thoát nước: https://www.youtube.com/watch?v=5or1jexWJnA
  + Bài 41 - Phòng cháy chữa cháy: https://www.youtube.com/watch?v=ZwOa0qiqD-U
  + Bài 45 - Fabrication Part: https://www.youtube.com/watch?v=TEVrOJmMTaU

- Làm việc nhóm - Worksharing (eRSVN):
  + Bài 04 - Thiết lập Worksharing: https://www.youtube.com/watch?v=RM6ombzTX4I
  + Bài 05 - Hiểu về Worksets: https://www.youtube.com/watch?v=ml0bi89333I
  + Bài 06 - Tạo Central File: https://www.youtube.com/watch?v=Tc8ygsJXz5k
  + Bài 14 - Synchronize & Reload: https://www.youtube.com/watch?v=sDGefJ47njc
  + Bài 17 - Tính năng Detach: https://www.youtube.com/watch?v=Y85-AryfYnY
- Hướng dẫn Add-ins ALPHA BIM (ALPHA BIM Revit Plugins):
  + ALPHA BIM | Auto Join: https://www.youtube.com/watch?v=tGbyWsfbt4E
  + ALPHA BIM plugin | Beam Rebar: https://www.youtube.com/watch?v=sIZqEiqA15k
  + Bí quyết bóc khối lượng từ mô hình BIM Kết cấu: https://www.youtube.com/watch?v=qk9N1Jp_-40
  + ALPHA BIM for QS | Buổi 1: Tính Diện Tích Ván Khuôn: https://www.youtube.com/watch?v=FOiuIE1GPRc
  + Formwork Area - Part 1: Calculate for Structural Foundation: https://www.youtube.com/watch?v=MRgwXV6qo3c
  + ALPHA BIM for QS | Buổi 2: Tự động dựng model Revit kết cấu: https://www.youtube.com/watch?v=uTlxVkH7YtM
  + Tính khối lượng đào - đắp đất trong Revit: https://www.youtube.com/watch?v=dTvJl7yk69c
  + Alpha BIM | Auto Join - Hướng dẫn chi tiết: https://www.youtube.com/watch?v=3KKzPTwVDQs
  + ALPHA BIM | Dựng địa hình & tính khối lượng đào - đắp đất: https://www.youtube.com/watch?v=CQy7oXI_4qU
  + ALPHA BIM | Tính Diện Tích Ván Khuôn - Hướng dẫn chi tiết: https://www.youtube.com/watch?v=rF2hsRKqKxI
  + ALPHA BIM | Rebar for Column & Wall - V2: https://www.youtube.com/watch?v=7398_66WgZc
  + CUT - FILL VOLUME by Toposurface - part 1: https://www.youtube.com/watch?v=SxaJpAl8Mgk
  + ALPHA BIM | Create Shape Image & Weight of Rebar: https://www.youtube.com/watch?v=xamd2COT1KM
  + Dựng địa hình & Tính khối lượng Đào - Đắp đất: https://www.youtube.com/watch?v=31EN2Ng2kF0
  + ALPHA BIM | Split Rebar: https://www.youtube.com/watch?v=fWGNGRbqtY4
  + Calculate the Formwork Area in Revit for Parts: https://www.youtube.com/watch?v=P0ZsHbT4bVg
  + DỰNG & TRIỂN KHAI BẢN VẼ REBAR CHO CỘT-VÁCH: https://www.youtube.com/watch?v=EuLyuLtsfw4
  + Thống kê hình dạng cốt thép - v1: https://www.youtube.com/watch?v=H1IPagN1SuQ
  + Alpha BIM | AUTO REBAR NUMBER: https://www.youtube.com/watch?v=TWRrGwQVzk8
  + Dựng địa hình từ đường đồng mức: https://www.youtube.com/watch?v=QrnrAhBvjs0
  + Alpha BIM 2021.3 | Introducing new features: https://www.youtube.com/watch?v=b_C9EOaWIlQ
  + Tự động dựng Dầm từ bản vẽ AutoCAD: https://www.youtube.com/watch?v=MPgzN9JDJ5Q
  + ALPHA BIM | Rebar for Beam - Column - Wall: https://www.youtube.com/watch?v=FocZ0m86bkg
  + Formwork Area - Part 2: Calculate for Structural Column: https://www.youtube.com/watch?v=Acx0Hi9237Y
  + ALPHA BIM | Draw Formwork Shape & Slab Foundation Rebar: https://www.youtube.com/watch?v=3qg1e1NbYXQ
  + Create Rebar Shape Image V2: https://www.youtube.com/watch?v=3Z2HT6ienCs
  + Alpha BIM | Offset/Edit Wall: https://www.youtube.com/watch?v=pwjkQ7I5TMM
  + Alpha BIM | Allow/Disallow Join at end of Beam/Wall: https://www.youtube.com/watch?v=_9vIDk2WtKA
  + ALPHA BIM | BIM LINK - Synchronize data between Revit and Excel: https://www.youtube.com/watch?v=Zdwi9tBuEZc
  + ALPHA BIM | BÓC KHỐI LƯỢNG BÊ TÔNG, VÁN KHUÔN VÀO BẢNG BOQ: https://www.youtube.com/watch?v=GiCOQsvgMGs
  + CUT - FILL VOLUME by Toposurface - part 2: https://www.youtube.com/watch?v=m9Y4Tc0o_yM
  + ALPHA BIM | Draw Formwork Shape: https://www.youtube.com/watch?v=v3y1Lnsvckc
  + ALPHA BIM | PLACE VIEW: https://www.youtube.com/watch?v=tTzKZ8VmKLE
  + Alpha BIM | ALIGN TAG/TEXT: https://www.youtube.com/watch?v=0g-geXUAo9E
  + Alpha BIM | CROP VIEW: https://www.youtube.com/watch?v=AQXUxLLBFXo
  + Formwork Area - Part 4: Calculate for Structural Beam: https://www.youtube.com/watch?v=yDfVPWrQ43k
  + ALPHA BIM | Giới thiệu các tool hỗ trợ một số công tác hạ tầng: https://www.youtube.com/watch?v=6oe6MT3qcyg
  + ALPHA BIM | Rebar Shape 2D: https://www.youtube.com/watch?v=AMqCxJf1kKQ
  + ALPHA BIM | DUPLICATE SHEET: https://www.youtube.com/watch?v=6kb6NtnZS3I
  + Coordinate for Toposurface: https://www.youtube.com/watch?v=zSlBsy_rSfA
  + ALPHA BIM | BIM LINK - Hướng dẫn chi tiết: https://www.youtube.com/watch?v=hqhwEIVDWkY
  + Alpha BIM | AUTO NUMBERING: https://www.youtube.com/watch?v=wCxIXEDU_Q8
  + ALPHA BIM | Concrete Column/Wall: https://www.youtube.com/watch?v=7gtsYJNm4Tc
  + ALPHA BIM | RENAME SHEET: https://www.youtube.com/watch?v=R_CXnf-z4xU
  + ALPHA BIM | SECTION BOX: https://www.youtube.com/watch?v=3zFfKC01ggM
  + Alpha BIM | FIND & REPLACE: https://www.youtube.com/watch?v=GS5ZqU5J11o
  + Alpha BIM | Quick Select: https://www.youtube.com/watch?v=O8FKjaD5V80
  + Formwork Area - Part 3: Calculate for Structural Wall: https://www.youtube.com/watch?v=SYYgeCX1dUc
  + ALPHA BIM | RENAME VIEW: https://www.youtube.com/watch?v=dxuyj8dbGXY
  + Hướng dẫn dựng cọc từ AutoCAD: https://www.youtube.com/watch?v=R2NGANoZxy0
  + Alpha BIM | Export Schedules to Excel: https://www.youtube.com/watch?v=YtebpUVufmo
  + ALPHA BIM | Create 3D Views by Level: https://www.youtube.com/watch?v=5dbNrwAe8b4
  + Alpha BIM | Align Tag/TextNote: https://www.youtube.com/watch?v=rVMKnFTJd0I
  + Alpha BIM | Auto Modeling Framing from AutoCAD: https://www.youtube.com/watch?v=oBcDgXNgTKc
  + Tự động dựng Cột từ bản vẽ AutoCAD: https://www.youtube.com/watch?v=6RvGk6SSO5Y
  + Bóc khối lượng Bê tông, Ván khuôn, Cốt thép: https://www.youtube.com/watch?v=DqDX2oSWNeg
  + ALPHA BIM | Auto Modeling Pile Foundations from AutoCAD: https://www.youtube.com/watch?v=JbTPMK8SufQ
  + Alpha BIM | Auto Join with option Cut Other Elements: https://www.youtube.com/watch?v=P6RipfPpwYk
  + ALPHA BIM | DUPLICATE VIEW: https://www.youtube.com/watch?v=UQrUMV5juS4
  + ALPHA BIM | PURGE MODEL: https://www.youtube.com/watch?v=sudh03FQ8ts
  + Alpha BIM | SELECT ELEMENTS SAME CATEGORY/LEVEL/PLACE: https://www.youtube.com/watch?v=YpDiR7V2ndU
  + ALPHA BIM | Pick Faces to Get Total Area: https://www.youtube.com/watch?v=wwxlSTxrbf0
  + Formwork Area - Part 5: Calculate for Structural Floor: https://www.youtube.com/watch?v=hQeu6Xl5N8Y
  + Alpha BIM | Create Lining Concrete: https://www.youtube.com/watch?v=TXsrWCEdlWg
  + ALPHA BIM | Extend Rebar: https://www.youtube.com/watch?v=-6s-E-pniOw
  + Import DWG or DXF to Drafting/Legend View: https://www.youtube.com/watch?v=JpeLdYwdcv8
  + Alpha BIM | Total Parameter Value: https://www.youtube.com/watch?v=fOiRXkEvRtg
  + Alpha BIM | Auto set mark for Beam, Auto Update Beam Section: https://www.youtube.com/watch?v=NhsPxggrQBk
  + Alpha BIM | Update Sheet Number & Sheet Name from Excel: https://www.youtube.com/watch?v=B-jkBBda_zM
  + Alpha BIM | Auto Modeling Slab Foundations from AutoCAD: https://www.youtube.com/watch?v=HAgGKQgeXrc
  + Alpha BIM | SELECT ELEMENTS IN FILTERS: https://www.youtube.com/watch?v=FhOeM1HlrgU
  + Alpha BIM | CẮT CÁC PHẦN KHỐI LƯỢNG DẦM BỊ DƯ: https://www.youtube.com/watch?v=0wpbCCGvp6A
  + Alpha BIM | Auto DIM Grids; Auto DIM Column, Wall plan: https://www.youtube.com/watch?v=eh4xRcSw1TM
  + Alpha BIM | Auto Modeling Slab Foundation from AutoCAD: https://www.youtube.com/watch?v=Eh3rsImkl48
  + Alpha BIM | Tự Động Dựng Lưới Trục từ AutoCAD: https://www.youtube.com/watch?v=ES3iU9_iRCw
  + ALPHA BIM | Model Column & Pile from boundary Layer in AutoCAD: https://www.youtube.com/watch?v=vM4JYgVfgbY
  + Alpha BIM | Copy Text from AutoCAD to Framings/Columns/Walls: https://www.youtube.com/watch?v=zE3CGyqaHlQ
  + ALPHA BIM | CONCRETE COLUMN/WALL - TÍNH KHỐI LƯỢNG BÊ TÔNG TẠI ĐỈNH CỘT - VÁCH: https://www.youtube.com/watch?v=pO2JumCqvZM
  + ALPHA BIM | Transfer Parameters Value: https://www.youtube.com/watch?v=mMfAbcTTK4k
  + Tự động dựng Sàn từ bản vẽ AutoCAD: https://www.youtube.com/watch?v=0CnDlJ6LdfA
  + Tự động dựng Vách từ bản vẽ AutoCAD: https://www.youtube.com/watch?v=ssTF70gGgNY
  + Alpha BIM | Điều chỉnh Rebar Shape Image: https://www.youtube.com/watch?v=7Ije9ANDPec
  + Alpha BIM | Manage Revision Cloud & Review Elements: https://www.youtube.com/watch?v=f_velHAOGhg
  + Alpha BIM | Auto create dimension for Column setting out plan: https://www.youtube.com/watch?v=YeaguHlKzFo
  + Alpha BIM | Export Family: https://www.youtube.com/watch?v=ZlIuK-fqDv8
  + Alpha BIM | Auto Update Beam Section from Excel: https://www.youtube.com/watch?v=VgZyX8EMbhg
  + Create Rebar Shape Image v1 & Weight of Rebar: https://www.youtube.com/watch?v=w_liJ7AHsZw
  + Alpha BIM | Get Element Have Same Parameter Value: https://www.youtube.com/watch?v=4UYMSnaAXm4
  + Alpha BIM | Quickly Change Y Justifycation Framing: https://www.youtube.com/watch?v=aDk1z0YGOek
  + Alpha BIM | Tính diện tích chống thấm mặt trong bể nước: https://www.youtube.com/watch?v=kjYN3ReoJSM
  + Alpha BIM | Cut framing by face: https://www.youtube.com/watch?v=jFYPn3PJmHU
  + Alpha BIM | Select Columns/Walls Same Location: https://www.youtube.com/watch?v=R6-81-Gnofs
  + Alpha BIM | Tính chiều dài thực tế của Dầm & Vách: https://www.youtube.com/watch?v=CdesvS8mk4M
  + Alpha BIM | Dựng Grid Cong từ AutoCAD: https://www.youtube.com/watch?v=y_Rlas6UXrg
  + Tính thể tích bê tông mở rộng tại đỉnh Cột - Vách: https://www.youtube.com/watch?v=VXkMEoO0tAE
  + Alpha BIM - [Mini tools] | Kéo lưới trục qua tất cả các tầng: https://www.youtube.com/watch?v=CChXaMIYL4c
  + Select Beam/Wall according to X direction, Y direction: https://www.youtube.com/watch?v=NRpwE4cLgDw

- Hướng dẫn Add-ins Naviate (Naviate solution by Symetri):
  + Filter Revit elements easily by category and parameter: https://www.youtube.com/watch?v=K0mxIJwx7NM
  + How to color elements in Revit: https://www.youtube.com/watch?v=r-Q7c4l3PBk
  + How to renumber elements in Revit: https://www.youtube.com/watch?v=jmDBhcvTSdA
  + Automate section box controls in Revit: https://www.youtube.com/watch?v=Mv1BagXcs8M
  + Naviate for Revit - Top 10 features for architects: https://www.youtube.com/watch?v=vBUVaGyVe7Q
  + Renaming views using Combine Parameters: https://www.youtube.com/watch?v=96XfINy_Ut8
  + Easily manage your Revit content with the Naviate Family Browser: https://www.youtube.com/watch?v=YjVUmiCA16Y
  + Unhide elements in a view: https://www.youtube.com/watch?v=h77IIBWklE4
  + Create Quick Dependant Views from Filled Region: https://www.youtube.com/watch?v=coSoHR3FccQ
  + Naviate Accelerate feature demo: Project Cleanup: https://www.youtube.com/watch?v=3UafwG9xkGA
  + Naviate Accelerate feature demo: Live Selection: https://www.youtube.com/watch?v=Jq1Ok0Agtbo
  + Using Naviate Accelerate to renumber grids: https://www.youtube.com/watch?v=fdoAYuClkeM
  + Using Live Selection to add Coordinates to Piles: https://www.youtube.com/watch?v=nPasLdnwhTA
  + Using Naviate Color Elements to show levels heights of pile caps: https://www.youtube.com/watch?v=sY0ZhBFww9k
  + Using Naviate Color Elements to identify a structural material: https://www.youtube.com/watch?v=QnFTdlK1qWs
  + Make your Naviate for Revit work smarter with pre-configuration: https://www.youtube.com/watch?v=qT7ABfk855k
  + Naviate Accelerate 2021 - Update Sheet Scale: https://www.youtube.com/watch?v=6ckHXij9-Rg
  + Naviate Accelerate 2021 - Update Sheet Revisions: https://www.youtube.com/watch?v=QgzYvxZgFaw
  + Naviate Accelerate 2021 - Export Schedules: https://www.youtube.com/watch?v=nJ1wCownhnE
  + Naviate Accelerate 2021 - Export and Import: https://www.youtube.com/watch?v=mOLh3xeGrSA
  + Naviate Accelerate 2021 - Color Elements: https://www.youtube.com/watch?v=freOWiuTBXw
  + Naviate Accelerate 2021 - Cloud Family Browser: https://www.youtube.com/watch?v=e1q9XwKg-nw
  + Naviate Accelerate 2021 - Place Family - Align to Path: https://www.youtube.com/watch?v=lWkef197YO4
  + Naviate Accelerate 2021 - Align Tags: https://www.youtube.com/watch?v=7cBtQJxhf_w
  + Naviate Accelerate 2021 - IFC - Align IFC: https://www.youtube.com/watch?v=kQA-QoD2CWI
  + Naviate Accelerate 2021 - 3D Zone - Write All Setup: https://www.youtube.com/watch?v=vioh48XN6WQ
  + Naviate Accelerate 2021 - Manage Project - Warning Handler: https://www.youtube.com/watch?v=8hBGSzyqh5U
  + Naviate Accelerate 2021 - Manage Parameters - Write Parameters: https://www.youtube.com/watch?v=l5D4d71zSeQ
  + Naviate Accelerate 2021 - Manage Parameters - Combine Parameter Values: https://www.youtube.com/watch?v=krwJl-7cR10
  + Naviate Accelerate 2021 - Live Selection: https://www.youtube.com/watch?v=zXpdS5UmwKY
  + Naviate Accelerate 2021 - IFC - Property Sets: https://www.youtube.com/watch?v=XbfSm5FTqrg
  + Naviate Accelerate 2021 - IFC - Class by Family: https://www.youtube.com/watch?v=rSJ6Bivhc2I
  + Naviate Accelerate 2021 - IFC - Global IFC Class: https://www.youtube.com/watch?v=fv3ejayXDBU
  + Naviate Accelerate 2021 - Sheet manager - Create Dependent View: https://www.youtube.com/watch?v=qqNZi95yf34
  + Naviate Accelerate 2021 - Sheet manager - Duplicate Dependent Views: https://www.youtube.com/watch?v=aFnx12OrRC8
  + Naviate Accelerate 2021 - Sheet Manager - Edit Sheet Parameters: https://www.youtube.com/watch?v=ZOODB64roXk
  + Naviate Accelerate 2021 - Sheet Manager - Edit Sheet Revisions: https://www.youtube.com/watch?v=SD-5fW8GOwA
  + Naviate Accelerate 2021 - Sheet Manager - Quick Dependent Views: https://www.youtube.com/watch?v=Kv7e2OJNnKY
  + Naviate Accelerate 2021 - Transfer Settings: https://www.youtube.com/watch?v=9U3zeHcKZ2A
  + Naviate Accelerate - What's new, demo and Q&A: https://www.youtube.com/watch?v=4Y3kzfWpxoM
  + 5 Top most used Naviate Accelerate Features: https://www.youtube.com/watch?v=cxub9VbXU-U
  + What is new in Naviate Accelerate and Architecture June 2024: https://www.youtube.com/watch?v=KkbtGqxZ9Sk
  + Cloud Content in Naviate Accelerate: https://www.youtube.com/watch?v=MZD0IFqZvrg
  + Publish in Naviate Accelerate: https://www.youtube.com/watch?v=TNwqap1LKbQ
  + Color Elements in Naviate Accelerate: https://www.youtube.com/watch?v=h8W_mFUy-jM
  + Release for Revit 2025 in Naviate Accelerate: https://www.youtube.com/watch?v=dbtm6F1Ma2c
  + Combine Parameters in Naviate Accelerate: https://www.youtube.com/watch?v=rHb7Ws2Hwnc
  + Rectangular Array in Naviate Accelerate: https://www.youtube.com/watch?v=3MHcG7hYVNY
  + Family Browser in Naviate Accelerate: https://www.youtube.com/watch?v=SgpJ8YjcJpk
  + Create Views in Naviate Accelerate: https://www.youtube.com/watch?v=ixyLzFJRVek
  + Export and Import in Naviate Accelerate: https://www.youtube.com/watch?v=5eRjSkDfoCo
  + Renumber Elements in Naviate Accelerate: https://www.youtube.com/watch?v=mELYw4zeikw
  + Naviate Accelerate February release news 2025.1.2: https://www.youtube.com/watch?v=PGJDb_0ecsc
  + Select viewports to renumber - Naviate Accelerate: https://www.youtube.com/watch?v=OHEfIwJl0I8
  + Renumber a pre-selected Spline - Naviate Accelerate: https://www.youtube.com/watch?v=QyCMFrWwEts
  + Renumber with no pre-selection - Naviate Accelerate: https://www.youtube.com/watch?v=YIQtle6y04U
  + Renumber Filter Elements - Naviate Accelerate: https://www.youtube.com/watch?v=X7UhL8PKzJA
  + Place View Annotations - Naviate Accelerate: https://www.youtube.com/watch?v=GZe8UIBlRqo
  + Create View Annotations - Naviate Accelerate: https://www.youtube.com/watch?v=NGiLy-lReno
  + Quick Dependant Views in Naviate Accelerate: https://www.youtube.com/watch?v=6f-FPXaz3o4
  + Quick Renumber in Naviate Accelerate: https://www.youtube.com/watch?v=s3pBS9U3Ij8
  + Naviate Accelerate May release News 2025.2: https://www.youtube.com/watch?v=YD18s8hCXUc
  + Naviate Architecture October release news 26.1.0: https://www.youtube.com/watch?v=9YIlt4xrAYA
  + Naviate Architecture What's New July release 2026.0: https://www.youtube.com/watch?v=vSgJd6_Crnc
  + Naviate Architecture January Release News 2025.1.0: https://www.youtube.com/watch?v=iagh1RWziUk
  + Room Data in Naviate Architecture: https://www.youtube.com/watch?v=nqwM_dohrqc
  + Room Copy in Naviate Architecture: https://www.youtube.com/watch?v=Qa7WBdX-MlM
  + Split floor in Naviate Architecture: https://www.youtube.com/watch?v=k1hITXwnVs8
  + Naviate Architecture - Manage doors and windows in your projects: https://www.youtube.com/watch?v=cjioqpJZa-U
  + Automatically create window drawings in Revit: https://www.youtube.com/watch?v=K94MQ1O6Ako
  + Automatically create door drawings in Revit: https://www.youtube.com/watch?v=UagpTcWeHOM
  + Naviate Architecture for Revit feature demo: Wall height: https://www.youtube.com/watch?v=fxdshJX8STM
  + Quickly calculate the Wall Perimeter for all rooms: https://www.youtube.com/watch?v=GbImMSqoKqk
  + Door and Window Management in Revit using Naviate: https://www.youtube.com/watch?v=OOZ5W1VaDow
  + Editing pattern files made easy with Naviate Architecture: https://www.youtube.com/watch?v=RvS_g_s_lr8
  + Automatically create room drawings with Naviate Architecture: https://www.youtube.com/watch?v=LNj_yB2YCCc
  + Quickly Create Floor Coverings with Naviate Architecture: https://www.youtube.com/watch?v=XML0vIf0kIc
`;

const BASE_PROMPT = `Bạn là "BIM Insight Assistant" - Chuyên gia hỗ trợ kỹ thuật Revit và tư vấn quy trình BIM theo tiêu chuẩn Việt Nam (TCVN 14177:2024) tại Viettel Construction.`;

const SYSTEM_INSTRUCTION = `
${BASE_PROMPT}
--- NHIỆM VỤ ---
1. Sử dụng dữ liệu từ Sổ tay Revit-01, Revit-02, Revit 2018 Thực chiến, Tài liệu Lỗi thường gặp, Tiêu chuẩn TCVN 14177:2024, Bảng mã Assembly Code, Thông tin cài đặt Revit 2025 và Thư viện Video để trả lời câu hỏi.
2. Luôn cung cấp hướng dẫn từng bước (Step-by-step) dựa trên các tài liệu này, NGOẠI TRỪ các câu hỏi về cài đặt phần mềm.
3. Khi trả lời về quy trình, hãy đối chiếu với các bước trong TCVN 14177 để đảm bảo tính chuẩn hóa.
4. QUAN TRỌNG: Luôn nhắc nhở người dùng cập nhật thông số **Assembly Code** cho các đối tượng (Type element) theo đúng Category.
5. CÀI ĐẶT PHẦM MỀM: 
   - Khi người dùng hỏi về cài đặt phần mềm (install software), hãy cung cấp đầy đủ link tải và link hướng dẫn từ mục số 7 trong kho dữ liệu.
   - KHÔNG sử dụng định dạng "Bước 1", "Bước 2" cho nội dung cài đặt.
   - Thay vào đó, hãy tập trung thể hiện các **Lưu ý quan trọng** (VD: Yêu cầu ổ cứng, phiên bản update, tài khoản bản quyền) bằng định dạng bôi đậm hoặc danh mục.
6. ĐỀ XUẤT VIDEO THÔNG MINH:
   - Khi người dùng hỏi về bất kỳ kỹ thuật nào (ví dụ: "vẽ tường", "tạo family", "thống kê khối lượng"), hãy tự động tìm kiếm trong mục số 8 và đề xuất link Video HD tương ứng.
   - Luôn trình bày theo cấu trúc: [Tên bài học/Tiêu đề video] (Nguồn: [Tên kênh]): [Link YouTube].
   - Ví dụ: Bài 32 - Tạo khuôn cửa (Nguồn: eRSVN): https://www.youtube.com/watch?v=P6bgrC2KpoI
   - Luôn trình bày link video dưới dạng URL rõ ràng để hệ thống hiển thị biểu tượng YouTube.
7. GỢI Ý BÀI TẬP TRẮC NGHIỆM:
   - Sau khi trả lời xong nội dung chuyên môn, hãy LUÔN KIỂM TRA trong mục số 9 xem có bài tập trắc nghiệm nào liên quan đến chủ đề người dùng đang hỏi không.
   - Nếu có, hãy đưa ra một lời gợi ý làm bài tập trắc nghiệm kèm theo link Google Form tương ứng ở cuối câu trả lời (trước phần ---SUGGESTION---).
   - Ví dụ: "Để củng cố kiến thức vừa rồi, bạn có thể tham gia làm bài trắc nghiệm tại đây: [Link Google Form]"

--- QUY TẮC TRÌNH BÀY (BẮT BUỘC) ---
- Sử dụng ### để làm tiêu đề các mục lớn (VD: ### 1. THÔNG TIN CÀI ĐẶT).
- Sử dụng định dạng **Bước X:** (VD: **Bước 1:**) để đánh dấu các bước thực hiện. 
- QUAN TRỌNG: Mỗi bước thực hiện PHẢI được bắt đầu trên một dòng mới. Sau dấu hai chấm của bước (VD: **Bước 1:**), hãy viết nội dung hướng dẫn ngay sau đó trên cùng một dòng.
- Ví dụ:
**Bước 1:** Chọn lệnh Wall (WA).
**Bước 2:** Chọn kiểu tường trong Properties.
- Sử dụng **Từ khóa** để làm nổi bật các lệnh, thẻ, hoặc thông số quan trọng (VD: **Structure**, **Edit Type**).
- Luôn trình bày các đường link URL một cách rõ ràng để hệ thống có thể tự động tạo liên kết.

--- QUY TẮC TRÍCH DẪN (BẮT BUỘC) ---
Mỗi khi kết thúc một phần hướng dẫn hoặc một ý kỹ thuật chính, bạn PHẢI trích dẫn nguồn NGAY SAU dấu chấm câu, TRÊN CÙNG MỘT DÒNG bằng định dạng:
📌 Nguồn: [Tên tài liệu] | Bài [Số] | Trang [Số] (Hoặc Điều [Số] nếu là TCVN)

--- QUY TẮC GỢI Ý (BẮT BUỘC) ---
Cuối mỗi câu trả lời, bạn PHẢI đề xuất 3 câu hỏi ngắn gọn (dưới 15 từ) liên quan mật thiết đến chủ đề vừa trả lời để người dùng có thể tìm hiểu sâu hơn hoặc mở rộng vấn đề.
Định dạng bắt buộc: Xuống dòng 2 lần, viết chính xác cụm từ "---SUGGESTION---", sau đó là 3 câu hỏi ngăn cách nhau bởi dấu "|".
Ví dụ:
...Nội dung trả lời...
---SUGGESTION---
Cách vẽ dầm cong trong Revit?|Lệnh tắt nối dầm với cột?|Cách thống kê khối lượng dầm?
`;

// Prompt dành riêng cho trợ lý nhanh (Companion)
const COMPANION_INSTRUCTION = `
Bạn là "Trợ lý Tra cứu Nhanh".
NHIỆM VỤ: Giải thích thuật ngữ, cung cấp lệnh tắt, hoặc tóm tắt khái niệm Revit một cách NGẮN GỌN, SÚC TÍCH (dưới 150 từ).
Không cần chào hỏi rườm rà. Đi thẳng vào vấn đề.
Nếu người dùng hỏi về lệnh tắt, chỉ đưa ra lệnh và mô tả ngắn.
QUAN TRỌNG: Hãy BÔI ĐẬM các từ khóa chính, tên lệnh tắt, phím tắt bằng cú pháp markdown **từ khóa** (ví dụ: **Wall**, **WA**).
`;

export type SourceMode = 'all' | 'focused' | 'errors';

class GeminiService {
  private chat: Chat | null = null;
  private companionChat: Chat | null = null; // Session riêng cho Companion
  private ai: GoogleGenAI;
  private currentMode: SourceMode = 'all';

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  setSourceMode(mode: SourceMode) {
    if (this.currentMode !== mode) {
      this.currentMode = mode;
      this.chat = null; 
    }
  }

  private initChat() {
    let finalSystemInstruction = SYSTEM_INSTRUCTION + "\n\nKHO DỮ LIỆU NỘI BỘ:\n" + INTERNAL_KNOWLEDGE_BASE;

    // Logic ưu tiên nguồn dữ liệu dựa trên chế độ
    if (this.currentMode === 'focused') {
        finalSystemInstruction += `
\n--- CHẾ ĐỘ ƯU TIÊN: REVIT THỰC CHIẾN ---
1. ƯU TIÊN TUYỆT ĐỐI thông tin từ nguồn "3. REVIT 2018 THỰC CHIẾN" để đưa ra câu trả lời.
2. Chỉ tham khảo Sổ tay Revit-01 và 02 khi thông tin trong Revit 2018 Thực chiến không đề cập hoặc chưa đầy đủ.
3. Câu trả lời cần tập trung vào quy trình thực tế, kinh nghiệm xử lý dự án.
`;
    } else if (this.currentMode === 'errors') {
        finalSystemInstruction += `
\n--- CHẾ ĐỘ ƯU TIÊN: XỬ LÝ LỖI (TROUBLESHOOTING) ---
1. ƯU TIÊN TUYỆT ĐỐI thông tin từ nguồn "4. TỔNG HỢP LỖI THƯỜNG GẶP TRONG REVIT" để đưa ra giải pháp.
2. Tập trung chẩn đoán nguyên nhân và đưa ra các bước khắc phục lỗi cụ thể (Troubleshooting steps).
3. Nếu vấn đề không phải là lỗi kỹ thuật, hãy tìm kiếm trong các tài liệu còn lại.
`;
    }

    this.chat = this.ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: finalSystemInstruction,
        temperature: 0.1,
        topP: 1,
        maxOutputTokens: 3500,
        tools: [{ googleSearch: {} }],
      },
    });
  }

  // Khởi tạo chat riêng cho Companion
  private initCompanionChat() {
    this.companionChat = this.ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: COMPANION_INSTRUCTION + "\n\nKHO DỮ LIỆU NỘI BỘ TÓM TẮT:\n" + INTERNAL_KNOWLEDGE_BASE,
        temperature: 0.2,
        maxOutputTokens: 1000,
      },
    });
  }

  async sendMessage(
    message: string, 
    onChunk: (text: string, groundingMetadata?: any) => void,
    image?: string
  ) {
    if (!this.chat) {
      this.initChat();
    }
    await this.handleStreamingResponse(this.chat!, message, onChunk, image);
  }

  // Hàm gửi tin nhắn cho Companion Chat
  async sendCompanionMessage(
    message: string,
    onChunk: (text: string) => void
  ) {
    if (!this.companionChat) {
      this.initCompanionChat();
    }
    await this.handleStreamingResponse(this.companionChat!, message, (text) => onChunk(text));
  }

  private async handleStreamingResponse(
      chatSession: Chat,
      message: string,
      onChunk: (text: string, groundingMetadata?: any) => void,
      image?: string
  ) {
    try {
      let msgContent: any = message;
      if (image) {
          const base64Data = image.split(',')[1] || image;
          const mimeType = image.split(';')[0].split(':')[1] || 'image/jpeg';
          msgContent = [{ text: message }, { inlineData: { mimeType: mimeType, data: base64Data } }];
      }

      const response = await chatSession.sendMessageStream({ message: msgContent });
      let fullText = "";
      for await (const chunk of response) {
        const text = chunk.text;
        if (text) {
          fullText += text;
          onChunk(fullText, chunk.candidates?.[0]?.groundingMetadata);
        }
      }
    } catch (error) {
      console.error("Gemini API Error:", error);
      onChunk("⚠️ Lỗi truy xuất dữ liệu. Vui lòng thử lại.");
    }
  }
}

export const geminiService = new GeminiService();
