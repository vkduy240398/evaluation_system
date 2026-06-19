-- ============================================================
-- Migration: Create evaluation_period_department_setting_tbl
-- Date: 2026-06-05
-- Entity: EvaluationPeriodDepartmentSetting
-- Description:
--   Bảng lưu cấu hình thời gian thực hiện đánh giá riêng theo
--   từng bộ phận/phòng ban cho mỗi kỳ đánh giá.
--   Khi có bản ghi này, các ngày trong bản ghi sẽ được ưu tiên
--   hơn cấu hình chung (全社設定) của evaluation_period_tbl.
--
--   Quy tắc ưu tiên áp dụng cho evaluation_tbl:
--     1. Cấu hình theo phòng ban (department - level ≤ 7)
--     2. Cấu hình theo bộ phận   (division  - level > 7)
--     3. Cấu hình chung toàn công ty (fallback)
-- ============================================================

-- Bước 1: Tạo bảng
CREATE TABLE IF NOT EXISTS evaluation_period_department_setting_tbl (
    id                                   SERIAL          NOT NULL,
    evaluation_period_id                 INTEGER         NOT NULL,
    department_id                        INTEGER         NOT NULL,
    company_group_code                   VARCHAR(20),

    -- 部門目標設定 (deptGoalSetting): Ngày thiết lập mục tiêu bộ phận
    date_creation_goal_department_start  VARCHAR(10),
    date_creation_goal_department_end    VARCHAR(10),

    -- 個人目標設定 (userGoalSetting): Ngày thiết lập mục tiêu cá nhân
    date_creation_goal_start             VARCHAR(10),
    date_creation_goal_end               VARCHAR(10),

    -- 部門評価 (deptEvaluation): Ngày đánh giá bộ phận
    date_evaluation_department_start     VARCHAR(10),
    date_evaluation_department_end       VARCHAR(10),

    -- 個人評価 (userEvaluation): Ngày đánh giá cá nhân
    date_evaluation_start                VARCHAR(10),
    date_evaluation_end                  VARCHAR(10),

    -- 0=未確認, 1=目標確定済, 2=評価完了
    check_fixed                          SMALLINT        NOT NULL DEFAULT 0,

    created_time                         TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_time                         TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    -- Primary key
    CONSTRAINT pk_evaluation_period_department_setting
        PRIMARY KEY (id),

    -- FK → evaluation_period_tbl
    CONSTRAINT fk_epds_evaluation_period
        FOREIGN KEY (evaluation_period_id)
        REFERENCES evaluation_period_tbl(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    -- FK → department_tbl
    CONSTRAINT fk_epds_department
        FOREIGN KEY (department_id)
        REFERENCES department_tbl(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    -- FK → company_group_tbl
    CONSTRAINT fk_epds_company_group
        FOREIGN KEY (company_group_code)
        REFERENCES company_group_tbl(code)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

-- Bước 2: Tạo các index
-- Index theo evaluation_period_id (dùng cho truy vấn list theo kỳ)
CREATE INDEX IF NOT EXISTS idx_epds_evaluation_period_id
    ON evaluation_period_department_setting_tbl(evaluation_period_id);

-- Index theo department_id
CREATE INDEX IF NOT EXISTS idx_epds_department_id
    ON evaluation_period_department_setting_tbl(department_id);

-- Unique index: mỗi kỳ chỉ có 1 cấu hình cho mỗi bộ phận
CREATE UNIQUE INDEX IF NOT EXISTS idx_epds_period_department_unique
    ON evaluation_period_department_setting_tbl(evaluation_period_id, department_id);

-- Bước 3: Comment mô tả bảng và cột
COMMENT ON TABLE evaluation_period_department_setting_tbl IS
    'Cấu hình thời gian thực hiện đánh giá riêng theo bộ phận/phòng ban cho từng kỳ đánh giá';

COMMENT ON COLUMN evaluation_period_department_setting_tbl.evaluation_period_id IS
    'FK → evaluation_period_tbl.id - Kỳ đánh giá áp dụng';

COMMENT ON COLUMN evaluation_period_department_setting_tbl.department_id IS
    'FK → department_tbl.id - Bộ phận/Phòng ban được cấu hình riêng';

COMMENT ON COLUMN evaluation_period_department_setting_tbl.company_group_code IS
    'FK → company_group_tbl.code - Mã công ty (multi-tenancy)';

COMMENT ON COLUMN evaluation_period_department_setting_tbl.date_creation_goal_department_start IS
    '部門目標設定 開始日 (format: YYYY/MM/DD)';

COMMENT ON COLUMN evaluation_period_department_setting_tbl.date_creation_goal_department_end IS
    '部門目標設定 終了日 (format: YYYY/MM/DD)';

COMMENT ON COLUMN evaluation_period_department_setting_tbl.date_creation_goal_start IS
    '個人目標設定 開始日 (format: YYYY/MM/DD)';

COMMENT ON COLUMN evaluation_period_department_setting_tbl.date_creation_goal_end IS
    '個人目標設定 終了日 (format: YYYY/MM/DD)';

COMMENT ON COLUMN evaluation_period_department_setting_tbl.date_evaluation_department_start IS
    '部門評価 開始日 (format: YYYY/MM/DD)';

COMMENT ON COLUMN evaluation_period_department_setting_tbl.date_evaluation_department_end IS
    '部門評価 終了日 (format: YYYY/MM/DD)';

COMMENT ON COLUMN evaluation_period_department_setting_tbl.date_evaluation_start IS
    '個人評価 開始日 (format: YYYY/MM/DD)';

COMMENT ON COLUMN evaluation_period_department_setting_tbl.date_evaluation_end IS
    '個人評価 終了日 (format: YYYY/MM/DD)';

COMMENT ON COLUMN evaluation_period_department_setting_tbl.check_fixed IS
    '確定フラグ: 0=未確認, 1=目標確定済, 2=評価完了';
