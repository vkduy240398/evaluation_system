
-- Xóa các type nếu thay đổi data
-- DROP TYPE IF EXISTS evaluation_period_type CASCADE;
-- DROP TYPE IF EXISTS role_evaluator_type CASCADE;
-- DROP TYPE IF EXISTS role_user_type CASCADE;

-- Định nghĩa kiểu dữ liệu cho evaluation_period_type
CREATE TYPE evaluation_period_type AS (
    year TEXT,
    period_index INTEGER
);

-- Định nghĩa kiểu dữ liệu cho role_evaluator_type (evaluator)
CREATE TYPE role_evaluator_type AS (
    userId INTEGER,
    "order" NUMERIC(2,1)
);

-- Định nghĩa kiểu dữ liệu cho role_user_type (user)
CREATE TYPE role_user_type AS (
    userId INTEGER
);

-- DROP PROCEDURE IF EXISTS PUBLIC.ADD_EDIT_SETTING_EVALUATION_REFERENCE (EVALUATION_PERIOD_TYPE[], ROLE_EVALUATOR_TYPE[], ROLE_USER_TYPE[], TEXT, TEXT, INTEGER, NUMERIC(2,1),TEXT)

CREATE OR REPLACE PROCEDURE public.add_edit_setting_evaluation_reference(
    list_year_and_period evaluation_period_type[],
    list_role_evaluator role_evaluator_type[],
    list_role_user role_user_type[],
    role TEXT,
    company_group_code_input TEXT,
    type INTEGER,
    order_value NUMERIC(2,1),
	type_register TEXT
)
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
    list_period_id INTEGER[] := '{}';
    evaluator_param RECORD;
    user_param RECORD;
	evaluation_period_param RECORD;
    period_id INTEGER;
    viewer_id INTEGER;
    user_id INTEGER;
BEGIN
    -- Lấy danh sách periodId
    FOREACH evaluation_period_param IN ARRAY list_year_and_period
    LOOP
        SELECT id INTO period_id
        FROM evaluation_period_tbl ept
        WHERE ept.year = (evaluation_period_param.year)::TEXT
          AND ept.period_index = (evaluation_period_param.period_index)::INTEGER
          AND ept.company_group_code = company_group_code_input;

        IF period_id IS NOT NULL THEN
            list_period_id := array_append(list_period_id, period_id);
        END IF;
    END LOOP;

    -- Xóa các bản ghi cũ
    FOREACH evaluator_param IN ARRAY list_role_evaluator
    LOOP
        FOREACH user_param IN ARRAY list_role_user
        LOOP
            DELETE FROM setting_review_tbl sr
            WHERE sr.viewer_id = (evaluator_param.userId)::INTEGER
              AND sr.user_id = (user_param.userId)::INTEGER
              AND sr.company_group_code = company_group_code_input;
        END LOOP;
    END LOOP;

    -- Thêm các bản ghi mới
    FOREACH evaluator_param IN ARRAY list_role_evaluator
    LOOP
        FOREACH user_param IN ARRAY list_role_user
        LOOP
            FOREACH period_id IN ARRAY list_period_id
            LOOP
                INSERT INTO setting_review_tbl (viewer_id, user_id, evaluation_period_id, type, "order", creation_type, company_group_code, created_time, updated_time)
                VALUES (
                    (evaluator_param.userId)::INTEGER,
                    (user_param.userId)::INTEGER,
                    period_id,
                    CASE
                        WHEN role = 'f5' THEN
                            CASE WHEN (evaluator_param.order) IN (0.5, 1.0) THEN 5 ELSE 6 END
                        ELSE type
                    END,
                    CASE
                        WHEN role = 'f5' THEN (evaluator_param.order)::NUMERIC(2,1)
                        ELSE order_value
                    END,
					CASE
                        WHEN type_register = 'auto' THEN 1
                        ELSE 0
                    END,
                    company_group_code_input,
					now(),
					now()
                );
            END LOOP;
        END LOOP;
    END LOOP;
END;
$BODY$;