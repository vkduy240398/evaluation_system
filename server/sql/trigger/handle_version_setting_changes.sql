CREATE OR REPLACE FUNCTION public.handle_version_setting_changes()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
DECLARE
    version_id_1_7 INT;
	version_id_8_10 INT;
    v_point INT;
    v_note TEXT;
    formula_id_1_7 INT;
	formula_id_8_10 INT;
    v_total_item INT;
    v_coefficient NUMERIC;
	version_id_common INT;
    v_company_group_code TEXT;

    -- Con trỏ để duyệt qua các bản ghi
    record_formula RECORD;
	record_formula_sub RECORD;
BEGIN
    -- Kiểm tra điều kiện cho INSERT
    IF TG_OP = 'UPDATE' AND NEW.status = 3 AND OLD.type IN (5) THEN
        IF TG_OP = 'UPDATE' THEN
            v_company_group_code := OLD.company_group_code;
        ELSE
            v_company_group_code := NEW.company_group_code;
        END IF;

		SELECT id INTO version_id_common FROM version_setting_tbl WHERE type = 5 AND status = 4 AND company_group_code = v_company_group_code;
	
		IF version_id_common IS NOT NULL THEN
			-- Lấy version_id từ version_setting_tbl
			SELECT id INTO version_id_1_7 
			FROM version_setting_tbl 
			WHERE type = 1 AND status = 4 AND company_group_code = v_company_group_code;

			-- Xóa dữ liệu cũ trong bảng setting_pro_formula_tbl và setting_pro_formula_sub_tbl
			DELETE FROM setting_pro_formula_tbl WHERE version_id = version_id_1_7;
			DELETE FROM setting_pro_formula_sub_tbl WHERE formula_id IN (SELECT id FROM setting_pro_formula_tbl WHERE version_id = version_id_1_7);

			SELECT id INTO version_id_8_10 
			FROM version_setting_tbl 
			WHERE type = 2 AND status = 4 AND company_group_code = v_company_group_code;

			DELETE FROM setting_pro_formula_tbl WHERE version_id = version_id_8_10;
			DELETE FROM setting_pro_formula_sub_tbl WHERE formula_id IN (SELECT id FROM setting_pro_formula_tbl WHERE version_id = version_id_8_10);

			-- Lấy thông tin từ setting_pro_formula_tbl với version_id tương ứng
			FOR record_formula IN 
				SELECT id, point, note 
				FROM setting_pro_formula_tbl 
				WHERE version_id = version_id_common
			LOOP
				v_point := record_formula.point;
				v_note := record_formula.note;

				-- Chèn dữ liệu mới vào bảng setting_pro_formula_tbl
				INSERT INTO setting_pro_formula_tbl (version_id, point, note) VALUES (version_id_1_7, v_point, v_note)
				RETURNING id INTO formula_id_1_7;

				INSERT INTO setting_pro_formula_tbl (version_id, point, note) VALUES (version_id_8_10, v_point, v_note)
				RETURNING id INTO formula_id_8_10;

				-- Lấy thông tin từ setting_pro_formula_sub_tbl để chèn vào
				FOR record_formula_sub IN 
					SELECT total_item, coefficient 
					FROM setting_pro_formula_sub_tbl 
					WHERE formula_id = record_formula.id
				LOOP
					v_total_item := record_formula_sub.total_item;
					v_coefficient := record_formula_sub.coefficient;

					-- Chèn dữ liệu vào bảng setting_pro_formula_sub_tbl
					INSERT INTO setting_pro_formula_sub_tbl (formula_id, total_item, coefficient) VALUES (formula_id_1_7, v_total_item, v_coefficient);

					INSERT INTO setting_pro_formula_sub_tbl (formula_id, total_item, coefficient) VALUES (formula_id_8_10, v_total_item, v_coefficient);
				END LOOP;
			END LOOP;
		END IF;
	ELSEIF (TG_OP = 'UPDATE' AND NEW.status = 4 AND OLD.type IN (1, 2)) OR (TG_OP = 'INSERT' AND NEW.status = 4 AND NEW.type IN (1, 2)) THEN
		IF TG_OP = 'UPDATE' THEN
            version_id_1_7 := OLD.id;
            v_company_group_code := OLD.company_group_code;
        ELSE
            version_id_1_7 := NEW.id;
            v_company_group_code := NEW.company_group_code;
        END IF;
        
        SELECT id INTO version_id_common FROM version_setting_tbl WHERE type = 5 AND status = 4 AND company_group_code = v_company_group_code;
	
		IF version_id_common IS NOT NULL THEN
			-- Xóa dữ liệu cũ trong bảng setting_pro_formula_tbl và setting_pro_formula_sub_tbl
			DELETE FROM setting_pro_formula_tbl WHERE version_id = version_id_1_7;
			DELETE FROM setting_pro_formula_sub_tbl WHERE formula_id IN (SELECT id FROM setting_pro_formula_tbl WHERE version_id = version_id_1_7);
			
			-- Lấy thông tin từ setting_pro_formula_tbl với version_id tương ứng
			FOR record_formula IN 
				SELECT id, point, note 
				FROM setting_pro_formula_tbl 
				WHERE version_id = version_id_common
			LOOP
				v_point := record_formula.point;
				v_note := record_formula.note;

				-- Chèn dữ liệu mới vào bảng setting_pro_formula_tbl
				INSERT INTO setting_pro_formula_tbl (version_id, point, note) VALUES (version_id_1_7, v_point, v_note)
				RETURNING id INTO formula_id_1_7;

				-- Lấy thông tin từ setting_pro_formula_sub_tbl để chèn vào
				FOR record_formula_sub IN 
					SELECT total_item, coefficient 
					FROM setting_pro_formula_sub_tbl 
					WHERE formula_id = record_formula.id
				LOOP
					v_total_item := record_formula_sub.total_item;
					v_coefficient := record_formula_sub.coefficient;

					-- Chèn dữ liệu vào bảng setting_pro_formula_sub_tbl
					INSERT INTO setting_pro_formula_sub_tbl (formula_id, total_item, coefficient) VALUES (formula_id_1_7, v_total_item, v_coefficient);
				END LOOP;
			END LOOP;
		END IF;
    END IF;

    RETURN NEW;
END;
$BODY$;

CREATE TRIGGER version_setting_trigger
AFTER INSERT OR UPDATE ON version_setting_tbl
FOR EACH ROW
EXECUTE PROCEDURE handle_version_setting_changes();
