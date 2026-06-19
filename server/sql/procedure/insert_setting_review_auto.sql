-- PROCEDURE: public.insert_setting_review(smallint, smallint, numeric, integer, text)

-- DROP PROCEDURE IF EXISTS public.insert_setting_review(smallint, smallint, numeric, integer, text);

CREATE OR REPLACE PROCEDURE public.insert_setting_review_auto(
	IN user_id_input smallint,
	IN viewer_id_input smallint,
	IN order_input numeric,
	IN evaluation_period_id_input integer,
	IN company_group_code_input text)
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
    count_setting INT;
    last_evaluation_period_id INT;
	last_order NUMERIC; 
    default_period_number INT;
    eval_period_ids INT[];
    eval_period_id INT;
BEGIN
    -- Kiểm tra nếu có bản ghi có creation_type = 0 thì kết thúc xử lý
    SELECT COUNT(*) INTO count_setting
    FROM setting_review_tbl
    WHERE viewer_id = viewer_id_input
      AND user_id = user_id_input
      AND company_group_code = company_group_code_input
      AND creation_type = 0;

    IF count_setting > 0 THEN
        RETURN;
    END IF;

    -- Lấy evaluation_period_id gần nhất
    SELECT evaluation_period_id, "order" INTO last_evaluation_period_id, last_order
    FROM setting_review_tbl
    WHERE viewer_id = viewer_id_input
      AND user_id = user_id_input
      AND company_group_code = company_group_code_input
    ORDER BY evaluation_period_id DESC
    LIMIT 1;

    -- Kiểm tra điều kiện evaluation_period_id
    IF last_evaluation_period_id IS NOT NULL AND (last_evaluation_period_id >= evaluation_period_id_input OR (last_evaluation_period_id = evaluation_period_id_input - 1 AND last_order >= order_input)) THEN
        RETURN;
    END IF;

    -- Xóa bản ghi trong setting_review_tbl
    DELETE FROM setting_review_tbl
    WHERE viewer_id = viewer_id_input
      AND user_id = user_id_input
      AND company_group_code = company_group_code_input;

    -- Lấy số lượng period mặc định
    SELECT number INTO default_period_number
    FROM setting_default_period_viewing_tbl
    WHERE company_group_code = company_group_code_input;

    -- Lấy danh sách evaluation_period_tbl.id
    SELECT array_agg(id ORDER BY id DESC) 
	INTO eval_period_ids
	FROM (
		SELECT id 
		FROM evaluation_period_tbl
		WHERE id < evaluation_period_id_input
		  AND company_group_code = company_group_code_input
		ORDER BY id DESC
		LIMIT default_period_number
	) subquery;

   IF eval_period_ids IS NULL OR array_length(eval_period_ids, 1) IS NULL THEN
        RAISE NOTICE 'No IDs to process.';
        RETURN;
    END IF;

    -- Chèn dữ liệu vào setting_review_tbl
    FOREACH eval_period_id IN ARRAY eval_period_ids LOOP
        INSERT INTO setting_review_tbl (viewer_id, user_id, evaluation_period_id, type, company_group_code, "order", creation_type, created_time, updated_time)
        VALUES (viewer_id_input, user_id_input, eval_period_id, CASE WHEN order_input = 0.5 OR order_input = 1.0 THEN 5 ELSE 6 END, company_group_code_input, order_input, 1, now(), now());
    END LOOP;
END;
$BODY$;
