export const getDepartment = `
select KJ.拠点コード, KJ.拠点名 
from 拠点基本情報マスタ KJ
where (exists (select 1 from 従業員マスタ JM inner join ＡＤユーザマスタ AD on JM.従業員コード = AD.従業員コード and AD.有効区分 = '1' and JM.有効区分 = '1' where KJ.拠点コード = JM.所属部署コード) 
or exists (select 1 from 従業員兼任マスタ JK inner join ＡＤユーザマスタ AD on JK.従業員コード = AD.従業員コード and AD.有効区分 = '1' and JK.有効区分 = '1' where KJ.拠点コード = JK.所属部署コード)
or exists (select 1 from 特別ユーザ管理マスタ TK inner join ＡＤユーザマスタ AD on TK.従業員コード = AD.従業員コード and AD.有効区分 = '1' and TK.有効区分 = '1' where KJ.拠点コード = TK.所属部署コード)) order by KJ.拠点名 ASC
`;
export const getCompany = `
select 法人コード AS COMPANYID,法人名 AS COMPANY from 法人マスタ
`;
export const getUserDbOracle = (employmentList: string[]) => `
SELECT * from 
(
  SELECT 
  AD.ユーザＩＤ AS USERNAME
  , JM.姓
  , JM.名
  , JM.所属部署コード AS DEPARTMENTID
  , KJ.拠点名  AS DEPARTMENTNAME
  , JM.職掌コード AS POSITIONID
  , SM.職掌名 AS POSITION
  , SM.職掌略称 AS POSITIONNAME
  , HM.法人コード AS COMPANYID
  , HM.法人名 AS COMPANY
  , AD.従業員コード
  FROM 従業員マスタ JM
  INNER JOIN ＡＤユーザマスタ AD ON JM.従業員コード = AD.従業員コード AND AD.有効区分 = '1'
  LEFT JOIN 職掌マスタ SM ON JM.職掌コード = SM.職掌コード AND SM.有効区分 = '1'
  INNER JOIN 拠点基本情報マスタ KJ ON JM.所属部署コード = KJ.拠点コード -- AND KJ.有効区分 = '1'
  INNER JOIN 法人マスタ HM ON KJ.法人コード = HM.法人コード AND HM.有効区分 = '1'
  where
  AD.ユーザＩＤ is not null 
  
  AND (HM.法人コード Like :company
    OR HM.法人名 Like :company)

    AND (AD.ユーザＩＤ Like :email
    OR JM.姓 Like :email
    OR JM.名 Like :email or CONCAT(TRIM(JM.姓),CONCAT(' ',TRIM(JM.名))) Like :email)
  
  AND KJ.拠点名 Like :departmentName
  ${
    employmentList.length > 0
      ? `AND AD.従業員コード NOT IN (${employmentList.toString()})`
      : ''
  }

  UNION ALL
  SELECT
  AD.ユーザＩＤ AS USERNAME
  , JM.姓
  , JM.名
  , JK.所属部署コード AS DEPARTMENTID
  , KJ.拠点名  AS DEPARTMENTNAME
  , JK.職掌コード AS POSITIONID
  , SM.職掌名 AS POSITION
  , SM.職掌略称 AS POSITIONNAME
  , HM.法人コード AS COMPANYID
  , HM.法人名 AS COMPANY
  , AD.従業員コード
  FROM 従業員兼任マスタ JK
  INNER JOIN 従業員マスタ JM ON JK.従業員コード = JM.従業員コード AND JK.有効区分 = '1'
  INNER JOIN ＡＤユーザマスタ AD ON JK.従業員コード = AD.従業員コード AND AD.有効区分 = '1'
  LEFT JOIN 職掌マスタ SM ON JK.職掌コード = SM.職掌コード AND SM.有効区分 = '1'
  INNER JOIN 拠点基本情報マスタ KJ ON JK.所属部署コード = KJ.拠点コード
  INNER JOIN 法人マスタ HM ON KJ.法人コード = HM.法人コード AND HM.有効区分 = '1'
  where
  AD.ユーザＩＤ is not null 
  AND (AD.ユーザＩＤ Like :email
    OR JM.姓 Like :email
    OR JM.名 Like :email or CONCAT(TRIM(JM.姓),CONCAT(' ',TRIM(JM.名))) Like :email)
  AND (HM.法人コード Like :company
    OR HM.法人名 Like :company)
  AND KJ.拠点名 Like :departmentName
  ${
    employmentList.length > 0
      ? `AND AD.従業員コード NOT IN (${employmentList.toString()})`
      : ''
  }
  UNION ALL
  select  AD.ユーザＩＤ as username,
  t1.姓,
  t1.名,
  t1.所属部署コード AS DEPARTMENTID,
  KM.拠点名 AS DEPARTMENTNAME,
  PS.職掌コード AS POSITIONID,
  PS.職掌名 AS POSITION,
  PS.職掌略称 AS POSITIONNAME,
  CP.法人コード AS COMPANYID,
  CP.法人名 AS COMPANY,
  AD.従業員コード
  from ＡＤユーザマスタ AD 
  INNER JOIN 特別ユーザ管理マスタ t1 on t1.従業員コード = AD.従業員コード -- ho va ten
  INNER JOIN 拠点基本情報マスタ KM ON KM.拠点コード = t1.所属部署コード -- AND KM.有効区分 = '0' -- ten department
  LEFT JOIN 職掌マスタ PS ON PS.職掌コード = t1.職掌コード and PS.有効区分 = '1' -- ten department
  INNER JOIN 法人マスタ CP ON CP.法人コード = KM.法人コード -- ten cong ty
  where AD.有効区分 = 1
  AND (AD.ユーザＩＤ Like :email
    OR t1.姓 Like :email
    OR t1.名 Like :email or CONCAT(TRIM(t1.姓),CONCAT(' ',TRIM(t1.名))) Like :email)
    AND (CP.法人コード Like :company
    OR CP.法人名 Like :company)
    AND KM.拠点名 Like :departmentName
    ${
      employmentList.length > 0
        ? `AND AD.従業員コード NOT IN (${employmentList.toString()})`
        : ''
    }
  GROUP BY (AD.ユーザＩＤ, t1.姓, t1.名, t1.所属部署コード, KM.拠点名 ,PS.職掌コード ,PS.職掌名 ,PS.職掌略称 ,CP.法人コード ,CP.法人名 ,AD.従業員コード,KM.有効区分)
) DUM
ORDER BY 
    CASE
     WHEN :sortKey = '従業員コード' AND :sortOrder = 'ASC' THEN 従業員コード 
     WHEN :sortKey = '姓' AND :sortOrder = 'ASC' THEN 姓 
     WHEN :sortKey = 'DEPARTMENTNAME' AND :sortOrder = 'ASC' THEN DEPARTMENTNAME 
     WHEN :sortKey = 'COMPANY' AND :sortOrder = 'ASC' THEN COMPANY 
    END ASC,
    CASE
     WHEN :sortKey = '従業員コード' AND :sortOrder = 'DESC' THEN 従業員コード 
     WHEN :sortKey = '姓' AND :sortOrder = 'DESC' THEN 姓 
     WHEN :sortKey = 'DEPARTMENTNAME' AND :sortOrder = 'DESC' THEN DEPARTMENTNAME 
     WHEN :sortKey = 'COMPANY' AND :sortOrder = 'DESC' THEN COMPANY 
    END DESC
OFFSET :offsetParam ROWS FETCH NEXT :nextParam ROWS ONLY
`;

