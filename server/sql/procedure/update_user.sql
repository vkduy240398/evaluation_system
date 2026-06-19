-- CREATE OR REPLACE PROCEDURE public.update_user(
-- 	IN user_id_input integer,
-- 	IN roles integer[],
-- 	IN is_change_role_f2 boolean,
-- 	IN is_change_role_f3 boolean,
-- 	IN is_change_role_f4 boolean,
-- 	IN type_change_role_f1 integer,
-- 	IN list_evaluator_evaluation_ids bigint[],
-- 	IN period_id_input integer,
-- 	IN radio_level_value integer,
-- 	IN company_id_input integer,
-- 	IN company_name_input text,
-- 	IN department_id_input integer,
-- 	IN department_name_input text,
-- 	IN division_id_input integer,
-- 	IN division_name_input text,
-- 	IN level_input integer,
-- 	IN level_old integer,
-- 	IN flag_skill_value integer,
-- 	IN old_flag_skill integer,
-- 	IN current_date_input text,
-- 	IN company_group_code_input text)
-- LANGUAGE 'plpgsql'
-- AS $BODY$
-- DECLARE
--     role_list JSON;
--     list_period_un_public INT[];
-- 	is_change_flag_skill BOOLEAN;
-- 	type_check INT;
-- 	check_count INT;
-- 	current_date_check DATE;
-- 	date_creation_goal_start DATE;
-- 	date_creation_goal_end DATE;
-- 	date_creation_goal_department_start DATE;
-- 	date_creation_goal_department_end DATE;
-- 	guide_evaluation RECORD;
-- 	setting_info RECORD;
-- 	list_dep_div_id INT[];
-- 	evaluation RECORD;
-- 	skill RECORD;
-- 	user_info RECORD;
-- 	-- Gap 1 fix: variables for date re-sync after dept/div change
-- 	new_effective_level INT;
-- 	new_dept_id_effective INT;
-- 	new_div_id_effective INT;
-- 	dept_date_setting RECORD;
-- 	period_date_setting RECORD;
-- BEGIN
-- 		-- xóa quyền F3
--         IF IS_CHANGE_ROLE_F3 THEN
--             DELETE FROM skill_role_tbl WHERE user_id = user_id_input AND role = 1;
--         END IF;

-- 		-- xóa quyền F4
--         IF IS_CHANGE_ROLE_F4 THEN
--             DELETE FROM skill_role_tbl WHERE user_id = user_id_input AND role = 2;
--         END IF;

-- 		-- Delete role rồi đăng ký lại
-- 		IF ROLES IS NOT NULL THEN
-- 			DELETE FROM permission_tbl WHERE user_id = USER_ID_INPUT AND ROLE_ID <> 9;
-- 			IF array_length(roles, 1) > 0 AND roles[1] <> 0 THEN
-- 				INSERT INTO permission_tbl (user_id, role_id, created_time, updated_time)
-- 				SELECT USER_ID_INPUT, r, now(), now()
-- 				FROM unnest(roles) AS r;
-- 			END IF;
-- 		END IF;

-- 		-- delete quyền F2 và F1
--         IF IS_CHANGE_ROLE_F2 OR TYPE_CHANGE_ROLE_F1 = 2 THEN
--             SELECT ARRAY_AGG(id) INTO list_period_un_public FROM evaluation_period_tbl WHERE company_group_code = company_group_code_input AND check_fixed <> 2;
--         END IF;

-- 		-- delete quyền F2 thì clear các quyền đánh giá của các kì chưa public
--         IF IS_CHANGE_ROLE_F2 THEN
-- 			IF LIST_EVALUATOR_EVALUATION_IDS IS NOT NULL THEN
-- 				-- Uncheck vai trò evaluator
-- 				DELETE FROM evaluator_tbl WHERE evaluation_id = (SELECT unnest(LIST_EVALUATOR_EVALUATION_IDS)) AND evaluator_id = user_id_input AND evaluation_order <> '2.0';
-- 			END IF;
			
--             UPDATE evaluator_default_tbl
--             SET evaluator_0_5_id = NULL, updated_time = now()
--             WHERE company_group_code = company_group_code_input AND evaluator_0_5_id = user_id_input AND evaluation_period_id IN (SELECT * FROM unnest(list_period_un_public));

--             UPDATE evaluator_default_tbl
--             SET evaluator_1_id = NULL, updated_time = now()
--             WHERE company_group_code = company_group_code_input AND evaluator_1_id = user_id_input AND evaluation_period_id IN (SELECT * FROM unnest(list_period_un_public));

--             UPDATE evaluator_default_tbl
--             SET evaluator_2_id = NULL, updated_time = now()
--             WHERE company_group_code = company_group_code_input AND evaluator_2_id = user_id_input AND evaluation_period_id IN (SELECT * FROM unnest(list_period_un_public));
--         END IF;

-- 		-- delete quyền F1 thì clear khỏi đối tượng đánh giá của các kỳ chưa public
--         IF TYPE_CHANGE_ROLE_F1 = 2 THEN
--             DELETE FROM evaluator_default_tbl
--             WHERE company_group_code = company_group_code_input AND user_id = user_id_input AND evaluation_period_id IN (SELECT * FROM unnest(list_period_un_public));
--         END IF;

-- 		-- xác định type theo flag_skill và level
-- 		IF FLAG_SKILL_VALUE = 1 THEN
-- 			type_check := CASE WHEN COALESCE(LEVEL_INPUT, level_old) > 7 THEN 2 ELSE 1 END;
-- 		ELSE
-- 			type_check := CASE WHEN COALESCE(LEVEL_INPUT, level_old) > 7 THEN 4 ELSE 3 END;
-- 		END IF;

-- 		-- get version setting public theo type và level
-- 		SELECT vs.id, sl.skill_percent, sl.behavior_percent, sl.achievement_percent INTO setting_info
-- 		FROM version_setting_tbl vs  -- Replace with your actual table name
-- 		LEFT JOIN setting_level_tbl sl ON vs.id = sl.version_id  -- Adjust join condition as necessary
-- 		WHERE company_group_code = company_group_code_input AND vs.type = type_check AND vs.status = 4 AND sl.level = COALESCE(LEVEL_INPUT, level_old);

-- 		-- Trường hợp không update evaluation_tbl
-- 		IF RADIO_LEVEL_VALUE <> -1 THEN
-- 			 -- Kiểm tra điều kiện isChangeFlagSkill
-- 			is_change_flag_skill := flag_skill_value <> old_flag_skill;

-- 			-- Lấy dữ liệu đánh giá theo user_id và period_id
-- 			FOR evaluation IN
-- 				SELECT e.*, ep.date_creation_goal_start AS period_date_creation_goal_start, ep.date_creation_goal_end AS period_date_creation_goal_end,
-- 					   ep.date_creation_goal_department_start, ep.date_creation_goal_department_end
-- 				FROM evaluation_tbl e -- Thay thế bằng bảng thực tế của bạn
-- 				LEFT JOIN evaluation_period_tbl ep ON ep.id = e.evaluation_period_id
-- 				WHERE e.evaluation_period_id = PERIOD_ID_INPUT
-- 				  AND e.user_id = USER_ID_INPUT
-- 				  AND e.level = level_old
-- 				  AND e.creation_user IS NULL
-- 				  AND e.status < 50
-- 				  AND e.company_group_code = company_group_code_input
-- 			LOOP
-- 				current_date_check := TO_DATE(CURRENT_DATE_INPUT, 'YYYY/MM/DD');
-- 				date_creation_goal_start := TO_DATE(COALESCE(evaluation.date_creation_goal_start, evaluation.period_date_creation_goal_start), 'YYYY/MM/DD');
-- 				date_creation_goal_end := TO_DATE(COALESCE(evaluation.date_creation_goal_end, evaluation.period_date_creation_goal_end), 'YYYY/MM/DD');
-- 				date_creation_goal_department_start := TO_DATE(COALESCE(evaluation.date_creation_goal_start, evaluation.date_creation_goal_department_start), 'YYYY/MM/DD');
-- 				date_creation_goal_department_end := TO_DATE(COALESCE(evaluation.date_creation_goal_end, evaluation.date_creation_goal_department_end), 'YYYY/MM/DD');

