
import { Shortcut, CommonError } from './types';

export interface ShortcutGroup {
  category: string;
  items: Shortcut[];
}

export interface BIMCategory {
  name: string;
  icon: string;
  description: string;
}

export const REVIT_SHORTCUT_GROUPS: ShortcutGroup[] = [
  {
    category: "Annotate (Chú thích)",
    items: [
      { key: 'DI', command: 'Aligned Dimension', description: 'Tạo kích thước thẳng hàng' },
      { key: 'DL', command: 'Detail Line', description: 'Vẽ đường chi tiết 2D' },
      { key: 'EL', command: 'Spot Elevation', description: 'Hiển thị cao độ điểm' },
      { key: 'FR', command: 'Find/Replace', description: 'Tìm kiếm và thay thế nội dung' },
      { key: 'GP', command: 'Model/Detail Group', description: 'Tạo nhóm mô hình/chi tiết' },
      { key: 'RT', command: 'Tag Room', description: 'Gắn thẻ cho phòng' },
      { key: 'TG', command: 'Tag by Category', description: 'Gắn thẻ theo danh mục đối tượng' },
      { key: 'TX', command: 'Text', description: 'Thêm văn bản vào bản vẽ' },
    ]
  },
  {
    category: "Architecture (Kiến trúc)",
    items: [
      { key: 'CL', command: 'Column', description: 'Thêm cột kiến trúc/kết cấu' },
      { key: 'CM', command: 'Place a Component', description: 'Đặt cấu kiện (Family)' },
      { key: 'DR', command: 'Door', description: 'Thêm cửa đi' },
      { key: 'GR', command: 'Grid', description: 'Đặt lưới trục cột' },
      { key: 'LL', command: 'Level', description: 'Đặt cao độ tầng' },
      { key: 'RM', command: 'Room', description: 'Tạo phòng và đường phân cách' },
      { key: 'RP', command: 'Reference Plane', description: 'Tạo mặt phẳng tham chiếu' },
      { key: 'SB', command: 'Structural Floor', description: 'Thêm sàn kết cấu' },
      { key: 'WA', command: 'Wall', description: 'Tạo tường kiến trúc/kết cấu' },
      { key: 'WN', command: 'Window', description: 'Đặt cửa sổ' },
    ]
  },
  {
    category: "Modify (Chỉnh sửa)",
    items: [
      { key: 'AL', command: 'Align', description: 'Căn chỉnh đối tượng' },
      { key: 'AR', command: 'Array', description: 'Tạo mảng đối tượng' },
      { key: 'CO', command: 'Copy', description: 'Sao chép đối tượng' },
      { key: 'MM', command: 'Mirror (Pick Axis)', description: 'Lấy đối xứng qua trục chọn' },
      { key: 'DM', command: 'Mirror (Draw Axis)', description: 'Lấy đối xứng qua trục vẽ' },
      { key: 'MV', command: 'Move', description: 'Di chuyển đối tượng' },
      { key: 'OF', command: 'Offset', description: 'Dịch chuyển song song' },
      { key: 'RO', command: 'Rotate', description: 'Xoay đối tượng quanh trục' },
      { key: 'TR', command: 'Trim/Extend', description: 'Cắt hoặc gia hạn đến góc' },
      { key: 'SL', command: 'Split Element', description: 'Cắt/chia nhỏ phần tử' },
      { key: 'RE', command: 'Scale', description: 'Thay đổi tỷ lệ/kích thước' },
      { key: 'PN', command: 'Pin', description: 'Ghim cố định đối tượng' },
      { key: 'UP', command: 'Unpin', description: 'Tháo ghim đối tượng' },
      { key: 'DE', command: 'Delete', description: 'Xóa đối tượng khỏi mô hình' },
    ]
  },
  {
    category: "View (Chế độ xem)",
    items: [
      { key: 'VG', command: 'Visibility/Graphics', description: 'Quản lý hiển thị đồ họa' },
      { key: 'HH', command: 'Hide Element', description: 'Ẩn đối tượng tạm thời' },
      { key: 'HI', command: 'Isolate Element', description: 'Cô lập đối tượng tạm thời' },
      { key: 'HC', command: 'Hide Category', description: 'Ẩn danh mục đối tượng' },
      { key: 'IC', command: 'Isolate Category', description: 'Cô lập danh mục đối tượng' },
      { key: 'HR', command: 'Reset Temporary Hide', description: 'Khôi phục ẩn/cô lập tạm thời' },
      { key: 'RH', command: 'Reveal Hidden Elements', description: 'Bật/tắt hiển thị phần tử ẩn' },
      { key: 'TL', command: 'Thin Lines', description: 'Chế độ nét mảnh' },
      { key: 'WT', command: 'Tile Windows', description: 'Hiển thị tất cả cửa sổ đang mở' },
      { key: 'WC', command: 'Cascade Windows', description: 'Sắp xếp cửa sổ theo tầng' },
    ]
  },
  {
    category: "Analyze (Phân tích)",
    items: [
      { key: 'AA', command: 'Adjust Analytical Model', description: 'Điều chỉnh mô hình phân tích' },
      { key: 'DC', command: 'Check Duct Systems', description: 'Kiểm tra hệ thống ống gió' },
      { key: 'EC', command: 'Check Circuits', description: 'Xác minh mạch điện' },
      { key: 'LD', command: 'Loads', description: 'Áp dụng tải trọng lên mô hình' },
      { key: 'LO', command: 'Heating/Cooling Loads', description: 'Phân tích tải trọng nhiệt' },
      { key: 'PC', command: 'Check Pipe Systems', description: 'Kiểm tra hệ thống ống nước' },
      { key: 'PS', command: 'Panel Schedules', description: 'Tạo lịch bảng điện' },
      { key: 'RA', command: 'Reset Analytical Model', description: 'Khôi phục mô hình phân tích' },
    ]
  },
  {
    category: "Navigation (Điều hướng)",
    items: [
      { key: '32', command: '2D Mode', description: 'Điều hướng chế độ xem 2D' },
      { key: '3F', command: 'Fly Mode', description: 'Mô phỏng bay qua mô hình' },
      { key: '3O', command: 'Object Mode', description: 'Điều hướng theo tâm đối tượng' },
      { key: '3W', command: 'Walk Mode', description: 'Mô phỏng đi bộ qua mô hình' },
      { key: 'ZA', command: 'Zoom All to Fit', description: 'Phóng to hiển thị toàn bộ' },
      { key: 'ZE', command: 'Zoom to Fit', description: 'Phóng to vừa khít màn hình' },
      { key: 'ZO', command: 'Zoom Out 2X', description: 'Thu nhỏ chế độ xem gấp đôi' },
      { key: 'ZR', command: 'Zoom in Region', description: 'Phóng to một vùng cụ thể' },
    ]
  },
  {
    category: "Snaps (Bắt điểm)",
    items: [
      { key: 'SC', command: 'Centers', description: 'Bắt vào điểm trung tâm' },
      { key: 'SE', command: 'Endpoints', description: 'Bắt vào các điểm cuối' },
      { key: 'SI', command: 'Intersections', description: 'Bắt vào giao điểm' },
      { key: 'SM', command: 'Midpoints', description: 'Bắt vào điểm giữa' },
      { key: 'SN', command: 'Nearest', description: 'Bắt vào điểm gần nhất' },
      { key: 'SP', command: 'Perpendicular', description: 'Bắt vào điểm vuông góc' },
      { key: 'SQ', command: 'Quadrants', description: 'Bắt vào góc phần tư' },
      { key: 'SO', command: 'Snaps Off', description: 'Tắt tính năng bắt điểm' },
    ]
  },
  {
    category: "Structural (Kết cấu)",
    items: [
      { key: 'BM', command: 'Structural Beam', description: 'Thêm dầm kết cấu chịu lực' },
      { key: 'BR', command: 'Structural Brace', description: 'Thêm thanh giằng kết cấu' },
      { key: 'BS', command: 'Beam System', description: 'Tạo hệ thống dầm song song' },
      { key: 'FT', command: 'Structural Foundation', description: 'Tạo móng tường kết cấu' },
      { key: 'RN', command: 'Reinforcement Numbers', description: 'Đánh số cốt thép' },
    ]
  },
  {
    category: "System (Cơ điện MEP)",
    items: [
      { key: 'AT', command: 'Air Terminal', description: 'Đặt đầu cuối không khí (Miệng gió)' },
      { key: 'CN', command: 'Conduit', description: 'Vẽ ống dẫn dây điện cứng' },
      { key: 'CT', command: 'Cable Tray', description: 'Vẽ khay cáp điện' },
      { key: 'DT', command: 'Duct', description: 'Vẽ ống gió' },
      { key: 'PI', command: 'Pipe', description: 'Vẽ ống nước cứng' },
      { key: 'PX', command: 'Plumbing Fixture', description: 'Đặt thiết bị vệ sinh' },
      { key: 'EE', command: 'Electrical Equipment', description: 'Đặt thiết bị điện (Tủ điện)' },
      { key: 'LF', command: 'Lighting Fixture', description: 'Đặt thiết bị chiếu sáng' },
    ]
  }
];

