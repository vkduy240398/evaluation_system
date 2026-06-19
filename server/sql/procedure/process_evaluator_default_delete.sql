-- PROCEDURE: public.process_evaluator_default_delete(smallint, integer, text, smallint, numeric)

-- DROP PROCEDURE IF EXISTS public.process_evaluator_default_delete(smallint, integer, text, smallint, numeric);

CREATE OR REPLACE PROCEDURE public.process_evaluator_default_delete(
	IN user_id smallint,
	IN evaluation_period_id integer,
	IN company_group_code text,
	IN evaluator_id smallint,
	IN order_value numeric)
LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
    IF evaluator_id IS NOT NULL THEN
        CALL delete_setting_review_auto(user_id, evaluator_id, order_value, evaluation_period_id, company_group_code, NULL);
    END IF;
END;
$BODY$;