-- 				-- Chỉ cập nhật behavior nếu radioLevelvalue = 2
-- 				IF radio_level_value = 2 THEN
-- 					-- Update the level of the evaluation
-- 					UPDATE evaluation_tbl
--             		SET level = COALESCE(LEVEL_INPUT, level_old), updated_time = now()
--             		WHERE id = evaluation.id;

-- 					-- Update evaluator default information
-- 					UPDATE evaluator_default_tbl
-- 					SET level = COALESCE(LEVEL_INPUT, level_old), updated_time = now()
-- 					WHERE user_id = USER_ID_INPUT
-- 					  AND evaluation_period_id = PERIOD_ID_INPUT;

-- 					-- ③Behavior tự động update.
-- 					CALL update_evaluation_basic_behavior(evaluation.id, FLAG_SKILL_VALUE, COALESCE(LEVEL_INPUT, level_old), company_group_code_input);
					
-- 					-- Update evaluation percentages if newPercentList is found
-- 					IF setting_info.id IS NOT NULL THEN
-- 						UPDATE evaluation_tbl  -- Replace with your actual table name
-- 						SET skill_percent = COALESCE(setting_info.skill_percent, NULL),
-- 							behavior_percent = setting_info.behavior_percent,
-- 							achievement_percent = setting_info.achievement_percent,
-- 							updated_time = now()
-- 						WHERE id = evaluation.id;
-- 					END IF;

-- 				ELSIF radio_level_value = 1
-- 					AND ((LEVEL_OLD < 8 AND current_date_check BETWEEN date_creation_goal_start AND date_creation_goal_end)
-- 					OR (LEVEL_OLD > 7 AND current_date_check BETWEEN date_creation_goal_department_start AND date_creation_goal_department_end)) THEN

-- 					 -- Lấy thông tin guide setting public
-- 					SELECT vg.* INTO guide_evaluation
-- 					FROM version_guide_evaluation_tbl vg
-- 					WHERE vg.company_group_code = company_group_code_input AND vg.status = 4 AND vg.type = type_check;

-- 					-- Update evaluator default information
-- 					UPDATE evaluator_default_tbl  -- Replace with your actual table name
-- 					SET department_name = CASE WHEN DEPARTMENT_ID_INPUT = 0 THEN department_name ELSE DEPARTMENT_NAME_INPUT END,
-- 						level = COALESCE(LEVEL_INPUT, level_old),
-- 						flag_skill = flag_skill_value,
-- 						department_id = CASE WHEN DEPARTMENT_ID_INPUT = 0 THEN department_id ELSE DEPARTMENT_ID_INPUT END,
-- 						division_name = CASE WHEN DIVISION_ID_INPUT = 0 THEN division_name ELSE DIVISION_NAME_INPUT END,
-- 						division_id = CASE WHEN DIVISION_ID_INPUT = 0 THEN division_id ELSE DIVISION_ID_INPUT END,
-- 						updated_time = now()
-- 					WHERE user_id = USER_ID_INPUT
-- 					  AND evaluation_period_id = PERIOD_ID_INPUT
-- 					  AND company_group_code = company_group_code_input;

-- 					CALL process_user_skills(USER_ID_INPUT, PERIOD_ID_INPUT, evaluation.id, DIVISION_ID_INPUT, 
-- 											 DEPARTMENT_ID_INPUT, FLAG_SKILL_VALUE, OLD_FLAG_SKILL);

-- 					-- Update the evaluation record in the database
-- 					UPDATE evaluation_tbl
-- 					SET
-- 						level = COALESCE(LEVEL_INPUT, level_old),
-- 						division_id = CASE WHEN DIVISION_ID_INPUT = 0 THEN division_id ELSE DIVISION_ID_INPUT END,
-- 						division_name = CASE WHEN DIVISION_ID_INPUT = 0 THEN division_name ELSE DIVISION_NAME_INPUT END,
-- 						department_id = CASE WHEN DEPARTMENT_ID_INPUT = 0 THEN department_id ELSE DEPARTMENT_ID_INPUT END,
-- 						department_name = CASE WHEN DEPARTMENT_ID_INPUT = 0 THEN department_name ELSE DEPARTMENT_NAME_INPUT END,
-- 						company_name = CASE WHEN COMPANY_ID_INPUT = 0 THEN company_name ELSE COMPANY_NAME_INPUT END,
-- 						flag_skill = FLAG_SKILL_VALUE,

-- 						-- Set status and reset points
-- 						status = 0,
-- 						evaluation_department_id = NULL,
-- 						comment_user = NULL,
-- 						basic_pro_total_point_user = NULL,
-- 						basic_pro_total_point_evaluator_0_5 = NULL,
-- 						basic_pro_total_point_evaluator_1 = NULL,
-- 						basic_pro_total_point_evaluator_2 = NULL,
-- 						behavior_total_point_user = NULL,
-- 						behavior_total_point_evaluator_0_5 = NULL,
-- 						behavior_total_point_evaluator_1 = NULL,
-- 						behavior_total_point_evaluator_2 = NULL,
-- 						achievement_personal_total_point_user = NULL,
-- 						achievement_personal_total_point_evaluator_0_5 = NULL,
-- 						achievement_personal_total_point_evaluator_1 = NULL,
-- 						achievement_personal_total_point_evaluator_2 = NULL,
-- 						achievement_additional_total_point_user = NULL,
-- 						achievement_additional_total_point_evaluator_0_5 = NULL,
-- 						achievement_additional_total_point_evaluator_1 = NULL,
-- 						achievement_additional_total_point_evaluator_2 = NULL,
-- 						summary_char_point_user = NULL,
-- 						basic_total_point_user = NULL,
-- 						basic_total_point_evaluator_0_5 = NULL,
-- 						basic_total_point_evaluator_1 = NULL,
-- 						basic_total_point_evaluator_2 = NULL,
-- 						pro_total_point_user = NULL,
-- 						summary_point_user = NULL,
-- 						summary_point_evaluator_0_5 = NULL,
-- 						summary_point_evaluator_1 = NULL,
-- 						summary_point_evaluator_2 = NULL,
-- 						pro_total_point_evaluator_0_5 = NULL,
-- 						pro_total_point_evaluator_1 = NULL,
-- 						pro_total_point_evaluator_2 = NULL,

-- 						-- Set guide_version_id based on conditions
-- 						guide_version_id = guide_evaluation.id,
-- 						updated_time = now()

-- 					WHERE id = evaluation.id;

