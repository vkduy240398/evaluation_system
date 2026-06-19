-- tìm string status theo ngày và time zone

create or replace
function get_status(p_date_evaluation_start text,
p_date_evaluation_end text,
p_status smallint,
p_evaluation_status text,
p_timezone text)
returns text as $$
declare v_string_status text;

begin
if p_status <> 50 then
	select value into v_string_status from (select
		j.key::int,
		j.value
	from
		json_each_text(p_evaluation_status::json) as j) where key = p_status;
else
    if to_date(p_date_evaluation_start,
'YYYY/MM/DD') <= (CURRENT_TIMESTAMP at TIME zone p_timezone)::date
and to_date(p_date_evaluation_end,
'YYYY/MM/DD') >= (CURRENT_TIMESTAMP at TIME zone p_timezone)::date
	then
		v_string_status := SPLIT_PART((select value from (select
		j.key::int,
		j.value
	from
		json_each_text(p_evaluation_status::json) as j) where key=p_status),'/',2);
else
	v_string_status := SPLIT_PART((select value from (select
		j.key::int,
		j.value
	from
		json_each_text(p_evaluation_status::json) as j) where key=p_status),'/',1);
end if;
	
end if;

return v_string_status;
end;

$$ language plpgsql;