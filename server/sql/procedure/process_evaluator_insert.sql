-- PROCEDURE: public.process_evaluator_insert(bigint, smallint, numeric)

-- DROP PROCEDURE IF EXISTS public.process_evaluator_insert(bigint, smallint, numeric);

CREATE OR REPLACE PROCEDURE public.process_evaluator_insert(
	IN evaluation_id_input bigint,
	IN evaluator_id_input smallint,
	IN evaluation_order_input numeric)
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
    user_id_input smallint;
    evaluation_period_id_input INT;
    company_group_code_input TEXT;
BEGIN
    -- Lấy thông tin từ evaluation_tbl
    SELECT user_id, evaluation_period_id, company_group_code 
    INTO user_id_input, evaluation_period_id_input, company_group_code_input
    FROM evaluation_tbl 
    WHERE id = evaluation_id_input;

    -- Nếu không tìm thấy evaluation_tbl, thoát khỏi procedure
    IF user_id_input IS NULL THEN
        RETURN;
    END IF;

    -- Gọi stored procedure để thêm mới setting_review_tbl
    CALL insert_setting_review_auto(user_id_input, evaluator_id_input, evaluation_order_input, evaluation_period_id_input, company_group_code_input);
END;
$BODY$;