export const countUserDB = (employmentList: string[]) => `
SELECT count(*) as total from 
(
SELECT 
AD.ユーザＩＤ AS USERNAME
, JM.姓
, JM.名
, JM.所属部署コード AS DEPARTMENTID
, KJ.拠点名  AS DEPARTMENTNAME
, JM.職掌コード AS POSITIONID
, SM.職掌名 AS POSITION
, SM.職掌略称 AS POSITIONNAME
, HM.法人コード AS COMPANYID
, HM.法人名 AS COMPANY
, AD.従業員コード
FROM 従業員マスタ JM
INNER JOIN ＡＤユーザマスタ AD ON JM.従業員コード = AD.従業員コード AND AD.有効区分 = '1'
LEFT JOIN 職掌マスタ SM ON JM.職掌コード = SM.職掌コード AND SM.有効区分 = '1'
INNER JOIN 拠点基本情報マスタ KJ ON JM.所属部署コード = KJ.拠点コード -- AND KJ.有効区分 = '1'
INNER JOIN 法人マスタ HM ON KJ.法人コード = HM.法人コード AND HM.有効区分 = '1'
where
AD.ユーザＩＤ is not null 
AND (HM.法人コード Like :company
    OR HM.法人名 Like :company)
AND (AD.ユーザＩＤ Like :email
  OR JM.姓 Like :email
  OR JM.名 Like :email or CONCAT(TRIM(JM.姓),CONCAT(' ',TRIM(JM.名))) Like :email)

AND KJ.拠点名 Like :departmentName
${
  employmentList.length > 0
    ? `AND AD.従業員コード NOT IN (${employmentList.toString()})`
    : ''
}

UNION ALL
SELECT
AD.ユーザＩＤ AS USERNAME
, JM.姓
, JM.名
, JK.所属部署コード AS DEPARTMENTID
, KJ.拠点名  AS DEPARTMENTNAME
, JK.職掌コード AS POSITIONID
, SM.職掌名 AS POSITION
, SM.職掌略称 AS POSITIONNAME
, HM.法人コード AS COMPANYID
, HM.法人名 AS COMPANY
, AD.従業員コード
FROM 従業員兼任マスタ JK
INNER JOIN 従業員マスタ JM ON JK.従業員コード = JM.従業員コード AND JK.有効区分 = '1'
INNER JOIN ＡＤユーザマスタ AD ON JK.従業員コード = AD.従業員コード AND AD.有効区分 = '1'
LEFT JOIN 職掌マスタ SM ON JK.職掌コード = SM.職掌コード AND SM.有効区分 = '1'
INNER JOIN 拠点基本情報マスタ KJ ON JK.所属部署コード = KJ.拠点コード -- AND KJ.有効区分 = '1'
INNER JOIN 法人マスタ HM ON KJ.法人コード = HM.法人コード AND HM.有効区分 = '1'
where
AD.ユーザＩＤ is not null 
AND (HM.法人コード Like :company
    OR HM.法人名 Like :company)
AND (AD.ユーザＩＤ Like :email
  OR JM.姓 Like :email
  OR JM.名 Like :email or CONCAT(TRIM(JM.姓),CONCAT(' ',TRIM(JM.名))) Like :email)
  AND KJ.拠点名 Like :departmentName
  ${
    employmentList.length > 0
      ? `AND AD.従業員コード NOT IN (${employmentList.toString()})`
      : ''
  }


UNION ALL
select  AD.ユーザＩＤ as USERNAME,
t1.姓,
t1.名,
t1.所属部署コード AS DEPARTMENTID,
KM.拠点名 AS DEPARTMENTNAME,
PS.職掌コード AS POSITIONID,
PS.職掌名 AS POSITION,
PS.職掌略称 AS POSITIONNAME,
CP.法人コード AS COMPANYID,
CP.法人名 AS COMPANY,
AD.従業員コード
from ＡＤユーザマスタ AD 
INNER JOIN 特別ユーザ管理マスタ t1 on t1.従業員コード = AD.従業員コード -- ho va ten
INNER JOIN 拠点基本情報マスタ KM ON KM.拠点コード = t1.所属部署コード -- AND KM.有効区分 = '0' -- ten department
LEFT JOIN 職掌マスタ PS ON PS.職掌コード = t1.職掌コード and PS.有効区分 = '1' -- ten department
INNER JOIN 法人マスタ CP ON CP.法人コード = KM.法人コード -- ten cong ty
where AD.有効区分 = 1
AND (CP.法人コード Like :company
    OR CP.法人名 Like :company)
AND (AD.ユーザＩＤ Like :email
  OR t1.姓 Like :email
  OR t1.名 Like :email or CONCAT(TRIM(t1.姓),CONCAT(' ',TRIM(t1.名))) Like :email)
  AND KM.拠点名 Like :departmentName
  ${
    employmentList.length > 0
      ? `AND AD.従業員コード NOT IN (${employmentList.toString()})`
      : ''
  }
  
GROUP BY (AD.ユーザＩＤ, t1.姓, t1.名, t1.所属部署コード, KM.拠点名 ,PS.職掌コード ,PS.職掌名 ,PS.職掌略称 ,CP.法人コード ,CP.法人名 ,AD.従業員コード,KM.有効区分)
) DUM
`;

