-- PROCEDURE: public.process_evaluator_default_update(smallint, integer, text, smallint, smallint, numeric)

-- DROP PROCEDURE IF EXISTS public.process_evaluator_default_update(smallint, integer, text, smallint, smallint, numeric);

CREATE OR REPLACE PROCEDURE public.process_evaluator_default_update(
	IN user_id_input smallint,
	IN evaluation_period_id_input integer,
	IN company_group_code_input text,
	IN old_evaluator_id smallint,
	IN new_evaluator_id smallint,
	IN order_input numeric)
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
    eval_count INT;
BEGIN
    -- Kiểm tra nếu có evaluation_tbl.id tồn tại
    SELECT COUNT(*) INTO eval_count
    FROM evaluation_tbl
    WHERE user_id = user_id_input
      AND evaluation_period_id = evaluation_period_id_input
      AND company_group_code = company_group_code_input;

    IF eval_count > 0 THEN
        RETURN;
    END IF;

    -- Nếu cập nhật từ NULL thành giá trị mới
    IF old_evaluator_id IS NULL AND new_evaluator_id IS NOT NULL THEN
        CALL insert_setting_review_auto(user_id_input, new_evaluator_id, order_input, evaluation_period_id_input, company_group_code_input);
    END IF;

    -- Nếu cập nhật từ giá trị cũ thành giá trị mới
    IF old_evaluator_id IS NOT NULL AND new_evaluator_id IS NOT NULL AND old_evaluator_id <> new_evaluator_id THEN
        CALL delete_setting_review_auto(user_id_input, old_evaluator_id, order_input, evaluation_period_id_input, company_group_code_input, NULL);
        CALL insert_setting_review_auto(user_id_input, new_evaluator_id, order_input, evaluation_period_id_input, company_group_code_input);
    END IF;

    -- Nếu cập nhật từ giá trị cũ thành NULL
    IF old_evaluator_id IS NOT NULL AND new_evaluator_id IS NULL THEN
        CALL delete_setting_review_auto(user_id_input, old_evaluator_id, order_input, evaluation_period_id_input, company_group_code_input, NULL);
    END IF;
END;
$BODY$;