-- 					-- Only delete when there's a change in division or department, or level changes from 1-7 to 8-10 or vice versa
-- 					IF (DIVISION_ID_INPUT > 0 OR DEPARTMENT_ID_INPUT IS NULL OR DEPARTMENT_ID_INPUT > 0 OR
-- 						(LEVEL_INPUT >= 8 AND level_old < 8) OR 
-- 						(LEVEL_INPUT <= 7 AND level_old > 7)) THEN

-- 						IF (DIVISION_ID_INPUT > 0 OR DEPARTMENT_ID_INPUT IS NULL OR DEPARTMENT_ID_INPUT > 0) THEN
-- 							-- Delete records from evaluationAchievementPersonalSub where achievementPersonalId is null
-- 							DELETE FROM evaluation_achievement_personal_sub_tbl 
-- 							WHERE achievement_personal_id IS NULL;

-- 							-- Delete records from evaluationAchievementPersonalEntity based on evaluationId
-- 							DELETE FROM evaluation_achievement_personal_tbl 
-- 							WHERE evaluation_id = evaluation.id;
-- 						ELSIF (LEVEL_INPUT >= 8 AND level_old < 8) THEN
-- 							-- 1-7 sang 8-10 thì Mục tiêu cá nhân thành mục tiêu cá nhân(level 1-7) của tab 個人目標(level 8-10)
-- 							UPDATE evaluation_achievement_personal_tbl SET type = 2 WHERE evaluation_id = evaluation.id;
-- 						ELSIF (LEVEL_INPUT <= 7 AND level_old > 7) THEN
-- 							-- 8-10 sang 1-7 thì Mục tiêu cá nhân của tab 個人目標(level 8-10) giữ lại cho mục tiêu cá nhân (level 1-7)
-- 							UPDATE evaluation_achievement_personal_tbl SET type = 1 WHERE evaluation_id = evaluation.id and type = 2;

-- 							-- Delete muc tieu bo phan
-- 							DELETE FROM evaluation_achievement_personal_tbl WHERE evaluation_id = evaluation.id and type = 3;
-- 						END IF;

-- 						-- Delete evaluators associated with this evaluation
-- 						DELETE FROM evaluator_tbl 
-- 						WHERE evaluation_id = evaluation.id;

-- 						-- Update evaluatorDefaultEntity to set evaluator IDs to null
-- 						UPDATE evaluator_default_tbl 
-- 						SET 
-- 							evaluator_0_5_id = NULL,
-- 							evaluator_1_id = NULL,
-- 							evaluator_2_id = NULL,
-- 							updated_time = now()
-- 						WHERE company_group_code = company_group_code_input AND user_id = USER_ID_INPUT AND evaluation_period_id = PERIOD_ID_INPUT;

-- 						-- Delete records from evaluationPro based on evaluationId
-- 						DELETE FROM evaluation_pro_tbl
-- 						WHERE evaluation_id = evaluation.id;
-- 					ELSIF is_change_flag_skill THEN
-- 						-- If there's a change in flagSkill, delete records from evaluationPro
-- 						DELETE FROM evaluation_pro_tbl
-- 						WHERE evaluation_id = evaluation.id;
-- 					END IF;

-- 					DELETE FROM evaluation_basic_behavior_tbl
-- 					WHERE evaluation_id = evaluation.id;

-- 					DELETE FROM history_approve_evaluation_tbl
-- 					WHERE evaluation_id = evaluation.id;

-- 					IF (LEVEL_INPUT IS NOT NULL AND LEVEL_INPUT <> LEVEL_OLD) OR is_change_flag_skill THEN
-- 						-- Update evaluation percentages if newPercentList is found
-- 						IF setting_info.id IS NOT NULL THEN
-- 							UPDATE evaluation_tbl  -- Replace with your actual table name
-- 							SET skill_percent = COALESCE(setting_info.skill_percent, NULL),
-- 								behavior_percent = setting_info.behavior_percent,
-- 								achievement_percent = setting_info.achievement_percent,
-- 								updated_time = now()
-- 							WHERE id = evaluation.id;
-- 						END IF;
-- 					END IF;

-- 					-- Gap 1 fix: re-apply period dates from new dept/div setting.
-- 					-- Runs only when dept or div actually changed (DEPARTMENT_ID_INPUT > 0 or DIVISION_ID_INPUT > 0).
-- 					-- Already inside the radio_level_value=1 + time-gate block, so no extra time check needed.
-- 					IF (DIVISION_ID_INPUT > 0 OR DEPARTMENT_ID_INPUT > 0) THEN
-- 						-- Resolve effective IDs: prefer new input value, fall back to existing value in the RECORD
-- 						new_dept_id_effective := CASE WHEN DEPARTMENT_ID_INPUT > 0 THEN DEPARTMENT_ID_INPUT ELSE evaluation.department_id END;
-- 						new_div_id_effective  := CASE WHEN DIVISION_ID_INPUT  > 0 THEN DIVISION_ID_INPUT  ELSE evaluation.division_id  END;
-- 						new_effective_level   := COALESCE(LEVEL_INPUT, level_old);

-- 						-- Priority: phòng ban (department_id match) > bộ phận (division_id match)
-- 						SELECT epds.* INTO dept_date_setting
-- 						FROM evaluation_period_department_setting_tbl epds
-- 						WHERE epds.evaluation_period_id = PERIOD_ID_INPUT
-- 						  AND epds.company_group_code   = company_group_code_input
-- 						  AND epds.department_id = ANY(
-- 								ARRAY[new_dept_id_effective, new_div_id_effective]::int[]
-- 							  )
-- 						ORDER BY
-- 							CASE WHEN epds.department_id = new_dept_id_effective THEN 0 ELSE 1 END ASC
-- 						LIMIT 1;

-- 						-- Fetch 全社設定 as fallback for any NULL dept-specific date
-- 						SELECT ep.* INTO period_date_setting
-- 						FROM evaluation_period_tbl ep
-- 						WHERE ep.id = PERIOD_ID_INPUT;

-- 						-- Apply dates: level > 7 → 部門 columns; level ≤ 7 → 個人 columns
-- 						UPDATE evaluation_tbl SET
-- 							date_creation_goal_start = CASE
-- 								WHEN new_effective_level > 7
-- 									THEN COALESCE(dept_date_setting.date_creation_goal_department_start,
-- 												  period_date_setting.date_creation_goal_department_start)
-- 								ELSE COALESCE(dept_date_setting.date_creation_goal_start,
-- 											  period_date_setting.date_creation_goal_start)
-- 							END,
-- 							date_creation_goal_end = CASE
-- 								WHEN new_effective_level > 7
-- 									THEN COALESCE(dept_date_setting.date_creation_goal_department_end,
-- 												  period_date_setting.date_creation_goal_department_end)
-- 								ELSE COALESCE(dept_date_setting.date_creation_goal_end,
-- 											  period_date_setting.date_creation_goal_end)
-- 							END,
-- 							date_evaluation_start = CASE
-- 								WHEN new_effective_level > 7
-- 									THEN COALESCE(dept_date_setting.date_evaluation_department_start,
-- 												  period_date_setting.date_evaluation_department_start)
-- 								ELSE COALESCE(dept_date_setting.date_evaluation_start,
-- 											  period_date_setting.date_evaluation_start)
-- 							END,
-- 							date_evaluation_end = CASE
-- 								WHEN new_effective_level > 7
-- 									THEN COALESCE(dept_date_setting.date_evaluation_department_end,
-- 												  period_date_setting.date_evaluation_department_end)
-- 								ELSE COALESCE(dept_date_setting.date_evaluation_end,
-- 											  period_date_setting.date_evaluation_end)
-- 							END,
-- 							updated_time = now()
-- 						WHERE id = evaluation.id;
-- 					END IF;
-- 				END IF;
-- 			END LOOP;
-- 		ELSE
-- 			-- Kiểm tra xem có record thỏa điều kiện không
-- 			SELECT COUNT(*) INTO check_count
-- 			FROM evaluation_tbl e
-- 			LEFT JOIN evaluation_period_tbl ep ON ep.id = e.evaluation_period_id
-- 			WHERE e.evaluation_period_id = PERIOD_ID_INPUT
-- 			AND e.user_id = USER_ID_INPUT
-- 			AND e.company_group_code = company_group_code_input;

