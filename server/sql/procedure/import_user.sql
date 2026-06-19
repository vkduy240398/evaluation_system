-- PROCEDURE: public.import_user(text, integer, text, integer[], integer)

-- DROP PROCEDURE IF EXISTS public.import_user(text, integer, text, integer[], integer);

CREATE OR REPLACE PROCEDURE public.import_user(
	IN year_input text,
	IN period_index_input integer,
	IN current_date_input text,
	IN user_ids integer[],
	IN is_import integer,
	IN company_group_code_input text)
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
    data_evaluation_period RECORD;
    list_user RECORD;
	list_user_evaluation RECORD;
	list_skills RECORD;
    user_import_list JSONB := '[]';
	user_import_evaluation_list JSONB := '[]';
    list_skill_users JSONB := '[]';
	list_dep_div_id INT[];
    title_evaluation TEXT;
	current_date_check DATE;
	date_creation_goal_start DATE;
	date_creation_goal_end DATE;
	date_creation_goal_department_start DATE;
	date_creation_goal_department_end DATE;
BEGIN
    -- Lấy thông tin kỳ đánh giá
    SELECT * INTO data_evaluation_period
    FROM evaluation_period_tbl
    WHERE year = year_input AND period_index = period_index_input AND company_group_code = company_group_code_input;
	
    IF data_evaluation_period.id IS NOT NULL THEN
        -- Kiểm tra người dùng đã nhập chưa
        IF IS_IMPORT = 1 AND (SELECT COUNT(*) FROM evaluator_default_tbl WHERE evaluation_period_id = data_evaluation_period.id) > 0 THEN
            RAISE EXCEPTION 'Have user already import';
        ELSE
			-- Lấy danh sách người dùng có quyền F1
			FOR list_user IN
			SELECT
				u.id AS user_id,
				u.level AS level,
				dep.name AS department_name,
				dep.id AS department_id,
				div.name AS division_name,
				div.id AS division_id,
				u.flag_skill AS flag_skill
			FROM user_tbl u
				LEFT JOIN department_tbl dep on dep.id = u.department_id
				LEFT JOIN department_tbl div on div.id = u.division_id
				LEFT JOIN permission_tbl per on per.user_id = u.id
			WHERE per.role_id = 1 AND u.active = 1 AND u.company_group_code = company_group_code_input
				AND ((is_import = 0 AND u.id = ANY(user_ids) AND u.id NOT IN (SELECT user_id FROM evaluator_default_tbl WHERE evaluation_period_id = data_evaluation_period.id AND company_group_code = company_group_code_input)) OR is_import = 1)
			LOOP
				-- Thêm thông tin người dùng vào danh sách nhập
				user_import_list := user_import_list || jsonb_build_array(jsonb_build_object(
					'user_id', list_user.user_id,
					'evaluation_period_id', data_evaluation_period.id,
					'level', list_user.level,
					'department_name', list_user.department_name,
					'department_id', list_user.department_id,
					'division_name', list_user.division_name,
					'division_id', list_user.division_id,
					'flag_skill', list_user.flag_skill,
					'company_group_code', company_group_code_input
				));

				IF list_user.flag_skill = 1 THEN
					-- Khởi tạo mảng để lưu ID phòng ban và bộ phận
					list_dep_div_id := ARRAY[]::INT[];

					-- Lấy ID phòng ban và bộ phận
					IF list_user.department_id IS NOT NULL THEN
						list_dep_div_id := array_append(list_dep_div_id, list_user.department_id);
					END IF;

					IF list_user.division_id IS NOT NULL THEN
						list_dep_div_id := array_append(list_dep_div_id, list_user.division_id);
					END IF;

					-- Lấy danh sách kỹ năng dựa trên departmentId hoặc divisionId
					FOR list_skills IN
						SELECT skill_id
						FROM skill_group_tbl  -- Giả sử bảng chứa kỹ năng là skill_group_tbl
						WHERE department_id = ANY(list_dep_div_id)  -- Sử dụng ANY để kiểm tra trong mảng
					LOOP
						-- Thêm thông tin vào danh sách kỹ năng người dùng
						list_skill_users := list_skill_users || jsonb_build_array(jsonb_build_object(
							'user_id', list_user.user_id,
							'skill_id', list_skills.skill_id,
							'period_id', data_evaluation_period.id,
							'evaluation_id', NULL,
							'type', 0
						));
					END LOOP;
				END IF;
			END LOOP;

            -- Thêm người dùng vào bảng evaluator_default
            INSERT INTO evaluator_default_tbl (user_id, evaluation_period_id, level, department_name, department_id, division_name, division_id, flag_skill, company_group_code, created_time, updated_time)
            SELECT user_id,  -- Sử dụng đúng tên cột từ jsonb_to_recordset
					evaluation_period_id,
					level,
					department_name,
					department_id,
					division_name,
					division_id,
					flag_skill,
					company_group_code_input,
					NOW() AS created_time,  -- Thêm thời gian hiện tại cho created_time
					NOW() AS updated_time     -- Thêm thời gian hiện tại cho updated_time
			FROM jsonb_to_recordset(user_import_list) AS (user_id INT, evaluation_period_id INT, level INT, department_name TEXT, department_id INT, division_name TEXT, division_id INT, flag_skill INT, company_group_code TEXT);
			
			-- Xóa các bản ghi cũ trước khi chèn dữ liệu mới vào bảng skill_user_tbl
			DELETE FROM skill_user_tbl
			WHERE user_id IN (SELECT DISTINCT (user_id) FROM jsonb_to_recordset(list_skill_users) AS (user_id INT))
			  AND period_id = data_evaluation_period.id
			  AND evaluation_id IS NULL
			  AND type = 0;

			-- Chèn dữ liệu vào bảng skill_user_tbl
			INSERT INTO skill_user_tbl (user_id, skill_id, period_id, evaluation_id, type, created_time, updated_time)
			SELECT user_id, skill_id, period_id, evaluation_id, type, NOW() AS created_time, NOW() AS updated_time
			FROM jsonb_to_recordset(list_skill_users) AS (
				user_id INT,
				skill_id INT,
				period_id INT,
				evaluation_id INT,
				type INT
			);

            -- Tạo title cho các evaluation
            title_evaluation := CASE
                WHEN data_evaluation_period.period_index = 1 THEN
                    data_evaluation_period.year || '年上期'
                ELSE
                    data_evaluation_period.year || '年下期'
            END;

			current_date_check := TO_DATE(CURRENT_DATE_INPUT, 'YYYY/MM/DD');
			date_creation_goal_start := TO_DATE(data_evaluation_period.date_creation_goal_start, 'YYYY/MM/DD');
			date_creation_goal_end := TO_DATE(data_evaluation_period.date_creation_goal_end, 'YYYY/MM/DD');
			
			-- Lấy danh sách người dùng có quyền F1
			FOR list_user_evaluation IN
			SELECT
				u.id AS user_id,
				u.level AS level,
				dep.name AS department_name,
				dep.id AS department_id,
				div.name AS division_name,
				div.id AS division_id,
				u.flag_skill AS flag_skill
			FROM user_tbl u
				LEFT JOIN department_tbl dep on dep.id = u.department_id
				LEFT JOIN department_tbl div on div.id = u.division_id
				LEFT JOIN permission_tbl per on per.user_id = u.id
			WHERE per.role_id = 1 AND u.company_group_code = company_group_code_input AND u.active = 1
				AND NOT EXISTS (SELECT 1 FROM evaluation_tbl e WHERE e.user_id = u.id AND e.evaluation_period_id = data_evaluation_period.id)
				AND ((is_import = 0 AND u.id = ANY(user_ids)) OR is_import = 1)
			LOOP
				-- Thêm thông tin người dùng vào danh sách nhập
				user_import_evaluation_list := user_import_evaluation_list || jsonb_build_array(jsonb_build_object(
					'user_id', list_user_evaluation.user_id,
					'evaluation_period_id', data_evaluation_period.id,
					'level', list_user_evaluation.level,
					'department_name', list_user_evaluation.department_name,
					'department_id', list_user_evaluation.department_id,
					'division_name', list_user_evaluation.division_name,
					'division_id', list_user_evaluation.division_id,
					'flag_skill', list_user_evaluation.flag_skill
				));
			END LOOP;

			-- Gọi createEvaluation17 cho từng người dùng chưa được tạo đánh giá
			IF current_date_check BETWEEN date_creation_goal_start AND date_creation_goal_end THEN
				FOR list_user_evaluation IN SELECT * FROM jsonb_to_recordset(user_import_evaluation_list) AS (user_id INT, evaluation_period_id INT, level INT, department_name TEXT, department_id INT, division_name TEXT, division_id INT, flag_skill INT) LOOP
					IF list_user_evaluation.level >= 1 AND list_user_evaluation.level <= 7 THEN
						CALL create_evaluation_17(data_evaluation_period.id, title_evaluation, list_user_evaluation.user_id, company_group_code_input);
					END IF;
				END LOOP;
			END IF;

			date_creation_goal_department_start := TO_DATE(data_evaluation_period.date_creation_goal_department_start, 'YYYY/MM/DD');
			date_creation_goal_department_end := TO_DATE(data_evaluation_period.date_creation_goal_department_end, 'YYYY/MM/DD');

			-- Gọi createEvaluation810 cho từng người dùng chưa được tạo đánh giá
			IF current_date_check BETWEEN date_creation_goal_department_start AND date_creation_goal_department_end THEN
				FOR list_user_evaluation IN SELECT * FROM jsonb_to_recordset(user_import_evaluation_list) AS (user_id INT, evaluation_period_id INT, level INT, department_name TEXT, department_id INT, division_name TEXT, division_id INT, flag_skill INT) LOOP
					IF list_user_evaluation.level > 7 THEN
						CALL create_evaluation_810(data_evaluation_period.id, title_evaluation, list_user_evaluation.user_id, company_group_code_input);
					END IF;
				END LOOP;
			END IF;

        END IF;
    END IF;
