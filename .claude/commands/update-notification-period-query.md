---
description: Chỉnh sửa query getProgressingPeriod (API get-notification-period) để join thêm evaluation_tbl theo level và fallback về evaluation_period_tbl
---

# Bối cảnh

API: `api/v1/common/get-notification-period`

Vị trí code liên quan:
- Query gốc: `server/src/repository/evaluationPeriod.repository.ts` — hàm `getProgressingPeriod` (khoảng dòng 98-116)
- Nơi gọi: `server/src/services/evaluationPeriod.service.ts` — hàm `getNotificationPeriod` (dòng 61+), có dùng các field: `date_creation_goal_start`, `date_creation_goal_end`, `date_creation_goal_department_start`, `date_creation_goal_department_end`, `date_evaluation_start`, `date_evaluation_end`, `date_evaluation_department_start`, `date_evaluation_department_end`

# Query hiện tại

```sql
select *
from evaluation_period_tbl where ((TO_TIMESTAMP(date_creation_goal_start, 'YYYY/MM/DD') <= :today AND TO_TIMESTAMP(date_creation_goal_end, 'YYYY/MM/DD') >= :today)
or (TO_TIMESTAMP(date_evaluation_start, 'YYYY/MM/DD') <= :today AND TO_TIMESTAMP(date_evaluation_end, 'YYYY/MM/DD') >= :today)
or (TO_TIMESTAMP(date_creation_goal_department_start, 'YYYY/MM/DD') <= :today AND TO_TIMESTAMP(date_creation_goal_department_end, 'YYYY/MM/DD') >= :today)
or (TO_TIMESTAMP(date_evaluation_department_start, 'YYYY/MM/DD') <= :today AND TO_TIMESTAMP(date_evaluation_department_end, 'YYYY/MM/DD') >= :today))
and year in (date_part('year', now())::text, date_part('year', now() - interval '1 year')::text)
AND company_group_code = :companyGroupCode
```

# Các bảng liên quan

- `evaluation_period_tbl (id, date_creation_goal_start, date_creation_goal_end, date_evaluation_start, date_evaluation_end, date_creation_goal_department_start, date_creation_goal_department_end, date_evaluation_department_start, date_evaluation_department_end)`
- `evaluation_tbl (id, evaluation_period_id, date_creation_goal_start, date_creation_goal_end, date_evaluation_start, date_evaluation_end, user_id, creation_user, department_id, division_id, level)`
- `evaluation_period_department_setting_tbl (evaluation_period_id, department_id)`

# Kết quả mong muốn (các field output)

`date_creation_goal_department_start`, `date_creation_goal_department_end`, `date_creation_goal_start`, `date_creation_goal_end`, `date_evaluation_department_start`, `date_evaluation_department_end`, `date_evaluation_start`, `date_evaluation_end`

# Logic cần áp dụng

Nguồn dữ liệu ưu tiên là `evaluation_tbl` khi `evaluation_tbl.creation_user IS NOT NULL`, lấy các cột `date_creation_goal_start`, `date_creation_goal_end`, `date_evaluation_start`, `date_evaluation_end` của `evaluation_tbl` để gán vào kết quả theo điều kiện `level`:

1. Nếu `evaluation_tbl.level > 7`:
   - `date_creation_goal_department_start` = `evaluation_tbl.date_creation_goal_start`, nếu NULL thì lấy `evaluation_period_tbl.date_creation_goal_department_start`
   - `date_creation_goal_department_end` = `evaluation_tbl.date_creation_goal_end`, nếu NULL thì lấy `evaluation_period_tbl.date_creation_goal_department_end`
   - `date_evaluation_department_start` = `evaluation_tbl.date_evaluation_start`, nếu NULL thì lấy `evaluation_period_tbl.date_evaluation_department_start`
   - `date_evaluation_department_end` = `evaluation_tbl.date_evaluation_end`, nếu NULL thì lấy `evaluation_period_tbl.date_evaluation_department_end`
2. Nếu `evaluation_tbl.level <= 7`:
   - `date_creation_goal_start` = `evaluation_tbl.date_creation_goal_start`, nếu NULL thì lấy `evaluation_period_tbl.date_creation_goal_start`
   - `date_creation_goal_end` = `evaluation_tbl.date_creation_goal_end`, nếu NULL thì lấy `evaluation_period_tbl.date_creation_goal_end`
   - `date_evaluation_start` = `evaluation_tbl.date_evaluation_start`, nếu NULL thì lấy `evaluation_period_tbl.date_evaluation_start`
   - `date_evaluation_end` = `evaluation_tbl.date_evaluation_end`, nếu NULL thì lấy `evaluation_period_tbl.date_evaluation_end`
3. Nếu evaluation_tbl cột department_id JOIN đến bảng evaluation_period_department_setting_tbl tìm thấy id này và theo kỳ đánh giá hiện tại (evaluation_period_id) sẽ thực hiện lấy dữ liệu với điều kiện như mục 1 và 2
4. Nếu evaluation_tbl cột division_id JOIN đến bảng evaluation_period_department_setting_tbl tìm thấy id này và theo kỳ đánh giá hiện tại (evaluation_period_id) sẽ thực hiện lấy dữ liệu với điều kiện như mục 1 và 2

5. Chú ý thêm điều kiện evaluation_tbl tìm theo id user đang logic từ hệ thống. Ex user_id - 128
Nếu `evaluation_tbl.creation_user IS NULL  (không có bản ghi cá nhân tương ứng)` ,  và `không tìm thấy department_id hoặc division_id từ bảng evaluation`, `sẽ lấy toàn bộ 8 field kết quả lấy trực tiếp từ `evaluation_period_tbl` (giữ nguyên hành vi cũ).

Điều kiện WHERE lọc theo khoảng ngày (4 nhánh OR), điều kiện `year`, và `company_group_code = :companyGroupCode` giữ nguyên như query gốc — chỉ áp dụng trên `evaluation_period_tbl`, không lọc theo `evaluation_tbl`.

# Việc cần làm

1. Xác nhận với tôi cách JOIN `evaluation_tbl` vào query (nên LEFT JOIN theo `evaluation_period_id`; nếu cần lọc thêm theo `user_id`/`department_id` thì hỏi tôi trước vì requirement chưa nói rõ điều kiện join theo user hiện tại đang thực thi request).
2. Viết lại raw SQL trong `getProgressingPeriod` ở `server/src/repository/evaluationPeriod.repository.ts` dùng `COALESCE(...)` để implement fallback NULL, và `CASE WHEN level > 7 ... ELSE ... END` để tách theo level.
3. Kiểm tra `server/src/services/evaluationPeriod.service.ts` xem có cần cập nhật gì khi field trả về đổi tên/ý nghĩa không (hiện service đang đọc trực tiếp các field cùng tên từ `evaluation_period_tbl`).
4. Chạy/kiểm tra lại các test liên quan (nếu có) đến `getProgressingPeriod` / `getNotificationPeriod`.