-- 			-- Nếu không có record thì mới xử lý
-- 			IF check_count = 0 THEN
-- 				CALL process_user_skills(USER_ID_INPUT, PERIOD_ID_INPUT, NULL, DIVISION_ID_INPUT, 
-- 										DEPARTMENT_ID_INPUT, FLAG_SKILL_VALUE, OLD_FLAG_SKILL);
-- 			END IF;
-- 		END IF;
		
-- 		UPDATE user_tbl 
--         SET 
--             department_id = CASE WHEN DEPARTMENT_ID_INPUT = 0 THEN department_id ELSE DEPARTMENT_ID_INPUT END,
--             division_id = CASE WHEN DIVISION_ID_INPUT = 0 THEN division_id ELSE DIVISION_ID_INPUT END,
--             company_id = CASE WHEN COMPANY_ID_INPUT = 0 THEN company_id ELSE COMPANY_ID_INPUT END,
--             level = COALESCE(LEVEL_INPUT, level_old),
--             flag_skill = flag_skill_value,
-- 			updated_time = now()
--         WHERE id = USER_ID_INPUT;
-- END;
-- $BODY$;

-- CREATE OR REPLACE PROCEDURE public.update_evaluation_basic_behavior(
-- 	IN evaluation_id_input bigint,
-- 	IN user_flag_skill integer,
-- 	IN level_input integer,
-- 	IN company_group_code_input text)
-- LANGUAGE 'plpgsql'
-- AS $BODY$
-- DECLARE
--     type_check INT;
--     behaviors RECORD;
-- 	item_no integer := 0;
-- BEGIN
--     -- Xóa các bản ghi behavior cũ
--     DELETE FROM evaluation_basic_behavior_tbl 
--     WHERE evaluation_id = evaluation_id_input AND type IN (2, 3, 5, 6);

--     -- Kiểm tra cờ kỹ năng của người dùng và xác định loại hành vi
--     IF user_flag_skill = 0 THEN
--         type_check := CASE WHEN level_input > 7 THEN 6 ELSE 3 END;
--     ELSE
--         type_check := CASE WHEN level_input > 7 THEN 5 ELSE 2 END;
--     END IF;

--     -- Truy vấn các hành vi cơ bản từ bảng listBasicBehaviorEntity
--     FOR behaviors IN
--         SELECT lb.*
--         FROM list_basic_behavior_tbl lb  -- Thay thế bằng bảng thực tế của bạn
--         RIGHT JOIN version_basic_behavior_tbl vb ON lb.version_id = vb.id
--         WHERE vb.company_group_code = company_group_code_input AND vb.status = 4 AND vb.level = level_input AND vb.type = type_check
--         ORDER BY lb.id_item ASC
--     LOOP
--         -- Thêm thông tin cần thiết vào behaviors và chèn vào bảng evaluationBasicBehaviorEntity
--         INSERT INTO evaluation_basic_behavior_tbl (evaluation_id, item_no, type, item_title, content, difficulty, created_time, updated_time) 
--         VALUES (evaluation_id_input, item_no, type_check, behaviors.title, behaviors.content, behaviors.difficulty, now(), now());
-- 		item_no := item_no + 1;
--     END LOOP;
-- END;
-- $BODY$;

-- CREATE OR REPLACE PROCEDURE process_user_skills(
--     IN USER_ID_INPUT integer,
--     IN PERIOD_ID_INPUT integer,
--     IN EVALUATION_ID_INPUT bigint,
--     IN DIVISION_ID_INPUT integer,
--     IN DEPARTMENT_ID_INPUT integer,
--     IN FLAG_SKILL_VALUE integer,
--     IN old_flag_skill integer
-- )
-- LANGUAGE plpgsql
-- AS $$
-- DECLARE
--     list_dep_div_id INT[] := ARRAY[]::INT[];
--     user_info RECORD;
--     skill RECORD;
-- BEGIN
--     -- Kiểm tra điều kiện
--     IF (DIVISION_ID_INPUT > 0 OR DEPARTMENT_ID_INPUT IS NULL OR DEPARTMENT_ID_INPUT > 0 OR FLAG_SKILL_VALUE <> OLD_FLAG_SKILL) THEN
--         -- Xóa dữ liệu cũ từ skill_user_tbl
--         DELETE FROM skill_user_tbl
--         WHERE user_id = USER_ID_INPUT
--           AND period_id = PERIOD_ID_INPUT
--           AND type = 0
--           AND (evaluation_id IS NULL OR evaluation_id = EVALUATION_ID_INPUT);

--         -- Nếu FLAG_SKILL_VALUE = 1 thì xử lý thêm kỹ năng
--         IF FLAG_SKILL_VALUE = 1 THEN
--             -- Lấy thông tin user
--             SELECT u.department_id, u.division_id INTO user_info
--             FROM user_tbl u
--             WHERE u.id = USER_ID_INPUT;

--             -- Thêm phòng ban vào danh sách
--             IF DEPARTMENT_ID_INPUT > 0 THEN
--                 list_dep_div_id := array_append(list_dep_div_id, DEPARTMENT_ID_INPUT);
--             ELSIF DEPARTMENT_ID_INPUT = 0 AND user_info.department_id IS NOT NULL THEN
--                 list_dep_div_id := array_append(list_dep_div_id, user_info.department_id);
--             END IF;

--             -- Thêm bộ phận vào danh sách
--             IF DIVISION_ID_INPUT > 0 THEN
--                 list_dep_div_id := array_append(list_dep_div_id, DIVISION_ID_INPUT);
--             ELSIF DIVISION_ID_INPUT = 0 AND user_info.division_id IS NOT NULL THEN
--                 list_dep_div_id := array_append(list_dep_div_id, user_info.division_id);
--             END IF;

--             -- Lặp qua các kỹ năng phù hợp và chèn vào skill_user_tbl
--             FOR skill IN SELECT skill_id FROM skill_group_tbl WHERE department_id = ANY(list_dep_div_id) LOOP
--                 INSERT INTO skill_user_tbl (user_id, skill_id, period_id, evaluation_id, type)
--                 VALUES (USER_ID_INPUT, skill.skill_id, PERIOD_ID_INPUT, NULL, 0);

--                 IF EVALUATION_ID_INPUT IS NOT NULL THEN
--                     INSERT INTO skill_user_tbl (user_id, skill_id, period_id, evaluation_id, type)
--                     VALUES (USER_ID_INPUT, skill.skill_id, PERIOD_ID_INPUT, EVALUATION_ID_INPUT, 0);
--                 END IF;
--             END LOOP;
--         END IF;
--     END IF;
-- END;
-- $$;


