# Review: Màn hình `company/GNW/admin-user/user-list` vs API `confirm-edit-list-user`

- **Ngày review:** 2026-08-03
- **Phạm vi:** So sánh FE `company/:companyCode/admin-user/user-list` (route thực tế cho `company/GNW/admin-user/user-list`) với API `PUT /api/v1/f8/management-user/confirm-edit-list-user`.
- **Phương pháp:** Đọc trực tiếp source code FE/BE liên quan, verify lại từng claim bằng grep/read trước khi đưa vào báo cáo (không suy đoán).

---

## 1. File liên quan

**Frontend** (route active, đăng ký tại `client/src/routes/routers.tsx:250-262`, bảo vệ bởi `RequireAuth roleList={[Roles.F8]}`):

| File | Vai trò |
|---|---|
| `client/src/page/admin/user-management/user-list/UserList.tsx` | Trang chính: bảng, chọn nhiều dòng, nút "Sửa hàng loạt" |
| `client/src/views/admin/user-management/user-list/user-list/ModalEditUser.tsx` | Modal wizard 3 bước, nơi gọi `confirm-edit-list-user` (Step 1→3) và `update-user` (Save) |
| `client/src/views/admin/user-management/shared/EditUserWizardShared.tsx` | Hiển thị bảng preview Step 3 (`DataChange`) |
| `client/src/views/admin/user-management/shared/editUserWizard.utils.ts` | Parse text tiếng Nhật BE trả về để render Step 3 |
| `client/src/views/admin/user-management/user-detail/ModalEditUserFromDetail.tsx` | Modal sửa 1 user (trang chi tiết), dùng chung 2 API trên |

**Backend:**

| File | Vai trò |
|---|---|
| `server/src/controllers/f8/managementUser.controller.ts` (dòng 544-551) | Route `PUT /confirm-edit-list-user` |
| `server/src/services/managementUser.service.ts` (`confirmEditListUser`, dòng ~1068-1830) | Business logic build text preview |
| `server/src/interfaces/service/managementUser.interface.ts` (dòng 12-33) | Type `ConfirmEditListUserQuery` |
| `server/src/repository/managementUser.repository.ts` (`getCountUserList` dòng 259-267, `getListUserInforCurrent` dòng 524+) | Truy vấn kiểm tra & lấy dữ liệu user hiện tại |
| `server/sql/procedure/update_user.sql` (dòng 526-943) | Procedure update thật (chạy khi bấm Save, không phải khi gọi `confirm-edit-list-user`) |

> **Lưu ý:** Repo còn tồn tại một bộ code cũ song song (`client/src/page/admin/list-user/*`) cũng gọi cùng API nhưng **không thấy được mount vào route** `admin-user/user-list` trong `routers.tsx`. Có thể là code chết cần dọn — nên xác nhận lại với team trước khi xoá.

---

## 2. Luồng xử lý

1. User chọn checkbox nhiều dòng trên bảng (`UserList.tsx`) → bấm "Sửa hàng loạt" → mở `ModalEditUser`.
2. **Step 1**: chọn `company / division / department / level / flagSkill`. `department` bắt buộc khi `level < 8` (validate FE only).
3. Bấm "Next" từ Step 2 → Step 3: FE gọi
   ```
   PUT /api/v1/f8/management-user/confirm-edit-list-user
   Body: { dataChange: { company, department, division, level, listId, flagSkillValue, radioLevelValue, listUserSelecteds, languageChange } }
   ```
4. **BE** (`confirmEditListUser`):
   - Check `getCountUserList(listId, companyGroupCode)` — đếm user `active=1 AND companyGroupCode=X AND id IN listId`. Nếu số đếm ≠ `listId.length` → `409 Conflict "Data is conflict"`. **Đây là chốt permission/tenant-check duy nhất.**
   - Chuẩn hoá field: giá trị `'変更しない'` → coi như "không đổi"; `department === null` → "xoá department".
   - Load dữ liệu hiện tại bằng `getListUserInforCurrent(listId)` (không filter lại `companyGroupCode`/`active`, dựa vào bước check ở trên).
   - Build 2 chuỗi text tiếng Nhật (`userInforChange`, `userEvaluationChange`) từ hằng số cứng trong `server/src/services/textMessage.ts`, **không dùng dữ liệu có cấu trúc**.
   - Trả về mảng `{ fullName, employeeNumber, userInforChange, userEvaluationChange }` — **không ghi gì vào DB**. Đây thuần túy là API "preview".
5. FE parse các chuỗi text này bằng regex (`editUserWizard.utils.ts`) để hiển thị bảng before/after ở Step 3.
6. Bấm "Save" ở Step 3 mới gọi API khác — `PUT /api/v1/f8/management-user/update-user` — API này mới thực sự `CALL update_user(...)` (SQL procedure) để ghi DB.

---

