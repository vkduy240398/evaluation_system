export type UpdateListUserType = {
  company: string | number;
  department: string | number;
  division: string | number;
  level: string | number;
  listId: number[];
  listUserSelecteds: UserSelectedType[];
  radioLevelValue: number;
  flagSkillValue: number | string;
};

/** Kiểu dữ liệu cho tham số query của confirmEditListUser.
 *  Tương tự UpdateListUserType nhưng department có thể là null (xóa phòng ban).
 *  Dùng type cụ thể thay cho `query: any` để TypeScript phát hiện lỗi thiếu field
 *  hoặc sai kiểu dữ liệu tại compile time thay vì runtime. */
export type ConfirmEditListUserQuery = {
  /** ID công ty mới hoặc chuỗi '変更しない' nếu không thay đổi */
  company: string | number;
  /** ID phòng ban mới, null (xóa phòng ban), hoặc '変更しない' nếu không thay đổi */
  department: string | number | null;
  /** ID bộ phận mới hoặc '変更しない' nếu không thay đổi */
  division: string | number;
  /** Bậc lương mới hoặc '変更しない' nếu không thay đổi */
  level: string | number;
  /** Danh sách ID của các user đang được chỉnh sửa */
  listId: number[];
  /** Snapshot thông tin user tại thời điểm mở modal (dùng để so sánh trước/sau) */
  listUserSelecteds: UserSelectedType[];
  /** 1 = tạo lại toàn bộ mục tiêu, 2 = chỉ cập nhật hành vi/情意 */
  radioLevelValue: 1 | 2;
  /** Giá trị flagSkill mới hoặc '変更しない' nếu không thay đổi */
  flagSkillValue: number | string;
};

export type UserSelectedType = {
  id: number;
  level: number;
  fullName: string;
  employeeNumber: string;
  email: string;
  division: { id: number; code: string };
  department: { id: number; code: string; name: string };
  company: { id: number; name: string };
  flagSkill: number;
};
