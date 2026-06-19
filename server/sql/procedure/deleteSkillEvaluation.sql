
-- DROP PROCEDURE IF EXISTS PUBLIC.DELETE_SKILL_EVALUATION (INTEGER[], INTEGER)

CREATE OR REPLACE PROCEDURE public.delete_skill_evaluation(
   IN list_skill_ids_input integer[],
   IN evaluation_id_input integer,
   IN company_group_code_input text)
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
    skill_id_param integer;
    version_pro_skill RECORD;
    list_pro_skill RECORD;
BEGIN
    FOREACH skill_id_param IN ARRAY list_skill_ids_input LOOP
        -- Lấy thông tin version pro skill bị xóa
        FOR version_pro_skill IN 
            SELECT * 
            FROM version_pro_skill_tbl vpst 
            WHERE vpst.skill_id = skill_id_param 
            AND vpst.public_status = 1 
            AND vpst.company_group_code = company_group_code_input
        LOOP
            -- Lấy thông tin list pro skill theo version pro skill bị xóa
            FOR list_pro_skill IN 
                SELECT * 
                FROM list_pro_skill_tbl lpst 
                WHERE lpst.version_id = version_pro_skill.id
            LOOP
                -- Xóa data trong bảng evaluation pro theo điều kiện
                DELETE FROM evaluation_pro_tbl ept 
                WHERE ept.evaluation_id = evaluation_id_input
                AND ept.item_id LIKE '%' || list_pro_skill.item_id || '%'
                AND ept.item_title = list_pro_skill.medium_class || '_' || list_pro_skill.small_class
                AND ept.job_type = list_pro_skill.job_type;
            END LOOP;
        END LOOP;
    END LOOP;
END;
$BODY$;