-- -- 


-- CREATE OR REPLACE PROCEDURE sp_update_user_permissions(p_roles_json JSONB)
-- LANGUAGE plpgsql
-- AS $$
-- DECLARE
--     v_user_id INT;
-- BEGIN
--     -- 1. Lấy userId từ phần tử đầu tiên trong mảng JSON để xác định user cần xóa role cũ
--     v_user_id := (p_roles_json->0->>'userId')::INT;

--     -- Kiểm tra nếu có dữ liệu hợp lệ thì mới xử lý
--     IF v_user_id IS NOT NULL THEN
        
--         -- 2. Xóa các role cũ của user này (Giống logic cũ của bạn, có thể thêm AND role_id <> 9 nếu cần)
--         DELETE FROM permission_tbl 
--         WHERE user_id = v_user_id;

--         -- 3. Giải nén mảng JSON và Insert toàn bộ danh sách role mới
--         INSERT INTO permission_tbl (user_id, role_id, created_time, updated_time)
--         SELECT 
--             (elem->>'userId')::INT,
--             (elem->>'roleId')::INT,
--             COALESCE((elem->>'createdTime')::TIMESTAMP, NOW()), -- Nếu không truyền createdTime sẽ lấy giờ hiện tại
--             NOW()
--         FROM jsonb_array_elements(p_roles_json) AS elem;
        
--     END IF;
-- END;
-- $$;


CREATE OR REPLACE PROCEDURE public.update_user(
	IN user_id_input integer,
	IN roles integer[],
	IN is_change_role_f2 boolean,
	IN is_change_role_f3 boolean,
	IN is_change_role_f4 boolean,
	IN type_change_role_f1 integer,
	IN list_evaluator_evaluation_ids bigint[],
	IN period_id_input integer,
	IN radio_level_value integer,
	IN company_id_input integer,
	IN company_name_input text,
	IN department_id_input integer,
	IN department_name_input text,
	IN division_id_input integer,
	IN division_name_input text,
	IN level_input integer,
	IN level_old integer,
	IN flag_skill_value integer,
	IN old_flag_skill integer,
	IN current_date_input text,
	IN company_group_code_input text)
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
    role_list JSON;
    list_period_un_public INT[];
	is_change_flag_skill BOOLEAN;
	type_check INT;
	check_count INT;
	current_date_check DATE;
	date_creation_goal_start DATE;
	date_creation_goal_end DATE;
	date_creation_goal_department_start DATE;
	date_creation_goal_department_end DATE;
	guide_evaluation RECORD;
	setting_info RECORD;
	list_dep_div_id INT[];
	evaluation RECORD;
	skill RECORD;
	user_info RECORD;
	-- Gap 1 fix: variables for date re-sync after dept/div change
	new_effective_level INT;
	new_dept_id_effective INT;
	new_div_id_effective INT;
	dept_date_setting RECORD;
	period_date_setting RECORD;