END;
$BODY$;

-- PROCEDURE: public.create_evaluation_17(integer, text, integer)

-- DROP PROCEDURE IF EXISTS public.create_evaluation_17(integer, text, integer);

CREATE OR REPLACE PROCEDURE public.create_evaluation_17(
	IN evaluation_period_id integer,
	IN title text,
	IN user_id_input integer,
	IN company_group_code_input text)
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
    period_id_record RECORD;
    version_setting RECORD;
    guide_skill RECORD;
    guide_no_skill RECORD;
    user_info RECORD;
    level_setting RECORD;
	list_dep_div_id INT[];
	new_evaluation_id INTEGER;
	list_skills RECORD;
	list_skill_users JSONB := '[]';
BEGIN
    -- Lấy thông tin kỳ đánh giá
    SELECT * INTO period_id_record FROM evaluation_period_tbl WHERE id = evaluation_period_id;

    IF FOUND THEN
		
		-- Lấy thông tin người dùng
        SELECT
			u.id,
			dep.name AS department_name,
			div.name AS division_name,
			u.department_id,
			u.division_id,
			com.name AS company_name,
			u.level,
			u.flag_skill
		INTO user_info
        FROM user_tbl u
			LEFT JOIN department_tbl dep on dep.id = u.department_id
			LEFT JOIN department_tbl div on div.id = u.division_id
			LEFT JOIN company_tbl com on com.id = u.company_id
		WHERE u.id = user_id_input;

        -- Lấy thông tin version setting
        SELECT * INTO version_setting
        FROM version_setting_tbl WHERE company_group_code = company_group_code_input AND status = 4 AND type = CASE WHEN user_info.flag_skill = 1 THEN 1 ELSE 3 END;  -- Giả sử bảng chứa version settings

        -- Lấy thông tin hướng dẫn
        SELECT * INTO guide_skill
        FROM version_guide_evaluation_tbl WHERE company_group_code = company_group_code_input AND status = 4 AND type = CASE WHEN user_info.flag_skill = 1 THEN 1 ELSE 3 END;

        -- Kiểm tra xem có version setting không
        IF version_setting.id IS NOT NULL THEN
            SELECT * INTO level_setting
            FROM setting_level_tbl
            WHERE version_id = version_setting.id
              AND level = user_info.level;

			-- Chèn dữ liệu vào bảng đánh giá
        	INSERT INTO evaluation_tbl (title, user_id, department_name, division_name, department_id,
										division_id, company_name, period_start, period_end, status, level,
										evaluation_period_id, guide_version_id, skill_percent,
									    achievement_percent, behavior_percent, created_by_cronjob, flag_skill, created_time, updated_time, company_group_code)
					            VALUES (title, user_info.id, COALESCE(user_info.department_name, NULL), COALESCE(user_info.division_name, NULL),
									   user_info.department_id, user_info.division_id, user_info.company_name, period_id_record.period_start,
									   period_id_record.period_end, 0, user_info.level, period_id_record.id, guide_skill.id, COALESCE(level_setting.skill_percent, NULL),
									   COALESCE(level_setting.achievement_percent, NULL), COALESCE(level_setting.behavior_percent, NULL), 1, user_info.flag_skill, now(), now(), company_group_code_input)
			RETURNING id INTO new_evaluation_id;

			IF user_info.flag_skill = 1 THEN
				-- Khởi tạo mảng để lưu ID phòng ban và bộ phận
				list_dep_div_id := ARRAY[]::INT[];

				-- Lấy ID phòng ban và bộ phận
				IF user_info.department_id IS NOT NULL THEN
					list_dep_div_id := array_append(list_dep_div_id, user_info.department_id);
				END IF;

				IF user_info.division_id IS NOT NULL THEN
					list_dep_div_id := array_append(list_dep_div_id, user_info.division_id);
				END IF;

				-- Lấy danh sách kỹ năng dựa trên departmentId hoặc divisionId
				FOR list_skills IN
					SELECT skill_id
					FROM skill_group_tbl  -- Giả sử bảng chứa kỹ năng là skill_group_tbl
					WHERE department_id = ANY(list_dep_div_id)  -- Sử dụng ANY để kiểm tra trong mảng
				LOOP
					-- Thêm thông tin vào danh sách kỹ năng người dùng
					list_skill_users := list_skill_users || jsonb_build_array(jsonb_build_object(
						'user_id', user_id_input,
						'skill_id', list_skills.skill_id,
						'period_id', EVALUATION_PERIOD_ID,
						'evaluation_id', new_evaluation_id,
						'type', 0
					));
				END LOOP;

				-- Xóa các bản ghi cũ trước khi chèn dữ liệu mới vào bảng skill_user_tbl
				DELETE FROM skill_user_tbl
				WHERE user_id = user_id_input
				AND period_id = EVALUATION_PERIOD_ID
				AND evaluation_id = new_evaluation_id
				AND type = 0;

				-- Chèn dữ liệu vào bảng skill_user_tbl
				INSERT INTO skill_user_tbl (user_id, skill_id, period_id, evaluation_id, type)
				SELECT * FROM jsonb_to_recordset(list_skill_users) AS (
					user_id INT,
					skill_id INT,
					period_id INT,
					evaluation_id INT,
					type INT
				);
			END IF;
        ELSE
            RAISE EXCEPTION 'Version Setting is not found';
        END IF;
    ELSE
        RAISE EXCEPTION 'No evaluation period found with ID %.', evaluation_period_id;
    END IF;