// export const getDb = (
//   offset: number | undefined,
//   next: number | undefined,
//   list: string | undefined,
//   email?: string | undefined,
//   departmentId?: string | undefined,
//   order?: string | undefined,
// ) => `
// SELECT
// AD.ユーザＩＤ as username
// ,EMP.姓
// ,EMP.名
// ,JU.所属部署コード as departmentId-- mã phòng ban
// ,KM1.拠点名  as departmentName -- tên phòng ban (ó thể lẫn lộn phòng, bộ phận, nhómAS 部署名
// ,PS.職掌コード as positionId
// ,PS.職掌名 as position
// ,PS.職掌略称 as positionName
// ,HJ1.法人コード as companyId
// ,HJ1.法人名 as company -- tên công ty hệ thống cần
// ,JU.従業員コード -- mã nhân viên
// ,BS1.部署コード -- mã bộ phận
// --,KA1.課コード,KM2.拠点名 AS 課名  -- tên phòng hệ thống cần
// --,BU1.部コード,KM3.拠点名 AS 部名 -- tên bộ phận
// --,HB1.本部コード,KM4.拠点名 AS 本部名 --tên tổng bộ phận
// FROM
// (
// SELECT 従業員コード,所属部署コード,職掌コード FROM 従業員マスタ
// UNION ALL
// SELECT 従業員コード,所属部署コード,職掌コード FROM 従業員兼任マスタ WHERE 有効区分 = 1
// ) JU
// INNER JOIN (SELECT * FROM (SELECT BS.*,RANK() OVER(PARTITION BY 部署コード ORDER BY 変更日 DESC) RK FROM 部署履歴マスタ BS WHERE 変更日 <= SYSDATE) WHERE RK = 1 AND 有効区分 = 1) BS1
// ON BS1.部署コード = JU.所属部署コード
// INNER JOIN (SELECT * FROM (SELECT KA.*,RANK() OVER(PARTITION BY 課コード   ORDER BY 変更日 DESC) RK FROM 課履歴マスタ KA   WHERE 変更日 <= SYSDATE) WHERE RK = 1 AND 有効区分 = 1) KA1
// ON KA1.課コード = BS1.運営管理課コード
// INNER JOIN (SELECT * FROM (SELECT BU.*,RANK() OVER(PARTITION BY 部コード   ORDER BY 変更日 DESC) RK FROM 部履歴マスタ BU   WHERE 変更日 <= SYSDATE) WHERE RK = 1 AND 有効区分 = 1) BU1
// ON BU1.部コード = KA1.部コード
// INNER JOIN (SELECT * FROM (SELECT HB.*,RANK() OVER(PARTITION BY 本部コード ORDER BY 変更日 DESC) RK FROM 本部履歴マスタ HB WHERE 変更日 <= SYSDATE) WHERE RK = 1 AND 有効区分 = 1) HB1
// ON HB1.本部コード = BU1.本部コード
// INNER JOIN (SELECT * FROM (SELECT HJ.*,RANK() OVER(PARTITION BY 法人コード ORDER BY 変更日 DESC) RK FROM 法人履歴マスタ HJ WHERE 変更日 <= SYSDATE) WHERE RK = 1 AND 有効区分 = 1) HJ1
// ON HJ1.法人コード = HB1.法人コード
// INNER JOIN 拠点基本情報マスタ KM1 ON KM1.拠点コード = BS1.部署コード
// INNER JOIN 拠点基本情報マスタ KM2 ON KM2.拠点コード = KA1.部署コード
// INNER JOIN 拠点基本情報マスタ KM3 ON KM3.拠点コード = BU1.部署コード
// INNER JOIN 拠点基本情報マスタ KM4 ON KM4.拠点コード = HB1.部署コード
// LEFT JOIN ＡＤユーザマスタ AD ON AD.従業員コード = JU.従業員コード --account
// LEFT JOIN tougou.職掌マスタ PS ON PS.職掌コード = JU.職掌コード --position
// LEFT JOIN 従業員マスタ EMP ON EMP.従業員コード = AD.従業員コード --employment
// --WHERE JU.従業員コード = '1016545'
// WHERE
// AD.有効区分 = 1
// ${
//   email !== undefined
//     ? `
// AND (AD.ユーザＩＤ Like N'%${email}%'
//   OR EMP.姓 Like N'%${email}%'
//   OR EMP.名 Like N'%${email}%')
// `
//     : ''
// }
// ${list && list.length > 0 && `AND AD.従業員コード NOT IN (${list})`}
// ${departmentId ? `AND KM1.拠点名 Like N'%${departmentId}%'` : ''}