BEGIN
		-- xóa quyền F3
        IF IS_CHANGE_ROLE_F3 THEN
            DELETE FROM skill_role_tbl WHERE user_id = user_id_input AND role = 1;
        END IF;

		-- xóa quyền F4
        IF IS_CHANGE_ROLE_F4 THEN
            DELETE FROM skill_role_tbl WHERE user_id = user_id_input AND role = 2;
        END IF;

		-- Delete role rồi đăng ký lại
		IF ROLES IS NOT NULL THEN
			DELETE FROM permission_tbl WHERE user_id = USER_ID_INPUT AND ROLE_ID <> 9;
			IF array_length(roles, 1) > 0 AND roles[1] <> 0 THEN
				INSERT INTO permission_tbl (user_id, role_id, created_time, updated_time)
				SELECT USER_ID_INPUT, r, now(), now()
				FROM unnest(roles) AS r;
			END IF;
		END IF;

		-- delete quyền F2 và F1
        IF IS_CHANGE_ROLE_F2 OR TYPE_CHANGE_ROLE_F1 = 2 THEN
            SELECT ARRAY_AGG(id) INTO list_period_un_public FROM evaluation_period_tbl WHERE company_group_code = company_group_code_input AND check_fixed <> 2;
        END IF;

		-- delete quyền F2 thì clear các quyền đánh giá của các kì chưa public
        IF IS_CHANGE_ROLE_F2 THEN
			IF LIST_EVALUATOR_EVALUATION_IDS IS NOT NULL THEN
				-- Uncheck vai trò evaluator
				DELETE FROM evaluator_tbl WHERE evaluation_id = (SELECT unnest(LIST_EVALUATOR_EVALUATION_IDS)) AND evaluator_id = user_id_input AND evaluation_order <> '2.0';
			END IF;
			
            UPDATE evaluator_default_tbl
            SET evaluator_0_5_id = NULL, updated_time = now()
            WHERE company_group_code = company_group_code_input AND evaluator_0_5_id = user_id_input AND evaluation_period_id IN (SELECT * FROM unnest(list_period_un_public));

            UPDATE evaluator_default_tbl
            SET evaluator_1_id = NULL, updated_time = now()
            WHERE company_group_code = company_group_code_input AND evaluator_1_id = user_id_input AND evaluation_period_id IN (SELECT * FROM unnest(list_period_un_public));

            UPDATE evaluator_default_tbl
            SET evaluator_2_id = NULL, updated_time = now()
            WHERE company_group_code = company_group_code_input AND evaluator_2_id = user_id_input AND evaluation_period_id IN (SELECT * FROM unnest(list_period_un_public));
        END IF;

		-- delete quyền F1 thì clear khỏi đối tượng đánh giá của các kỳ chưa public
        IF TYPE_CHANGE_ROLE_F1 = 2 THEN
            DELETE FROM evaluator_default_tbl
            WHERE company_group_code = company_group_code_input AND user_id = user_id_input AND evaluation_period_id IN (SELECT * FROM unnest(list_period_un_public));
        END IF;

		-- xác định type theo flag_skill và level
		IF FLAG_SKILL_VALUE = 1 THEN
			type_check := CASE WHEN COALESCE(LEVEL_INPUT, level_old) > 7 THEN 2 ELSE 1 END;
		ELSE
			type_check := CASE WHEN COALESCE(LEVEL_INPUT, level_old) > 7 THEN 4 ELSE 3 END;
		END IF;

		-- get version setting public theo type và level
		SELECT vs.id, sl.skill_percent, sl.behavior_percent, sl.achievement_percent INTO setting_info
		FROM version_setting_tbl vs  -- Replace with your actual table name
		LEFT JOIN setting_level_tbl sl ON vs.id = sl.version_id  -- Adjust join condition as necessary
		WHERE company_group_code = company_group_code_input AND vs.type = type_check AND vs.status = 4 AND sl.level = COALESCE(LEVEL_INPUT, level_old);

		-- Trường hợp không update evaluation_tbl
		IF RADIO_LEVEL_VALUE <> -1 THEN
			 -- Kiểm tra điều kiện isChangeFlagSkill
			is_change_flag_skill := flag_skill_value <> old_flag_skill;

			-- Lấy dữ liệu đánh giá theo user_id và period_id
			FOR evaluation IN
				SELECT e.*, ep.date_creation_goal_start AS period_date_creation_goal_start, ep.date_creation_goal_end AS period_date_creation_goal_end,
					   ep.date_creation_goal_department_start, ep.date_creation_goal_department_end
				FROM evaluation_tbl e -- Thay thế bằng bảng thực tế của bạn
				LEFT JOIN evaluation_period_tbl ep ON ep.id = e.evaluation_period_id
				WHERE e.evaluation_period_id = PERIOD_ID_INPUT
				  AND e.user_id = USER_ID_INPUT
				  AND e.level = level_old
				  AND e.creation_user IS NULL
				  AND e.status < 50
				  AND e.company_group_code = company_group_code_input
			LOOP
				current_date_check := TO_DATE(CURRENT_DATE_INPUT, 'YYYY/MM/DD');
				date_creation_goal_start := TO_DATE(COALESCE(evaluation.date_creation_goal_start, evaluation.period_date_creation_goal_start), 'YYYY/MM/DD');
				date_creation_goal_end := TO_DATE(COALESCE(evaluation.date_creation_goal_end, evaluation.period_date_creation_goal_end), 'YYYY/MM/DD');
				date_creation_goal_department_start := TO_DATE(COALESCE(evaluation.date_creation_goal_start, evaluation.date_creation_goal_department_start), 'YYYY/MM/DD');
				date_creation_goal_department_end := TO_DATE(COALESCE(evaluation.date_creation_goal_end, evaluation.date_creation_goal_department_end), 'YYYY/MM/DD');

				-- Chỉ cập nhật behavior nếu radioLevelvalue = 2
				IF radio_level_value = 2 THEN
					-- Update the level of the evaluation
					UPDATE evaluation_tbl
        		SET level = COALESCE(LEVEL_INPUT, level_old), updated_time = now()
        		WHERE id = evaluation.id;

					-- Update evaluator default information
					UPDATE evaluator_default_tbl
					SET level = COALESCE(LEVEL_INPUT, level_old), updated_time = now()
					WHERE user_id = USER_ID_INPUT
					  AND evaluation_period_id = PERIOD_ID_INPUT;

					-- ③Behavior tự động update.
					CALL update_evaluation_basic_behavior(evaluation.id, FLAG_SKILL_VALUE, COALESCE(LEVEL_INPUT, level_old), company_group_code_input);
					
					-- Update evaluation percentages if newPercentList is found
					IF setting_info.id IS NOT NULL THEN
						UPDATE evaluation_tbl  -- Replace with your actual table name
						SET skill_percent = COALESCE(setting_info.skill_percent, NULL),
							behavior_percent = setting_info.behavior_percent,
							achievement_percent = setting_info.achievement_percent,
							updated_time = now()
						WHERE id = evaluation.id;
					END IF;

				ELSIF radio_level_value = 1
					AND ((LEVEL_OLD < 8 AND current_date_check BETWEEN date_creation_goal_start AND date_creation_goal_end)
					OR (LEVEL_OLD > 7 AND current_date_check BETWEEN date_creation_goal_department_start AND date_creation_goal_department_end)) THEN

					 -- Lấy thông tin guide setting public
					SELECT vg.* INTO guide_evaluation
					FROM version_guide_evaluation_tbl vg
					WHERE vg.company_group_code = company_group_code_input AND vg.status = 4 AND vg.type = type_check;

					-- Update evaluator default information
					UPDATE evaluator_default_tbl  -- Replace with your actual table name
					SET department_name = CASE WHEN DEPARTMENT_ID_INPUT = 0 THEN department_name ELSE DEPARTMENT_NAME_INPUT END,
						level = COALESCE(LEVEL_INPUT, level_old),
						flag_skill = flag_skill_value,
						department_id = CASE WHEN DEPARTMENT_ID_INPUT = 0 THEN department_id ELSE DEPARTMENT_ID_INPUT END,
						division_name = CASE WHEN DIVISION_ID_INPUT = 0 THEN division_name ELSE DIVISION_NAME_INPUT END,
						division_id = CASE WHEN DIVISION_ID_INPUT = 0 THEN division_id ELSE DIVISION_ID_INPUT END,
						updated_time = now()
					WHERE user_id = USER_ID_INPUT
					  AND evaluation_period_id = PERIOD_ID_INPUT
					  AND company_group_code = company_group_code_input;

					CALL process_user_skills(USER_ID_INPUT, PERIOD_ID_INPUT, evaluation.id, DIVISION_ID_INPUT, 
											 DEPARTMENT_ID_INPUT, FLAG_SKILL_VALUE, OLD_FLAG_SKILL);

					-- Update the evaluation record in the database
					UPDATE evaluation_tbl
					SET
						level = COALESCE(LEVEL_INPUT, level_old),
						division_id = CASE WHEN DIVISION_ID_INPUT = 0 THEN division_id ELSE DIVISION_ID_INPUT END,
						division_name = CASE WHEN DIVISION_ID_INPUT = 0 THEN division_name ELSE DIVISION_NAME_INPUT END,
						department_id = CASE WHEN DEPARTMENT_ID_INPUT = 0 THEN department_id ELSE DEPARTMENT_ID_INPUT END,
						department_name = CASE WHEN DEPARTMENT_ID_INPUT = 0 THEN department_name ELSE DEPARTMENT_NAME_INPUT END,
						company_name = CASE WHEN COMPANY_ID_INPUT = 0 THEN company_name ELSE COMPANY_NAME_INPUT END,
						flag_skill = FLAG_SKILL_VALUE,

						-- Set status and reset points
						status = 0,
						evaluation_department_id = NULL,
						comment_user = NULL,
						basic_pro_total_point_user = NULL,
						basic_pro_total_point_evaluator_0_5 = NULL,
						basic_pro_total_point_evaluator_1 = NULL,
						basic_pro_total_point_evaluator_2 = NULL,
						behavior_total_point_user = NULL,
						behavior_total_point_evaluator_0_5 = NULL,
						behavior_total_point_evaluator_1 = NULL,
						behavior_total_point_evaluator_2 = NULL,
						achievement_personal_total_point_user = NULL,
						achievement_personal_total_point_evaluator_0_5 = NULL,
						achievement_personal_total_point_evaluator_1 = NULL,
						achievement_personal_total_point_evaluator_2 = NULL,
						achievement_additional_total_point_user = NULL,
						achievement_additional_total_point_evaluator_0_5 = NULL,
						achievement_additional_total_point_evaluator_1 = NULL,
						achievement_additional_total_point_evaluator_2 = NULL,
						summary_char_point_user = NULL,
						basic_total_point_user = NULL,
						basic_total_point_evaluator_0_5 = NULL,
						basic_total_point_evaluator_1 = NULL,
						basic_total_point_evaluator_2 = NULL,
						pro_total_point_user = NULL,
						summary_point_user = NULL,
						summary_point_evaluator_0_5 = NULL,
						summary_point_evaluator_1 = NULL,
						summary_point_evaluator_2 = NULL,
						pro_total_point_evaluator_0_5 = NULL,
						pro_total_point_evaluator_1 = NULL,
						pro_total_point_evaluator_2 = NULL,

						-- Set guide_version_id based on conditions
						guide_version_id = guide_evaluation.id,
						updated_time = now()

					WHERE id = evaluation.id;

					-- Only delete when there's a change in division or department, or level changes from 1-7 to 8-10 or vice versa
					IF (DIVISION_ID_INPUT > 0 OR DEPARTMENT_ID_INPUT IS NULL OR DEPARTMENT_ID_INPUT > 0 OR
						(LEVEL_INPUT >= 8 AND level_old < 8) OR 
						(LEVEL_INPUT <= 7 AND level_old > 7)) THEN

						IF (DIVISION_ID_INPUT > 0 OR DEPARTMENT_ID_INPUT IS NULL OR DEPARTMENT_ID_INPUT > 0) THEN
							-- Delete records from evaluationAchievementPersonalSub where achievementPersonalId is null
							DELETE FROM evaluation_achievement_personal_sub_tbl 
							WHERE achievement_personal_id IS NULL;

							-- Delete records from evaluationAchievementPersonalEntity based on evaluationId
							DELETE FROM evaluation_achievement_personal_tbl 
							WHERE evaluation_id = evaluation.id;
						ELSIF (LEVEL_INPUT >= 8 AND level_old < 8) THEN
							-- 1-7 sang 8-10 thì Mục tiêu cá nhân thành mục tiêu cá nhân(level 1-7) của tab 個人目標(level 8-10)
							UPDATE evaluation_achievement_personal_tbl SET type = 2 WHERE evaluation_id = evaluation.id;
						ELSIF (LEVEL_INPUT <= 7 AND level_old > 7) THEN
							-- 8-10 sang 1-7 thì Mục tiêu cá nhân của tab 個人目標(level 8-10) giữ lại cho mục tiêu cá nhân (level 1-7)
							UPDATE evaluation_achievement_personal_tbl SET type = 1 WHERE evaluation_id = evaluation.id and type = 2;

							-- Delete muc tieu bo phan
							DELETE FROM evaluation_achievement_personal_tbl WHERE evaluation_id = evaluation.id and type = 3;
						END IF;

						-- Delete evaluators associated with this evaluation
						DELETE FROM evaluator_tbl 
						WHERE evaluation_id = evaluation.id;

						-- Update evaluatorDefaultEntity to set evaluator IDs to null
						UPDATE evaluator_default_tbl 
						SET 
							evaluator_0_5_id = NULL,
							evaluator_1_id = NULL,
							evaluator_2_id = NULL,
							updated_time = now()
						WHERE company_group_code = company_group_code_input AND user_id = USER_ID_INPUT AND evaluation_period_id = PERIOD_ID_INPUT;

						-- Delete records from evaluationPro based on evaluationId
						DELETE FROM evaluation_pro_tbl
						WHERE evaluation_id = evaluation.id;
					ELSIF is_change_flag_skill THEN
						-- If there's a change in flagSkill, delete records from evaluationPro
						DELETE FROM evaluation_pro_tbl
						WHERE evaluation_id = evaluation.id;
					END IF;

					DELETE FROM evaluation_basic_behavior_tbl
					WHERE evaluation_id = evaluation.id;

					DELETE FROM history_approve_evaluation_tbl
					WHERE evaluation_id = evaluation.id;

					IF (LEVEL_INPUT IS NOT NULL AND LEVEL_INPUT <> LEVEL_OLD) OR is_change_flag_skill THEN
						-- Update evaluation percentages if newPercentList is found
						IF setting_info.id IS NOT NULL THEN
							UPDATE evaluation_tbl  -- Replace with your actual table name
							SET skill_percent = COALESCE(setting_info.skill_percent, NULL),
								behavior_percent = setting_info.behavior_percent,
								achievement_percent = setting_info.achievement_percent,
								updated_time = now()
							WHERE id = evaluation.id;
						END IF;
					END IF;

					-- Gap 1 fix: re-apply period dates from new dept/div setting.
					-- Runs only when dept or div actually changed (DEPARTMENT_ID_INPUT > 0 or DIVISION_ID_INPUT > 0).
					-- Already inside the radio_level_value=1 + time-gate block, so no extra time check needed.
					IF (DIVISION_ID_INPUT > 0 OR DEPARTMENT_ID_INPUT > 0) THEN
						-- Resolve effective IDs: prefer new input value, fall back to existing value in the RECORD
						new_dept_id_effective := CASE WHEN DEPARTMENT_ID_INPUT > 0 THEN DEPARTMENT_ID_INPUT ELSE evaluation.department_id END;
						new_div_id_effective  := CASE WHEN DIVISION_ID_INPUT  > 0 THEN DIVISION_ID_INPUT  ELSE evaluation.division_id  END;
						new_effective_level   := COALESCE(LEVEL_INPUT, level_old);

						-- Priority: phòng ban (department_id match) > bộ phận (division_id match)
						SELECT epds.* INTO dept_date_setting
						FROM evaluation_period_department_setting_tbl epds
						WHERE epds.evaluation_period_id = PERIOD_ID_INPUT
						  AND epds.company_group_code   = company_group_code_input
						  AND epds.department_id = ANY(
								ARRAY[new_dept_id_effective, new_div_id_effective]::int[]
							  )
						ORDER BY
							CASE WHEN epds.department_id = new_dept_id_effective THEN 0 ELSE 1 END ASC
						LIMIT 1;

						-- Fetch 全社設定 as fallback for any NULL dept-specific date
						SELECT ep.* INTO period_date_setting
						FROM evaluation_period_tbl ep
						WHERE ep.id = PERIOD_ID_INPUT;

						-- Apply dates: level > 7 → 部門 columns; level ≤ 7 → 個人 columns
						UPDATE evaluation_tbl SET
							date_creation_goal_start = CASE
								WHEN new_effective_level > 7
									THEN COALESCE(dept_date_setting.date_creation_goal_department_start,
												  period_date_setting.date_creation_goal_department_start)
								ELSE COALESCE(dept_date_setting.date_creation_goal_start,
											  period_date_setting.date_creation_goal_start)
							END,
							date_creation_goal_end = CASE
								WHEN new_effective_level > 7
									THEN COALESCE(dept_date_setting.date_creation_goal_department_end,
												  period_date_setting.date_creation_goal_department_end)
								ELSE COALESCE(dept_date_setting.date_creation_goal_end,
											  period_date_setting.date_creation_goal_end)
							END,
							date_evaluation_start = CASE
								WHEN new_effective_level > 7
									THEN COALESCE(dept_date_setting.date_evaluation_department_start,
												  period_date_setting.date_evaluation_department_start)
								ELSE COALESCE(dept_date_setting.date_evaluation_start,
											  period_date_setting.date_evaluation_start)
							END,
							date_evaluation_end = CASE
								WHEN new_effective_level > 7
									THEN COALESCE(dept_date_setting.date_evaluation_department_end,
												  period_date_setting.date_evaluation_department_end)
								ELSE COALESCE(dept_date_setting.date_evaluation_end,
											  period_date_setting.date_evaluation_end)
							END,
							updated_time = now()
						WHERE id = evaluation.id;
					END IF;
				END IF;
			END LOOP;
		ELSE
			-- Kiểm tra xem có record thỏa điều kiện không
			SELECT COUNT(*) INTO check_count
			FROM evaluation_tbl e
			LEFT JOIN evaluation_period_tbl ep ON ep.id = e.evaluation_period_id
			WHERE e.evaluation_period_id = PERIOD_ID_INPUT
			AND e.user_id = USER_ID_INPUT
			AND e.company_group_code = company_group_code_input;

			-- Nếu không có record thì mới xử lý
			IF check_count = 0 THEN
				CALL process_user_skills(USER_ID_INPUT, PERIOD_ID_INPUT, NULL, DIVISION_ID_INPUT, 
										DEPARTMENT_ID_INPUT, FLAG_SKILL_VALUE, OLD_FLAG_SKILL);
			END IF;
		END IF;
		
		UPDATE user_tbl 
        SET 
            department_id = CASE WHEN DEPARTMENT_ID_INPUT = 0 THEN department_id ELSE DEPARTMENT_ID_INPUT END,
            division_id = CASE WHEN DIVISION_ID_INPUT = 0 THEN division_id ELSE DIVISION_ID_INPUT END,
            company_id = CASE WHEN COMPANY_ID_INPUT = 0 THEN company_id ELSE COMPANY_ID_INPUT END,
            level = COALESCE(LEVEL_INPUT, level_old),
            flag_skill = flag_skill_value,
			updated_time = now()
        WHERE id = USER_ID_INPUT;