END;
$BODY$;

-- PROCEDURE: public.create_evaluation_810(integer, text, integer)

-- DROP PROCEDURE IF EXISTS public.create_evaluation_810(integer, text, integer);

CREATE OR REPLACE PROCEDURE public.create_evaluation_810(
	IN evaluation_period_id integer,
	IN title text,
	IN user_id_input integer,
	IN company_group_code_input text)
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
    period_id_record RECORD;
    version_setting RECORD;
    guide_skill RECORD;
    guide_no_skill RECORD;
    user_info RECORD;
    level_setting RECORD;
	list_dep_div_id INT[];
	new_evaluation_id INTEGER;
	list_skills RECORD;
	list_skill_users JSONB := '[]';
BEGIN
    -- Lấy thông tin kỳ đánh giá
    SELECT * INTO period_id_record FROM evaluation_period_tbl WHERE id = evaluation_period_id;

    IF FOUND THEN
		-- Lấy thông tin người dùng
        SELECT
			u.id,
			dep.name AS department_name,
			div.name AS division_name,
			u.department_id,
			u.division_id,
			com.name AS company_name,
			u.level,
			u.flag_skill
		INTO user_info
        FROM user_tbl u
			LEFT JOIN department_tbl dep on dep.id = u.department_id
			LEFT JOIN department_tbl div on div.id = u.division_id
			LEFT JOIN company_tbl com on com.id = u.company_id
		WHERE u.id = user_id_input;
		
        -- Lấy thông tin version setting
        SELECT * INTO version_setting
        FROM version_setting_tbl WHERE company_group_code = company_group_code_input AND status = 4 AND type = CASE WHEN user_info.flag_skill = 1 THEN 2 ELSE 4 END;  -- Giả sử bảng chứa version settings

        -- Lấy thông tin hướng dẫn
        SELECT * INTO guide_skill
        FROM version_guide_evaluation_tbl WHERE company_group_code = company_group_code_input AND status = 4 AND type = CASE WHEN user_info.flag_skill = 1 THEN 2 ELSE 4 END;

        -- Kiểm tra xem có version setting không
        IF version_setting.id IS NOT NULL THEN
            SELECT * INTO level_setting
            FROM setting_level_tbl
            WHERE version_id = version_setting.id
              AND level = user_info.level;

			-- Chèn dữ liệu vào bảng đánh giá
        	INSERT INTO evaluation_tbl (title, user_id, department_name, division_name, department_id,
										division_id, company_name, period_start, period_end, status, level,
										evaluation_period_id, guide_version_id, skill_percent,
									    achievement_percent, behavior_percent, created_by_cronjob, flag_skill, created_time, updated_time, company_group_code)
					            VALUES (title, user_info.id, COALESCE(user_info.department_name, NULL), COALESCE(user_info.division_name, NULL),
									   user_info.department_id, user_info.division_id, user_info.company_name, period_id_record.period_start,
									   period_id_record.period_end, 0, user_info.level, period_id_record.id, guide_skill.id, COALESCE(level_setting.skill_percent, NULL),
									   COALESCE(level_setting.achievement_percent, NULL), COALESCE(level_setting.behavior_percent, NULL), 1, user_info.flag_skill, now(), now(), company_group_code_input)
			RETURNING id INTO new_evaluation_id;

			IF user_info.flag_skill = 1 THEN
				-- Khởi tạo mảng để lưu ID phòng ban và bộ phận
				list_dep_div_id := ARRAY[]::INT[];

				-- Lấy ID phòng ban và bộ phận
				IF user_info.department_id IS NOT NULL THEN
					list_dep_div_id := array_append(list_dep_div_id, user_info.department_id);
				END IF;

				IF user_info.division_id IS NOT NULL THEN
					list_dep_div_id := array_append(list_dep_div_id, user_info.division_id);
				END IF;

				-- Lấy danh sách kỹ năng dựa trên departmentId hoặc divisionId
				FOR list_skills IN
					SELECT skill_id
					FROM skill_group_tbl  -- Giả sử bảng chứa kỹ năng là skill_group_tbl
					WHERE department_id = ANY(list_dep_div_id)  -- Sử dụng ANY để kiểm tra trong mảng
				LOOP
					-- Thêm thông tin vào danh sách kỹ năng người dùng
					list_skill_users := list_skill_users || jsonb_build_array(jsonb_build_object(
						'user_id', user_id_input,
						'skill_id', list_skills.skill_id,
						'period_id', EVALUATION_PERIOD_ID,
						'evaluation_id', new_evaluation_id,
						'type', 0
					));
				END LOOP;

				-- Xóa các bản ghi cũ trước khi chèn dữ liệu mới vào bảng skill_user_tbl
				DELETE FROM skill_user_tbl
				WHERE user_id = user_id_input
				AND period_id = EVALUATION_PERIOD_ID
				AND evaluation_id = new_evaluation_id
				AND type = 0;

				-- Chèn dữ liệu vào bảng skill_user_tbl
				INSERT INTO skill_user_tbl (user_id, skill_id, period_id, evaluation_id, type)
				SELECT * FROM jsonb_to_recordset(list_skill_users) AS (
					user_id INT,
					skill_id INT,
					period_id INT,
					evaluation_id INT,
					type INT
				);
			END IF;
        ELSE
            RAISE EXCEPTION 'Version Setting is not found';
        END IF;
    ELSE
        RAISE EXCEPTION 'No evaluation period found with ID %.', evaluation_period_id;
    END IF;
END;
$BODY$;