// ${order && order}
// OFFSET ${offset} ROWS FETCH NEXT ${next || 0} ROWS ONLY
// `;

// export const countDb = (list: string | undefined, email?: string | undefined, departmentId?: string | undefined) => `
// SELECT
// COUNT(JU.従業員コード) as Total -- mã nhân viên
// FROM
// (
// SELECT 従業員コード,所属部署コード,職掌コード FROM 従業員マスタ
// UNION ALL
// SELECT 従業員コード,所属部署コード,職掌コード FROM 従業員兼任マスタ WHERE 有効区分 = 1
// ) JU
// INNER JOIN (SELECT * FROM (SELECT BS.*,RANK() OVER(PARTITION BY 部署コード ORDER BY 変更日 DESC) RK FROM 部署履歴マスタ BS WHERE 変更日 <= SYSDATE) WHERE RK = 1 AND 有効区分 = 1) BS1
// ON BS1.部署コード = JU.所属部署コード
// INNER JOIN (SELECT * FROM (SELECT KA.*,RANK() OVER(PARTITION BY 課コード   ORDER BY 変更日 DESC) RK FROM 課履歴マスタ KA   WHERE 変更日 <= SYSDATE) WHERE RK = 1 AND 有効区分 = 1) KA1
// ON KA1.課コード = BS1.運営管理課コード
// INNER JOIN (SELECT * FROM (SELECT BU.*,RANK() OVER(PARTITION BY 部コード   ORDER BY 変更日 DESC) RK FROM 部履歴マスタ BU   WHERE 変更日 <= SYSDATE) WHERE RK = 1 AND 有効区分 = 1) BU1
// ON BU1.部コード = KA1.部コード
// INNER JOIN (SELECT * FROM (SELECT HB.*,RANK() OVER(PARTITION BY 本部コード ORDER BY 変更日 DESC) RK FROM 本部履歴マスタ HB WHERE 変更日 <= SYSDATE) WHERE RK = 1 AND 有効区分 = 1) HB1
// ON HB1.本部コード = BU1.本部コード
// INNER JOIN (SELECT * FROM (SELECT HJ.*,RANK() OVER(PARTITION BY 法人コード ORDER BY 変更日 DESC) RK FROM 法人履歴マスタ HJ WHERE 変更日 <= SYSDATE) WHERE RK = 1 AND 有効区分 = 1) HJ1
// ON HJ1.法人コード = HB1.法人コード
// INNER JOIN 拠点基本情報マスタ KM1 ON KM1.拠点コード = BS1.部署コード
// INNER JOIN 拠点基本情報マスタ KM2 ON KM2.拠点コード = KA1.部署コード
// INNER JOIN 拠点基本情報マスタ KM3 ON KM3.拠点コード = BU1.部署コード
// INNER JOIN 拠点基本情報マスタ KM4 ON KM4.拠点コード = HB1.部署コード
// LEFT JOIN ＡＤユーザマスタ AD ON AD.従業員コード = JU.従業員コード --account
// LEFT JOIN tougou.職掌マスタ PS ON PS.職掌コード = JU.職掌コード --position
// LEFT JOIN 従業員マスタ EMP ON EMP.従業員コード = AD.従業員コード --employment
// WHERE
// AD.有効区分 = 1
// ${
//   email !== undefined
//     ? `
// AND (AD.ユーザＩＤ Like N'%${email}%'
//   OR EMP.姓 Like N'%${email}%'
//   OR EMP.名 Like N'%${email}%')
// `
//     : ''
// }
// ${list && list.length > 0 && `AND AD.従業員コード NOT IN (${list})`}
// ${departmentId ? `AND KM1.拠点名 Like N'%${departmentId}%'` : ''}
// `;

