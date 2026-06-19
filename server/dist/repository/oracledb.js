"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countUserDB = exports.getUserDbOracle = exports.getCompany = exports.getDepartment = void 0;
exports.getDepartment = `
select KJ.拠点コード, KJ.拠点名 
from 拠点基本情報マスタ KJ
where (exists (select 1 from 従業員マスタ JM inner join ＡＤユーザマスタ AD on JM.従業員コード = AD.従業員コード and AD.有効区分 = '1' and JM.有効区分 = '1' where KJ.拠点コード = JM.所属部署コード) 
or exists (select 1 from 従業員兼任マスタ JK inner join ＡＤユーザマスタ AD on JK.従業員コード = AD.従業員コード and AD.有効区分 = '1' and JK.有効区分 = '1' where KJ.拠点コード = JK.所属部署コード)
or exists (select 1 from 特別ユーザ管理マスタ TK inner join ＡＤユーザマスタ AD on TK.従業員コード = AD.従業員コード and AD.有効区分 = '1' and TK.有効区分 = '1' where KJ.拠点コード = TK.所属部署コード)) order by KJ.拠点名 ASC
`;
exports.getCompany = `
select 法人コード AS COMPANYID,法人名 AS COMPANY from 法人マスタ
`;
const getUserDbOracle = (employmentList) => `
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
  ${employmentList.length > 0
    ? `AND AD.従業員コード NOT IN (${employmentList.toString()})`
    : ''}

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
  ${employmentList.length > 0
    ? `AND AD.従業員コード NOT IN (${employmentList.toString()})`
    : ''}
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
    ${employmentList.length > 0
    ? `AND AD.従業員コード NOT IN (${employmentList.toString()})`
    : ''}
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
exports.getUserDbOracle = getUserDbOracle;
const countUserDB = (employmentList) => `
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
${employmentList.length > 0
    ? `AND AD.従業員コード NOT IN (${employmentList.toString()})`
    : ''}

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
  ${employmentList.length > 0
    ? `AND AD.従業員コード NOT IN (${employmentList.toString()})`
    : ''}


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
  ${employmentList.length > 0
    ? `AND AD.従業員コード NOT IN (${employmentList.toString()})`
    : ''}
  
GROUP BY (AD.ユーザＩＤ, t1.姓, t1.名, t1.所属部署コード, KM.拠点名 ,PS.職掌コード ,PS.職掌名 ,PS.職掌略称 ,CP.法人コード ,CP.法人名 ,AD.従業員コード,KM.有効区分)
) DUM
`;
exports.countUserDB = countUserDB;
//# sourceMappingURL=oracledb.js.map