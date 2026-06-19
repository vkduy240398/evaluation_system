CREATE OR REPLACE FUNCTION update_evaluation_department_id()
RETURNS TRIGGER AS $$
DECLARE
    v_id INTEGER;
BEGIN
    -- Lấy id từ bảng evaluation_tbl
    SELECT e.id INTO v_id
    FROM evaluation_tbl e
    LEFT JOIN user_tbl u on u.id = e.user_id
    WHERE e.division_id = NEW.division_id
      AND e.level >= 8
      AND evaluation_period_id = NEW.evaluation_period_id
      AND EXISTS (
          SELECT 1 FROM user_tbl u WHERE u.id = NEW.user_id AND u.active = 1
      )
    ORDER BY e.level DESC, to_date(e.period_end, 'YYYY/MM') DESC, u.employee_number ASC
    LIMIT 1;
    -- Cập nhật evaluation_department_id nếu tìm thấy id
    IF v_id IS NOT NULL THEN
		  UPDATE evaluation_tbl SET evaluation_department_id = v_id WHERE id = NEW.id;
    ELSE 
      UPDATE evaluation_tbl SET evaluation_department_id = 0 WHERE id = NEW.id;
    END IF;
    RETURN NEW;
END;
$$
 LANGUAGE plpgsql;
CREATE TRIGGER set_evaluation_department_id
AFTER UPDATE OF status ON evaluation_tbl
FOR EACH ROW
WHEN (NEW.status = 100)
EXECUTE FUNCTION update_evaluation_department_id();