// export const getDepartment = `
// SELECT
// JU.所属部署コード as departmentId-- mã phòng ban
// ,KM1.拠点名  as departmentName -- tên phòng ban có thể lẫn lộn phòng, bộ phận, nhómAS 部署名
// FROM
// (
// SELECT 従業員コード,所属部署コード,職掌コード FROM 従業員マスタ
// UNION ALL
// SELECT 従業員コード,所属部署コード,職掌コード FROM 従業員兼任マスタ WHERE 有効区分 = 1
// ) JU
// INNER JOIN (SELECT * FROM (SELECT BS.*,RANK() OVER(PARTITION BY 部署コード ORDER BY 変更日 DESC) RK FROM 部署履歴マスタ BS WHERE 変更日 <= SYSDATE) WHERE RK = 1 AND 有効区分 = 1) BS1
// ON BS1.部署コード = JU.所属部署コード
// INNER JOIN (SELECT * FROM (SELECT KA.*,RANK() OVER(PARTITION BY 課コード   ORDER BY 変更日 DESC) RK FROM 課履歴マスタ KA   WHERE 変更日 <= SYSDATE) WHERE RK = 1 AND 有効区分 = 1) KA1
// ON KA1.課コード = BS1.運営管理課コード
// INNER JOIN (SELECT * FROM (SELECT BU.*,RANK() OVER(PARTITION BY 部コード   ORDER BY 変更日 DESC) RK FROM 部履歴マスタ BU   WHERE 変更日 <= SYSDATE) WHERE RK = 1 AND 有効区分 = 1) BU1
// ON BU1.部コード = KA1.部コード
// INNER JOIN (SELECT * FROM (SELECT HB.*,RANK() OVER(PARTITION BY 本部コード ORDER BY 変更日 DESC) RK FROM 本部履歴マスタ HB WHERE 変更日 <= SYSDATE) WHERE RK = 1 AND 有効区分 = 1) HB1
// ON HB1.本部コード = BU1.本部コード
// INNER JOIN (SELECT * FROM (SELECT HJ.*,RANK() OVER(PARTITION BY 法人コード ORDER BY 変更日 DESC) RK FROM 法人履歴マスタ HJ WHERE 変更日 <= SYSDATE) WHERE RK = 1 AND 有効区分 = 1) HJ1
// ON HJ1.法人コード = HB1.法人コード
// INNER JOIN 拠点基本情報マスタ KM1 ON KM1.拠点コード = BS1.部署コード
// INNER JOIN 拠点基本情報マスタ KM2 ON KM2.拠点コード = KA1.部署コード
// INNER JOIN 拠点基本情報マスタ KM3 ON KM3.拠点コード = BU1.部署コード
// INNER JOIN 拠点基本情報マスタ KM4 ON KM4.拠点コード = HB1.部署コード
// LEFT JOIN ＡＤユーザマスタ AD ON AD.従業員コード = JU.従業員コード --account
// LEFT JOIN tougou.職掌マスタ PS ON PS.職掌コード = JU.職掌コード --position
// LEFT JOIN 従業員マスタ EMP ON EMP.従業員コード = AD.従業員コード --employment
// WHERE
// AD.有効区分 = 1
// ORDER BY AD.ユーザＩＤ ASC
// `;