END;
$BODY$;

CREATE OR REPLACE PROCEDURE public.update_evaluation_basic_behavior(
	IN evaluation_id_input bigint,
	IN user_flag_skill integer,
	IN level_input integer,
	IN company_group_code_input text)
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
    type_check INT;
    behaviors RECORD;
	item_no integer := 0;
BEGIN
    -- Xóa các bản ghi behavior cũ
    DELETE FROM evaluation_basic_behavior_tbl 
    WHERE evaluation_id = evaluation_id_input AND type IN (2, 3, 5, 6);

    -- Kiểm tra cờ kỹ năng của người dùng và xác định loại hành vi
    IF user_flag_skill = 0 THEN
        type_check := CASE WHEN level_input > 7 THEN 6 ELSE 3 END;
    ELSE
        type_check := CASE WHEN level_input > 7 THEN 5 ELSE 2 END;
    END IF;

    -- Truy vấn các hành vi cơ bản từ bảng listBasicBehaviorEntity
    FOR behaviors IN
        SELECT lb.*
        FROM list_basic_behavior_tbl lb  -- Thay thế bằng bảng thực tế của bạn
        RIGHT JOIN version_basic_behavior_tbl vb ON lb.version_id = vb.id
        WHERE vb.company_group_code = company_group_code_input AND vb.status = 4 AND vb.level = level_input AND vb.type = type_check
        ORDER BY lb.id_item ASC
    LOOP
        -- Thêm thông tin cần thiết vào behaviors và chèn vào bảng evaluationBasicBehaviorEntity
        INSERT INTO evaluation_basic_behavior_tbl (evaluation_id, item_no, type, item_title, content, difficulty, created_time, updated_time) 
        VALUES (evaluation_id_input, item_no, type_check, behaviors.title, behaviors.content, behaviors.difficulty, now(), now());
		item_no := item_no + 1;
    END LOOP;
