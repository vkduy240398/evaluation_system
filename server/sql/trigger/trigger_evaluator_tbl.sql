-- FUNCTION: public.trigger_evaluator_tbl()

-- DROP FUNCTION IF EXISTS public.trigger_evaluator_tbl();

CREATE OR REPLACE FUNCTION public.trigger_evaluator_tbl()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
BEGIN
    -- Khi DELETE
    IF TG_OP = 'DELETE' THEN
        CALL process_evaluator_delete(OLD.evaluation_id, OLD.evaluator_id, OLD.evaluation_order);
        RETURN OLD;
    END IF;

    -- Khi UPDATE
    IF TG_OP = 'UPDATE' THEN
        CALL process_evaluator_update(OLD.evaluation_id, OLD.evaluator_id, NEW.evaluator_id, OLD.evaluation_order);
        RETURN NEW;
    END IF;

    -- Khi INSERT
    IF TG_OP = 'INSERT' THEN
        CALL process_evaluator_insert(NEW.evaluation_id, NEW.evaluator_id, NEW.evaluation_order);
        RETURN NEW;
    END IF;

    RETURN NULL;
END;
$BODY$;

CREATE OR REPLACE TRIGGER evaluator_tbl_trigger
    AFTER INSERT OR DELETE OR UPDATE 
    ON public.evaluator_tbl
    FOR EACH ROW
    EXECUTE FUNCTION public.trigger_evaluator_tbl();