// export const getUserOracleVNQuery = (username: string) => `
// with
//     bsr   as (select * from (select a.*,rank() over(partition by 部署コード order by 変更日 desc) as rk from tougou.部署履歴マスタ a) where rk = 1)
//     ,kr   as (select * from (select a.*,rank() over(partition by 課コード order by 変更日 desc) as rk from tougou.課履歴マスタ a) where rk = 1)
//     ,gr   as (select * from (select a.*,rank() over(partition by グループコード order by 変更日 desc) as rk from tougou.グループ履歴マスタ a) where rk = 1)
//     ,br   as (select * from (select a.*,rank() over(partition by 部コード order by 変更日 desc) as rk from tougou.部履歴マスタ a) where rk = 1)
//     ,kkjr as (select * from (select a.*,rank() over(partition by 拠点コード order by 変更日 desc) as rk from tougou.拠点基本情報履歴マスタ a) where rk = 1)
// select
//     t2.従業員コード
//     ,CASE
//         WHEN t1.姓 is null THEN ' '
//         WHEN t1.姓 is not null THEN t1.姓
//     END as 姓
//     ,CASE
//         WHEN t1.名 is null THEN ' '
//         WHEN t1.名 is not null THEN t1.名
//     END as 名
//     ,t2.ユーザＩＤ
//     ,kkjr2.拠点名 as 課名
//     ,kkjr4.拠点名 as 部名

