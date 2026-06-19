CREATE OR REPLACE PROCEDURE public.undo_exception(
  IN period_id_input integer,
  IN user_id_input integer,
  IN company_group_code_input TEXT,
  IN level_input integer,
  IN flag_skill_input integer,
  IN skill_list_input integer[],
  IN evaluation_id_input integer,
  IN year_input integer,
  IN period_index_input integer,
  IN evaluator05_id_input integer DEFAULT NULL,
  IN evaluator1_id_input integer DEFAULT NULL,
  IN evaluator2_id_input integer DEFAULT NULL,
  IN department_name_input TEXT DEFAULT NULL,
  IN department_id_input integer DEFAULT NULL,
  IN division_id_input integer DEFAULT NULL,
  IN division_name_input TEXT DEFAULT NULL
)
LANGUAGE plpgsql
AS $BODY$
DECLARE
  skill_id_param INT;
  period_start_param TEXT;
  period_end_param TEXT;
BEGIN
  -- 1. Update evaluator_default_tbl
  UPDATE evaluator_default_tbl
  SET
    evaluator_0_5_id = evaluator05_id_input,
    evaluator_1_id = evaluator1_id_input,
    evaluator_2_id = evaluator2_id_input,
    department_name = department_name_input,
    department_id = department_id_input,
    division_id = division_id_input,
    division_name = division_name_input,
    level = level_input,
    flag_skill = flag_skill_input
  WHERE evaluation_period_id = period_id_input
    AND user_id = user_id_input
    AND company_group_code = company_group_code_input;

  -- 2. Delete old skills
  DELETE FROM skill_user_tbl
  WHERE user_id = user_id_input
    AND period_id = period_id_input;

  -- 3. Insert new skills
  IF array_length(skill_list_input, 1) > 0 THEN
    FOREACH skill_id_param IN ARRAY skill_list_input LOOP
      -- Insert default
      INSERT INTO skill_user_tbl(skill_id, user_id, period_id, type, evaluation_id)
      VALUES (skill_id_param, user_id_input, period_id_input, 0, NULL);

      -- Insert with evaluation_id
      INSERT INTO skill_user_tbl(skill_id, user_id, period_id, type, evaluation_id)
      VALUES (skill_id_param, user_id_input, period_id_input, 0, evaluation_id_input);
    END LOOP;
  END IF;

  -- 4. Update evaluation_tbl
  IF period_index_input = 1 THEN
    period_start_param := year_input || '/4';
    period_end_param := year_input || '/9';
  ELSE
    period_start_param := year_input || '/10';
    period_end_param := (year_input + 1) || '/3';
  END IF;

  UPDATE evaluation_tbl
  SET
    period_start = period_start_param,
    period_end = period_end_param,
    date_creation_goal_start = NULL,
    date_creation_goal_end = NULL,
    date_evaluation_start = NULL,
    date_evaluation_end = NULL,
    percent_point = NULL,
    creation_user = NULL
  WHERE evaluation_period_id = period_id_input
    AND id = evaluation_id_input
    AND user_id = user_id_input
    AND company_group_code = company_group_code_input;
END;
$BODY$;

-------

CREATE OR REPLACE PROCEDURE public.backup_evaluation(delete_ids integer[])
LANGUAGE plpgsql
AS $BODY$
DECLARE
  id_param integer;
  evaluation_record_param TEXT;
  evaluation_pro_param TEXT;
  evaluation_basic_behavior_param TEXT;
  evaluation_achievement_personal_param TEXT;
  evaluator_param TEXT;
  skill_user_param TEXT;
  history_approve_param TEXT;
BEGIN
  IF array_length(delete_ids, 1) > 0 THEN
    FOREACH id_param IN ARRAY delete_ids LOOP
    -- 1. evaluation_record
    SELECT row_to_json(t)::TEXT INTO evaluation_record_param
    FROM (
      SELECT * FROM evaluation_tbl WHERE id = id_param
    ) t;

    -- 2. evaluation_pro
    SELECT COALESCE(json_agg(row_to_json(t)), '[]')::TEXT INTO evaluation_pro_param
    FROM (
      SELECT * FROM evaluation_pro_tbl WHERE evaluation_id = id_param
    ) t;

    -- 3. evaluation_basic_behavior
    SELECT COALESCE(json_agg(row_to_json(t)), '[]')::TEXT INTO evaluation_basic_behavior_param
    FROM (
      SELECT * FROM evaluation_basic_behavior_tbl WHERE evaluation_id = id_param
      ORDER BY type, item_no
    ) t;

    -- 4. evaluation_achievement_personal + sub
    SELECT COALESCE(json_agg(row_to_json(t)), '[]')::TEXT INTO evaluation_achievement_personal_param
    FROM (
      SELECT eap.*, eaps.*
      FROM evaluation_achievement_personal_tbl eap
      LEFT JOIN evaluation_achievement_personal_sub_tbl eaps
        ON eap.id = eaps.achievement_personal_id
      WHERE eap.evaluation_id = id_param
      ORDER BY eap.type, eap.item_no
    ) t;

    -- 5. evaluator
    SELECT COALESCE(json_agg(row_to_json(t)), '[]')::TEXT INTO evaluator_param
    FROM (
      SELECT * FROM evaluator_tbl WHERE evaluation_id = id_param
    ) t;

    -- 6. skill_user
    SELECT COALESCE(json_agg(row_to_json(t)), '[]')::TEXT INTO skill_user_param
    FROM (
      SELECT * FROM skill_user_tbl WHERE evaluation_id = id_param
    ) t;

    -- 7. history_approve_evaluation
    SELECT COALESCE(json_agg(row_to_json(t)), '[]')::TEXT INTO history_approve_param
    FROM (
      SELECT * FROM history_approve_evaluation_tbl WHERE evaluation_id = id_param
    ) t;

    -- 8. Insert into backup table
    INSERT INTO history_backup_evaluation_tbl (
      evaluation_id,
      evaluation_record,
      evaluation_pro,
      evaluation_basic_behavior,
      evaluation_achievement_personal,
      evaluator,
      skill_user,
      history_approve_evaluation,
	  created_time,
	  updated_time
    )
    VALUES (
      id_param,
      evaluation_record_param,
      evaluation_pro_param,
      evaluation_basic_behavior_param,
      evaluation_achievement_personal_param,
      evaluator_param,
      skill_user_param,
      history_approve_param,
	  now(),
  	  now()
    );
  END LOOP;
  END IF;
END;
$BODY$;