## 3. Các case bất thường phát hiện được (đã verify lại code)

### 3.1 — `languageChange` là dead payload (Nghiêm trọng: gây nhầm lẫn / rác code)
FE build và gửi field `languageChange` chứa các chuỗi đã dịch (`ModalEditUser.tsx:537-543`, `ModalEditUserFromDetail.tsx:359-365`):
```ts
languageChange: {
  textItemChanged: t('MESSAGE.IDS_TEXT_TITLE_ITEM_CHANGED'),
  textTitleSkill: t('MESSAGE.IDS_TEXT_TITLE_SKILL'),
  textTitleDepDiv: t('MESSAGE.IDS_TEXT_TITLE_DEP_DIV'),
  textTitleLevel: t('MESSAGE.IDS_TEXT_TITLE_LEVEL'),
  textComma: t('IDS_COMMA'),
},
```
Đã grep toàn bộ `server/src` — **không có nơi nào đọc `languageChange`** (0 kết quả). `ConfirmEditListUserQuery` cũng không khai field này. BE luôn trả text tiếng Nhật cứng từ `textMessage.ts` bất kể FE gửi gì.

→ Nếu mục tiêu là đa ngôn ngữ hoá (i18n) Step 3, tính năng này **chưa hoạt động** dù FE đã chuẩn bị payload sẵn — trông như một phần việc dang dở. Nếu không có kế hoạch i18n, đây là payload thừa cần dọn ở FE để tránh hiểu nhầm khi đọc code sau này.

### 3.2 — API không có DTO / validate runtime (Nghiêm trọng: rủi ro bảo mật & data integrity)
```ts
@Put('/confirm-edit-list-user')
async confirmEditListUser(@Body() query: any, @Req() req: Request) {
```
`@Body() query: any` — không `@ApiBody`, không class-validator, không xuất hiện trong Swagger. So với `update-user` (cũng dùng `any` nhưng ít nhất có `@ApiBody({ type: RequestUpdatedUser })` cho mục đích tài liệu — dù DTO đó cũng không có validator nào).

Hệ quả cụ thể:
- Không kiểm tra `level` có nằm trong khoảng hợp lệ (1-10) hay không.
- Không kiểm tra `department` có thực sự thuộc `division` đã chọn hay không.
- Không kiểm tra `radioLevelValue` chỉ nhận `1 | 2` — xem case 3.3.
- Không có field nào bị coi là bắt buộc ở tầng BE (toàn bộ "required" chỉ tồn tại ở FE, có thể bypass bằng cách gọi API trực tiếp).

### 3.3 — Type khai báo sai với giá trị thực tế FE gửi (`radioLevelValue`)
`ConfirmEditListUserQuery.radioLevelValue` khai kiểu `1 | 2` (`managementUser.interface.ts:30`), nhưng FE khởi tạo:
```ts
const [radioLevelValue, setRadioLevelValue] = useState(-1);   // ModalEditUser.tsx:234
```
và có case hợp lệ để **không** set lại giá trị này (khi user không có bản ghi đánh giá nào, `typeEvaluation === 2`, dòng 357: `radioLevelValue === -1 && (displayRadioOne || displayRadioTwo)` được dùng để validate bắt buộc chọn — nghĩa là khi điều kiện này false, `-1` vẫn có thể được gửi lên nguyên vẹn).

BE xử lý phòng hờ bằng `radioResetValue = query.radioLevelValue == 2 ? 2 : 1` nên không crash runtime, nhưng **type khai báo (`1 | 2`) không đúng với giá trị thực tế có thể nhận (`-1`)** — TypeScript compile-time check ở đây đang cho cảm giác an toàn giả (false sense of safety), vì giá trị `-1` âm thầm bị coi như `1` (tạo lại mục tiêu) thay vì được BE từ chối hoặc cảnh báo rõ ràng.

### 3.4 — Lệch kiểu dữ liệu response `employeeNumber`
BE trả `employeeNumber` là `string` (đúng theo `UserResponse.ts` — cả 3 chỗ khai `employeeNumber: string`), nhưng FE type `DataChange` (`EditUserWizardShared.tsx`) khai `employeeNumber: number`. Không gây lỗi runtime (JS không ép kiểu) nhưng type sai lệch, tiềm ẩn bug nếu sau này có code thực hiện phép toán số học trên field này.

### 3.5 — Coupling chuỗi text FE ↔ BE rất mong manh (không có type-safety)
BE trả về chuỗi text tiếng Nhật đã format sẵn (`userInforChange`, `userEvaluationChange`), FE parse lại bằng regex/`split()` dựa theo các từ khóa cứng: `'変更しない'`, `' → '`, `'が取り消されます'`, `'等級'`, `'部署名'`, `'課名'`, `'スキル評価'`...