// from
//     bsr
//     inner join kr  on kr.課コード = bsr.運営管理課コード
//     left  join gr  on gr.グループコード = kr.グループコード
//     inner join br  on br.部コード = nvl(gr.部コード,kr.部コード)
//     inner join kkjr kkjr2 on kkjr2.拠点コード = kr.部署コード
//     inner join kkjr kkjr4 on kkjr4.拠点コード = br.部署コード
//     left join tougou.特別ユーザ管理マスタ t1 on t1.所属部署コード = bsr.部署コード
//     left join tougou.ＡＤユーザマスタ t2 on t1.従業員コード = t2.従業員コード
// where
//     t2.従業員コード is not null
// AND
//     t2.有効区分 = 1
// AND t1.職掌コード <> '900'
// And t2.ユーザＩＤ like '%${username}%'
//   `;
// export const getUserOracleVNQueryVersion2 = (
//   offset: number | undefined,
//   next: number | undefined,
//   list: string | undefined,
//   email?: string | undefined,
//   departmentId?: string | undefined,
//   order?: string | undefined,
// ) => `
//   SELECT
// t2.ユーザＩＤ as usernameVN
// ,t1.姓 as firstNameVN
// ,t1.名 as lastNameVN
// ,JU.所属部署コード as departmentId-- mã phòng ban
// ,KM1.拠点名  as departmentName -- tên phòng ban (ó thể lẫn lộn phòng, bộ phận, nhómAS 部署名
// ,PS.職掌コード as positionId
// ,PS.職掌名 as position
// ,PS.職掌略称 as positionName
// ,HJ1.法人コード as companyId
// ,HJ1.法人名 as company -- tên công ty hệ thống cần
// ,t2.従業員コード as employVN
// ,BS1.部署コード -- mã bộ phận
// FROM
// (
// SELECT 従業員コード,所属部署コード,職掌コード FROM 従業員マスタ
// UNION ALL
// SELECT 従業員コード,所属部署コード,職掌コード FROM 従業員兼任マスタ
// ) JU
// INNER JOIN (SELECT * FROM (SELECT BS.*,RANK() OVER(PARTITION BY 部署コード ORDER BY 変更日 DESC) RK FROM 部署履歴マスタ BS WHERE 変更日 <= SYSDATE) WHERE RK = 1) BS1
// ON BS1.部署コード = JU.所属部署コード
// INNER JOIN (SELECT * FROM (SELECT KA.*,RANK() OVER(PARTITION BY 課コード   ORDER BY 変更日 DESC) RK FROM 課履歴マスタ KA   WHERE 変更日 <= SYSDATE) WHERE RK = 1) KA1
// ON KA1.課コード = BS1.運営管理課コード
// INNER JOIN (SELECT * FROM (SELECT BU.*,RANK() OVER(PARTITION BY 部コード   ORDER BY 変更日 DESC) RK FROM 部履歴マスタ BU   WHERE 変更日 <= SYSDATE) WHERE RK = 1) BU1
// ON BU1.部コード = KA1.部コード
// INNER JOIN (SELECT * FROM (SELECT HB.*,RANK() OVER(PARTITION BY 本部コード ORDER BY 変更日 DESC) RK FROM 本部履歴マスタ HB WHERE 変更日 <= SYSDATE) WHERE RK = 1) HB1
// ON HB1.本部コード = BU1.本部コード
// INNER JOIN (SELECT * FROM (SELECT HJ.*,RANK() OVER(PARTITION BY 法人コード ORDER BY 変更日 DESC) RK FROM 法人履歴マスタ HJ WHERE 変更日 <= SYSDATE) WHERE RK = 1) HJ1
// ON HJ1.法人コード = HB1.法人コード
// INNER JOIN 拠点基本情報マスタ KM1 ON KM1.拠点コード = BS1.部署コード
// INNER JOIN 拠点基本情報マスタ KM2 ON KM2.拠点コード = KA1.部署コード
// INNER JOIN 拠点基本情報マスタ KM3 ON KM3.拠点コード = BU1.部署コード
// INNER JOIN 拠点基本情報マスタ KM4 ON KM4.拠点コード = HB1.部署コード
// INNER JOIN ＡＤユーザマスタ AD ON AD.従業員コード = JU.従業員コード --account
// INNER JOIN tougou.職掌マスタ PS ON PS.職掌コード = JU.職掌コード --position
// INNER JOIN 従業員マスタ EMP ON EMP.従業員コード = AD.従業員コード --employment
// --WHERE JU.従業員コード = '2005721'
// --vn
// INNER JOIN 特別ユーザ管理マスタ t1 ON t1.所属部署コード = BS1.部署コード -- nguoi dung dac biet
// INNER join tougou.ＡＤユーザマスタ t2 on t1.従業員コード = t2.従業員コード

// where
//  t2.ユーザＩＤ is not null

