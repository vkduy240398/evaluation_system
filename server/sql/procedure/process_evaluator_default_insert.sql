-- PROCEDURE: public.process_evaluator_default_insert(smallint, integer, text)

-- DROP PROCEDURE IF EXISTS public.process_evaluator_default_insert(smallint, integer, text);

CREATE OR REPLACE PROCEDURE public.process_evaluator_default_insert(
	IN user_id_input smallint,
	IN evaluation_period_id_input integer,
	IN company_group_code_input text)
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
    evaluation_id_rec bigint;
    evaluator_rec RECORD;
BEGIN
    -- Lấy evaluation_tbl.id
    FOR evaluation_id_rec IN 
        SELECT id 
        FROM evaluation_tbl 
        WHERE user_id = user_id_input 
          AND evaluation_period_id = evaluation_period_id_input 
          AND company_group_code = company_group_code_input 
          AND creation_user IS NOT NULL
    LOOP
        -- Lấy danh sách evaluator_id và evaluation_order từ evaluator_tbl
        FOR evaluator_rec IN 
            SELECT evaluator_id, evaluation_order 
            FROM evaluator_tbl 
            WHERE evaluation_id = evaluation_id_rec
        LOOP
            -- Gọi insert_setting_review cho từng evaluator_id
            CALL insert_setting_review_auto(user_id_input, evaluator_rec.evaluator_id, evaluator_rec.evaluation_order, evaluation_period_id_input, company_group_code_input);
        END LOOP;
    END LOOP;
END;
$BODY$;

