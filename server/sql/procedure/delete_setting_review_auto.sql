-- PROCEDURE: public.delete_setting_review(smallint, smallint, numeric, integer, text, bigint)

-- DROP PROCEDURE IF EXISTS public.delete_setting_review(smallint, smallint, numeric, integer, text, bigint);

CREATE OR REPLACE PROCEDURE public.delete_setting_review_auto(
	IN user_id_input smallint,
	IN viewer_id_input smallint,
	IN order_input numeric,
	IN evaluation_period_id_input integer,
	IN company_group_code_input text,
	IN evaluation_id_input bigint)
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
    count_setting INT;
    last_evaluation_period_id INT;
    default_period_number INT;
    eval_period_ids INT[];
    eval_order FLOAT;
    eval_period_id INT;
    rec RECORD;
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
    SELECT evaluation_period_id INTO last_evaluation_period_id
    FROM setting_review_tbl
    WHERE viewer_id = viewer_id_input
      AND user_id = user_id_input
      AND company_group_code = company_group_code_input
      AND "order" = order_input
    ORDER BY evaluation_period_id DESC
    LIMIT 1;

    -- Kiểm tra điều kiện evaluation_period_id
    IF last_evaluation_period_id IS NULL OR last_evaluation_period_id <> evaluation_period_id_input - 1 THEN
        RETURN;
    END IF;

    -- Xóa bản ghi trong setting_review_tbl
    DELETE FROM setting_review_tbl
    WHERE viewer_id = viewer_id_input
      AND user_id = user_id_input
      AND company_group_code = company_group_code_input;

    -- Lấy dữ liệu evaluator
    FOR rec IN
        SELECT e_tbl.evaluation_period_id, ev_tbl.evaluation_order
        FROM evaluator_tbl ev_tbl
        JOIN evaluation_tbl e_tbl ON ev_tbl.evaluation_id = e_tbl.id
        WHERE ev_tbl.evaluator_id = viewer_id_input
          AND e_tbl.user_id = user_id_input
          AND e_tbl.company_group_code = company_group_code_input
          AND (e_tbl.evaluation_period_id <> evaluation_period_id_input
		  OR (e_tbl.evaluation_period_id = evaluation_period_id_input AND e_tbl.id <> evaluation_id_input))
        ORDER BY e_tbl.evaluation_period_id DESC, ev_tbl.evaluation_order DESC
        LIMIT 1
    LOOP
        eval_period_id := rec.evaluation_period_id;
        eval_order := rec.evaluation_order;

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
			WHERE id < eval_period_id
			  AND company_group_code = company_group_code_input
			ORDER BY id DESC
			LIMIT default_period_number
		) subquery;

        -- Chèn dữ liệu vào setting_review_tbl
        FOREACH eval_period_id IN ARRAY eval_period_ids LOOP
            INSERT INTO setting_review_tbl (viewer_id, user_id, evaluation_period_id, type, company_group_code, "order", creation_type, created_time, updated_time)
            VALUES (viewer_id_input, user_id_input, eval_period_id, CASE WHEN eval_order = 0.5 OR eval_order = 1.0 THEN 5 ELSE 6 END, company_group_code_input, eval_order, 1, now(), now());
        END LOOP;
    END LOOP;
END;
$BODY$;