export const BIM_INFO_CATEGORIES: BIMCategory[] = [
  { name: "Tường (Walls)", icon: "🧱", description: "Cấu trúc, vật liệu, Assembly Code: B2010" },
  { name: "Cột (Columns)", icon: "🏛️", description: "Chịu lực, cao độ, Assembly Code: B1010" },
  { name: "Dầm (Beams)", icon: "🏗️", description: "Mác bê tông, tiết diện, Assembly Code: B1010" },
  { name: "Cửa (Doors/Windows)", icon: "🚪", description: "Kích thước, mã hiệu, Assembly Code: B2020/B2030" },
  { name: "Sàn (Floors)", icon: "📐", description: "Cấu tạo lớp, diện tích, Assembly Code: B1010" },
  { name: "MEP (Mechanical)", icon: "⚙️", description: "Hệ thống, công suất, Assembly Code chuẩn MEP" }
];

export const REVIT_SHORTCUTS: Shortcut[] = REVIT_SHORTCUT_GROUPS.flatMap(g => g.items);

export const COMMON_ERRORS: CommonError[] = [
  {
    title: "Mất thanh Properties/Project Browser?",
    solutions: ["Chuột phải vào màn hình > chọn Properties hoặc Project Browser", "Vào tab View > User Interface > Tích chọn thanh bị mất."]
  },
  {
    title: "Lỗi Card màn hình không nhận?",
    solutions: ["Kiểm tra driver card đồ họa", "Nên chọn card trong danh sách hỗ trợ của Autodesk."]
  },
  {
    title: "Mất Cube View hoặc Toolbar?",
    solutions: ["Kích vào nút thu nhỏ Ribon", "Vào Options > ViewCube > Bật lại Show the ViewCube."]
  }
];