// ${
//   email !== undefined
//     ? `
// AND (t2.ユーザＩＤ Like N'%${email}%'
//   OR t1.姓 Like N'%${email}%'
//   OR t1.名 Like N'%${email}%')
// `
//     : ''
// }
// ${list && list.length > 0 && `AND t2.従業員コード NOT IN (${list})`}
// ${departmentId ? `AND KM1.拠点名 Like N'%${departmentId}%'` : ''}

// GROUP BY t2.ユーザＩＤ ,t1.姓,t1.名 ,JU.所属部署コード,KM1.拠点名 ,PS.職掌コード,PS.職掌名,PS.職掌略称,HJ1.法人コード ,HJ1.法人名 ,t2.従業員コード ,BS1.部署コード
// ${order && order}
// OFFSET ${offset} ROWS FETCH NEXT ${next || 0} ROWS ONLY
// `;

// export const getUserDetailOracleQuery = (
//   offset: number | undefined,
//   next: number | undefined,
//   list: string | undefined,
//   email?: string | undefined,
//   departmentId?: string | undefined,
// ) => `

// SELECT
// ＡＤユーザマスタ.ユーザＩＤ,
// 従業員マスタ.姓,
// 従業員マスタ.名,
// tougou.拠点基本情報マスタ.拠点名, --departmentName
// tougou.職掌マスタ.職掌名,
// tougou.職掌マスタ.職掌コード, --positionId
// --TOUGOU.従業員兼任マスタ.職掌コード,
// TOUGOU.従業員兼任マスタ.所属部署コード, --departmentId
// ＡＤユーザマスタ.従業員コード

// FROM
// ＡＤユーザマスタ
// LEFT OUTER JOIN 従業員マスタ ON ＡＤユーザマスタ.従業員コード = 従業員マスタ.従業員コード
// LEFT OUTER JOIN TOUGOU.従業員兼任マスタ ON 従業員マスタ.従業員コード =  tougou.従業員兼任マスタ.従業員コード
// LEFT OUTER JOIN tougou.職掌マスタ ON TOUGOU.従業員兼任マスタ.職掌コード =  tougou.職掌マスタ.職掌コード
// LEFT OUTER JOIN tougou.拠点基本情報マスタ ON TOUGOU.従業員兼任マスタ.所属部署コード =  tougou.拠点基本情報マスタ.拠点コード

// WHERE
// ＡＤユーザマスタ.有効区分 = 1
// AND TOUGOU.従業員兼任マスタ.有効区分 = 1
// AND 従業員マスタ.有効区分 = 1
// AND tougou.拠点基本情報マスタ.有効区分 = 1
// ${
//   email !== undefined
//     ? `
// AND (ＡＤユーザマスタ.ユーザＩＤ Like N'%${email}%'
//   OR 従業員マスタ.姓 Like N'%${email}%'
//   OR 従業員マスタ.名 Like N'%${email}%')
// `
//     : ''
// }
// ${departmentId ? `AND tougou.拠点基本情報マスタ.拠点名 Like N'%${departmentId}%'` : ''}
// ${list !== undefined ? `AND ＡＤユーザマスタ.従業員コード NOT IN (${list})` : ''}
// ORDER BY ＡＤユーザマスタ.ユーザＩＤ ASC
// OFFSET ${offset} ROWS FETCH NEXT ${next || 0} ROWS ONLY
// `;

// export const getDepartmentUserDetailOracleQuery = `

// SELECT
// tougou.拠点基本情報マスタ.拠点名, --departmentName
// TOUGOU.従業員兼任マスタ.所属部署コード --departmentId
// FROM
// ＡＤユーザマスタ
// LEFT OUTER JOIN 従業員マスタ ON ＡＤユーザマスタ.従業員コード = 従業員マスタ.従業員コード
// LEFT OUTER JOIN TOUGOU.従業員兼任マスタ ON 従業員マスタ.従業員コード =  tougou.従業員兼任マスタ.従業員コード
// LEFT OUTER JOIN tougou.職掌マスタ ON TOUGOU.従業員兼任マスタ.職掌コード =  tougou.職掌マスタ.職掌コード
// LEFT OUTER JOIN tougou.拠点基本情報マスタ ON TOUGOU.従業員兼任マスタ.所属部署コード =  tougou.拠点基本情報マスタ.拠点コード

// WHERE
// ＡＤユーザマスタ.有効区分 = 1
// AND TOUGOU.従業員兼任マスタ.有効区分 = 1
// AND 従業員マスタ.有効区分 = 1
// AND tougou.拠点基本情報マスタ.有効区分 = 1
// `;