→ Nếu backend đổi format string trong `textMessage.ts` hoặc đổi logic build text trong `confirmEditListUser`, **Step 3 sẽ hiển thị sai hoặc rỗng mà không có lỗi biên dịch/runtime nào cảnh báo**. Đây là điểm rủi ro cao nhất khi 2 phía (FE/BE) được sửa độc lập bởi 2 người khác nhau.

### 3.6 — Guard nghiệp vụ "cross-boundary level" tồn tại độc lập ở 2 nơi, không có test đồng bộ
`server/sql/procedure/update_user.sql` (dòng 666-677) có comment do chính dev để lại, cảnh báo rõ:
> Option 2 (chỉ cập nhật hành vi) chỉ hợp lệ khi level cũ và level mới cùng thuộc một nhóm (cùng 1–7 hoặc cùng 8–10). Nếu thay đổi điều kiện này, cần kiểm tra lại logic hiển thị message cross-boundary trong service `confirmEditListUser` / `confirmEditOneUser` để đảm bảo hành vi nhất quán giữa SQL và tầng service.

→ Nghĩa là: API preview (`confirmEditListUser`, TS) và API thực thi (`update_user` SQL procedure) **implement riêng cùng một rule nghiệp vụ ở 2 ngôn ngữ khác nhau**, không dùng chung nguồn logic, không có test tự động nào đảm bảo 2 bên khớp nhau. Rủi ro: preview ở Step 3 hiển thị đúng nhưng dữ liệu lưu thực tế sai (hoặc ngược lại), vì một bên bị sửa mà quên đồng bộ bên kia.

### 3.7 — `confirm-edit-list-user` không ghi log / audit gì (đúng vì chỉ là preview, nhưng cần lưu ý)
Vì đây chỉ là bước preview (không update DB), nên nếu FE gọi API này nhiều lần (ví dụ user bấm back/next qua lại giữa Step 1-2-3) sẽ tính lại toàn bộ mỗi lần — không ảnh hưởng data nhưng cần lưu ý về performance nếu `listId` lớn (vòng lặp build text cho từng user, không thấy giới hạn số lượng user tối đa trong `listId`).

---

## 4. Bảng so sánh field FE gửi ↔ BE đọc

| Field FE gửi (`getDataChange()`) | BE đọc (`ConfirmEditListUserQuery`) | Trạng thái |
|---|---|---|
| `company` | ✅ | Khớp |
| `department` | ✅ | Khớp |
| `division` | ✅ | Khớp |
| `level` | ✅ | Khớp |
| `listId` | ✅ | Khớp |
| `flagSkillValue` | ✅ | Khớp |
| `radioLevelValue` | ⚠️ | Khớp tên nhưng type khai báo (`1\|2`) sai với giá trị thực tế có thể gửi (`-1`) — case 3.3 |
| `listUserSelecteds` | ✅ | Khớp |
| `languageChange` | ❌ | BE không có field này, hoàn toàn bị bỏ qua — case 3.1 |

---

## 5. Đề xuất

1. **Ưu tiên cao:** Thêm DTO + class-validator cho `confirm-edit-list-user` (và `update-user`) — tối thiểu validate `level` trong khoảng hợp lệ, `radioLevelValue` chỉ nhận `1`/`2`, `listId` không rỗng. Hiện tại API chấp nhận `any`, hoàn toàn dựa vào FE để đảm bảo tính đúng đắn dữ liệu.
2. **Ưu tiên trung bình:** Quyết định dứt điểm về `languageChange` — hoặc BE đọc và dùng field này để hỗ trợ đa ngôn ngữ thật sự, hoặc xoá khỏi payload FE để tránh gây hiểu nhầm cho người đọc code sau này.
3. **Ưu tiên trung bình:** Sửa type `ConfirmEditListUserQuery.radioLevelValue` thành `1 | 2 | -1` (hoặc validate/reject `-1` tường minh ở BE) để type phản ánh đúng giá trị thực tế.
4. **Ưu tiên thấp:** Sửa `DataChange.employeeNumber` ở FE từ `number` → `string` cho khớp response thực tế.
5. **Cần theo dõi lâu dài:** Cân nhắc thêm test tích hợp (integration test) so sánh output của `confirmEditListUser` (preview) với kết quả thực tế của `update_user` procedure cho các case cross-boundary level (1-7 ↔ 8-10), vì đây là 2 cài đặt độc lập của cùng 1 rule nghiệp vụ.
6. Xác nhận với team liệu bộ code cũ `client/src/page/admin/list-user/*` có còn được dùng ở route nào khác không — nếu không, nên dọn để tránh nhầm lẫn khi maintain.

---

*Báo cáo này chỉ dựa trên đọc code tĩnh (static review), không chạy thử API/UI trực tiếp. Các số dòng tham chiếu theo trạng thái source code tại thời điểm review (2026-08-03) — có thể lệch nếu code đã thay đổi sau đó.*
