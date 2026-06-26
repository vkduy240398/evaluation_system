CREATE OR REPLACE PROCEDURE public.sp_change_role_user(
    IN user_id_input integer,
    IN roles integer[],
    IN is_change_role_f2 boolean,
    IN is_change_role_f3 boolean,
    IN is_change_role_f4 boolean,
    IN type_change_role_f1 integer,
    IN list_evaluator_evaluation_ids bigint[],
    IN company_group_code_input text
)
LANGUAGE plpgsql
AS $$
DECLARE
    list_period_un_public INT[];
BEGIN
    -- xóa quyền F3: xóa vai trò chuyên gia kỹ năng (cài đặt)
    IF is_change_role_f3 THEN
        DELETE FROM skill_role_tbl WHERE user_id = user_id_input AND role = 1;
    END IF;

    -- xóa quyền F4: xóa vai trò chuyên gia kỹ năng (phê duyệt)
    IF is_change_role_f4 THEN
        DELETE FROM skill_role_tbl WHERE user_id = user_id_input AND role = 2;
    END IF;

    -- cập nhật danh sách role: xóa cũ (giữ lại role 9 - system admin) rồi thêm mới
    IF roles IS NOT NULL THEN
        DELETE FROM permission_tbl WHERE user_id = user_id_input AND role_id <> 9;
        IF array_length(roles, 1) > 0 AND roles[1] <> 0 THEN
            INSERT INTO permission_tbl (user_id, role_id, created_time, updated_time)
            SELECT user_id_input, r, now(), now()
            FROM unnest(roles) AS r;
        END IF;
    END IF;

    -- lấy danh sách kỳ chưa public (dùng cho F2 và F1)
    IF is_change_role_f2 OR type_change_role_f1 = 2 THEN
        SELECT ARRAY_AGG(id) INTO list_period_un_public
        FROM evaluation_period_tbl
        WHERE company_group_code = company_group_code_input AND check_fixed <> 2;
    END IF;

    -- xóa quyền F2: clear vai trò evaluator trong các kỳ chưa public
    IF is_change_role_f2 AND list_period_un_public IS NOT NULL THEN
        IF list_evaluator_evaluation_ids IS NOT NULL THEN
            DELETE FROM evaluator_tbl
            WHERE evaluation_id = ANY(list_evaluator_evaluation_ids)
              AND evaluator_id = user_id_input
              AND evaluation_order <> '2.0';
        END IF;

        UPDATE evaluator_default_tbl
        SET evaluator_0_5_id = NULL, updated_time = now()
        WHERE company_group_code = company_group_code_input
          AND evaluator_0_5_id = user_id_input
          AND evaluation_period_id = ANY(list_period_un_public);

        UPDATE evaluator_default_tbl
        SET evaluator_1_id = NULL, updated_time = now()
        WHERE company_group_code = company_group_code_input
          AND evaluator_1_id = user_id_input
          AND evaluation_period_id = ANY(list_period_un_public);

        UPDATE evaluator_default_tbl
        SET evaluator_2_id = NULL, updated_time = now()
        WHERE company_group_code = company_group_code_input
          AND evaluator_2_id = user_id_input
          AND evaluation_period_id = ANY(list_period_un_public);
    END IF;

    -- xóa quyền F1: xóa user khỏi đối tượng đánh giá của các kỳ chưa public
    IF type_change_role_f1 = 2 AND list_period_un_public IS NOT NULL THEN
        DELETE FROM evaluator_default_tbl
        WHERE company_group_code = company_group_code_input
          AND user_id = user_id_input
          AND evaluation_period_id = ANY(list_period_un_public);
    END IF;
END;
$$;