END;
$BODY$;

CREATE OR REPLACE PROCEDURE process_user_skills(
    IN USER_ID_INPUT integer,
    IN PERIOD_ID_INPUT integer,
    IN EVALUATION_ID_INPUT bigint,
    IN DIVISION_ID_INPUT integer,
    IN DEPARTMENT_ID_INPUT integer,
    IN FLAG_SKILL_VALUE integer,
    IN old_flag_skill integer
)
LANGUAGE plpgsql
AS $$
DECLARE
    list_dep_div_id INT[] := ARRAY[]::INT[];
    user_info RECORD;
    skill RECORD;
BEGIN
    -- Kiểm tra điều kiện
    IF (DIVISION_ID_INPUT > 0 OR DEPARTMENT_ID_INPUT IS NULL OR DEPARTMENT_ID_INPUT > 0 OR FLAG_SKILL_VALUE <> OLD_FLAG_SKILL) THEN
        -- Xóa dữ liệu cũ từ skill_user_tbl
        DELETE FROM skill_user_tbl
        WHERE user_id = USER_ID_INPUT
          AND period_id = PERIOD_ID_INPUT
          AND type = 0
          AND (evaluation_id IS NULL OR evaluation_id = EVALUATION_ID_INPUT);

        -- Nếu FLAG_SKILL_VALUE = 1 thì xử lý thêm kỹ năng
        IF FLAG_SKILL_VALUE = 1 THEN
            -- Lấy thông tin user
            SELECT u.department_id, u.division_id INTO user_info
            FROM user_tbl u
            WHERE u.id = USER_ID_INPUT;

            -- Thêm phòng ban vào danh sách
            IF DEPARTMENT_ID_INPUT > 0 THEN
                list_dep_div_id := array_append(list_dep_div_id, DEPARTMENT_ID_INPUT);
            ELSIF DEPARTMENT_ID_INPUT = 0 AND user_info.department_id IS NOT NULL THEN
                list_dep_div_id := array_append(list_dep_div_id, user_info.department_id);
            END IF;

            -- Thêm bộ phận vào danh sách
            IF DIVISION_ID_INPUT > 0 THEN
                list_dep_div_id := array_append(list_dep_div_id, DIVISION_ID_INPUT);
            ELSIF DIVISION_ID_INPUT = 0 AND user_info.division_id IS NOT NULL THEN
                list_dep_div_id := array_append(list_dep_div_id, user_info.division_id);
            END IF;

            -- Lặp qua các kỹ năng phù hợp và chèn vào skill_user_tbl
            FOR skill IN SELECT skill_id FROM skill_group_tbl WHERE department_id = ANY(list_dep_div_id) LOOP
                INSERT INTO skill_user_tbl (user_id, skill_id, period_id, evaluation_id, type)
                VALUES (USER_ID_INPUT, skill.skill_id, PERIOD_ID_INPUT, NULL, 0);

                IF EVALUATION_ID_INPUT IS NOT NULL THEN
                    INSERT INTO skill_user_tbl (user_id, skill_id, period_id, evaluation_id, type)
                    VALUES (USER_ID_INPUT, skill.skill_id, PERIOD_ID_INPUT, EVALUATION_ID_INPUT, 0);
                END IF;
            END LOOP;
        END IF;
    END IF;
END;
$$;


-- 


CREATE OR REPLACE PROCEDURE sp_update_user_permissions(p_roles_json JSONB)
LANGUAGE plpgsql
AS $$
DECLARE
    v_user_id INT;
BEGIN
    -- 1. Lấy userId từ phần tử đầu tiên trong mảng JSON để xác định user cần xóa role cũ
    v_user_id := (p_roles_json->0->>'userId')::INT;

    -- Kiểm tra nếu có dữ liệu hợp lệ thì mới xử lý
    IF v_user_id IS NOT NULL THEN
        
        -- 2. Xóa các role cũ của user này (Giống logic cũ của bạn, có thể thêm AND role_id <> 9 nếu cần)
        DELETE FROM permission_tbl 
        WHERE user_id = v_user_id;

        -- 3. Giải nén mảng JSON và Insert toàn bộ danh sách role mới
        INSERT INTO permission_tbl (user_id, role_id, created_time, updated_time)
        SELECT 
            (elem->>'userId')::INT,
            (elem->>'roleId')::INT,
            COALESCE((elem->>'createdTime')::TIMESTAMP, NOW()), -- Nếu không truyền createdTime sẽ lấy giờ hiện tại
            NOW()
        FROM jsonb_array_elements(p_roles_json) AS elem;
        
    END IF;
END;
$$;