export const MANUAL_URLS = {
  // Tập 1 - Dựng hình
  REVIT_01_BAI_1: 'https://drive.google.com/file/d/1MHM6j1J5a2O_0cwqDDYX8AoFxzBdLIqO/view?usp=drive_link',
  REVIT_01_BAI_2: 'https://drive.google.com/file/d/1DGcPuu7UKXHyylp3vwNB_ha1JF3hiFb7/view?usp=drive_link',
  REVIT_01_BAI_3: 'https://drive.google.com/file/d/1Dt1ryrKW-Qyda630qd3KffkVlt6D_KFU/view?usp=drive_link',
  REVIT_01_BAI_4: 'https://drive.google.com/file/d/1hjK6Kbuujx_axggba6VN_-FbGY9j8cs6/view?usp=drive_link',
  REVIT_01_BAI_5: 'https://drive.google.com/file/d/1TyoVON_ll4KkxdEdHop3WRCIZOsn5ho9/view?usp=drive_link',
  REVIT_01_BAI_6: 'https://drive.google.com/file/d/1HzDugKLAMjJGtZ6HvVBJ8XCC9itJZeMx/view?usp=drive_link',
  REVIT_01_BAI_7: 'https://drive.google.com/file/d/1PRS9lg162T2hiA056baXohNlXj51s1HU/view?usp=drive_link',
  REVIT_01_BAI_8: 'https://drive.google.com/file/d/1tZmpUgXzkJYgPCJrEhIvW8P9Y-kbLw68/view?usp=drive_link',
  REVIT_01_BAI_9: 'https://drive.google.com/file/d/1ABsbrgu84aK7T7BBw5jkqLmT4w6yhH8R/view?usp=drive_link',

  // Tập 2 - Quản lý & Hồ sơ
  REVIT_02_BAI_1: 'https://drive.google.com/file/d/13yPA_NIAQl_EiRKtR29sR4NyNQVW0-tD/view?usp=drive_link',
  REVIT_02_BAI_2: 'https://drive.google.com/file/d/1Td1uliv4V-yrBJg4p0iZvGSL11cVVY0d/view?usp=drive_link',
  REVIT_02_BAI_3: 'https://drive.google.com/file/d/1xFvAZZnXu_Ma1Rn5nlOjTBZdU6T6C47M/view?usp=drive_link',
  REVIT_02_BAI_4: 'https://drive.google.com/file/d/1NpNWOYnnxY9FX75byPgybhwrrRFSkohb/view?usp=drive_link',
  REVIT_02_BAI_5: 'https://drive.google.com/file/d/1WWrPOmav7lpNOSX4LZGmAheVpH6ZN1yg/view?usp=drive_link',
  REVIT_02_BAI_6: 'https://drive.google.com/file/d/12pU6gfPseRt_3IUfXipFmovKdYnh9RwJ/view?usp=drive_link',
  REVIT_02_BAI_7: 'https://drive.google.com/file/d/1KIzgsisWnNayeJtcv89ZDLJAvGxHRaSe/view?usp=drive_link',
  REVIT_02_BAI_8: 'https://drive.google.com/file/d/12mfmkIltDlEu65K9caY39mw4KvLLIeEt/view?usp=drive_link',

  // Revit 2018 Thực chiến
  REVIT_2018_BAI_1: 'https://drive.google.com/file/d/1e33_kPlvVMb6rytpkokr6YW8QCKbCqDC/view?usp=sharing',
  REVIT_2018_BAI_2: 'https://drive.google.com/file/d/11KUpwMxd-sTFHi1SkQRqTDuOaHhvG5to/view?usp=drive_link',
  REVIT_2018_BAI_3: 'https://drive.google.com/file/d/1HVcrs4bfQjJxrrZ66n51WE67ANR5MJYb/view?usp=drive_link',
  REVIT_2018_BAI_4: 'https://drive.google.com/file/d/1tbmOcWPR0qXWsSdMS1wYQQsIc7M78MLI/view?usp=drive_link',
  REVIT_2018_BAI_5: 'https://drive.google.com/file/d/1BLQvf89nhGZJDkKXSQgnjWwacqzvZhR2/view?usp=drive_link',
  REVIT_2018_BAI_6: 'https://drive.google.com/file/d/1TXNEa_4G3GZXcZqdmEB2RsizMU-kvPHo/view?usp=drive_link',
  REVIT_2018_BAI_7: 'https://drive.google.com/file/d/1Xw7P-AvRNUmGLMwxwxp3QDhLheHSIqYj/view?usp=drive_link',
  REVIT_2018_BAI_8: 'https://drive.google.com/file/d/1z3Vn1iyeTqDcDgPxzZU05hn-k5puuOD_/view?usp=drive_link',
  REVIT_2018_BAI_9: 'https://drive.google.com/file/d/1qtV4uQY40pMCz-dr93hipy7JDGvFr57T/view?usp=drive_link',
  REVIT_2018_BAI_10: 'https://drive.google.com/file/d/1okURr6D7tsrrJcxwpPhExu23MOyDszNa/view?usp=drive_link',
  REVIT_2018_BAI_11: 'https://drive.google.com/file/d/1-uhhTI8BkX-RzM-hzcavNcAewDavfPeX/view?usp=drive_link',
  REVIT_2018_BAI_12: 'https://drive.google.com/file/d/1ecKnh_3YLSCDUO16zEKfLxLdNLmRcXFO/view?usp=drive_link',
  REVIT_2018_BAI_13: 'https://drive.google.com/file/d/1qaetfDkuOQ7a3AvDGehre67o1sg9li9Z/view?usp=drive_link',
  REVIT_2018_BAI_14: 'https://drive.google.com/file/d/1muLY7qRGIKWkz84q_nqHbK-DQqPnCEfs/view?usp=drive_link',
  REVIT_2018_BAI_15: 'https://drive.google.com/file/d/1pF36S2wb0GxU9O-9cjgxkE1ZCZoBmgzt/view?usp=drive_link',
  REVIT_2018_BAI_16: 'https://drive.google.com/file/d/12N0qs2c96U6P8ID9tzsrkcxMrnHcc5LO/view?usp=drive_link',
  REVIT_2018_BAI_17: 'https://drive.google.com/file/d/1S1Ax35-6kCBhy7VlEvbQMrG1EPDBWEhN/view?usp=drive_link',

  REVIT_ERRORS: 'https://drive.google.com/file/d/11ShF9H2tSBqY6t52ZH_eN7PvqYlOhEZs/view?usp=sharing',
  TCVN_14177_1: 'https://drive.google.com/file/d/1JFYWhWW0kMSjIM58VtofizbPyh3sccRM/view?usp=drive_link',
  TCVN_14177_2: 'https://drive.google.com/file/d/1wJlFU1xlSuKOMWeaAVJVqRdgDvj-66hD/view?usp=drive_link',
  
  // Hướng dẫn dùng Template
  TEMPLATE_00: 'https://drive.google.com/file/d/1Hv-YSyWGn_2a72L77rjy4nDYKpF8m12-/view?usp=drive_link',
  TEMPLATE_01: 'https://drive.google.com/file/d/1FxYk9lra4f7s5X18t2NOm6f9QVqDvjNS/view?usp=drive_link',
  TEMPLATE_02: 'https://drive.google.com/file/d/17oxG_CbiUPkiaurQOhzxfaQ3SPVpRM5v/view?usp=drive_link',
  TEMPLATE_03: 'https://drive.google.com/file/d/1HPtUZeBLwQnkQNR7B5OOYG0xpQ1nEKRv/view?usp=drive_link',
  TEMPLATE_04: 'https://drive.google.com/file/d/1HPtUZeBLwQnkQNR7B5OOYG0xpQ1nEKRv/view?usp=drive_link',
  TEMPLATE_05: 'https://drive.google.com/file/d/1Crv_ui-jnChWq4x56MwXds--3sJQPMuz/view?usp=drive_link',
  TEMPLATE_06: 'https://drive.google.com/file/d/1-T8T_XT2WdWort7Vsie5AocKVFXdyuQ/view?usp=drive_link',
  TEMPLATE_07: 'https://drive.google.com/file/d/1_lbZZ5NeDmOfPAFI1y0BAhk942Rzl1tY/view?usp=drive_link',
  TEMPLATE_08: 'https://drive.google.com/file/d/12DnYpSwEu8nI4zGOnBCL92BMJ_XrTzG/view?usp=drive_link',
  TEMPLATE_09: 'https://drive.google.com/file/d/1Zjffqc_52UKpfJyOe5rxq2pgEuyYVDhv/view?usp=drive_link'
};

export const VCC_LOGO_TEXT = "VCC";
