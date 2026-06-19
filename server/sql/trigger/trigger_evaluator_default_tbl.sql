-- FUNCTION: public.trigger_evaluator_default_tbl()

-- DROP FUNCTION IF EXISTS public.trigger_evaluator_default_tbl();

CREATE OR REPLACE FUNCTION public.trigger_evaluator_default_tbl()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
DECLARE
    eval_count INT;
BEGIN
	IF TG_OP = 'DELETE' THEN
        SELECT COUNT(*) INTO eval_count
        FROM evaluation_tbl
        WHERE user_id = OLD.user_id
          AND evaluation_period_id = OLD.evaluation_period_id
          AND company_group_code = OLD.company_group_code;

        IF eval_count > 0 THEN
            RETURN OLD;
        END IF;

        CALL process_evaluator_default_delete(OLD.user_id, OLD.evaluation_period_id, OLD.company_group_code, OLD.evaluator_0_5_id, 0.5);
        CALL process_evaluator_default_delete(OLD.user_id, OLD.evaluation_period_id, OLD.company_group_code, OLD.evaluator_1_id, 1.0);
        CALL process_evaluator_default_delete(OLD.user_id, OLD.evaluation_period_id, OLD.company_group_code, OLD.evaluator_2_id, 2.0);
    END IF;

    -- Khi INSERT
    IF TG_OP = 'INSERT' THEN
        CALL process_evaluator_default_insert(NEW.user_id, NEW.evaluation_period_id, NEW.company_group_code);
        RETURN NEW;
    END IF;

    -- Khi UPDATE các cột evaluator_0_5_id, evaluator_1_id, evaluator_2_id
    IF TG_OP = 'UPDATE' THEN
        CALL process_evaluator_default_update(NEW.user_id, NEW.evaluation_period_id, NEW.company_group_code, OLD.evaluator_0_5_id, NEW.evaluator_0_5_id, 0.5);
        CALL process_evaluator_default_update(NEW.user_id, NEW.evaluation_period_id, NEW.company_group_code, OLD.evaluator_1_id, NEW.evaluator_1_id, 1.0);
        CALL process_evaluator_default_update(NEW.user_id, NEW.evaluation_period_id, NEW.company_group_code, OLD.evaluator_2_id, NEW.evaluator_2_id, 2.0);
        RETURN NEW;
    END IF;

    RETURN NULL;
END;
$BODY$;

CREATE OR REPLACE TRIGGER evaluator_default_tbl_trigger
    AFTER INSERT OR UPDATE OR DELETE  
    ON public.evaluator_default_tbl
    FOR EACH ROW
    EXECUTE FUNCTION public.trigger_evaluator_default_tbl();

