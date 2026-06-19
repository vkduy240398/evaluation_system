CREATE OR REPLACE FUNCTION trigger_delete_evaluation_tbl()
RETURNS TRIGGER AS $$
DECLARE
    rec RECORD;
BEGIN
    -- Lấy danh sách evaluation_id, evaluator_id, evaluation_order từ evaluator_tbl
    FOR rec IN 
        SELECT evaluation_id, evaluator_id, evaluation_order
        FROM evaluator_tbl
        WHERE evaluation_id = OLD.id
    LOOP
        -- Gọi procedure process_evaluator_delete cho từng bản ghi
        CALL process_evaluator_delete(rec.evaluation_id, rec.evaluator_id, rec.evaluation_order);
    END LOOP;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE TRIGGER evaluation_tbl_delete_trigger
    BEFORE DELETE
    ON public.evaluation_tbl
    FOR EACH ROW
    EXECUTE FUNCTION public.trigger_delete_evaluation_tbl();