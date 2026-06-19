import { Test } from '@nestjs/testing';
import { ENTITY_MODULES } from 'src/entity/EntityExport';
import { OracleRepository } from 'src/repository/oracle.repository';
import OracleService from 'src/services/oracle.service';

describe('OracleService', () => {
  let oracleRepository: OracleRepository;
  let oracleService: OracleService;
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [OracleRepository, OracleService, ...ENTITY_MODULES],
    }).compile();

    oracleRepository = moduleRef.get<OracleRepository>(OracleRepository);
    oracleService = moduleRef.get<OracleService>(OracleService);
  });

  test('get department oracle', async () => {
    const results: any = [
      {
        departmentId: '00032',
        departmentName: '採用教育部',
      },
      {
        departmentId: '00056',
        departmentName: 'ｱﾐｭｰｽﾞﾒﾝﾄ事業部',
      },
      {
        departmentId: '00071',
        departmentName: '社長室',
      },
      {
        departmentId: '00072',
        departmentName: 'ｹﾞｵ事業部',
      },
      {
        departmentId: '00075',
        departmentName: 'ｾｶﾝﾄﾞｽﾄﾘｰﾄ事業部',
      },
      {
        departmentId: '00081',
        departmentName: 'ｾｶﾝﾄﾞｽﾄﾘｰﾄ店舗運営1課',
      },
      {
        departmentId: '00091',
        departmentName: '組織開発室',
      },
      {
        departmentId: '00205',
        departmentName: '九州沖縄業務課',
      },
      {
        departmentId: '00220',
        departmentName: '店舗立上3課',
      },
      {
        departmentId: '00227',
        departmentName: '中国四国業務課',
      },
      {
        departmentId: '00430',
        departmentName: '犬山用品出荷ｾﾝﾀｰ',
      },
      {
        departmentId: '00433',
        departmentName: '商品購買3課',
      },
      {
        departmentId: '00440',
        departmentName: '岩倉ﾒﾃﾞｨｱ加工',
      },
      {
        departmentId: '00446',
        departmentName: '札幌物販流通',
      },
      {
        departmentId: '00469',
        departmentName: '福岡物販流通',
      },
      {
        departmentId: '00677',
        departmentName: '岩倉ﾒﾃﾞｨｱEC販売倉庫',
      },
      {
        departmentId: '00717',
        departmentName: '宅配ﾚﾝﾀﾙ課ﾕﾆｯﾄ',
      },
      {
        departmentId: '00796',
        departmentName: '店舗開発部',
      },
      {
        departmentId: '00810',
        departmentName: 'GEO春日井店',
      },
      {
        departmentId: '00814',
        departmentName: 'GEO萩野通店',
      },
      {
        departmentId: '00830',
        departmentName: 'GEO半田店',
      },
      {
        departmentId: '00834',
        departmentName: 'GEO津南店',
      },
      {
        departmentId: '00839',
        departmentName: 'GEO北新宿店',
      },
      {
        departmentId: '00842',
        departmentName: 'GMB池袋北口店',
      },
      {
        departmentId: '00844',
        departmentName: 'GEOﾎﾞｰﾄ店',
      },
      {
        departmentId: '00853',
        departmentName: 'GEO西尾店',
      },
      {
        departmentId: '00921',
        departmentName: '経理1課',
      },
      {
        departmentId: '00922',
        departmentName: 'ｸﾞﾙｰﾌﾟ会社支援課',
      },
      {
        departmentId: '00941',
        departmentName: '法務課',
      },
      {
        departmentId: '00944',
        departmentName: '労務課',
      },
      {
        departmentId: '00946',
        departmentName: '監査課',
      },
      {
        departmentId: '01013',
        departmentName: 'ｲｰﾈｯﾄﾌﾛﾝﾃｨｱ',
      },
      {
        departmentId: '01015',
        departmentName: 'ﾃｨｰ･ｱﾝﾄﾞ･ｼﾞｰ',
      },
      {
        departmentId: '01034',
        departmentName: 'ｹﾞｵﾋﾞｼﾞﾈｽｻﾎﾟｰﾄ',
      },
      {
        departmentId: '01040',
        departmentName: 'ｴｲｼｽ',
      },
      {
        departmentId: '01101',
        departmentName: '内部統制室',
      },
      {
        departmentId: '01121',
        departmentName: 'GEO北本店',
      },
      {
        departmentId: '01122',
        departmentName: 'GEOひばりヶ丘店',
      },
      {
        departmentId: '01202',
        departmentName: '情報ｼｽﾃﾑ部',
      },
      {
        departmentId: '01221',
        departmentName: '次世代ｼｽﾃﾑ開発課',
      },
      {
        departmentId: '01233',
        departmentName: 'ｼｽﾃﾑｻﾎﾟｰﾄ課',
      },
      {
        departmentId: '01237',
        departmentName: 'ｼｽﾃﾑ管理課',
      },
      {
        departmentId: '01246',
        departmentName: '岩倉六反田ﾘﾕｰｽEC加工',
      },
      {
        departmentId: '01254',
        departmentName: 'ｶｽﾀﾏｰｻﾎﾟｰﾄ課',
      },
      {
        departmentId: '01255',
        departmentName: '人財教育課',
      },
      {
        departmentId: '01261',
        departmentName: '物件開発課',
      },
      {
        departmentId: '01267',
        departmentName: '人財採用課',
      },
      {
        departmentId: '01268',
        departmentName: '原価計算課',
      },
      {
        departmentId: '01283',
        departmentName: 'ｳｪｱﾊｳｽ事業課',
      },
      {
        departmentId: '01291',
        departmentName: 'ｹﾞｵ在庫管理課',
      },
      {
        departmentId: '01292',
        departmentName: '物流1課',
      },
      {
        departmentId: '01293',
        departmentName: 'EC流通課',
      },
      {
        departmentId: '01298',
        departmentName: 'ｾｶﾝﾄﾞｽﾄﾘｰﾄ運営支援課',
      },
      {
        departmentId: '01299',
        departmentName: '施設管理課',
      },
      {
        departmentId: '01300',
        departmentName: '業務ｼｽﾃﾑ改善課',
      },
      {
        departmentId: '01302',
        departmentName: 'ｹﾞｵHD',
      },
      {
        departmentId: '01303',
        departmentName: 'ｹﾞｵ',
      },
      {
        departmentId: '01305',
        departmentName: 'ｹﾞｵﾃﾞｨﾉｽ',
      },
      {
        departmentId: '01315',
        departmentName: 'ｲｰﾈｯﾄ･ﾌﾛﾝﾃｨｱ課',
      },
      {
        departmentId: '01350',
        departmentName: '総務課',
      },
      {
        departmentId: '01354',
        departmentName: 'ｳｪｱﾊｳｽ1地区',
      },
      {
        departmentId: '01356',
        departmentName: 'ｳｪｱﾊｳｽ2地区',
      },
      {
        departmentId: '01357',
        departmentName: 'ﾏｰｹﾃｨﾝｸﾞ課',
      },
      {
        departmentId: '01393',
        departmentName: '犬山ﾘﾕｰｽ倉庫',
      },
      {
        departmentId: '01419',
        departmentName: 'ﾈｯﾄﾜｰｸ戦略課',
      },
      {
        departmentId: '01460',
        departmentName: 'ｹﾞｵ共通費(総務付)',
      },
      {
        departmentId: '01492',
        departmentName: '高山加工',
      },
      {
        departmentId: '01500',
        departmentName: '財務部',
      },
      {
        departmentId: '01501',
        departmentName: '経理2課',
      },
      {
        departmentId: '01505',
        departmentName: 'GBSｻﾎﾟｰﾄﾕﾆｯﾄ',
      },
      {
        departmentId: '01786',
        departmentName: 'SS函館昭和店',
      },
      {
        departmentId: '01798',
        departmentName: 'SS大河原店',
      },
      {
        departmentId: '01805',
        departmentName: 'SS北上店',
      },
      {
        departmentId: '01811',
        departmentName: 'SS恵那店',
      },
      {
        departmentId: '01812',
        departmentName: 'SS新庄店',
      },
      {
        departmentId: '01819',
        departmentName: 'SS君津店',
      },
      {
        departmentId: '01823',
        departmentName: 'SS東松山店',
      },
      {
        departmentId: '01827',
        departmentName: 'SS八戸下長店',
      },
      {
        departmentId: '01830',
        departmentName: 'SS坂戸店',
      },
      {
        departmentId: '01845',
        departmentName: 'SS須坂店',
      },
      {
        departmentId: '01849',
        departmentName: 'SS岩見沢店',
      },
      {
        departmentId: '01853',
        departmentName: 'SS札幌手稲店',
      },
      {
        departmentId: '01857',
        departmentName: 'SS札幌伏古店',
      },
      {
        departmentId: '01868',
        departmentName: 'SS岐阜河渡店',
      },
      {
        departmentId: '01871',
        departmentName: 'SS茨島店',
      },
      {
        departmentId: '01872',
        departmentName: 'SS半田成岩店',
      },
      {
        departmentId: '01973',
        departmentName: 'ｹﾞｵ小牧什器倉庫',
      },
      {
        departmentId: '02008',
        departmentName: 'GEO豊田広路店',
      },
      {
        departmentId: '02010',
        departmentName: 'GEO岐阜北島店',
      },
      {
        departmentId: '02011',
        departmentName: 'GEO秋田土崎店',
      },
      {
        departmentId: '02013',
        departmentName: 'GEOｻﾝﾛｰﾄﾞｼﾃｨ人吉店',
      },
      {
        departmentId: '02033',
        departmentName: 'GEO医大ﾊﾞｲﾊﾟｽ店',
      },
      {
        departmentId: '02043',
        departmentName: 'GEO長井店',
      },
      {
        departmentId: '02051',
        departmentName: 'GEO碧南店',
      },
      {
        departmentId: '02053',
        departmentName: 'GEO五所川原店',
      },
      {
        departmentId: '02063',
        departmentName: 'GEO大分森町店',
      },
      {
        departmentId: '02064',
        departmentName: 'GEO会津若松古川町店',
      },
      {
        departmentId: '02066',
        departmentName: 'GEO辻本通店',
      },
      {
        departmentId: '02067',
        departmentName: 'GMBｱｷﾊﾞ店',
      },
      {
        departmentId: '02070',
        departmentName: 'GEO金山駅北口店',
      },
      {
        departmentId: '02076',
        departmentName: 'GEO岐阜茜部店',
      },
      {
        departmentId: '02078',
        departmentName: 'GEO豊川店',
      },
      {
        departmentId: '02081',
        departmentName: 'GEO熊谷店',
      },
      {
        departmentId: '02082',
        departmentName: 'GEO静岡ｲﾝﾀｰ店',
      },
      {
        departmentId: '02087',
        departmentName: 'GEO木月店',
      },
      {
        departmentId: '02091',
        departmentName: 'GEO札幌西岡店',
      },
      {
        departmentId: '02092',
        departmentName: 'GEO弥富通店',
      },
      {
        departmentId: '02094',
        departmentName: 'GEO宇部工学部通店',
      },
      {
        departmentId: '02095',
        departmentName: 'GEO東海荒尾店',
      },
      {
        departmentId: '02098',
        departmentName: 'GEO安城大東店',
      },
      {
        departmentId: '02100',
        departmentName: 'GEO札幌西町店',
      },
      {
        departmentId: '02104',
        departmentName: 'GEO春日井ｲﾝﾀｰ店',
      },
      {
        departmentId: '02106',
        departmentName: 'GEO御器所店',
      },
      {
        departmentId: '02107',
        departmentName: 'GEO榛原店',
      },
      {
        departmentId: '02109',
        departmentName: 'GEO横手店',
      },
      {
        departmentId: '02115',
        departmentName: 'GEO浜松幸店',
      },
      {
        departmentId: '02116',
        departmentName: 'GEO札幌環状通東店',
      },
      {
        departmentId: '02117',
        departmentName: 'GEO札幌発寒店',
      },
      {
        departmentId: '02119',
        departmentName: 'GEO道徳店',
      },
      {
        departmentId: '02120',
        departmentName: 'GEO蘇原店',
      },
      {
        departmentId: '02123',
        departmentName: 'GEO三重大学前店',
      },
      {
        departmentId: '02125',
        departmentName: 'GEO関緑ヶ丘店',
      },
      {
        departmentId: '02127',
        departmentName: 'GEO千種駅南店',
      },
      {
        departmentId: '02130',
        departmentName: 'GEO札幌南郷通店',
      },
      {
        departmentId: '02131',
        departmentName: 'SS岐阜長良店',
      },
      {
        departmentId: '02136',
        departmentName: 'GEO国立店',
      },
      {
        departmentId: '02140',
        departmentName: 'GEO須賀川店',
      },
      {
        departmentId: '02141',
        departmentName: 'GEOｲｵﾝﾀｳﾝ荒尾店',
      },
      {
        departmentId: '02143',
        departmentName: 'GEO花巻店',
      },
      {
        departmentId: '02145',
        departmentName: 'GEO大分高城店',
      },
      {
        departmentId: '02147',
        departmentName: 'GEO光店',
      },
      {
        departmentId: '02148',
        departmentName: 'GEO大分明野店',
      },
      {
        departmentId: '02151',
        departmentName: 'GEO狛江店',
      },
      {
        departmentId: '02156',
        departmentName: 'GEO堺一条店',
      },
      {
        departmentId: '02164',
        departmentName: 'GEO西新井店',
      },
      {
        departmentId: '02165',
        departmentName: 'GEO三鷹駅南口店',
      },
      {
        departmentId: '02166',
        departmentName: 'GEO田無北原店',
      },
      {
        departmentId: '02167',
        departmentName: 'GEO鶴見緑地公園店',
      },
      {
        departmentId: '02168',
        departmentName: 'GEO西八王子店',
      },
      {
        departmentId: '02169',
        departmentName: 'GEO甲府昭和店',
      },
      {
        departmentId: '02170',
        departmentName: 'GEO新所沢店',
      },
      {
        departmentId: '02171',
        departmentName: 'GEO西台店',
      },
      {
        departmentId: '02172',
        departmentName: 'GEOPATあやせ店',
      },
      {
        departmentId: '02173',
        departmentName: 'GEO中央林間店',
      },
      {
        departmentId: '02175',
        departmentName: 'GEO喜連東店',
      },
      {
        departmentId: '02177',
        departmentName: 'GEO西国分寺店',
      },
      {
        departmentId: '02178',
        departmentName: 'GEO池上店',
      },
      {
        departmentId: '02179',
        departmentName: 'GEO小平小川町店',
      },
      {
        departmentId: '02181',
        departmentName: 'GEO平塚店',
      },
      {
        departmentId: '02186',
        departmentName: 'GEO能代店',
      },
      {
        departmentId: '02187',
        departmentName: 'GEO山口湯田店',
      },
      {
        departmentId: '02194',
        departmentName: 'GEO具志川店',
      },
      {
        departmentId: '02195',
        departmentName: 'GEO仙台八乙女店',
      },
      {
        departmentId: '02203',
        departmentName: 'GEO甲府国母店',
      },
      {
        departmentId: '02205',
        departmentName: 'GEO高島平店',
      },
      {
        departmentId: '02207',
        departmentName: 'GEO京成大久保店',
      },
      {
        departmentId: '02220',
        departmentName: 'GEO高蔵寺店',
      },
      {
        departmentId: '02229',
        departmentName: 'GEO福岡東光寺店',
      },
      {
        departmentId: '02230',
        departmentName: 'GEO佐土原店',
      },
      {
        departmentId: '02231',
        departmentName: 'GEO岐阜羽島店',
      },
      {
        departmentId: '02240',
        departmentName: '岩倉物販流通',
      },
      {
        departmentId: '02241',
        departmentName: 'GEO名張店',
      },
      {
        departmentId: '02246',
        departmentName: 'GEO古川橋店',
      },
      {
        departmentId: '02251',
        departmentName: 'GEO那覇新都心店',
      },
      {
        departmentId: '02259',
        departmentName: 'GEO川崎店',
      },
      {
        departmentId: '02261',
        departmentName: 'GEO札幌北24条駅前店',
      },
      {
        departmentId: '02271',
        departmentName: 'GEO札幌南11条店',
      },
      {
        departmentId: '02282',
        departmentName: 'GEO札幌南平岸店',
      },
      {
        departmentId: '02284',
        departmentName: 'GEO鹿角店',
      },
      {
        departmentId: '02295',
        departmentName: 'GEO気仙沼南郷店',
      },
      {
        departmentId: '02298',
        departmentName: 'GEO秋田東通店',
      },
      {
        departmentId: '02300',
        departmentName: 'GEO弘前新町店',
      },
      {
        departmentId: '02305',
        departmentName: 'GEO東大宮店',
      },
      {
        departmentId: '02306',
        departmentName: 'GEO由利本荘桜小路店',
      },
      {
        departmentId: '02310',
        departmentName: 'GEO三沢店',
      },
      {
        departmentId: '02311',
        departmentName: 'GEO青森柳川店',
      },
      {
        departmentId: '02314',
        departmentName: 'GEO奥州水沢日高店',
      },
      {
        departmentId: '02315',
        departmentName: 'GEO大牟田田隈店',
      },
      {
        departmentId: '02316',
        departmentName: 'GEO宮崎平和台店',
      },
      {
        departmentId: '02318',
        departmentName: 'GEO宮崎恒久店',
      },
      {
        departmentId: '02323',
        departmentName: 'GEO大崎古川駅前店',
      },
      {
        departmentId: '02327',
        departmentName: 'GEO青森荒川店',
      },
      {
        departmentId: '02328',
        departmentName: 'GEO十和田千歳森店',
      },
      {
        departmentId: '02329',
        departmentName: 'GEO高槻寿町店',
      },
      {
        departmentId: '02330',
        departmentName: 'GEO武庫之荘店',
      },
      {
        departmentId: '02334',
        departmentName: 'GEO伊丹店',
      },
      {
        departmentId: '02335',
        departmentName: 'GEO大宮本郷店',
      },
      {
        departmentId: '02338',
        departmentName: 'GEO千歳信濃店',
      },
      {
        departmentId: '02339',
        departmentName: 'GEO新開地店',
      },
      {
        departmentId: '02341',
        departmentName: 'GEO酒田駅前店',
      },
      {
        departmentId: '02342',
        departmentName: 'GEO磐田今之浦店',
      },
      {
        departmentId: '02343',
        departmentName: 'GEO佐賀北川副店',
      },
      {
        departmentId: '02344',
        departmentName: 'GEOつつじヶ丘駅前店',
      },
      {
        departmentId: '02345',
        departmentName: 'GEO鶴岡美咲町店',
      },
      {
        departmentId: '02346',
        departmentName: 'GEO浜松市野店',
      },
      {
        departmentId: '02347',
        departmentName: 'GEO田無駅前店',
      },
      {
        departmentId: '02356',
        departmentName: 'GEO廿日市店',
      },
      {
        departmentId: '02358',
        departmentName: 'GEO秋田牛島店',
      },
      {
        departmentId: '02359',
        departmentName: 'GEO藤枝水上店',
      },
      {
        departmentId: '02360',
        departmentName: 'GEO那覇小禄店',
      },
      {
        departmentId: '02362',
        departmentName: 'GEO八千代高津店',
      },
      {
        departmentId: '02368',
        departmentName: 'GEO会津若松ｲﾝﾀｰ店',
      },
      {
        departmentId: '02369',
        departmentName: 'GEO泡瀬店',
      },
      {
        departmentId: '02377',
        departmentName: 'GEO北上常盤台店(旧)',
      },
      {
        departmentId: '02378',
        departmentName: 'GEO米沢金池店',
      },
      {
        departmentId: '02380',
        departmentName: 'GEO佐世保藤原店',
      },
      {
        departmentId: '02382',
        departmentName: 'GEO八雲店',
      },
      {
        departmentId: '02383',
        departmentName: 'GEO柳井店',
      },
      {
        departmentId: '02386',
        departmentName: 'GEO札幌美しが丘店',
      },
      {
        departmentId: '02387',
        departmentName: 'GEO弥生台店',
      },
      {
        departmentId: '02389',
        departmentName: 'GEO当知店',
      },
      {
        departmentId: '02390',
        departmentName: 'GEO札幌光星店',
      },
      {
        departmentId: '02391',
        departmentName: 'GEO延岡店',
      },
      {
        departmentId: '02392',
        departmentName: 'GEO一日橋店',
      },
      {
        departmentId: '02393',
        departmentName: 'GEO市ヶ尾店',
      },
      {
        departmentId: '02397',
        departmentName: 'GEO札幌麻生店',
      },
      {
        departmentId: '02399',
        departmentName: 'GEO上野幌店',
      },
      {
        departmentId: '02401',
        departmentName: 'GEO海老名店',
      },
      {
        departmentId: '02403',
        departmentName: 'GEO亀岡店',
      },
      {
        departmentId: '02409',
        departmentName: 'GEO西那須野店',
      },
      {
        departmentId: '02410',
        departmentName: 'GEO瀬谷店',
      },
      {
        departmentId: '02413',
        departmentName: 'GEO留萌店',
      },
      {
        departmentId: '02414',
        departmentName: 'GEO男鹿店',
      },
      {
        departmentId: '02416',
        departmentName: 'GEO富山布瀬店',
      },
      {
        departmentId: '02417',
        departmentName: 'GEO鈴蘭台店',
      },
      {
        departmentId: '02420',
        departmentName: 'GEO益田店',
      },
      {
        departmentId: '02422',
        departmentName: 'GEO福島鳥谷野店',
      },
      {
        departmentId: '02423',
        departmentName: 'GEO大垣ﾊﾞｲﾊﾟｽ店',
      },
      {
        departmentId: '02424',
        departmentName: 'GEO萩店',
      },
      {
        departmentId: '02425',
        departmentName: 'GEO南陽店',
      },
      {
        departmentId: '02429',
        departmentName: 'GEO札幌新琴似四番通店',
      },
      {
        departmentId: '02432',
        departmentName: 'GEO北広島店',
      },
      {
        departmentId: '02434',
        departmentName: 'GEO千歳駅前店',
      },
      {
        departmentId: '02436',
        departmentName: 'GEO苫小牧新生台店',
      },
      {
        departmentId: '02438',
        departmentName: 'GEO登別店',
      },
      {
        departmentId: '02439',
        departmentName: 'GEO苫小牧桜木店',
      },
      {
        departmentId: '02443',
        departmentName: 'GEO室蘭東町店',
      },
      {
        departmentId: '02444',
        departmentName: 'GEO滝川東町店',
      },
      {
        departmentId: '02447',
        departmentName: 'GEO富良野店',
      },
      {
        departmentId: '02449',
        departmentName: 'GEO北見南大通店',
      },
      {
        departmentId: '02450',
        departmentName: 'GEO函館昭和店',
      },
      {
        departmentId: '02451',
        departmentName: 'GEO一社店',
      },
      {
        departmentId: '02454',
        departmentName: 'SS滝川店',
      },
      {
        departmentId: '02456',
        departmentName: 'SS室蘭店',
      },
      {
        departmentId: '02457',
        departmentName: 'SS広面店',
      },
      {
        departmentId: '02459',
        departmentName: 'SS飯島店',
      },
      {
        departmentId: '02464',
        departmentName: 'SS郡山店',
      },
      {
        departmentId: '02465',
        departmentName: 'SS古川東店',
      },
      {
        departmentId: '02482',
        departmentName: 'SS新琴似店',
      },
      {
        departmentId: '02484',
        departmentName: 'SS札幌光星店',
      },
      {
        departmentId: '02488',
        departmentName: 'GEO鳴尾店',
      },
      {
        departmentId: '02490',
        departmentName: 'GEO北斗久根別店',
      },
      {
        departmentId: '02491',
        departmentName: 'GEO函館戸倉店',
      },
      {
        departmentId: '02494',
        departmentName: 'GEO帯広ﾄﾞﾘｰﾑﾀｳﾝ店',
      },
      {
        departmentId: '02495',
        departmentName: 'GEO焼山店',
      },
      {
        departmentId: '02496',
        departmentName: 'GEO津山ｲﾝﾀｰ店',
      },
      {
        departmentId: '02497',
        departmentName: 'GEO福浜店',
      },
      {
        departmentId: '02498',
        departmentName: 'GEO下中野店',
      },
      {
        departmentId: '02500',
        departmentName: 'GEO笹沖店',
      },
      {
        departmentId: '02501',
        departmentName: 'GEO小田中店',
      },
      {
        departmentId: '02503',
        departmentName: 'GEO玉野店',
      },
      {
        departmentId: '02506',
        departmentName: 'GEO美幌店',
      },
      {
        departmentId: '02508',
        departmentName: 'GEO東淀川店',
      },
      {
        departmentId: '02510',
        departmentName: 'GEO一関ｲﾝﾀｰ店',
      },
      {
        departmentId: '02511',
        departmentName: 'GEO札幌篠路店',
      },
      {
        departmentId: '02512',
        departmentName: 'GEO仙台南中山店',
      },
      {
        departmentId: '02516',
        departmentName: 'GEO川口赤山店',
      },
      {
        departmentId: '02520',
        departmentName: 'GEOｲｵﾝﾀｳﾝ大曲店',
      },
      {
        departmentId: '02521',
        departmentName: 'GEO遠軽店',
      },
      {
        departmentId: '02522',
        departmentName: 'GEO太田宝町店',
      },
      {
        departmentId: '02527',
        departmentName: 'GEO根室店',
      },
      {
        departmentId: '02528',
        departmentName: 'GEO宮古店',
      },
      {
        departmentId: '02529',
        departmentName: 'GEO笠岡店',
      },
      {
        departmentId: '02532',
        departmentName: 'GEO北九州大里店',
      },
      {
        departmentId: '02533',
        departmentName: 'GEO稲田堤店',
      },
      {
        departmentId: '02534',
        departmentName: 'GEO西葛西店',
      },
      {
        departmentId: '02535',
        departmentName: 'GEO竹ﾉ塚西店',
      },
      {
        departmentId: '02536',
        departmentName: 'GEO行徳店',
      },
      {
        departmentId: '02539',
        departmentName: 'GEO札幌東苗穂店',
      },
      {
        departmentId: '02541',
        departmentName: 'GEO網走店',
      },
      {
        departmentId: '02542',
        departmentName: 'GEO浦添店',
      },
      {
        departmentId: '02546',
        departmentName: 'GEO茶屋町店',
      },
      {
        departmentId: '02547',
        departmentName: 'GEO水島店',
      },
      {
        departmentId: '02548',
        departmentName: 'GEO玉島店',
      },
      {
        departmentId: '02549',
        departmentName: 'GEO中庄店',
      },
      {
        departmentId: '02550',
        departmentName: 'GEO総社店',
      },
      {
        departmentId: '02552',
        departmentName: 'GEO高屋店',
      },
      {
        departmentId: '02553',
        departmentName: 'GEO益野店',
      },
      {
        departmentId: '02554',
        departmentName: 'GEO平島店',
      },
      {
        departmentId: '02556',
        departmentName: 'GEO伊達ｲﾝﾀｰ店',
      },
      {
        departmentId: '02557',
        departmentName: 'GEO音更木野大通店',
      },
      {
        departmentId: '02561',
        departmentName: 'GEO旭川大町店',
      },
      {
        departmentId: '02564',
        departmentName: 'GEO弘前安原店',
      },
      {
        departmentId: '02566',
        departmentName: 'GEO喜多方店',
      },
      {
        departmentId: '02569',
        departmentName: 'GEO一宮音羽店',
      },
      {
        departmentId: '02571',
        departmentName: 'GEO釜石店',
      },
      {
        departmentId: '02572',
        departmentName: 'GEO佐世保大野店',
      },
      {
        departmentId: '02574',
        departmentName: 'GEO山形花楯店',
      },
      {
        departmentId: '02575',
        departmentName: 'GEO新庄店',
      },
      {
        departmentId: '02578',
        departmentName: 'GEO久喜店',
      },
      {
        departmentId: '02579',
        departmentName: 'GEO坂戸店',
      },
      {
        departmentId: '02585',
        departmentName: 'GEO姉ヶ崎店',
      },
      {
        departmentId: '02588',
        departmentName: 'GEO石垣店',
      },
      {
        departmentId: '02589',
        departmentName: 'GEO奥州水沢佐倉河店',
      },
      {
        departmentId: '02592',
        departmentName: 'GEO黒石ﾊﾞｲﾊﾟｽ店',
      },
      {
        departmentId: '02595',
        departmentName: 'GEO都城上東店',
      },
      {
        departmentId: '02597',
        departmentName: 'GEO郡山うねめ通り店',
      },
      {
        departmentId: '02598',
        departmentName: 'GEO伊予西条店',
      },
      {
        departmentId: '02599',
        departmentName: 'GEO釧路貝塚店',
      },
      {
        departmentId: '02600',
        departmentName: 'GEOいわき平上荒川店',
      },
      {
        departmentId: '02601',
        departmentName: 'GEO石川店',
      },
      {
        departmentId: '02603',
        departmentName: 'GEOﾐﾗｸﾙﾀｳﾝ店',
      },
      {
        departmentId: '02605',
        departmentName: 'GEO円座店',
      },
      {
        departmentId: '02606',
        departmentName: 'GEO観音寺店',
      },
      {
        departmentId: '02607',
        departmentName: 'GEO丸亀南店',
      },
      {
        departmentId: '02608',
        departmentName: 'GEO三木店',
      },
      {
        departmentId: '02611',
        departmentName: 'GEO琴平店',
      },
      {
        departmentId: '02612',
        departmentName: 'GEO斑鳩店',
      },
      {
        departmentId: '02614',
        departmentName: 'GEO奈良押熊店',
      },
      {
        departmentId: '02615',
        departmentName: 'GEO川島店',
      },
      {
        departmentId: '02616',
        departmentName: 'GEO白鳥店',
      },
      {
        departmentId: '02617',
        departmentName: 'GEO土庄店',
      },
      {
        departmentId: '02628',
        departmentName: 'GEO詫間店',
      },
      {
        departmentId: '02631',
        departmentName: 'GEO新座片山店',
      },
      {
        departmentId: '02632',
        departmentName: 'GEO東松山店',
      },
      {
        departmentId: '02634',
        departmentName: 'GEO狭山店',
      },
      {
        departmentId: '02636',
        departmentName: 'GEOつるせ店',
      },
      {
        departmentId: '02637',
        departmentName: 'GEO鳴門店',
      },
      {
        departmentId: '02638',
        departmentName: 'GEO新倉敷店',
      },
      {
        departmentId: '02639',
        departmentName: 'GEO青梅新町店',
      },
      {
        departmentId: '02641',
        departmentName: 'GEO八戸小中野店',
      },
      {
        departmentId: '02642',
        departmentName: 'GEO八戸湊高台店',
      },
      {
        departmentId: '02643',
        departmentName: 'GEO稚内店',
      },
      {
        departmentId: '02646',
        departmentName: 'GEO宮崎ﾌｪﾆｯｸｽｶﾞｰﾃﾞﾝ店',
      },
      {
        departmentId: '02647',
        departmentName: 'GEOｻﾝﾛｰﾄﾞｼﾃｨ熊本店',
      },
      {
        departmentId: '02650',
        departmentName: 'GEO札幌豊平店',
      },
      {
        departmentId: '02653',
        departmentName: 'GEO善光寺下店',
      },
      {
        departmentId: '02654',
        departmentName: 'GEO大豆島店',
      },
      {
        departmentId: '02655',
        departmentName: 'GEO稲里店',
      },
      {
        departmentId: '02656',
        departmentName: 'GEO須坂店',
      },
      {
        departmentId: '02657',
        departmentName: 'GEO中野ﾊﾞｲﾊﾟｽ店',
      },
      {
        departmentId: '02658',
        departmentName: 'GEO佐久店',
      },
      {
        departmentId: '02659',
        departmentName: 'GEO上田国分店',
      },
      {
        departmentId: '02660',
        departmentName: 'GEO更埴店',
      },
      {
        departmentId: '02661',
        departmentName: 'GEO茅野店',
      },
      {
        departmentId: '02667',
        departmentName: 'GEO藍住店',
      },
      {
        departmentId: '02673',
        departmentName: 'GEO一宮名岐ﾊﾞｲﾊﾟｽ店',
      },
      {
        departmentId: '02676',
        departmentName: 'GEO札幌手稲店',
      },
      {
        departmentId: '02677',
        departmentName: 'GEO山科東野店',
      },
      {
        departmentId: '02678',
        departmentName: 'GEO野辺地駅前店',
      },
      {
        departmentId: '02682',
        departmentName: 'GEO原山店',
      },
      {
        departmentId: '02683',
        departmentName: 'GEO新狭山店',
      },
      {
        departmentId: '02684',
        departmentName: 'GEO戸越公園店',
      },
      {
        departmentId: '02685',
        departmentName: 'GEO野川店',
      },
      {
        departmentId: '02686',
        departmentName: 'GEO盛岡月が丘店',
      },
      {
        departmentId: '02687',
        departmentName: 'GEO岩沼桑原店',
      },
      {
        departmentId: '02688',
        departmentName: 'GEO出来島店',
      },
      {
        departmentId: '02690',
        departmentName: 'GEO岸和田店',
      },
      {
        departmentId: '02691',
        departmentName: 'GEO泉大津店',
      },
      {
        departmentId: '02692',
        departmentName: 'GEO高石店',
      },
      {
        departmentId: '02693',
        departmentName: 'GEO対馬店',
      },
      {
        departmentId: '02696',
        departmentName: 'GEO上越高田店',
      },
      {
        departmentId: '02700',
        departmentName: 'GEO半田有楽店',
      },
      {
        departmentId: '02702',
        departmentName: 'GEO山形高堂店',
      },
      {
        departmentId: '02706',
        departmentName: 'GEO小松有明町店',
      },
      {
        departmentId: '02707',
        departmentName: 'GEO金沢元菊店',
      },
      {
        departmentId: '02708',
        departmentName: 'GEO松任店',
      },
      {
        departmentId: '02711',
        departmentName: 'GEO野々市矢作店',
      },
      {
        departmentId: '02712',
        departmentName: 'GEO津幡店',
      },
      {
        departmentId: '02713',
        departmentName: 'GEO金沢桜町店',
      },
      {
        departmentId: '02714',
        departmentName: 'GEO金沢久安店',
      },
      {
        departmentId: '02715',
        departmentName: 'GEO金沢東大通店',
      },
      {
        departmentId: '02717',
        departmentName: 'GEO新湊店',
      },
      {
        departmentId: '02719',
        departmentName: 'GEO高岡蓮花寺店',
      },
      {
        departmentId: '02721',
        departmentName: 'GEO小杉店',
      },
      {
        departmentId: '02723',
        departmentName: 'GEO福井日の出店',
      },
      {
        departmentId: '02725',
        departmentName: 'GEO大野店',
      },
      {
        departmentId: '02726',
        departmentName: 'GEO福井二の宮店',
      },
      {
        departmentId: '02728',
        departmentName: 'GEO葛西店',
      },
      {
        departmentId: '02730',
        departmentName: 'GEO巣鴨店',
      },
      {
        departmentId: '02731',
        departmentName: 'GEOくらわんか枚方店',
      },
      {
        departmentId: '02732',
        departmentName: 'GEO天草瀬戸橋店',
      },
      {
        departmentId: '02733',
        departmentName: 'GEO金沢御経塚店',
      },
      {
        departmentId: '02734',
        departmentName: 'GEO宜野湾店',
      },
      {
        departmentId: '02746',
        departmentName: 'GEOせき東新町店',
      },
      {
        departmentId: '02749',
        departmentName: 'GEO吉井店',
      },
      {
        departmentId: '02752',
        departmentName: 'GEO江南飛高店',
      },
      {
        departmentId: '02753',
        departmentName: 'GEO高槻浦堂店',
      },
      {
        departmentId: '02757',
        departmentName: 'GEO鳥取安長店',
      },
      {
        departmentId: '02758',
        departmentName: 'GEO今宿店',
      },
      {
        departmentId: '02759',
        departmentName: 'GEO今治鳥生店',
      },
      {
        departmentId: '02760',
        departmentName: 'GEO江戸川店',
      },
      {
        departmentId: '02761',
        departmentName: 'GEO市原店',
      },
      {
        departmentId: '02763',
        departmentName: 'GEO茂原店',
      },
      {
        departmentId: '02764',
        departmentName: 'GEO富里店',
      },
      {
        departmentId: '02765',
        departmentName: 'GEOおゆみ野店',
      },
      {
        departmentId: '02770',
        departmentName: 'GEO久居ｲﾝﾀｰ店',
      },
      {
        departmentId: '02773',
        departmentName: 'GEO遠野店',
      },
      {
        departmentId: '02774',
        departmentName: 'GEO三田ｳｯﾃﾞｨﾀｳﾝ店',
      },
      {
        departmentId: '02775',
        departmentName: 'GEO滑川店',
      },
      {
        departmentId: '02776',
        departmentName: 'GEO立石店',
      },
      {
        departmentId: '02778',
        departmentName: 'GEO八代松江店',
      },
      {
        departmentId: '02782',
        departmentName: 'GEO菊川店',
      },
      {
        departmentId: '02783',
        departmentName: 'GEO日向店',
      },
      {
        departmentId: '02784',
        departmentName: 'GEO関目高殿店',
      },
      {
        departmentId: '02785',
        departmentName: 'GEOむつ苫生町店',
      },
      {
        departmentId: '02787',
        departmentName: 'GEO福井つくし野店',
      },
      {
        departmentId: '02788',
        departmentName: 'GEO臼杵店',
      },
      {
        departmentId: '02789',
        departmentName: 'GEO鹿屋店',
      },
      {
        departmentId: '02791',
        departmentName: 'GEO桑名七和店',
      },
      {
        departmentId: '02796',
        departmentName: 'GEO名古屋高畑店',
      },
      {
        departmentId: '02797',
        departmentName: 'GEO千葉末広店',
      },
      {
        departmentId: '02798',
        departmentName: 'GEO新井店',
      },
      {
        departmentId: '02800',
        departmentName: 'GEO能美辰口店',
      },
      {
        departmentId: '02803',
        departmentName: 'GEO井原店',
      },
      {
        departmentId: '02805',
        departmentName: 'GEO四万十店',
      },
      {
        departmentId: '02807',
        departmentName: 'GEO土岐店',
      },
      {
        departmentId: '02808',
        departmentName: 'GEO西明石店',
      },
      {
        departmentId: '02815',
        departmentName: 'GEO豊岡店',
      },
      {
        departmentId: '02816',
        departmentName: 'GEO舞鶴店',
      },
      {
        departmentId: '02817',
        departmentName: 'GEO丹波氷上店',
      },
      {
        departmentId: '02819',
        departmentName: 'GEO南相馬原町店',
      },
      {
        departmentId: '02825',
        departmentName: 'GEO守山大門店',
      },
      {
        departmentId: '02828',
        departmentName: 'GEO藤井寺ｲﾝﾀｰ店',
      },
      {
        departmentId: '02830',
        departmentName: 'GEO寄居店',
      },
      {
        departmentId: '02832',
        departmentName: 'GEO名古屋大曽根店',
      },
      {
        departmentId: '02834',
        departmentName: 'GEO名古屋平針店',
      },
      {
        departmentId: '02836',
        departmentName: 'GEO京丹後峰山店',
      },
      {
        departmentId: '02839',
        departmentName: 'GEO名古屋守山店',
      },
      {
        departmentId: '02841',
        departmentName: 'GEO竜ヶ崎松ヶ丘店',
      },
      {
        departmentId: '02845',
        departmentName: 'GEO阿見店',
      },
      {
        departmentId: '02848',
        departmentName: 'GEO市川南店',
      },
      {
        departmentId: '02849',
        departmentName: 'GEO円町店',
      },
      {
        departmentId: '02851',
        departmentName: 'GEO小浜店',
      },
      {
        departmentId: '02853',
        departmentName: 'GEO長崎矢上店',
      },
      {
        departmentId: '02854',
        departmentName: 'GEO与那原店',
      },
      {
        departmentId: '02855',
        departmentName: 'GEO久慈店',
      },
      {
        departmentId: '02856',
        departmentName: 'GEO岡崎上地店',
      },
      {
        departmentId: '02859',
        departmentName: 'GEO大村店',
      },
      {
        departmentId: '02860',
        departmentName: 'GEO北須磨店',
      },
      {
        departmentId: '02863',
        departmentName: 'GEO石和店',
      },
      {
        departmentId: '02865',
        departmentName: 'GEO多治見光ヶ丘店',
      },
      {
        departmentId: '02866',
        departmentName: 'GEO福岡二又瀬店',
      },
      {
        departmentId: '02867',
        departmentName: 'GEO時津店',
      },
      {
        departmentId: '02872',
        departmentName: 'GEO東中野店',
      },
      {
        departmentId: '02878',
        departmentName: 'GEO板橋本町店',
      },
      {
        departmentId: '02883',
        departmentName: 'GEO名古屋亀島店',
      },
      {
        departmentId: '02884',
        departmentName: 'GEO岐阜真正店',
      },
      {
        departmentId: '02886',
        departmentName: 'GEO四日市日永店',
      },
      {
        departmentId: '02887',
        departmentName: 'GEO鈴鹿西条店',
      },
      {
        departmentId: '02889',
        departmentName: 'GEO松阪大塚店',
      },
      {
        departmentId: '02890',
        departmentName: 'GEO玉城店',
      },
      {
        departmentId: '02893',
        departmentName: 'GEO要町店',
      },
      {
        departmentId: '02894',
        departmentName: 'GEO下関長府店',
      },
      {
        departmentId: '02898',
        departmentName: 'GEO天六店',
      },
      {
        departmentId: '02899',
        departmentName: 'GEO佐倉志津店',
      },
      {
        departmentId: '02902',
        departmentName: 'GEO守谷久保ヶ丘店',
      },
      {
        departmentId: '02903',
        departmentName: 'GEO角田店',
      },
      {
        departmentId: '02907',
        departmentName: 'GEO札幌厚別店',
      },
      {
        departmentId: '02908',
        departmentName: 'GEO熊本光の森店',
      },
      {
        departmentId: '02909',
        departmentName: 'GEO亀山ｴｺｰ店',
      },
      {
        departmentId: '02913',
        departmentName: 'GEO鹿沼店',
      },
      {
        departmentId: '02914',
        departmentName: 'GEO赤穂店',
      },
      {
        departmentId: '02915',
        departmentName: 'GEO富士店',
      },
      {
        departmentId: '02916',
        departmentName: 'GEO御殿場店',
      },
      {
        departmentId: '02918',
        departmentName: 'GEO西春店',
      },
      {
        departmentId: '02919',
        departmentName: 'GEO小牧桜井店',
      },
      {
        departmentId: '02920',
        departmentName: 'GEO名古屋黒川店',
      },
      {
        departmentId: '02922',
        departmentName: 'GEO犬山小牧店',
      },
      {
        departmentId: '02925',
        departmentName: 'GEO浜岡店',
      },
      {
        departmentId: '02926',
        departmentName: 'GEO八女店',
      },
      {
        departmentId: '02930',
        departmentName: 'GEO盛岡三本柳店',
      },
      {
        departmentId: '02932',
        departmentName: 'GEO福岡若久店',
      },
      {
        departmentId: '02933',
        departmentName: 'GEO福岡土井店',
      },
      {
        departmentId: '02934',
        departmentName: 'GEO久留米ｲﾝﾀｰ店',
      },
      {
        departmentId: '02935',
        departmentName: 'GEO宇部小松原店',
      },
      {
        departmentId: '02936',
        departmentName: 'GEO宮崎大塚店',
      },
      {
        departmentId: '02937',
        departmentName: 'GEO和多田店',
      },
      {
        departmentId: '02938',
        departmentName: 'GEO中津店',
      },
      {
        departmentId: '02939',
        departmentName: 'GEO福津店',
      },
      {
        departmentId: '02940',
        departmentName: 'GEO西原店',
      },
      {
        departmentId: '02941',
        departmentName: 'GEO高鍋店',
      },
      {
        departmentId: '02942',
        departmentName: 'GEO鳥栖店',
      },
      {
        departmentId: '02943',
        departmentName: 'GEO北九州八幡東店',
      },
      {
        departmentId: '02944',
        departmentName: 'GEO甘木旭町店',
      },
      {
        departmentId: '02945',
        departmentName: 'GEO春日店',
      },
      {
        departmentId: '02946',
        departmentName: 'GEO前原店',
      },
      {
        departmentId: '02947',
        departmentName: 'GEO志免店',
      },
      {
        departmentId: '02949',
        departmentName: 'GEO宗像野坂店',
      },
      {
        departmentId: '02950',
        departmentName: 'GEO出雲店',
      },
      {
        departmentId: '02952',
        departmentName: 'GEO大野城店',
      },
      {
        departmentId: '02953',
        departmentName: 'GEO札幌北33条店',
      },
      {
        departmentId: '02954',
        departmentName: 'GEO日南店',
      },
      {
        departmentId: '02955',
        departmentName: 'GEO北九州本城店',
      },
      {
        departmentId: '02956',
        departmentName: 'GEO袋井店',
      },
      {
        departmentId: '02958',
        departmentName: 'GEO浜松舞阪店',
      },
      {
        departmentId: '02959',
        departmentName: 'GEO岡垣店',
      },
      {
        departmentId: '02960',
        departmentName: 'GEO千葉園生町店',
      },
      {
        departmentId: '02962',
        departmentName: 'GEO東大阪花園店',
      },
      {
        departmentId: '02963',
        departmentName: 'GEOｸﾛｽｼﾃｨ弁天町店',
      },
      {
        departmentId: '02964',
        departmentName: 'GEO向日店',
      },
      {
        departmentId: '02968',
        departmentName: 'GEO千里丘駅前店',
      },
      {
        departmentId: '02969',
        departmentName: 'GEO姫路砥堀店',
      },
      {
        departmentId: '02971',
        departmentName: 'GEO船橋薬園台店',
      },
      {
        departmentId: '02972',
        departmentName: 'GEO秋田飯島店',
      },
      {
        departmentId: '02973',
        departmentName: 'GEO西都店',
      },
      {
        departmentId: '02975',
        departmentName: 'GEO下館店',
      },
      {
        departmentId: '02977',
        departmentName: 'GEO岩内店',
      },
      {
        departmentId: '02979',
        departmentName: 'GEO瑞穂岐大ﾊﾞｲﾊﾟｽ店',
      },
      {
        departmentId: '02980',
        departmentName: 'GEO仙台中野店',
      },
      {
        departmentId: '02981',
        departmentName: 'GEO札幌北49条店',
      },
      {
        departmentId: '02982',
        departmentName: 'GEO都城郡元店',
      },
      {
        departmentId: '02983',
        departmentName: 'GEO浜松西伊場店',
      },
      {
        departmentId: '02984',
        departmentName: 'GEO焼津店',
      },
      {
        departmentId: '02990',
        departmentName: 'GEO静岡川合店',
      },
      {
        departmentId: '02993',
        departmentName: 'GEO磐田豊田店',
      },
      {
        departmentId: '02995',
        departmentName: 'GEO新宮店',
      },
      {
        departmentId: '02999',
        departmentName: 'GEO富士宮店',
      },
      {
        departmentId: '03000',
        departmentName: 'GEO鶴岡城南店',
      },
      {
        departmentId: '03002',
        departmentName: 'GEO三原店',
      },
      {
        departmentId: '03005',
        departmentName: 'GEO相模原駅前店',
      },
      {
        departmentId: '03006',
        departmentName: 'GEOひたちなか高場店',
      },
      {
        departmentId: '03007',
        departmentName: 'GEO古河下辺見店',
      },
      {
        departmentId: '03008',
        departmentName: 'GEO北九州葛原店',
      },
      {
        departmentId: '03010',
        departmentName: 'GEO佐伯店',
      },
      {
        departmentId: '03014',
        departmentName: 'GEO広島長束店',
      },
      {
        departmentId: '03017',
        departmentName: 'GEO福山みどりまち店',
      },
      {
        departmentId: '03018',
        departmentName: 'GEO因島店',
      },
      {
        departmentId: '03019',
        departmentName: 'GEO倉吉店',
      },
      {
        departmentId: '03020',
        departmentName: 'GEO相馬店',
      },
      {
        departmentId: '03021',
        departmentName: 'GEO盛岡本宮店',
      },
      {
        departmentId: '03022',
        departmentName: 'GEO伊勢店',
      },
      {
        departmentId: '03023',
        departmentName: 'GEO札幌月寒店',
      },
      {
        departmentId: '03024',
        departmentName: 'GEO常陸太田店',
      },
      {
        departmentId: '03025',
        departmentName: 'GEO匝瑳八日市場店',
      },
      {
        departmentId: '03026',
        departmentName: 'GEO津高野尾店',
      },
      {
        departmentId: '03027',
        departmentName: 'GEO二本松店',
      },
      {
        departmentId: '03028',
        departmentName: 'GEO山鹿店',
      },
      {
        departmentId: '03029',
        departmentName: 'GEO銚子清川町店',
      },
      {
        departmentId: '03030',
        departmentName: 'GEO福島石川店',
      },
      {
        departmentId: '03034',
        departmentName: 'GEO香取小見川店',
      },
      {
        departmentId: '03037',
        departmentName: 'GEO四街道大日店',
      },
      {
        departmentId: '03040',
        departmentName: 'GEO高知南国店',
      },
      {
        departmentId: '03041',
        departmentName: 'GEOいすみ深堀店',
      },
      {
        departmentId: '03042',
        departmentName: 'GEO富山北の森店',
      },
      {
        departmentId: '03043',
        departmentName: 'GEO佐渡佐和田店',
      },
      {
        departmentId: '03046',
        departmentName: 'GEO佐賀南部ﾊﾞｲﾊﾟｽ店',
      },
      {
        departmentId: '03047',
        departmentName: 'GEO防府店',
      },
      {
        departmentId: '03048',
        departmentName: 'GEO岐阜河渡店',
      },
      {
        departmentId: '03049',
        departmentName: 'GEO共和店',
      },
      {
        departmentId: '03050',
        departmentName: 'GEO郡山小山田店',
      },
      {
        departmentId: '03052',
        departmentName: 'GEO小松符津店',
      },
      {
        departmentId: '03055',
        departmentName: 'GEO熊本室園店',
      },
      {
        departmentId: '03058',
        departmentName: 'GEO津嘉山店',
      },
      {
        departmentId: '03059',
        departmentName: 'GEO井荻駅南口店',
      },
      {
        departmentId: '03060',
        departmentName: 'GEO日立本宮店',
      },
      {
        departmentId: '03061',
        departmentName: 'GEO滝沢巣子店',
      },
      {
        departmentId: '03062',
        departmentName: 'GEO鴨島店',
      },
      {
        departmentId: '03063',
        departmentName: 'GEO久留米諏訪野店',
      },
      {
        departmentId: '03064',
        departmentName: 'GEO佐世保相浦店',
      },
      {
        departmentId: '03065',
        departmentName: 'GEO高山昭和店',
      },
      {
        departmentId: '03067',
        departmentName: 'GEO天童店',
      },
      {
        departmentId: '03068',
        departmentName: 'GEO伊万里店',
      },
      {
        departmentId: '03069',
        departmentName: 'GEO豊橋藤沢店',
      },
      {
        departmentId: '03070',
        departmentName: 'GEO豊橋花田店',
      },
      {
        departmentId: '03074',
        departmentName: 'GEO阿久根店',
      },
      {
        departmentId: '03075',
        departmentName: 'GEO北九州中津口店',
      },
      {
        departmentId: '03077',
        departmentName: 'GEO桂店',
      },
      {
        departmentId: '03078',
        departmentName: 'GEO大和郡山店',
      },
      {
        departmentId: '03079',
        departmentName: 'GEO掛川大池店',
      },
      {
        departmentId: '03080',
        departmentName: 'GEO柏明原店',
      },
      {
        departmentId: '03081',
        departmentName: 'GEO八代海士江店',
      },
      {
        departmentId: '03082',
        departmentName: 'GEO一宮ｲﾝﾀｰ店',
      },
      {
        departmentId: '03083',
        departmentName: 'GEO新居浜店',
      },
      {
        departmentId: '03084',
        departmentName: 'GEO富山婦中店',
      },
      {
        departmentId: '03085',
        departmentName: 'GEO大阪日本橋店',
      },
      {
        departmentId: '03087',
        departmentName: 'GEO太宰府向佐野店',
      },
      {
        departmentId: '03088',
        departmentName: 'GEO奄美店',
      },
      {
        departmentId: '03089',
        departmentName: 'GEO秋田保戸野店',
      },
      {
        departmentId: '03093',
        departmentName: 'GEO青梅河辺店',
      },
      {
        departmentId: '03097',
        departmentName: 'GEO田原店',
      },
      {
        departmentId: '03098',
        departmentName: 'GEO高知横浜店',
      },
      {
        departmentId: '03099',
        departmentName: 'GEO川越新宿店',
      },
      {
        departmentId: '03106',
        departmentName: 'GEO加茂店',
      },
      {
        departmentId: '03107',
        departmentName: 'GEO塩山店',
      },
      {
        departmentId: '03108',
        departmentName: 'GEO内灘店',
      },
      {
        departmentId: '03109',
        departmentName: 'GEO伊達保原店',
      },
      {
        departmentId: '03110',
        departmentName: 'GEO浜北店',
      },
      {
        departmentId: '03111',
        departmentName: 'GEO伊川谷店',
      },
      {
        departmentId: '03113',
        departmentName: 'GEO日田店',
      },
      {
        departmentId: '03114',
        departmentName: 'GEOﾌﾚｽﾎﾟ由利本荘店',
      },
      {
        departmentId: '03116',
        departmentName: 'GEO黒石東町店',
      },
      {
        departmentId: '03117',
        departmentName: 'GEO徳之島店',
      },
      {
        departmentId: '03118',
        departmentName: 'GEO泉南店',
      },
      {
        departmentId: '03119',
        departmentName: 'GEO明石魚住店',
      },
      {
        departmentId: '03120',
        departmentName: 'GEO別府青山店',
      },
      {
        departmentId: '03121',
        departmentName: 'GEO大分王子店',
      },
      {
        departmentId: '03124',
        departmentName: 'GEOﾌｪﾆｯｸｽﾌﾟﾗｻﾞ摩耶店',
      },
      {
        departmentId: '03127',
        departmentName: 'GEO指宿店',
      },
      {
        departmentId: '03128',
        departmentName: 'GEO富士青葉通店',
      },
      {
        departmentId: '03129',
        departmentName: 'GEO筑後店',
      },
      {
        departmentId: '03130',
        departmentName: 'GEO首里大名店',
      },
      {
        departmentId: '03131',
        departmentName: 'GEO仙台南店',
      },
      {
        departmentId: '03132',
        departmentName: 'GEO弥富店',
      },
      {
        departmentId: '03133',
        departmentName: 'GEO仙台長町南店',
      },
      {
        departmentId: '03134',
        departmentName: 'GEO恵那店',
      },
      {
        departmentId: '03136',
        departmentName: 'GEO洲本店',
      },
      {
        departmentId: '03137',
        departmentName: 'GEO守山吉根店',
      },
      {
        departmentId: '03138',
        departmentName: 'GEO沖縄美里店',
      },
      {
        departmentId: '03140',
        departmentName: 'GEO名古屋大野木店',
      },
      {
        departmentId: '03141',
        departmentName: 'GEO刈谷井ヶ谷店',
      },
      {
        departmentId: '03142',
        departmentName: 'GEO阿久比店',
      },
      {
        departmentId: '03143',
        departmentName: 'GEO愛川店',
      },
      {
        departmentId: '03144',
        departmentName: 'GEO長崎大学前店',
      },
      {
        departmentId: '03145',
        departmentName: 'GEO奈良四条大路店',
      },
      {
        departmentId: '03146',
        departmentName: 'GEO旭川神楽店',
      },
      {
        departmentId: '03148',
        departmentName: 'GEO小樽店',
      },
      {
        departmentId: '03149',
        departmentName: 'GEO富谷店',
      },
      {
        departmentId: '03151',
        departmentName: 'GEO九十九里店',
      },
      {
        departmentId: '03152',
        departmentName: 'GEO都立家政店',
      },
      {
        departmentId: '03153',
        departmentName: 'GEO函南店',
      },
      {
        departmentId: '03154',
        departmentName: 'GEO壱岐店',
      },
      {
        departmentId: '03155',
        departmentName: 'GEO島田店',
      },
      {
        departmentId: '03156',
        departmentName: 'GEO宝塚小林店',
      },
      {
        departmentId: '03158',
        departmentName: 'GEO高知土佐道路店',
      },
      {
        departmentId: '03159',
        departmentName: 'GEO豊田美里店',
      },
      {
        departmentId: '03160',
        departmentName: 'GEO松山朝生田店',
      },
      {
        departmentId: '03163',
        departmentName: 'GEO豊中服部店',
      },
      {
        departmentId: '03164',
        departmentName: 'GEO三島店',
      },
      {
        departmentId: '03166',
        departmentName: 'GEO池田店',
      },
      {
        departmentId: '03167',
        departmentName: 'GEOｱｸﾛｽﾌﾟﾗｻﾞ扶桑店',
      },
      {
        departmentId: '03168',
        departmentName: 'GEO岡谷店',
      },
      {
        departmentId: '03169',
        departmentName: 'GEO大和中央店',
      },
      {
        departmentId: '03171',
        departmentName: 'GEOいわき湯本店',
      },
      {
        departmentId: '03172',
        departmentName: 'GEO長岡宮内店',
      },
      {
        departmentId: '03173',
        departmentName: 'GEO名古屋南陽店',
      },
      {
        departmentId: '03175',
        departmentName: 'GEO松山中央店',
      },
      {
        departmentId: '03176',
        departmentName: 'GEO和歌山大浦店',
      },
      {
        departmentId: '03177',
        departmentName: 'GEO大阪住之江店',
      },
      {
        departmentId: '03179',
        departmentName: 'GEO横浜笠間店',
      },
      {
        departmentId: '03180',
        departmentName: 'GEO木更津店',
      },
      {
        departmentId: '03181',
        departmentName: 'GEO旭店',
      },
      {
        departmentId: '03182',
        departmentName: 'GEO松山桑原店',
      },
      {
        departmentId: '03183',
        departmentName: 'GEO松山椿店',
      },
      {
        departmentId: '03185',
        departmentName: 'GEO橿原葛本店',
      },
      {
        departmentId: '03186',
        departmentName: 'GEO出水店',
      },
      {
        departmentId: '03188',
        departmentName: 'GEO下松店',
      },
      {
        departmentId: '03189',
        departmentName: 'GEO松山山西店',
      },
      {
        departmentId: '03190',
        departmentName: 'GEO大井川店',
      },
      {
        departmentId: '03191',
        departmentName: 'GEO御殿場萩原店',
      },
      {
        departmentId: '03195',
        departmentName: 'GEOつくば学園店',
      },
      {
        departmentId: '03196',
        departmentName: 'GEO羽咋店',
      },
      {
        departmentId: '03198',
        departmentName: 'GEO鹿島店',
      },
      {
        departmentId: '03199',
        departmentName: 'GEO大阪狭山店',
      },
      {
        departmentId: '03200',
        departmentName: 'GEO草津店',
      },
      {
        departmentId: '03202',
        departmentName: 'GEO岐南店',
      },
      {
        departmentId: '03203',
        departmentName: 'GEO坂之上店',
      },
      {
        departmentId: '03204',
        departmentName: 'GEO仙台松森店',
      },
      {
        departmentId: '03206',
        departmentName: 'GEO美濃加茂店',
      },
      {
        departmentId: '03208',
        departmentName: 'GEO伊予三島店',
      },
      {
        departmentId: '03209',
        departmentName: 'GEO川之江店',
      },
      {
        departmentId: '03210',
        departmentName: 'GEO仙台古城店',
      },
      {
        departmentId: '03211',
        departmentName: 'GEO寝屋川店',
      },
      {
        departmentId: '03213',
        departmentName: 'GEO富山上飯野店',
      },
      {
        departmentId: '03215',
        departmentName: 'GEO岩倉駅前店',
      },
      {
        departmentId: '03216',
        departmentName: 'GEO境港店',
      },
      {
        departmentId: '03217',
        departmentName: 'GEO大崎古川ﾊﾞｲﾊﾟｽ店',
      },
      {
        departmentId: '03218',
        departmentName: 'GEO浜松初生店',
      },
      {
        departmentId: '03220',
        departmentName: 'GEO岩槻店',
      },
      {
        departmentId: '03221',
        departmentName: 'GEO水戸吉沢店',
      },
      {
        departmentId: '03223',
        departmentName: 'GEO行橋店',
      },
      {
        departmentId: '03226',
        departmentName: 'GEO佐賀兵庫店',
      },
      {
        departmentId: '03227',
        departmentName: 'GEO伊万里大坪店',
      },
      {
        departmentId: '03228',
        departmentName: 'GEO門司西店',
      },
      {
        departmentId: '03229',
        departmentName: 'GEO苅田店',
      },
      {
        departmentId: '03233',
        departmentName: 'GEO桐生店',
      },
      {
        departmentId: '03234',
        departmentName: 'GEO沖縄山内店',
      },
      {
        departmentId: '03235',
        departmentName: 'GEO福岡賀茂店',
      },
      {
        departmentId: '03236',
        departmentName: 'GEO屋島店',
      },
      {
        departmentId: '03237',
        departmentName: 'GEO熊本萩原店',
      },
      {
        departmentId: '03238',
        departmentName: 'GEO新南陽店',
      },
      {
        departmentId: '03239',
        departmentName: 'GEO利府店',
      },
      {
        departmentId: '03240',
        departmentName: 'GEO鶯谷店',
      },
      {
        departmentId: '03243',
        departmentName: 'GEOﾍﾞｱｰｽﾞ大日店',
      },
      {
        departmentId: '03244',
        departmentName: 'GEO板橋駅前店',
      },
      {
        departmentId: '03247',
        departmentName: 'GEO静岡SBS通り店',
      },
      {
        departmentId: '03248',
        departmentName: 'GEO横浜中山店',
      },
      {
        departmentId: '03249',
        departmentName: 'GEO横浜栗木店',
      },
      {
        departmentId: '03252',
        departmentName: 'GEO神戸六甲道店',
      },
      {
        departmentId: '03255',
        departmentName: 'GEO京田辺店',
      },
      {
        departmentId: '03257',
        departmentName: 'GEO伊予店',
      },
      {
        departmentId: '03258',
        departmentName: 'GEO三木青山店',
      },
      {
        departmentId: '03259',
        departmentName: 'GEO角館店',
      },
      {
        departmentId: '03260',
        departmentName: 'GEO大分古国府店',
      },
      {
        departmentId: '03262',
        departmentName: 'GEO熱田大宝店',
      },
      {
        departmentId: '03264',
        departmentName: 'GEO松阪久保店',
      },
      {
        departmentId: '03265',
        departmentName: 'GEO大塚駅南口店',
      },
      {
        departmentId: '03266',
        departmentName: 'GEO福島鎌田店',
      },
      {
        departmentId: '03269',
        departmentName: 'GEO沼津学園通り店',
      },
      {
        departmentId: '03271',
        departmentName: 'GEO敷島店',
      },
      {
        departmentId: '03272',
        departmentName: 'GEO和歌山紀三井寺店',
      },
      {
        departmentId: '03273',
        departmentName: 'GEO東加古川店',
      },
      {
        departmentId: '03274',
        departmentName: 'GEO所沢駅前店',
      },
      {
        departmentId: '03275',
        departmentName: 'GEO寒川店',
      },
      {
        departmentId: '03276',
        departmentName: 'GEO伊勢原大住台店',
      },
      {
        departmentId: '03278',
        departmentName: 'GEO外環寝屋川店',
      },
      {
        departmentId: '03280',
        departmentName: 'GEOﾄﾞﾐｰ小坂井店',
      },
      {
        departmentId: '03281',
        departmentName: 'GEO大東店',
      },
      {
        departmentId: '03282',
        departmentName: 'GEO西脇店',
      },
      {
        departmentId: '03283',
        departmentName: 'GEO河内長野店',
      },
      {
        departmentId: '03284',
        departmentName: 'GEO伊賀店',
      },
      {
        departmentId: '03285',
        departmentName: 'GEO秩父店',
      },
      {
        departmentId: '03288',
        departmentName: 'GEO菊池店',
      },
      {
        departmentId: '03294',
        departmentName: 'GEOときわ台駅南口店',
      },
      {
        departmentId: '03296',
        departmentName: 'GEO曳舟店',
      },
      {
        departmentId: '03299',
        departmentName: 'GEO渋川店',
      },
      {
        departmentId: '03300',
        departmentName: 'GEO東大阪若江店',
      },
      {
        departmentId: '03301',
        departmentName: 'GEO玉名店',
      },
      {
        departmentId: '03302',
        departmentName: 'GEO刈谷稲場店',
      },
      {
        departmentId: '03303',
        departmentName: 'GEOｱｸﾛｽﾌﾟﾗｻﾞ高陽店',
      },
      {
        departmentId: '03304',
        departmentName: 'GEO福岡姪浜駅前店',
      },
      {
        departmentId: '03305',
        departmentName: 'GEO宇都宮鶴田店',
      },
      {
        departmentId: '03307',
        departmentName: 'GEO貝塚店',
      },
      {
        departmentId: '03308',
        departmentName: 'GEO大津瀬田店',
      },
      {
        departmentId: '03309',
        departmentName: 'GEO仙台幸町店',
      },
      {
        departmentId: '03310',
        departmentName: 'GEO師勝店',
      },
      {
        departmentId: '03311',
        departmentName: 'GEO新発田店',
      },
      {
        departmentId: '03313',
        departmentName: 'GEOｸﾗｽﾎﾟ蒲郡店',
      },
      {
        departmentId: '03314',
        departmentName: 'GEO宇佐店',
      },
      {
        departmentId: '03316',
        departmentName: 'GEO埼大通り店',
      },
      {
        departmentId: '03317',
        departmentName: 'GEO石岡店',
      },
      {
        departmentId: '03319',
        departmentName: 'GEO大森駅西口店',
      },
      {
        departmentId: '03321',
        departmentName: 'GEO中環茨木店',
      },
      {
        departmentId: '03324',
        departmentName: 'GEO呉焼山店',
      },
      {
        departmentId: '03326',
        departmentName: 'GEO羽生店',
      },
      {
        departmentId: '03327',
        departmentName: 'GEO宇都宮今泉店',
      },
      {
        departmentId: '03330',
        departmentName: 'GEO清水庵原店',
      },
      {
        departmentId: '03333',
        departmentName: 'GEO川西能勢口駅前店',
      },
      {
        departmentId: '03334',
        departmentName: 'GEO可児店',
      },
      {
        departmentId: '03336',
        departmentName: 'GEO町屋店',
      },
      {
        departmentId: '03337',
        departmentName: 'GEO神戸板宿駅前店',
      },
      {
        departmentId: '03340',
        departmentName: 'GEOﾗｿﾗ札幌店',
      },
      {
        departmentId: '03341',
        departmentName: 'GEO島原店',
      },
      {
        departmentId: '03342',
        departmentName: 'GEO新津店',
      },
      {
        departmentId: '03345',
        departmentName: 'GEO西帯広店',
      },
      {
        departmentId: '03346',
        departmentName: 'GEO涌谷店',
      },
      {
        departmentId: '03348',
        departmentName: 'GEO箕面店',
      },
      {
        departmentId: '03351',
        departmentName: 'GEOｱﾐｭﾌﾟﾗｻﾞおおいた店',
      },
      {
        departmentId: '03352',
        departmentName: 'GEO小郡店',
      },
      {
        departmentId: '03353',
        departmentName: 'GEO宇和島店',
      },
      {
        departmentId: '03354',
        departmentName: 'GEO宿毛店',
      },
      {
        departmentId: '03355',
        departmentName: 'GEO釧路星が浦店',
      },
      {
        departmentId: '03356',
        departmentName: 'GEO巻店',
      },
      {
        departmentId: '03357',
        departmentName: 'GEO大川店',
      },
      {
        departmentId: '03360',
        departmentName: 'GEO高知安芸店',
      },
      {
        departmentId: '03361',
        departmentName: 'GEO沼津原店',
      },
      {
        departmentId: '03362',
        departmentName: 'GEO大分戸次店',
      },
      {
        departmentId: '03363',
        departmentName: 'GEO国東店',
      },
      {
        departmentId: '03364',
        departmentName: 'GEO豊後大野店',
      },
      {
        departmentId: '03365',
        departmentName: 'GEO柏崎店',
      },
      {
        departmentId: '03367',
        departmentName: 'GEO燕吉田店',
      },
      {
        departmentId: '03368',
        departmentName: 'GEO土佐高岡店',
      },
      {
        departmentId: '03369',
        departmentName: 'GEO横浜六浦店',
      },
      {
        departmentId: '03370',
        departmentName: 'GEO大阪加島店',
      },
      {
        departmentId: '03372',
        departmentName: 'GEO菰野店',
      },
      {
        departmentId: '03374',
        departmentName: 'GEO高萩店',
      },
      {
        departmentId: '03376',
        departmentName: 'GEO姫路飾磨店',
      },
      {
        departmentId: '03377',
        departmentName: 'GEO岐阜柳津店',
      },
      {
        departmentId: '03380',
        departmentName: 'GEO直江津店',
      },
      {
        departmentId: '03381',
        departmentName: 'GEOｱｸﾛｽﾌﾟﾗｻﾞ神栖店',
      },
      {
        departmentId: '03382',
        departmentName: 'GEO中標津店',
      },
      {
        departmentId: '03383',
        departmentName: 'GEO相模台店',
      },
      {
        departmentId: '03384',
        departmentName: 'GEO阿賀野店',
      },
      {
        departmentId: '03386',
        departmentName: 'GEO神戸有野店',
      },
      {
        departmentId: '03387',
        departmentName: 'GEO福岡博多口店',
      },
      {
        departmentId: '03388',
        departmentName: 'GEO福山蔵王店',
      },
      {
        departmentId: '03391',
        departmentName: 'GEO村上店',
      },
      {
        departmentId: '03393',
        departmentName: 'GEO袖ヶ浦店',
      },
      {
        departmentId: '03395',
        departmentName: 'GEO南紀田辺店',
      },
      {
        departmentId: '03398',
        departmentName: 'GEO米子西福原店',
      },
      {
        departmentId: '03399',
        departmentName: 'GEO新座大和田店',
      },
      {
        departmentId: '03404',
        departmentName: 'GEO上尾小泉店',
      },
      {
        departmentId: '03405',
        departmentName: 'GEO前橋高井店',
      },
      {
        departmentId: '03406',
        departmentName: 'GEO長岡西津店',
      },
      {
        departmentId: '03407',
        departmentName: 'GEO白河旭町店',
      },
      {
        departmentId: '03408',
        departmentName: 'GEO高知高須店',
      },
      {
        departmentId: '03409',
        departmentName: 'GEO松江菅田店',
      },
      {
        departmentId: '03410',
        departmentName: 'GEO出雲斐川店',
      },
      {
        departmentId: '03412',
        departmentName: 'GEO南ｱﾙﾌﾟｽ店',
      },
      {
        departmentId: '03413',
        departmentName: 'GEO熱海店',
      },
      {
        departmentId: '03414',
        departmentName: 'GEO諫早店',
      },
      {
        departmentId: '03415',
        departmentName: 'GEO豊見城店',
      },
      {
        departmentId: '03416',
        departmentName: 'GEO静内店',
      },
      {
        departmentId: '03417',
        departmentName: 'GEO棚倉店',
      },
      {
        departmentId: '03418',
        departmentName: 'GEO松原店',
      },
      {
        departmentId: '03419',
        departmentName: 'GEO高崎福島店',
      },
      {
        departmentId: '03420',
        departmentName: 'GEO幕張店',
      },
      {
        departmentId: '03421',
        departmentName: 'GEO川西山下店',
      },
      {
        departmentId: '03423',
        departmentName: 'GEO北宇和島店',
      },
      {
        departmentId: '03425',
        departmentName: 'GEO北九州徳吉店',
      },
      {
        departmentId: '03426',
        departmentName: 'GEO名護びいまた店',
      },
      {
        departmentId: '03427',
        departmentName: 'GEO八戸根城店',
      },
      {
        departmentId: '03428',
        departmentName: 'GEO岡崎大樹寺店',
      },
      {
        departmentId: '03432',
        departmentName: 'GEO八王子堀之内店',
      },
      {
        departmentId: '03433',
        departmentName: 'GEO伊集院店',
      },
      {
        departmentId: '03434',
        departmentName: 'GEO福岡片江店',
      },
      {
        departmentId: '03435',
        departmentName: 'GEO松山谷町店',
      },
      {
        departmentId: '03436',
        departmentName: 'GEO東広島西条店',
      },
      {
        departmentId: '03437',
        departmentName: 'GEO伏見新堀川店',
      },
      {
        departmentId: '03438',
        departmentName: 'GEO北谷国道58号店',
      },
      {
        departmentId: '03439',
        departmentName: 'GEO薩摩川内店',
      },
      {
        departmentId: '03441',
        departmentName: 'GEO静岡昭府店',
      },
      {
        departmentId: '03442',
        departmentName: 'GEO伊那福島店',
      },
      {
        departmentId: '03443',
        departmentName: 'GEO香芝店',
      },
      {
        departmentId: '03446',
        departmentName: 'GEO那珂川いちょう通り店',
      },
      {
        departmentId: '03448',
        departmentName: 'GEO鶴岡宝田店',
      },
      {
        departmentId: '03449',
        departmentName: 'GEO知立店',
      },
      {
        departmentId: '03450',
        departmentName: 'GEO東生駒駅前店',
      },
      {
        departmentId: '03451',
        departmentName: 'GEO大垣築捨店',
      },
      {
        departmentId: '03452',
        departmentName: 'GEO御坊店',
      },
      {
        departmentId: '03453',
        departmentName: 'GEO日出店',
      },
      {
        departmentId: '03456',
        departmentName: 'GEO下関大坪店',
      },
      {
        departmentId: '03457',
        departmentName: 'GEO鳥取立川店',
      },
      {
        departmentId: '03459',
        departmentName: 'GEO八幡店',
      },
      {
        departmentId: '03460',
        departmentName: 'GEO三国本町店',
      },
      {
        departmentId: '03461',
        departmentName: 'GEO矢本店',
      },
      {
        departmentId: '03462',
        departmentName: 'GEOｱｸﾛｽﾌﾟﾗｻﾞ笠間店',
      },
      {
        departmentId: '03463',
        departmentName: 'GEO福岡吉塚駅前店',
      },
      {
        departmentId: '03464',
        departmentName: 'GEO函館鍛治店',
      },
      {
        departmentId: '03465',
        departmentName: 'GEOﾌﾚｽﾎﾟ帯広稲田店',
      },
      {
        departmentId: '03466',
        departmentName: 'GEO稲沢平和店',
      },
      {
        departmentId: '03467',
        departmentName: 'GEO小野田店',
      },
      {
        departmentId: '03469',
        departmentName: 'GEO佐野高萩店',
      },
      {
        departmentId: '03470',
        departmentName: 'GEO東根中央店',
      },
      {
        departmentId: '03471',
        departmentName: 'GEO玉出店',
      },
      {
        departmentId: '03475',
        departmentName: 'GEO東尾道店',
      },
      {
        departmentId: '03476',
        departmentName: 'GEO妹尾店',
      },
      {
        departmentId: '03478',
        departmentName: 'GEO紋別店',
      },
      {
        departmentId: '03479',
        departmentName: 'GEO大船渡店',
      },
      {
        departmentId: '03481',
        departmentName: 'GEO不破垂井店',
      },
      {
        departmentId: '03482',
        departmentName: 'GMB名古屋大須新天地通店',
      },
      {
        departmentId: '03483',
        departmentName: 'GEO飯塚秋松店',
      },
      {
        departmentId: '03485',
        departmentName: 'GEO上田しおだ野店',
      },
      {
        departmentId: '03486',
        departmentName: 'GEO佐久ｲﾝﾀｰｳｪｰﾌﾞ店',
      },
      {
        departmentId: '03487',
        departmentName: 'GEO川中島店',
      },
      {
        departmentId: '03488',
        departmentName: 'GEO座光寺店',
      },
      {
        departmentId: '03489',
        departmentName: 'GEO塩尻店',
      },
      {
        departmentId: '03490',
        departmentName: 'GEO朝日町店',
      },
      {
        departmentId: '03491',
        departmentName: 'GEO福江店',
      },
      {
        departmentId: '03493',
        departmentName: 'GEOｻﾝｴｰしおざきｼﾃｨ店',
      },
      {
        departmentId: '03494',
        departmentName: 'GEO蕨店',
      },
      {
        departmentId: '03496',
        departmentName: 'GEOｲｵﾝﾀｳﾝ黒崎店',
      },
      {
        departmentId: '03497',
        departmentName: 'GEO甚目寺店',
      },
      {
        departmentId: '03498',
        departmentName: 'GEO寺尾店',
      },
      {
        departmentId: '03499',
        departmentName: 'GEO鹿児島下荒田店',
      },
      {
        departmentId: '03545',
        departmentName: '三重出張買取',
      },
      {
        departmentId: '03547',
        departmentName: 'GEOほら貝店',
      },
      {
        departmentId: '03548',
        departmentName: 'GEO青森浜館店',
      },
      {
        departmentId: '03559',
        departmentName: 'GEO村山駅前店',
      },
      {
        departmentId: '03560',
        departmentName: 'GEO佐賀上峰店',
      },
      {
        departmentId: '03563',
        departmentName: 'GEO福岡大橋店',
      },
      {
        departmentId: '03564',
        departmentName: 'GEO新城店',
      },
      {
        departmentId: '03566',
        departmentName: 'GEO橿原店',
      },
      {
        departmentId: '03567',
        departmentName: 'GEO酒田ﾊﾞｲﾊﾟｽ店',
      },
      {
        departmentId: '03570',
        departmentName: 'GEO鹿児島国分店',
      },
      {
        departmentId: '03575',
        departmentName: 'GEO大館店',
      },
      {
        departmentId: '03581',
        departmentName: 'GEO長崎小ヶ倉店',
      },
      {
        departmentId: '03582',
        departmentName: 'GEO二戸堀野店',
      },
      {
        departmentId: '03583',
        departmentName: 'GEO郡山城清水店',
      },
      {
        departmentId: '03586',
        departmentName: 'GEO盛岡高松店',
      },
      {
        departmentId: '03588',
        departmentName: 'GEO岩出店',
      },
      {
        departmentId: '03590',
        departmentName: 'GEO恵庭恵み野店',
      },
      {
        departmentId: '03595',
        departmentName: 'GEO白石店',
      },
      {
        departmentId: '03596',
        departmentName: 'GEO湘南台店',
      },
      {
        departmentId: '03603',
        departmentName: 'GEO宮古長町店',
      },
      {
        departmentId: '03607',
        departmentName: 'GMB札幌狸小路4丁目店',
      },
      {
        departmentId: '03608',
        departmentName: 'GMB渋谷ｾﾝﾀｰ街店',
      },
      {
        departmentId: '03615',
        departmentName: 'MP営業企画課',
      },
      {
        departmentId: '03616',
        departmentName: 'GEO山口大内店',
      },
      {
        departmentId: '03617',
        departmentName: 'GEO寒河江店',
      },
      {
        departmentId: '03623',
        departmentName: 'ｳｪｱﾊｳｽｿﾞｰﾝ',
      },
      {
        departmentId: '03632',
        departmentName: 'GEO豊玉店',
      },
      {
        departmentId: '03633',
        departmentName: 'GEO名古屋徳重店',
      },
      {
        departmentId: '03698',
        departmentName: 'GEO八戸下長店',
      },
      {
        departmentId: '03701',
        departmentName: 'SS三河一宮店',
      },
      {
        departmentId: '03710',
        departmentName: 'GEO犬山駅東店',
      },
      {
        departmentId: '03740',
        departmentName: 'GEO豊田福受店',
      },
      {
        departmentId: '03750',
        departmentName: 'GEO岡崎緑丘店',
      },
      {
        departmentId: '03759',
        departmentName: 'GEO平塚四之宮店',
      },
      {
        departmentId: '03763',
        departmentName: 'GEO徳島矢三店',
      },
      {
        departmentId: '03764',
        departmentName: 'GEO脇町店',
      },
      {
        departmentId: '03766',
        departmentName: 'GEO鹿児島草牟田店',
      },
      {
        departmentId: '03767',
        departmentName: 'GEO水島神田店',
      },
      {
        departmentId: '03771',
        departmentName: 'GEO福島店',
      },
      {
        departmentId: '03773',
        departmentName: 'GEO旭川一条通店',
      },
      {
        departmentId: '03805',
        departmentName: 'GEO東越谷店',
      },
      {
        departmentId: '03814',
        departmentName: 'GEOいわき小名浜店',
      },
      {
        departmentId: '03861',
        departmentName: 'GEO本地ヶ原店',
      },
      {
        departmentId: '03862',
        departmentName: 'GEO江別大麻店',
      },
      {
        departmentId: '04077',
        departmentName: 'GEO飯塚穂波店',
      },
      {
        departmentId: '04081',
        departmentName: 'GEO筑紫野原田店',
      },
      {
        departmentId: '04408',
        departmentName: 'GEO武里店',
      },
      {
        departmentId: '04501',
        departmentName: '株式会社ｹﾞｵﾈｯﾄﾜｰｸｽ',
      },
      {
        departmentId: '04589',
        departmentName: '経営企画課',
      },
      {
        departmentId: '04700',
        departmentName: 'ｸﾞﾗﾓﾗｯｸｽ',
      },
      {
        departmentId: '05783',
        departmentName: '札幌ﾒﾃﾞｨｱ加工',
      },
      {
        departmentId: '05788',
        departmentName: '高崎ﾒﾃﾞｨｱ加工',
      },
      {
        departmentId: '05793',
        departmentName: '福岡ﾒﾃﾞｨｱ加工',
      },
      {
        departmentId: '06390',
        departmentName: '掛割加工',
      },
      {
        departmentId: '06654',
        departmentName: 'GEO豊橋高師店',
      },
      {
        departmentId: '06948',
        departmentName: 'GEO七宝町店',
      },
      {
        departmentId: '07869',
        departmentName: 'GEO保木間店',
      },
      {
        departmentId: '07870',
        departmentName: 'GEO船堀店',
      },
      {
        departmentId: '07871',
        departmentName: 'GEO綾瀬店',
      },
      {
        departmentId: '07872',
        departmentName: 'GEO鹿浜店',
      },
      {
        departmentId: '07873',
        departmentName: 'GEO西新井大師西店',
      },
      {
        departmentId: '07874',
        departmentName: 'GEO新小岩店',
      },
      {
        departmentId: '07875',
        departmentName: 'GEO葛西駅前店',
      },
      {
        departmentId: '07877',
        departmentName: 'GEO八柱店',
      },
      {
        departmentId: '07878',
        departmentName: 'GEO東浦和店',
      },
      {
        departmentId: '07879',
        departmentName: 'GEO武蔵浦和店',
      },
      {
        departmentId: '07880',
        departmentName: 'GEO大和田店',
      },
      {
        departmentId: '07881',
        departmentName: 'GEO北越谷店',
      },
      {
        departmentId: '07882',
        departmentName: 'GEO春日部ﾕﾘﾉｷ通り店',
      },
      {
        departmentId: '07883',
        departmentName: 'GEO川口元郷店',
      },
      {
        departmentId: '07884',
        departmentName: 'GEO東川口店',
      },
      {
        departmentId: '07885',
        departmentName: 'GEO川口駅前店',
      },
      {
        departmentId: '07886',
        departmentName: 'GEO川口前川店',
      },
      {
        departmentId: '07888',
        departmentName: 'GEO川口芝店',
      },
      {
        departmentId: '07889',
        departmentName: 'GEO草加花栗店',
      },
      {
        departmentId: '07890',
        departmentName: 'GEO谷塚店',
      },
      {
        departmentId: '07915',
        departmentName: 'GEO川口柳崎店',
      },
      {
        departmentId: '07938',
        departmentName: 'ｺﾞﾙﾌEC課',
      },
      {
        departmentId: '07994',
        departmentName: '商品開発課',
      },
      {
        departmentId: '07995',
        departmentName: 'ｾｶﾝﾄﾞｽﾄﾘｰﾄEC課',
      },
      {
        departmentId: '08240',
        departmentName: '業務ｼｽﾃﾑ部',
      },
      {
        departmentId: '10932',
        departmentName: 'ｹﾞｵ花川什器倉庫',
      },
      {
        departmentId: '10940',
        departmentName: '広報室',
      },
      {
        departmentId: '10941',
        departmentName: '広報課',
      },
      {
        departmentId: '10944',
        departmentName: '2nd Street USA CA Branch',
      },
      {
        departmentId: '10945',
        departmentName: '秘書課',
      },
      {
        departmentId: '10947',
        departmentName: '上益城ﾘﾕｰｽEC加工',
      },
      {
        departmentId: '10961',
        departmentName: '札幌ﾘﾕｰｽEC加工',
      },
      {
        departmentId: '10964',
        departmentName: '予算企画課',
      },
      {
        departmentId: '10972',
        departmentName: '岩倉MP運用倉庫',
      },
      {
        departmentId: '10978',
        departmentName: '上益城ﾘﾕｰｽEC買取倉庫',
      },
      {
        departmentId: '11323',
        departmentName: 'GEO新本庄店',
      },
      {
        departmentId: '11324',
        departmentName: 'GEO大沼店',
      },
      {
        departmentId: '11325',
        departmentName: 'GEOふじみ野店',
      },
      {
        departmentId: '11326',
        departmentName: 'GEO連取店',
      },
      {
        departmentId: '11327',
        departmentName: 'GEO西吉井店',
      },
      {
        departmentId: '11328',
        departmentName: 'GEO内ヶ島店',
      },
      {
        departmentId: '11329',
        departmentName: 'GEO加須店',
      },
      {
        departmentId: '11330',
        departmentName: 'GEO新行田店',
      },
      {
        departmentId: '11331',
        departmentName: 'GEO牛久中央店',
      },
      {
        departmentId: '11332',
        departmentName: 'GEO並木店',
      },
      {
        departmentId: '11333',
        departmentName: 'GEO赤堀店',
      },
      {
        departmentId: '11334',
        departmentName: 'GEO上尾中妻店',
      },
      {
        departmentId: '11335',
        departmentName: 'GEO片貝店',
      },
      {
        departmentId: '11336',
        departmentName: 'GEO木田余店',
      },
      {
        departmentId: '11337',
        departmentName: 'GEO毛呂山店',
      },
      {
        departmentId: '11338',
        departmentName: 'GEO三和店',
      },
      {
        departmentId: '11339',
        departmentName: 'GEO笠懸店',
      },
      {
        departmentId: '11340',
        departmentName: 'GEO吉川店',
      },
      {
        departmentId: '11341',
        departmentName: 'GEO間々田店',
      },
      {
        departmentId: '11342',
        departmentName: 'GEO飯塚店',
      },
      {
        departmentId: '11343',
        departmentName: 'GEO鴻巣吹上店',
      },
      {
        departmentId: '11344',
        departmentName: 'GEO土浦店',
      },
      {
        departmentId: '11345',
        departmentName: 'GEO稲毛店',
      },
      {
        departmentId: '11346',
        departmentName: 'GEO足利鹿島店',
      },
      {
        departmentId: '11347',
        departmentName: 'GEO城東店',
      },
      {
        departmentId: '11348',
        departmentName: 'GEO大平店',
      },
      {
        departmentId: '11349',
        departmentName: 'GEO鴻巣店',
      },
      {
        departmentId: '11351',
        departmentName: 'GEO石原店',
      },
      {
        departmentId: '11352',
        departmentName: 'GEO若葉店',
      },
      {
        departmentId: '11353',
        departmentName: 'GEO飯能柳町店',
      },
      {
        departmentId: '11355',
        departmentName: 'GEO塩沢店',
      },
      {
        departmentId: '11356',
        departmentName: 'GEO羽川店',
      },
      {
        departmentId: '11359',
        departmentName: 'GEO館林店',
      },
      {
        departmentId: '11362',
        departmentName: 'GEO新里店',
      },
      {
        departmentId: '11364',
        departmentName: 'GEO足利店',
      },
      {
        departmentId: '11366',
        departmentName: 'GEO昭島店',
      },
      {
        departmentId: '11367',
        departmentName: 'GEO深谷上柴店',
      },
      {
        departmentId: '11368',
        departmentName: 'GEO東峰町店',
      },
      {
        departmentId: '11372',
        departmentName: 'GEOからす山店',
      },
      {
        departmentId: '11373',
        departmentName: 'GEO伊勢崎南店',
      },
      {
        departmentId: '11379',
        departmentName: 'GEO河和田店',
      },
      {
        departmentId: '11380',
        departmentName: 'GEOﾌﾚｽﾎﾟ八潮店',
      },
      {
        departmentId: '11382',
        departmentName: 'GEO厚木店',
      },
      {
        departmentId: '11384',
        departmentName: 'GEO藤岡店',
      },
      {
        departmentId: '11385',
        departmentName: 'GEO草加新田店',
      },
      {
        departmentId: '14105',
        departmentName: 'ﾌﾟﾙｰｸ',
      },
      {
        departmentId: '14111',
        departmentName: 'ｹﾞｵﾍﾟｲﾒﾝﾄｻｰﾋﾞｽ',
      },
      {
        departmentId: '14112',
        departmentName: 'ｹﾞｵｺﾝﾃﾝﾂｻｰﾋﾞｽ',
      },
      {
        departmentId: '14113',
        departmentName: '2nd Street USA',
      },
      {
        departmentId: '14114',
        departmentName: 'ｹﾞｵﾋﾞｭｰﾃｨｰ',
      },
      {
        departmentId: '14115',
        departmentName: 'forcs',
      },
      {
        departmentId: '14123',
        departmentName: 'ﾁｪﾙｼｰ',
      },
      {
        departmentId: '14124',
        departmentName: '2nd Street MALAYSIA',
      },
      {
        departmentId: '14125',
        departmentName: 'ｳﾞｫｶﾞ',
      },
      {
        departmentId: '14126',
        departmentName: 'ｹﾞｵﾋﾞｼﾞﾈｽｻﾎﾟｰﾄ',
      },
      {
        departmentId: '14127',
        departmentName: 'ｻﾝ･ﾃﾞﾊﾟｰﾄ',
      },
      {
        departmentId: '14130',
        departmentName: 'ｹﾞｵｸﾘｱ',
      },
      {
        departmentId: '15621',
        departmentName: '北海道1地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15622',
        departmentName: '北海道2地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15623',
        departmentName: '北海道3地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15631',
        departmentName: '北海道4地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15632',
        departmentName: '北海道5地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15641',
        departmentName: '東北1地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15642',
        departmentName: '東北2地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15643',
        departmentName: '東北3地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15651',
        departmentName: '東北5地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15652',
        departmentName: '東北6地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15653',
        departmentName: '東北7地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15661',
        departmentName: '北関東1地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15662',
        departmentName: '北関東2地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15663',
        departmentName: '北関東3地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15664',
        departmentName: '北関東4地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15665',
        departmentName: '埼玉6地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15671',
        departmentName: '埼玉1地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15672',
        departmentName: '埼玉2地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15673',
        departmentName: '埼玉3地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15674',
        departmentName: '埼玉4地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15675',
        departmentName: '埼玉5地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15681',
        departmentName: '千葉1地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15682',
        departmentName: '千葉2地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15683',
        departmentName: '千葉3地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15684',
        departmentName: '千葉4地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15691',
        departmentName: '東京1地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15692',
        departmentName: '東京2地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15693',
        departmentName: '東京3地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15701',
        departmentName: '信越･北陸1地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15702',
        departmentName: '信越･北陸2地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15703',
        departmentName: '信越･北陸3地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15704',
        departmentName: '信越･北陸4地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15721',
        departmentName: '京滋･三岐2地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15722',
        departmentName: '京滋･三岐3地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15723',
        departmentName: '愛知5地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15724',
        departmentName: '神奈川･山梨･静岡6地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15725',
        departmentName: '東京6地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15731',
        departmentName: '愛知1地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15732',
        departmentName: '愛知2地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15733',
        departmentName: '愛知3地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15734',
        departmentName: '愛知4地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15735',
        departmentName: '京滋･三岐1地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15741',
        departmentName: '京滋･三岐4地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15742',
        departmentName: '京滋･三岐5地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15743',
        departmentName: '兵庫･奈良･和歌山5地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15751',
        departmentName: '大阪5地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15752',
        departmentName: '大阪6地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15753',
        departmentName: '大阪7地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15754',
        departmentName: '大阪8地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15761',
        departmentName: '兵庫･奈良･和歌山1地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15762',
        departmentName: '兵庫･奈良･和歌山2地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15763',
        departmentName: '兵庫･奈良･和歌山3地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15771',
        departmentName: '中国･四国1地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15772',
        departmentName: '中国･四国2地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15773',
        departmentName: '中国･四国3地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15774',
        departmentName: '中国･四国4地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15791',
        departmentName: '北部九州･沖縄1地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15792',
        departmentName: '北部九州･沖縄2地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15793',
        departmentName: '北部九州･沖縄3地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15794',
        departmentName: '北部九州･沖縄4地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15801',
        departmentName: '北部九州･沖縄5地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15802',
        departmentName: '北部九州･沖縄6地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15803',
        departmentName: '北部九州･沖縄7地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15804',
        departmentName: '中南部九州1地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15805',
        departmentName: '中南部九州2地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15811',
        departmentName: '中南部九州3地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15812',
        departmentName: '中南部九州4地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15813',
        departmentName: '中南部九州5地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15831',
        departmentName: '神奈川･山梨･静岡1地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15832',
        departmentName: '神奈川･山梨･静岡2地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15833',
        departmentName: '神奈川･山梨･静岡3地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15841',
        departmentName: '大阪1地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15842',
        departmentName: '大阪2地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15843',
        departmentName: '大阪3地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15844',
        departmentName: '大阪4地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '15860',
        departmentName: '東京4地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '16101',
        departmentName: '北海道1地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16102',
        departmentName: '北海道2地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16103',
        departmentName: '北海道3地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16104',
        departmentName: '北海道4地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16105',
        departmentName: '北海道5地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16106',
        departmentName: '北海道6地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16107',
        departmentName: '北海道7地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16108',
        departmentName: '北海道8地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16121',
        departmentName: '東北1地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16122',
        departmentName: '東北2地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16123',
        departmentName: '東北3地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16124',
        departmentName: '東北4地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16125',
        departmentName: '東北5地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16126',
        departmentName: '東北6地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16141',
        departmentName: '東北7地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16142',
        departmentName: '東北8地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16143',
        departmentName: '東北9地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16144',
        departmentName: '東北10地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16145',
        departmentName: '東北11地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16161',
        departmentName: '北関東･千葉1地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16162',
        departmentName: '北関東･千葉2地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16163',
        departmentName: '北関東･千葉3地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16164',
        departmentName: '北関東･千葉4地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16165',
        departmentName: '北関東･千葉5地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16166',
        departmentName: '北関東･千葉6地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16167',
        departmentName: '北関東･千葉7地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16168',
        departmentName: '北関東･千葉8地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16181',
        departmentName: '東京･ﾓﾊﾞｲﾙ1地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16183',
        departmentName: '東京･ﾓﾊﾞｲﾙ2地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16184',
        departmentName: '東京･ﾓﾊﾞｲﾙ3地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16185',
        departmentName: '東京･ﾓﾊﾞｲﾙ4地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16186',
        departmentName: '東京･ﾓﾊﾞｲﾙ5地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16201',
        departmentName: '東京･ﾓﾊﾞｲﾙ6地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16202',
        departmentName: '東京･ﾓﾊﾞｲﾙ7地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16203',
        departmentName: '東京･ﾓﾊﾞｲﾙ8地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16204',
        departmentName: '東京･ﾓﾊﾞｲﾙ9地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16221',
        departmentName: '埼玉･神奈川1地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16222',
        departmentName: '埼玉･神奈川2地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16223',
        departmentName: '埼玉･神奈川3地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16224',
        departmentName: '埼玉･神奈川4地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16225',
        departmentName: '埼玉･神奈川5地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16226',
        departmentName: '埼玉･神奈川6地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16227',
        departmentName: '埼玉･神奈川7地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16261',
        departmentName: '東東海1地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16262',
        departmentName: '東東海2地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16263',
        departmentName: '東東海3地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16264',
        departmentName: '東東海4地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16265',
        departmentName: '東東海5地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16266',
        departmentName: '東東海6地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16281',
        departmentName: '西東海1地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16282',
        departmentName: '西東海2地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16283',
        departmentName: '東東海7地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16284',
        departmentName: '西東海3地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16301',
        departmentName: '西東海4地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16302',
        departmentName: '西東海5地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16303',
        departmentName: '西東海6地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16321',
        departmentName: '甲信越･北陸1地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16322',
        departmentName: '甲信越･北陸2地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16323',
        departmentName: '甲信越･北陸3地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16324',
        departmentName: '甲信越･北陸4地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16325',
        departmentName: '甲信越･北陸5地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16326',
        departmentName: '甲信越･北陸6地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16327',
        departmentName: '甲信越･北陸7地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16328',
        departmentName: '甲信越･北陸8地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16341',
        departmentName: '関西1地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16342',
        departmentName: '関西2地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16343',
        departmentName: '関西3地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16344',
        departmentName: '関西4地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16345',
        departmentName: '関西5地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16346',
        departmentName: '関西6地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16361',
        departmentName: '中国･四国1地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16362',
        departmentName: '中国･四国2地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16363',
        departmentName: '中国･四国3地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16364',
        departmentName: '中国･四国4地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16365',
        departmentName: '中国･四国5地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16366',
        departmentName: '中国･四国6地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16381',
        departmentName: '中国･四国7地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16382',
        departmentName: '中国･四国8地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16383',
        departmentName: '中国･四国9地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16384',
        departmentName: '中国･四国10地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16401',
        departmentName: '北部九州･沖縄1地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16402',
        departmentName: '北部九州･沖縄2地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16403',
        departmentName: '北部九州･沖縄3地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16404',
        departmentName: '北部九州･沖縄4地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16405',
        departmentName: '中南部九州1地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16406',
        departmentName: '中南部九州2地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16421',
        departmentName: '中南部九州3地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16422',
        departmentName: '中南部九州4地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16423',
        departmentName: '中南部九州5地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16424',
        departmentName: '中南部九州6地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16425',
        departmentName: '中南部九州7地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16426',
        departmentName: '中南部九州8地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16441',
        departmentName: '北部九州･沖縄5地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16442',
        departmentName: '北部九州･沖縄6地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16443',
        departmentName: '北部九州･沖縄7地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16444',
        departmentName: '北部九州･沖縄8地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16445',
        departmentName: '北部九州･沖縄9地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '16463',
        departmentName: 'ｹﾞｵ商品部',
      },
      {
        departmentId: '16464',
        departmentName: '特販部',
      },
      {
        departmentId: '16465',
        departmentName: '物流部',
      },
      {
        departmentId: '16468',
        departmentName: 'ﾜｰﾙﾄﾞﾓﾊﾞｲﾙ',
      },
      {
        departmentId: '16469',
        departmentName: 'ﾜｰﾙﾄﾞﾓﾊﾞｲﾙ事業部(WM)',
      },
      {
        departmentId: '16500',
        departmentName: 'ｺﾝﾌﾟﾗｲｱﾝｽ課',
      },
      {
        departmentId: '16503',
        departmentName: 'ﾌﾛﾝﾄSE課',
      },
      {
        departmentId: '16507',
        departmentName: '人事労政課',
      },
      {
        departmentId: '16508',
        departmentName: '総務課',
      },
      {
        departmentId: '16509',
        departmentName: 'ｹﾞｵ事業課',
      },
      {
        departmentId: '16510',
        departmentName: 'ｹﾞｵ商品1課',
      },
      {
        departmentId: '16511',
        departmentName: 'ｹﾞｵ商品2課',
      },
      {
        departmentId: '16513',
        departmentName: 'ﾘﾃｰﾙ商品1課',
      },
      {
        departmentId: '16514',
        departmentName: 'ﾓﾊﾞｲﾙ商品課',
      },
      {
        departmentId: '16515',
        departmentName: 'ｹﾞｵEC課',
      },
      {
        departmentId: '16517',
        departmentName: '物流3課',
      },
      {
        departmentId: '16518',
        departmentName: 'ｾｶﾝﾄﾞｽﾄﾘｰﾄ商品2課',
      },
      {
        departmentId: '16519',
        departmentName: 'ｾｶﾝﾄﾞｽﾄﾘｰﾄFC課',
      },
      {
        departmentId: '16520',
        departmentName: '海外事業管理課',
      },
      {
        departmentId: '16521',
        departmentName: '特販課',
      },
      {
        departmentId: '16524',
        departmentName: '物流2課',
      },
      {
        departmentId: '16525',
        departmentName: '立上課',
      },
      {
        departmentId: '16529',
        departmentName: 'ﾓﾊﾞｲﾙ管理課(WM)',
      },
      {
        departmentId: '16538',
        departmentName: 'ｹﾞｵFC課',
      },
      {
        departmentId: '16564',
        departmentName: 'ｹﾞｵﾈｯﾄﾜｰｸｽ',
      },
      {
        departmentId: '16614',
        departmentName: 'ﾋﾞｼﾞﾈｽｿﾘｭｰｼｮﾝ部',
      },
      {
        departmentId: '16615',
        departmentName: '組織開発課',
      },
      {
        departmentId: '16616',
        departmentName: '人財企画課',
      },
      {
        departmentId: '16618',
        departmentName: 'BtoB事業課',
      },
      {
        departmentId: '16621',
        departmentName: '東京5地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '16623',
        departmentName: '神奈川･山梨･静岡4地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '16624',
        departmentName: '京滋･三岐6地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '16625',
        departmentName: '兵庫･奈良･和歌山4地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '16626',
        departmentName: '中南部九州6地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '16640',
        departmentName: '2nd Street MALAYSIA事業部',
      },
      {
        departmentId: '16654',
        departmentName: '連結会計課',
      },
      {
        departmentId: '16658',
        departmentName: '総務部',
      },
      {
        departmentId: '16660',
        departmentName: '2nd Street MALAYSIA店舗運営1課',
      },
      {
        departmentId: '16662',
        departmentName: 'ｹﾞｵ川口什器倉庫',
      },
      {
        departmentId: '16663',
        departmentName: 'ｹﾞｵ多の津什器倉庫',
      },
      {
        departmentId: '16669',
        departmentName: 'ｾｶﾝﾄﾞｽﾄﾘｰﾄECｻﾎﾟｰﾄ',
      },
      {
        departmentId: '16670',
        departmentName: 'ｹﾞｵECｻﾎﾟｰﾄ',
      },
      {
        departmentId: '16671',
        departmentName: 'WEBｱﾌﾟﾘCSﾕﾆｯﾄ',
      },
      {
        departmentId: '16677',
        departmentName: '沖縄開発ﾕﾆｯﾄ',
      },
      {
        departmentId: '16684',
        departmentName: 'ｹﾞｵ製品開発1課',
      },
      {
        departmentId: '16685',
        departmentName: 'ｹﾞｵﾌﾟﾚｾﾞﾝﾃｰｼｮﾝ課',
      },
      {
        departmentId: '16687',
        departmentName: '物流統括課',
      },
      {
        departmentId: '16688',
        departmentName: 'ｾｶﾝﾄﾞｽﾄﾘｰﾄ商品1課',
      },
      {
        departmentId: '16690',
        departmentName: '統合ﾏｰｹﾃｨﾝｸﾞ課',
      },
      {
        departmentId: '16694',
        departmentName: 'ｹﾞｵﾋﾞｼﾞﾈｽｻﾎﾟｰﾄ部',
      },
      {
        departmentId: '16695',
        departmentName: '就労移行支援事業課',
      },
      {
        departmentId: '16696',
        departmentName: 'ｲｰﾈｯﾄ･ﾌﾛﾝﾃｨｱ部',
      },
      {
        departmentId: '16704',
        departmentName: 'ﾓﾊﾞｲﾙ法人商品課(WM)',
      },
      {
        departmentId: '16705',
        departmentName: 'ﾓﾊﾞｲﾙ買取推進課(WM)',
      },
      {
        departmentId: '16706',
        departmentName: '国内店舗地区',
      },
      {
        departmentId: '16707',
        departmentName: 'ﾌﾟﾙｰｸ部',
      },
      {
        departmentId: '16708',
        departmentName: 'ﾌﾟﾙｰｸ課',
      },
      {
        departmentId: '16709',
        departmentName: 'おお蔵ﾎｰﾙﾃﾞｨﾝｸﾞｽ',
      },
      {
        departmentId: '16710',
        departmentName: 'Ookura Investments Limited',
      },
      {
        departmentId: '16711',
        departmentName: 'Ookura USA Inc.',
      },
      {
        departmentId: '16717',
        departmentName: '経営企画室',
      },
      {
        departmentId: '16720',
        departmentName: '2ND STREET TAIWAN',
      },
      {
        departmentId: '16722',
        departmentName: 'OPS1地区',
      },
      {
        departmentId: '16726',
        departmentName: '営業企画部',
      },
      {
        departmentId: '16727',
        departmentName: '(株)おお蔵',
      },
      {
        departmentId: '16728',
        departmentName: '(株)ＯＫＵＲＡ',
      },
      {
        departmentId: '16730',
        departmentName: '2nd Street USA NY Branch',
      },
      {
        departmentId: '16731',
        departmentName: '山形出張買取',
      },
      {
        departmentId: '16735',
        departmentName: 'OKURA事業部',
      },
      {
        departmentId: '16736',
        departmentName: 'OKURA店舗運営課',
      },
      {
        departmentId: '16737',
        departmentName: '情報ｼｽﾃﾑ課',
      },
      {
        departmentId: '16738',
        departmentName: 'ﾍﾞﾄﾅﾑ開発課',
      },
      {
        departmentId: '16739',
        departmentName: '業務ｼｽﾃﾑ統括課',
      },
      {
        departmentId: '16740',
        departmentName: 'BPR推進部',
      },
      {
        departmentId: '16741',
        departmentName: 'ﾃﾞｰﾀ課',
      },
      {
        departmentId: '16742',
        departmentName: 'zowieQ',
      },
      {
        departmentId: '16745',
        departmentName: 'GEO SYSTEM SOLUTIONS VIETNAM',
      },
      {
        departmentId: '16748',
        departmentName: '2ND STREET TAIWAN事業部',
      },
      {
        departmentId: '16749',
        departmentName: '2ND STREET TAIWAN店舗営運課',
      },
      {
        departmentId: '16750',
        departmentName: 'ｹﾞｵｽﾄｱ',
      },
      {
        departmentId: '16751',
        departmentName: 'ｾｶﾝﾄﾞｽﾄﾘｰﾄ',
      },
      {
        departmentId: '16752',
        departmentName: '財務課',
      },
      {
        departmentId: '16753',
        departmentName: '会計ｼｽﾃﾑ課',
      },
      {
        departmentId: '16762',
        departmentName: '管理部',
      },
      {
        departmentId: '16764',
        departmentName: '第2営業部',
      },
      {
        departmentId: '16767',
        departmentName: '財務経理課',
      },
      {
        departmentId: '16768',
        departmentName: '人事労務課',
      },
      {
        departmentId: '16769',
        departmentName: '総務法務課',
      },
      {
        departmentId: '16771',
        departmentName: '営業1課',
      },
      {
        departmentId: '16772',
        departmentName: '営業2課',
      },
      {
        departmentId: '16773',
        departmentName: '営業3課',
      },
      {
        departmentId: '16774',
        departmentName: '営業企画課',
      },
      {
        departmentId: '16775',
        departmentName: 'ｵｰｸｼｮﾝ運営課',
      },
      {
        departmentId: '16776',
        departmentName: 'ﾚﾝﾀﾙ事業課',
      },
      {
        departmentId: '16777',
        departmentName: 'OKURA販促企画課',
      },
      {
        departmentId: '16778',
        departmentName: 'EC課',
      },
      {
        departmentId: '16779',
        departmentName: 'ｹﾞｵ事業本部',
      },
      {
        departmentId: '16781',
        departmentName: 'あれこれﾚﾝﾀﾙ課',
      },
      {
        departmentId: '16786',
        departmentName: 'ｹﾞｵﾌｫｰﾏｯﾄ開発部',
      },
      {
        departmentId: '16787',
        departmentName: 'ｹﾞｵ営業企画課',
      },
      {
        departmentId: '16788',
        departmentName: 'ｾｶﾝﾄﾞｽﾄﾘｰﾄ事業本部',
      },
      {
        departmentId: '16796',
        departmentName: '海外事業本部',
      },
      {
        departmentId: '16797',
        departmentName: '業務ｼｽﾃﾑ本部',
      },
      {
        departmentId: '16798',
        departmentName: 'ｹﾞｵｽﾄｱ店舗運営部',
      },
      {
        departmentId: '16799',
        departmentName: 'ｾｶﾝﾄﾞｽﾄﾘｰﾄ店舗運営部',
      },
      {
        departmentId: '16800',
        departmentName: 'ｾｶﾝﾄﾞｽﾄﾘｰﾄ店舗運営2課',
      },
      {
        departmentId: '16803',
        departmentName: 'ｹﾞｵｽﾄｱEC買取課',
      },
      {
        departmentId: '16804',
        departmentName: 'ｾｶﾝﾄﾞｽﾄﾘｰﾄEC買取課',
      },
      {
        departmentId: '16808',
        departmentName: 'CRM推進課',
      },
      {
        departmentId: '16809',
        departmentName: 'ﾏｰｹﾃｨﾝｸﾞ企画課',
      },
      {
        departmentId: '16810',
        departmentName: 'WEBﾏｰｹﾃｨﾝｸﾞ企画1課',
      },
      {
        departmentId: '16813',
        departmentName: '経理財務部',
      },
      {
        departmentId: '16814',
        departmentName: '人事総務本部',
      },
      {
        departmentId: '16815',
        departmentName: '開発本部',
      },
      {
        departmentId: '16816',
        departmentName: '開発業務課',
      },
      {
        departmentId: '16817',
        departmentName: '施設管理部',
      },
      {
        departmentId: '16818',
        departmentName: 'ｼｽﾃﾑ統括本部',
      },
      {
        departmentId: '16819',
        departmentName: 'WEB事業部',
      },
      {
        departmentId: '16820',
        departmentName: 'WEB事業企画課',
      },
      {
        departmentId: '16822',
        departmentName: 'ｾｶﾝﾄﾞｽﾄﾘｰﾄEC事業課',
      },
      {
        departmentId: '16823',
        departmentName: '買取ﾛｯｶｰﾕﾆｯﾄ',
      },
      {
        departmentId: '16829',
        departmentName: '東北4地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '16831',
        departmentName: '愛媛出張買取',
      },
      {
        departmentId: '16832',
        departmentName: '宅配ﾚﾝﾀﾙ課',
      },
      {
        departmentId: '16840',
        departmentName: 'USA事業課',
      },
      {
        departmentId: '16841',
        departmentName: '台湾事業課',
      },
      {
        departmentId: '16843',
        departmentName: 'GBS清掃ﾁｰﾑ',
      },
      {
        departmentId: '16849',
        departmentName: '新卒採用ﾕﾆｯﾄ',
      },
      {
        departmentId: '16850',
        departmentName: '中途採用ﾕﾆｯﾄ',
      },
      {
        departmentId: '16851',
        departmentName: 'PA採用ﾕﾆｯﾄ',
      },
      {
        departmentId: '16853',
        departmentName: 'Luxury真贋教育ﾕﾆｯﾄ',
      },
      {
        departmentId: '16857',
        departmentName: '査定ｼｽﾃﾑ企画課',
      },
      {
        departmentId: '16858',
        departmentName: 'ｹﾞｵ製品開発2課',
      },
      {
        departmentId: '16859',
        departmentName: '伊奈ﾘﾕｰｽEC加工',
      },
      {
        departmentId: '16860',
        departmentName: 'ｹﾞｵﾘﾃｰﾙ',
      },
      {
        departmentId: '16864',
        departmentName: 'D&I推進課',
      },
      {
        departmentId: '16865',
        departmentName: 'USA事業部',
      },
      {
        departmentId: '16866',
        departmentName: 'ﾏﾚｰｼｱ事業課',
      },
      {
        departmentId: '16867',
        departmentName: '伊奈ﾘﾕｰｽEC買取倉庫',
      },
      {
        departmentId: '16868',
        departmentName: 'ﾊﾞｯｸｴﾝﾄﾞSE課',
      },
      {
        departmentId: '16869',
        departmentName: 'OPS商品部',
      },
      {
        departmentId: '16871',
        departmentName: '東海ｺｰﾙｾﾝﾀｰ',
      },
      {
        departmentId: '16872',
        departmentName: '人事ﾕﾆｯﾄ',
      },
      {
        departmentId: '16873',
        departmentName: '健康相談室',
      },
      {
        departmentId: '16874',
        departmentName: 'OPS2地区',
      },
      {
        departmentId: '16876',
        departmentName: '業務ｼｽﾃﾑ教育ﾕﾆｯﾄ',
      },
      {
        departmentId: '16877',
        departmentName: 'ﾘﾃｰﾙ商品2課',
      },
      {
        departmentId: '16878',
        departmentName: '伊奈物販流通',
      },
      {
        departmentId: '16879',
        departmentName: '伊奈ﾒﾃﾞｨｱ加工',
      },
      {
        departmentId: '16880',
        departmentName: '札幌ﾘﾕｰｽEC買取倉庫',
      },
      {
        departmentId: '16881',
        departmentName: 'ｹﾞｵ商品3課',
      },
      {
        departmentId: '16882',
        departmentName: '業務ｼｽﾃﾑ計数管理分析課',
      },
      {
        departmentId: '16883',
        departmentName: '店舗ｼｽﾃﾑ開発課',
      },
      {
        departmentId: '16884',
        departmentName: 'ECｼｽﾃﾑ開発課',
      },
      {
        departmentId: '16887',
        departmentName: '台湾1地区',
      },
      {
        departmentId: '16888',
        departmentName: '台湾2地区',
      },
      {
        departmentId: '16889',
        departmentName: 'ﾍﾞﾄﾅﾑ開発ﾕﾆｯﾄ',
      },
      {
        departmentId: '16890',
        departmentName: 'OPS宣伝販促課',
      },
      {
        departmentId: '16892',
        departmentName: '東濃出張買取',
      },
      {
        departmentId: '16894',
        departmentName: 'WEB事業本部',
      },
      {
        departmentId: '16895',
        departmentName: '商品企画課',
      },
      {
        departmentId: '16896',
        departmentName: '催事企画課',
      },
      {
        departmentId: '16897',
        departmentName: 'OKURA買取事業課',
      },
      {
        departmentId: '16901',
        departmentName: 'OKURA店舗運営1地区',
      },
      {
        departmentId: '16902',
        departmentName: 'OKURA店舗運営2地区',
      },
      {
        departmentId: '16903',
        departmentName: 'ｾｶﾝﾄﾞｽﾄﾘｰﾄ店舗運営3課',
      },
      {
        departmentId: '16905',
        departmentName: '信越･北陸5地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '16906',
        departmentName: '信越･北陸6地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '16907',
        departmentName: '信越･北陸7地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '16908',
        departmentName: '奈良･京滋ｺｰﾙｾﾝﾀｰ',
      },
      {
        departmentId: '16909',
        departmentName: '中国･四国5地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '16910',
        departmentName: '中国･四国6地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '16911',
        departmentName: '中国･四国7地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '16913',
        departmentName: 'ｹﾞｵ広告宣伝課',
      },
      {
        departmentId: '16914',
        departmentName: 'IT企画部',
      },
      {
        departmentId: '16915',
        departmentName: 'IT企画課',
      },
      {
        departmentId: '16916',
        departmentName: 'ﾘﾃｰﾙ商品部',
      },
      {
        departmentId: '16917',
        departmentName: 'ｾｶﾝﾄﾞｽﾄﾘｰﾄ事業課',
      },
      {
        departmentId: '16918',
        departmentName: '商品検証課',
      },
      {
        departmentId: '16919',
        departmentName: 'ｼｪｱﾘﾝｸﾞ事業部',
      },
      {
        departmentId: '16920',
        departmentName: 'IT予算管理課',
      },
      {
        departmentId: '16923',
        departmentName: 'ﾄﾗﾝｸ事業部',
      },
      {
        departmentId: '16924',
        departmentName: 'ﾄﾗﾝｸ事業課',
      },
      {
        departmentId: '16929',
        departmentName: 'ﾏｽﾀ課',
      },
      {
        departmentId: '16930',
        departmentName: 'ﾌﾞﾝｿﾞｳ東地区',
      },
      {
        departmentId: '16931',
        departmentName: '管理本部(GNW)',
      },
      {
        departmentId: '16932',
        departmentName: '神奈川･山梨･静岡5地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '16933',
        departmentName: 'ｾｶﾝﾄﾞｽﾄﾘｰﾄ業務ｼｽﾃﾑ課',
      },
      {
        departmentId: '16934',
        departmentName: '2nd Street MALAYSIA店舗運営2課',
      },
      {
        departmentId: '16935',
        departmentName: 'IT企画本部(GNW)',
      },
      {
        departmentId: '16936',
        departmentName: 'WEBｱﾌﾟﾘ企画部(GNW)',
      },
      {
        departmentId: '16937',
        departmentName: 'ﾃﾞｻﾞｲﾝ課(GNW)',
      },
      {
        departmentId: '16948',
        departmentName: 'WEBｱﾌﾟﾘ企画課',
      },
      {
        departmentId: '16949',
        departmentName: 'WEBｱﾌﾟﾘ企画ﾕﾆｯﾄ',
      },
      {
        departmentId: '16950',
        departmentName: 'WEBｱﾌﾟﾘ運用ﾕﾆｯﾄ',
      },
      {
        departmentId: '16951',
        departmentName: 'ﾃﾞｻﾞｲﾝ課',
      },
      {
        departmentId: '16952',
        departmentName: 'WEBｼｽﾃﾑ開発部',
      },
      {
        departmentId: '16953',
        departmentName: 'WEBｲﾝﾌﾗ課',
      },
      {
        departmentId: '16954',
        departmentName: '開発1課',
      },
      {
        departmentId: '16955',
        departmentName: '開発2課',
      },
      {
        departmentId: '16956',
        departmentName: '開発3課',
      },
      {
        departmentId: '16957',
        departmentName: 'WEBｺｰﾃﾞｨﾝｸﾞ課',
      },
      {
        departmentId: '16961',
        departmentName: 'WEBﾏｰｹﾃｨﾝｸﾞ推進本部',
      },
      {
        departmentId: '16962',
        departmentName: 'ﾏｰｹﾃｨﾝｸﾞ部',
      },
      {
        departmentId: '16963',
        departmentName: 'viviON',
      },
      {
        departmentId: '16965',
        departmentName: '営業企画ﾕﾆｯﾄ',
      },
      {
        departmentId: '16966',
        departmentName: '分析ﾕﾆｯﾄ',
      },
      {
        departmentId: '16967',
        departmentName: 'ﾘﾕｰｽﾊﾞｲﾔｰﾕﾆｯﾄ(LUXB)',
      },
      {
        departmentId: '16968',
        departmentName: 'ﾘﾕｰｽﾊﾞｲﾔｰﾕﾆｯﾄ(ｶｼﾞｭｱﾙ衣服)',
      },
      {
        departmentId: '16969',
        departmentName: 'ﾘﾕｰｽﾊﾞｲﾔｰﾕﾆｯﾄ(家電)',
      },
      {
        departmentId: '16970',
        departmentName: 'ﾘﾕｰｽﾊﾞｲﾔｰﾕﾆｯﾄ(sp/fit)',
      },
      {
        departmentId: '16971',
        departmentName: 'ﾘﾕｰｽﾊﾞｲﾔｰﾕﾆｯﾄ(生活)',
      },
      {
        departmentId: '16972',
        departmentName: 'ﾘﾕｰｽﾊﾞｲﾔｰﾕﾆｯﾄ(家具)',
      },
      {
        departmentId: '16973',
        departmentName: 'ﾘﾕｰｽﾊﾞｲﾔｰﾕﾆｯﾄ(楽器)',
      },
      {
        departmentId: '16974',
        departmentName: 'ﾘﾕｰｽﾊﾞｲﾔｰﾕﾆｯﾄ(ﾎﾋﾞｰ)',
      },
      {
        departmentId: '16975',
        departmentName: 'ﾘﾕｰｽﾊﾞｲﾔｰﾕﾆｯﾄ(ｷｯｽﾞ)',
      },
      {
        departmentId: '16976',
        departmentName: 'ｸﾘｴｲﾃｨﾌﾞﾕﾆｯﾄ',
      },
      {
        departmentId: '16978',
        departmentName: '業務支援ﾕﾆｯﾄ',
      },
      {
        departmentId: '16982',
        departmentName: 'ﾘﾃｰﾙﾊﾞｯｸｵﾌｨｽ',
      },
      {
        departmentId: '16985',
        departmentName: '衣料服飾検証ﾕﾆｯﾄ',
      },
      {
        departmentId: '16987',
        departmentName: '総合検証ﾕﾆｯﾄ',
      },
      {
        departmentId: '16988',
        departmentName: 'ﾗｸﾞｼﾞｭｱﾘｰ検証ﾕﾆｯﾄ',
      },
      {
        departmentId: '16989',
        departmentName: 'ﾗｸﾞｼﾞｭｱﾘｰ二次検品ﾕﾆｯﾄ',
      },
      {
        departmentId: '16990',
        departmentName: 'ｶｼﾞｭｱﾙ二次検品ﾕﾆｯﾄ',
      },
      {
        departmentId: '16991',
        departmentName: '真贋ﾏﾆｭｱﾙﾕﾆｯﾄ',
      },
      {
        departmentId: '16992',
        departmentName: 'ｹﾞｵｸﾞﾙｰﾌﾟ労働組合',
      },
      {
        departmentId: '16994',
        departmentName: 'OPS法人営業課',
      },
      {
        departmentId: '17036',
        departmentName: 'おお蔵海外事業部',
      },
      {
        departmentId: '17037',
        departmentName: 'おお蔵海外事業課',
      },
      {
        departmentId: '17038',
        departmentName: 'ｲﾝｻｲﾄﾞｾｰﾙｽU',
      },
      {
        departmentId: '17040',
        departmentName: 'EC流通課',
      },
      {
        departmentId: '17042',
        departmentName: 'OKURA店舗運営3地区',
      },
      {
        departmentId: '17043',
        departmentName: 'OKURA店舗運営4地区',
      },
      {
        departmentId: '17044',
        departmentName: '販売戦略部',
      },
      {
        departmentId: '17045',
        departmentName: '教育再構築PJT',
      },
      {
        departmentId: '17046',
        departmentName: '教育再構築PJT推進課',
      },
      {
        departmentId: '17047',
        departmentName: '労使福祉部',
      },
      {
        departmentId: '17048',
        departmentName: 'ﾘﾃｰﾙ商品3課',
      },
      {
        departmentId: '17049',
        departmentName: 'ﾘﾕｰｽﾊﾞｯｸｵﾌｨｽ',
      },
      {
        departmentId: '17050',
        departmentName: '東南ｱｼﾞｱ事業部',
      },
      {
        departmentId: '17051',
        departmentName: '出店準備課',
      },
      {
        departmentId: '17052',
        departmentName: '台湾事業部',
      },
      {
        departmentId: '17053',
        departmentName: '物流ｼｽﾃﾑ本部',
      },
      {
        departmentId: '17054',
        departmentName: 'ﾆｭｰﾌｫｰﾏｯﾄｼｽﾃﾑ構築PJT',
      },
      {
        departmentId: '17056',
        departmentName: 'WEBﾏｰｹﾃｨﾝｸﾞ企画2課',
      },
      {
        departmentId: '17057',
        departmentName: 'お客様相談室',
      },
      {
        departmentId: '17058',
        departmentName: 'ｾｶﾝﾄﾞｽﾄﾘｰﾄEC事業部',
      },
      {
        departmentId: '17060',
        departmentName: 'ｹﾞｵﾋﾞｼﾞﾈｽｻﾎﾟｰﾄ課',
      },
      {
        departmentId: '17061',
        departmentName: '東京出張買取',
      },
      {
        departmentId: '17065',
        departmentName: '埼玉･神奈川8地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '17066',
        departmentName: '埼玉･神奈川9地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '17070',
        departmentName: 'rock事業支援ﾕﾆｯﾄ',
      },
      {
        departmentId: '17072',
        departmentName: 'ﾌﾞﾝｿﾞｳ店舗運営課',
      },
      {
        departmentId: '17073',
        departmentName: 'ﾌﾞﾝｿﾞｳ西地区',
      },
      {
        departmentId: '17075',
        departmentName: 'rock',
      },
      {
        departmentId: '17077',
        departmentName: 'rock事業部',
      },
      {
        departmentId: '17078',
        departmentName: 'ﾌﾟﾚｼﾞｬｰ事業課',
      },
      {
        departmentId: '17084',
        departmentName: 'こたろう事業課',
      },
      {
        departmentId: '17088',
        departmentName: '出張買取事業課',
      },
      {
        departmentId: '17089',
        departmentName: 'rock事業課',
      },
      {
        departmentId: '17091',
        departmentName: 'WEBｱﾌﾟﾘCS課(GNW)',
      },
      {
        departmentId: '17095',
        departmentName: 'ﾓﾊﾞｲﾙ店舗販売推進1課',
      },
      {
        departmentId: '17103',
        departmentName: 'GBS巡回清掃ﾕﾆｯﾄ(岡崎)',
      },
      {
        departmentId: '17104',
        departmentName: 'GBS巡回清掃ﾕﾆｯﾄ(岐阜)',
      },
      {
        departmentId: '17105',
        departmentName: 'GBS巡回清掃ﾕﾆｯﾄ(札幌)',
      },
      {
        departmentId: '17113',
        departmentName: '物流ｼｽﾃﾑ開発課',
      },
      {
        departmentId: '17119',
        departmentName: '施工監理ﾕﾆｯﾄ',
      },
      {
        departmentId: '17120',
        departmentName: '店舗ﾚｲｱｳﾄﾕﾆｯﾄ',
      },
      {
        departmentId: '17121',
        departmentName: '用品購買ﾕﾆｯﾄ',
      },
      {
        departmentId: '17122',
        departmentName: '店舗設備営繕ﾕﾆｯﾄ',
      },
      {
        departmentId: '17123',
        departmentName: 'ｲﾝﾌﾗ整備ﾕﾆｯﾄ',
      },
      {
        departmentId: '17124',
        departmentName: 'ﾘﾕｰｽｱﾗｲｱﾝｽ事業部',
      },
      {
        departmentId: '17125',
        departmentName: 'ﾘﾕｰｽｱﾗｲｱﾝｽ事業課',
      },
      {
        departmentId: '17126',
        departmentName: 'ｸﾞﾛｰﾊﾞﾙ財務課',
      },
      {
        departmentId: '17127',
        departmentName: 'SE採用課',
      },
      {
        departmentId: '17128',
        departmentName: 'ｳｪｱﾊｳｽ3地区',
      },
      {
        departmentId: '17129',
        departmentName: 'ｾｶﾝﾄﾞｽﾄﾘｰﾄ買取事業課',
      },
      {
        departmentId: '17130',
        departmentName: 'ﾓﾊﾞｲﾙ法人営業開発課(WM)',
      },
      {
        departmentId: '17131',
        departmentName: 'ﾏｰｹﾃｨﾝｸﾞ本部',
      },
      {
        departmentId: '17132',
        departmentName: 'ﾓﾊﾞｲﾙ推進本部',
      },
      {
        departmentId: '17133',
        departmentName: 'ﾓﾊﾞｲﾙ店舗販売推進部',
      },
      {
        departmentId: '17134',
        departmentName: 'ﾓﾊﾞｲﾙ店舗営業企画課',
      },
      {
        departmentId: '17135',
        departmentName: 'ﾓﾊﾞｲﾙPJT企画課',
      },
      {
        departmentId: '17136',
        departmentName: 'ﾓﾊﾞｲﾙ店舗販売推進2課',
      },
      {
        departmentId: '17137',
        departmentName: 'ﾓﾊﾞｲﾙ店舗販売支援課',
      },
      {
        departmentId: '17138',
        departmentName: 'ﾜｰﾙﾄﾞﾓﾊﾞｲﾙ事業部',
      },
      {
        departmentId: '17139',
        departmentName: 'ﾓﾊﾞｲﾙ法人商品課',
      },
      {
        departmentId: '17140',
        departmentName: 'ﾓﾊﾞｲﾙ法人営業開発課',
      },
      {
        departmentId: '17141',
        departmentName: 'ﾓﾊﾞｲﾙ買取推進課',
      },
      {
        departmentId: '17142',
        departmentName: 'ﾓﾊﾞｲﾙ管理課',
      },
      {
        departmentId: '17146',
        departmentName: '本部ﾘﾕｰｽﾊﾞｲﾔｰﾕﾆｯﾄ',
      },
      {
        departmentId: '17147',
        departmentName: '本部ﾘﾃｰﾙﾊﾞｲﾔｰﾕﾆｯﾄ',
      },
      {
        departmentId: '17148',
        departmentName: 'ﾘﾃｰﾙﾊﾞｲﾔｰﾕﾆｯﾄ(ｶｼﾞｭｱﾙ衣服)',
      },
      {
        departmentId: '17149',
        departmentName: 'ﾘﾃｰﾙﾊﾞｲﾔｰﾕﾆｯﾄ(生活)',
      },
      {
        departmentId: '17150',
        departmentName: 'ﾘﾃｰﾙﾊﾞｲﾔｰﾕﾆｯﾄ(家電)',
      },
      {
        departmentId: '17151',
        departmentName: 'ﾘﾃｰﾙﾊﾞｲﾔｰﾕﾆｯﾄ(sp/fit)',
      },
      {
        departmentId: '17152',
        departmentName: '関西7地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '17153',
        departmentName: '関西8地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '17154',
        departmentName: '関西9地区(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '17155',
        departmentName: 'OKURA店舗運営5地区',
      },
      {
        departmentId: '17156',
        departmentName: '販売企画課',
      },
      {
        departmentId: '17157',
        departmentName: '大阪ｺｰﾙｾﾝﾀｰ',
      },
      {
        departmentId: '17158',
        departmentName: '兵庫･奈良･和歌山6地区(ﾘﾕｰｽ)',
      },
      {
        departmentId: '17159',
        departmentName: '商品部',
      },
      {
        departmentId: '17160',
        departmentName: 'ﾌﾞﾝｿﾞｳ新店教育ﾕﾆｯﾄ',
      },
      {
        departmentId: '17161',
        departmentName: '組織開発ﾕﾆｯﾄ',
      },
      {
        departmentId: '17162',
        departmentName: '立上支援ﾕﾆｯﾄ',
      },
      {
        departmentId: '17163',
        departmentName: 'IT予算管理ﾕﾆｯﾄ',
      },
      {
        departmentId: '17164',
        departmentName: 'EC検品ﾕﾆｯﾄ',
      },
      {
        departmentId: '19500',
        departmentName: 'ﾌﾟﾛﾀﾞｸﾄ課',
      },
      {
        departmentId: '19502',
        departmentName: '管理課',
      },
      {
        departmentId: '19511',
        departmentName: 'ｹﾞｵｽﾄｱ店舗運営課',
      },
      {
        departmentId: '19517',
        departmentName: 'ﾆｭｰﾌｫｰﾏｯﾄｼｽﾃﾑ構築課',
      },
      {
        departmentId: '19518',
        departmentName: '犬山ｹﾞｵｸﾘｱ出荷ｾﾝﾀｰ',
      },
      {
        departmentId: '19520',
        departmentName: '就労移行支援ﾕﾆｯﾄ',
      },
      {
        departmentId: '19601',
        departmentName: 'ｻﾛﾝ事業課',
      },
      {
        departmentId: '19700',
        departmentName: 'ｳﾞｫｶﾞ',
      },
      {
        departmentId: '19720',
        departmentName: 'ﾌﾞﾝｿﾞｳ事業部',
      },
      {
        departmentId: '19721',
        departmentName: 'ﾌﾞﾝｿﾞｳ事業課',
      },
      {
        departmentId: '19800',
        departmentName: 'OPS事業部',
      },
      {
        departmentId: '19801',
        departmentName: 'OPS事業課',
      },
      {
        departmentId: '19802',
        departmentName: 'OPS商品課',
      },
      {
        departmentId: '19803',
        departmentName: 'OPS店舗運営課',
      },
      {
        departmentId: '23432',
        departmentName: '北海道ｿﾞｰﾝ(ﾘﾕｰｽ)',
      },
      {
        departmentId: '23434',
        departmentName: '東北ｿﾞｰﾝ(ﾘﾕｰｽ)',
      },
      {
        departmentId: '23436',
        departmentName: '北関東ｿﾞｰﾝ(ﾘﾕｰｽ)',
      },
      {
        departmentId: '23437',
        departmentName: '埼玉ｿﾞｰﾝ(ﾘﾕｰｽ)',
      },
      {
        departmentId: '23438',
        departmentName: '千葉ｿﾞｰﾝ(ﾘﾕｰｽ)',
      },
      {
        departmentId: '23439',
        departmentName: '東京ｿﾞｰﾝ(ﾘﾕｰｽ)',
      },
      {
        departmentId: '23440',
        departmentName: '信越･北陸ｿﾞｰﾝ(ﾘﾕｰｽ)',
      },
      {
        departmentId: '23443',
        departmentName: '愛知ｿﾞｰﾝ(ﾘﾕｰｽ)',
      },
      {
        departmentId: '23444',
        departmentName: '京滋･三岐ｿﾞｰﾝ(ﾘﾕｰｽ)',
      },
      {
        departmentId: '23445',
        departmentName: '大阪ｿﾞｰﾝ(ﾘﾕｰｽ)',
      },
      {
        departmentId: '23446',
        departmentName: '兵庫･奈良･和歌山ｿﾞｰﾝ(ﾘﾕｰｽ)',
      },
      {
        departmentId: '23447',
        departmentName: '中国･四国ｿﾞｰﾝ(ﾘﾕｰｽ)',
      },
      {
        departmentId: '23449',
        departmentName: '北部九州･沖縄ｿﾞｰﾝ(ﾘﾕｰｽ)',
      },
      {
        departmentId: '23450',
        departmentName: '中南部九州ｿﾞｰﾝ(ﾘﾕｰｽ)',
      },
      {
        departmentId: '23453',
        departmentName: '神奈川･山梨･静岡ｿﾞｰﾝ(ﾘﾕｰｽ)',
      },
      {
        departmentId: '23600',
        departmentName: '北海道ｿﾞｰﾝ(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '23601',
        departmentName: '東北ｿﾞｰﾝ(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '23603',
        departmentName: '北関東･千葉ｿﾞｰﾝ(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '23605',
        departmentName: '東京･ﾓﾊﾞｲﾙｿﾞｰﾝ(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '23607',
        departmentName: '埼玉･神奈川ｿﾞｰﾝ(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '23609',
        departmentName: '東東海ｿﾞｰﾝ(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '23615',
        departmentName: '西東海ｿﾞｰﾝ(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '23617',
        departmentName: '甲信越･北陸ｿﾞｰﾝ(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '23618',
        departmentName: '関西ｿﾞｰﾝ(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '23621',
        departmentName: '中国･四国ｿﾞｰﾝ(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '23622',
        departmentName: '北部九州･沖縄ｿﾞｰﾝ(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '23623',
        departmentName: '中南部九州ｿﾞｰﾝ(ﾒﾃﾞｨｱ)',
      },
      {
        departmentId: '30032',
        departmentName: 'SS南柏店',
      },
      {
        departmentId: '30039',
        departmentName: 'SS小田部店',
      },
      {
        departmentId: '30119',
        departmentName: 'SS大野城店',
      },
      {
        departmentId: '30164',
        departmentName: 'SS新潟桜木店',
      },
      {
        departmentId: '30168',
        departmentName: 'SS旭川東光店',
      },
      {
        departmentId: '30183',
        departmentName: 'SS新居浜星原店',
      },
      {
        departmentId: '30184',
        departmentName: 'SS五日市店',
      },
      {
        departmentId: '30189',
        departmentName: 'SS東ﾊﾞｲﾊﾟｽ店',
      },
      {
        departmentId: '30192',
        departmentName: 'SS古川橋店',
      },
      {
        departmentId: '30196',
        departmentName: 'SS蓮田椿山店',
      },
      {
        departmentId: '30197',
        departmentName: 'SS浦和埼大通り店',
      },
      {
        departmentId: '30207',
        departmentName: 'SS清田店',
      },
      {
        departmentId: '30222',
        departmentName: 'SS座光寺店',
      },
      {
        departmentId: '30234',
        departmentName: 'SS平岸店',
      },
      {
        departmentId: '30242',
        departmentName: 'SS平塚四之宮店',
      },
      {
        departmentId: '30251',
        departmentName: 'SS福島店',
      },
      {
        departmentId: '30254',
        departmentName: 'SS青梅店',
      },
      {
        departmentId: '30255',
        departmentName: 'SS富士店',
      },
      {
        departmentId: '30259',
        departmentName: 'SS越谷谷中店',
      },
      {
        departmentId: '30292',
        departmentName: 'SS熊本ｲﾝﾀｰ店',
      },
      {
        departmentId: '30298',
        departmentName: 'SS狭山店',
      },
      {
        departmentId: '30300',
        departmentName: 'SS鴻巣店',
      },
      {
        departmentId: '30306',
        departmentName: 'SS八戸新井田店',
      },
      {
        departmentId: '30308',
        departmentName: 'SS郡山あさか店',
      },
      {
        departmentId: '30310',
        departmentName: 'SS宮千代店',
      },
      {
        departmentId: '30311',
        departmentName: 'SS川崎千年店',
      },
      {
        departmentId: '30319',
        departmentName: 'SS矢三店',
      },
      {
        departmentId: '30326',
        departmentName: 'SS水島店',
      },
      {
        departmentId: '30327',
        departmentName: 'SS野々市本町店',
      },
      {
        departmentId: '30329',
        departmentName: 'SS三条店',
      },
      {
        departmentId: '30342',
        departmentName: 'SS弘前店',
      },
      {
        departmentId: '30358',
        departmentName: 'SS宇多津店',
      },
      {
        departmentId: '30367',
        departmentName: 'SS浮之城店',
      },
      {
        departmentId: '30380',
        departmentName: 'SS広島東雲店',
      },
      {
        departmentId: '30398',
        departmentName: 'SS神宮店',
      },
      {
        departmentId: '30405',
        departmentName: 'SS福山松永店',
      },
      {
        departmentId: '30434',
        departmentName: 'SS岩沼店',
      },
      {
        departmentId: '30436',
        departmentName: 'SS天山店',
      },
      {
        departmentId: '30444',
        departmentName: 'SS松森店',
      },
      {
        departmentId: '30448',
        departmentName: 'SS永山環状店',
      },
      {
        departmentId: '30521',
        departmentName: 'SS琴似店',
      },
      {
        departmentId: '30527',
        departmentName: 'SS小松店',
      },
      {
        departmentId: '30529',
        departmentName: 'SS高槻店',
      },
      {
        departmentId: '30536',
        departmentName: 'SS狸小路3丁目店',
      },
      {
        departmentId: '30539',
        departmentName: 'SS上越店',
      },
      {
        departmentId: '30541',
        departmentName: 'SS坂之上店',
      },
      {
        departmentId: '30548',
        departmentName: 'SS西条中央店',
      },
      {
        departmentId: '30553',
        departmentName: 'SS長久手店',
      },
      {
        departmentId: '30555',
        departmentName: 'SS長岡店',
      },
      {
        departmentId: '30556',
        departmentName: 'SS堅田店',
      },
      {
        departmentId: '30564',
        departmentName: 'SS岡崎店',
      },
      {
        departmentId: '30566',
        departmentName: 'SS石巻店',
      },
      {
        departmentId: '30567',
        departmentName: 'SS砺波店',
      },
      {
        departmentId: '30570',
        departmentName: 'SS古川店',
      },
      {
        departmentId: '30572',
        departmentName: 'SS田上店',
      },
      {
        departmentId: '30574',
        departmentName: 'SS豊明店',
      },
      {
        departmentId: '30575',
        departmentName: 'SS伊勢小俣店',
      },
      {
        departmentId: '30576',
        departmentName: 'SS松阪店',
      },
      {
        departmentId: '30577',
        departmentName: 'SS敦賀店',
      },
      {
        departmentId: '30584',
        departmentName: 'SS津福店',
      },
      {
        departmentId: '30586',
        departmentName: 'SS久世店',
      },
      {
        departmentId: '30588',
        departmentName: 'SS武生店',
      },
      {
        departmentId: '30589',
        departmentName: 'SS船橋14号店',
      },
      {
        departmentId: '30600',
        departmentName: 'SS津南店',
      },
      {
        departmentId: '30601',
        departmentName: 'SS盛岡店',
      },
      {
        departmentId: '30604',
        departmentName: 'SS福山西新涯店',
      },
      {
        departmentId: '30605',
        departmentName: 'SS出来島店',
      },
      {
        departmentId: '30607',
        departmentName: 'SS天正寺店',
      },
      {
        departmentId: '30608',
        departmentName: 'SS春日井店',
      },
      {
        departmentId: '30609',
        departmentName: 'SS西宮171号店',
      },
      {
        departmentId: '30611',
        departmentName: 'SS光の森店',
      },
      {
        departmentId: '30615',
        departmentName: 'SS加納店',
      },
      {
        departmentId: '30616',
        departmentName: 'SS介良店',
      },
      {
        departmentId: '30617',
        departmentName: 'SS茅ヶ崎店',
      },
      {
        departmentId: '30618',
        departmentName: 'SS深作16号店',
      },
      {
        departmentId: '30619',
        departmentName: 'SS熊本南店',
      },
      {
        departmentId: '30620',
        departmentName: 'SS北41条店',
      },
      {
        departmentId: '30621',
        departmentName: 'SS小杉店',
      },
      {
        departmentId: '30622',
        departmentName: 'SS太宰府店',
      },
      {
        departmentId: '30624',
        departmentName: 'SS羽曳野店',
      },
      {
        departmentId: '30625',
        departmentName: 'SS婦中店',
      },
      {
        departmentId: '30627',
        departmentName: 'SS新津店',
      },
      {
        departmentId: '30628',
        departmentName: 'SS中田店',
      },
      {
        departmentId: '30630',
        departmentName: 'SS渋谷神南店',
      },
      {
        departmentId: '30680',
        departmentName: 'SS新田東店',
      },
      {
        departmentId: '30683',
        departmentName: 'SS伊勢崎店',
      },
      {
        departmentId: '30684',
        departmentName: 'SS江別店',
      },
      {
        departmentId: '30685',
        departmentName: 'SS大垣店',
      },
      {
        departmentId: '30686',
        departmentName: 'SS高岡店',
      },
      {
        departmentId: '30687',
        departmentName: 'SS出雲店',
      },
      {
        departmentId: '30688',
        departmentName: 'SS富田林店',
      },
      {
        departmentId: '30689',
        departmentName: 'SS土佐道路店',
      },
      {
        departmentId: '30690',
        departmentName: 'SSｱｸﾛｽﾌﾟﾗｻﾞ久喜店',
      },
      {
        departmentId: '30692',
        departmentName: 'SS草加店',
      },
      {
        departmentId: '30693',
        departmentName: 'SS和白店',
      },
      {
        departmentId: '30694',
        departmentName: 'SS今治鳥生店',
      },
      {
        departmentId: '30698',
        departmentName: 'SS二又瀬店',
      },
      {
        departmentId: '30699',
        departmentName: 'SS函館戸倉店',
      },
      {
        departmentId: '30700',
        departmentName: 'SS寝屋川店',
      },
      {
        departmentId: '30701',
        departmentName: 'SS屋島店',
      },
      {
        departmentId: '30704',
        departmentName: 'SS川中島店',
      },
      {
        departmentId: '30705',
        departmentName: 'SS横浜今宿店',
      },
      {
        departmentId: '30708',
        departmentName: 'SSひたち野うしく店',
      },
      {
        departmentId: '30711',
        departmentName: 'SS清水ﾊﾞｲﾊﾟｽ店',
      },
      {
        departmentId: '30713',
        departmentName: 'SS川沿店',
      },
      {
        departmentId: '30714',
        departmentName: 'SS幸手店',
      },
      {
        departmentId: '30715',
        departmentName: 'SS高柳店',
      },
      {
        departmentId: '30717',
        departmentName: 'SS鞍月店',
      },
      {
        departmentId: '30718',
        departmentName: 'SS倉敷笹沖店',
      },
      {
        departmentId: '30721',
        departmentName: 'SS広島庚午店',
      },
      {
        departmentId: '30722',
        departmentName: 'SS調布つつじヶ丘店',
      },
      {
        departmentId: '30723',
        departmentName: 'SS箕面店',
      },
      {
        departmentId: '30725',
        departmentName: 'SS青森柳川店',
      },
      {
        departmentId: '30726',
        departmentName: 'SS熊本健軍店',
      },
      {
        departmentId: '30727',
        departmentName: 'SSｲｵﾝﾀｳﾝ柏松ヶ崎店',
      },
      {
        departmentId: '30728',
        departmentName: 'SS春日部店',
      },
      {
        departmentId: '30730',
        departmentName: 'SS所沢店',
      },
      {
        departmentId: '30731',
        departmentName: 'SS西大津店',
      },
      {
        departmentId: '30732',
        departmentName: 'SS名古屋大江店',
      },
      {
        departmentId: '30733',
        departmentName: 'SS松原店',
      },
      {
        departmentId: '30734',
        departmentName: 'SS松山中央店',
      },
      {
        departmentId: '30737',
        departmentName: 'SS岸和田店',
      },
      {
        departmentId: '30738',
        departmentName: 'SS中川店',
      },
      {
        departmentId: '30739',
        departmentName: 'SS足立保木間店',
      },
      {
        departmentId: '30740',
        departmentName: 'SS新栄店',
      },
      {
        departmentId: '30741',
        departmentName: 'SS新潟大学前店',
      },
      {
        departmentId: '30742',
        departmentName: 'SS西原店',
      },
      {
        departmentId: '30743',
        departmentName: 'SS松崎店',
      },
      {
        departmentId: '30749',
        departmentName: 'SS伊丹店',
      },
      {
        departmentId: '30752',
        departmentName: 'SS円座店',
      },
      {
        departmentId: '30754',
        departmentName: 'SS札幌北33条店',
      },
      {
        departmentId: '30756',
        departmentName: 'SSｱｸﾛｽﾌﾟﾗｻﾞ長岡店',
      },
      {
        departmentId: '30757',
        departmentName: 'SS福島松山店',
      },
      {
        departmentId: '30758',
        departmentName: 'SS京都上鳥羽店',
      },
      {
        departmentId: '30759',
        departmentName: 'SS仙台泉中央店',
      },
      {
        departmentId: '30760',
        departmentName: 'SS大阪住之江店',
      },
      {
        departmentId: '30761',
        departmentName: 'SS木更津店',
      },
      {
        departmentId: '30763',
        departmentName: 'SS安城百石店',
      },
      {
        departmentId: '30764',
        departmentName: 'SS阿久比店',
      },
      {
        departmentId: '30765',
        departmentName: 'SS名古屋黒川店',
      },
      {
        departmentId: '30768',
        departmentName: 'SS札幌月寒店',
      },
      {
        departmentId: '30773',
        departmentName: 'SS瀬谷店',
      },
      {
        departmentId: '30774',
        departmentName: 'SS川口赤山店',
      },
      {
        departmentId: '30781',
        departmentName: 'SS奈良押熊店',
      },
      {
        departmentId: '30782',
        departmentName: 'SS東淀川店',
      },
      {
        departmentId: '30783',
        departmentName: 'SS藤井寺ｲﾝﾀｰ店',
      },
      {
        departmentId: '30784',
        departmentName: 'SS福山みどりまち店',
      },
      {
        departmentId: '30786',
        departmentName: 'SS宗像稲元店',
      },
      {
        departmentId: '30789',
        departmentName: 'SS広島祇園店',
      },
      {
        departmentId: '30790',
        departmentName: 'SS延岡店',
      },
      {
        departmentId: '30800',
        departmentName: 'SS川崎野川店',
      },
      {
        departmentId: '30801',
        departmentName: 'SS斑鳩店',
      },
      {
        departmentId: '30802',
        departmentName: 'SS北九州葛原店',
      },
      {
        departmentId: '30805',
        departmentName: 'SSつくば学園店',
      },
      {
        departmentId: '30806',
        departmentName: 'SS水戸赤塚店',
      },
      {
        departmentId: '30807',
        departmentName: 'SS岐南店',
      },
      {
        departmentId: '30813',
        departmentName: 'SS鳴尾店',
      },
      {
        departmentId: '30814',
        departmentName: 'SS会津若松ｲﾝﾀｰ店',
      },
      {
        departmentId: '30816',
        departmentName: 'SS泉佐野店',
      },
      {
        departmentId: '30818',
        departmentName: 'SS春日井ｲﾝﾀｰ店',
      },
      {
        departmentId: '30819',
        departmentName: 'SS北須磨店',
      },
      {
        departmentId: '30821',
        departmentName: 'SS千種駅南店',
      },
      {
        departmentId: '30823',
        departmentName: 'SS天六店',
      },
      {
        departmentId: '30824',
        departmentName: 'SS浜松初生店',
      },
      {
        departmentId: '30825',
        departmentName: 'SS御殿場店',
      },
      {
        departmentId: '30833',
        departmentName: 'SS浜松原島店',
      },
      {
        departmentId: '30834',
        departmentName: 'SS古河旭町店',
      },
      {
        departmentId: '30835',
        departmentName: 'SS酒田ﾊﾞｲﾊﾟｽ店',
      },
      {
        departmentId: '30842',
        departmentName: 'SS名古屋徳重店',
      },
      {
        departmentId: '30849',
        departmentName: 'SS大分古国府店',
      },
      {
        departmentId: '30851',
        departmentName: 'SS沼津学園通り店',
      },
      {
        departmentId: '30852',
        departmentName: 'SS本庄店',
      },
      {
        departmentId: '30853',
        departmentName: 'SS宇都宮鶴田店',
      },
      {
        departmentId: '30856',
        departmentName: 'SS立川栄町店',
      },
      {
        departmentId: '30857',
        departmentName: 'SS北九州本城店',
      },
      {
        departmentId: '30858',
        departmentName: 'SS御座店',
      },
      {
        departmentId: '30860',
        departmentName: 'SS四条河原町店',
      },
      {
        departmentId: '30863',
        departmentName: 'SS大正店',
      },
      {
        departmentId: '30864',
        departmentName: 'SS彦根店',
      },
      {
        departmentId: '30866',
        departmentName: 'SS福山駅家店',
      },
      {
        departmentId: '30867',
        departmentName: 'SS新発田店',
      },
      {
        departmentId: '30868',
        departmentName: 'SS東浦和店',
      },
      {
        departmentId: '30871',
        departmentName: 'SS明石魚住店',
      },
      {
        departmentId: '30873',
        departmentName: 'SS新潟赤道店',
      },
      {
        departmentId: '30874',
        departmentName: 'SS藤沢六会店',
      },
      {
        departmentId: '30875',
        departmentName: 'SS名古屋栄店',
      },
      {
        departmentId: '30876',
        departmentName: 'SS奈良橿原店',
      },
      {
        departmentId: '30877',
        departmentName: 'SS横浜港北店',
      },
      {
        departmentId: '30881',
        departmentName: 'SS大宮大和田店',
      },
      {
        departmentId: '30882',
        departmentName: 'SS岡崎ｲﾝﾀｰ店',
      },
      {
        departmentId: '30883',
        departmentName: 'SS大和郡山店',
      },
      {
        departmentId: '30884',
        departmentName: 'SS鈴蘭台店',
      },
      {
        departmentId: '30885',
        departmentName: 'SS大分光吉ｲﾝﾀｰ店',
      },
      {
        departmentId: '30886',
        departmentName: 'SS多摩境店',
      },
      {
        departmentId: '30887',
        departmentName: 'SS原宿店',
      },
      {
        departmentId: '30888',
        departmentName: 'SSﾗｿﾗ札幌店',
      },
      {
        departmentId: '30889',
        departmentName: 'SS開発店',
      },
      {
        departmentId: '30890',
        departmentName: 'SS北本中山道店',
      },
      {
        departmentId: '30891',
        departmentName: 'SS加島店',
      },
      {
        departmentId: '30892',
        departmentName: 'SS心斎橋店',
      },
      {
        departmentId: '30893',
        departmentName: 'SS川越254号店',
      },
      {
        departmentId: '30894',
        departmentName: 'SS豊中向丘店',
      },
      {
        departmentId: '30895',
        departmentName: 'SS青森浜館店',
      },
      {
        departmentId: '30896',
        departmentName: 'SS福岡高木店',
      },
      {
        departmentId: '30897',
        departmentName: 'SS鳥栖蔵上店',
      },
      {
        departmentId: '30898',
        departmentName: 'SS鎌ヶ谷店',
      },
      {
        departmentId: '30899',
        departmentName: 'SS相模原光が丘店',
      },
      {
        departmentId: '30900',
        departmentName: 'SS東大阪店',
      },
      {
        departmentId: '30901',
        departmentName: 'SSうるまみどり町店',
      },
      {
        departmentId: '30902',
        departmentName: 'SS西岡店',
      },
      {
        departmentId: '30903',
        departmentName: 'SS三郷店',
      },
      {
        departmentId: '30904',
        departmentName: 'SS新松戸店',
      },
      {
        departmentId: '30907',
        departmentName: 'SS田代本通店',
      },
      {
        departmentId: '30908',
        departmentName: 'SS浦安店',
      },
      {
        departmentId: '30909',
        departmentName: 'SS高崎下之城店',
      },
      {
        departmentId: '30910',
        departmentName: 'SS長崎浜町店',
      },
      {
        departmentId: '30911',
        departmentName: 'SS川西山下店',
      },
      {
        departmentId: '30912',
        departmentName: 'SS宝塚安倉店',
      },
      {
        departmentId: '30915',
        departmentName: 'SS堺福田店',
      },
      {
        departmentId: '30917',
        departmentName: 'SO川沿店',
      },
      {
        departmentId: '30918',
        departmentName: 'SS那覇小禄店',
      },
      {
        departmentId: '30919',
        departmentName: 'SS松山谷町店',
      },
      {
        departmentId: '30922',
        departmentName: 'SS東住吉店',
      },
      {
        departmentId: '30923',
        departmentName: 'SS高針原店',
      },
      {
        departmentId: '30924',
        departmentName: 'SS豊田店',
      },
      {
        departmentId: '30925',
        departmentName: 'SS宇治槇島店',
      },
      {
        departmentId: '30926',
        departmentName: 'SS小山店',
      },
      {
        departmentId: '30927',
        departmentName: 'SS成田店',
      },
      {
        departmentId: '30928',
        departmentName: 'SS水戸南ｲﾝﾀｰ店',
      },
      {
        departmentId: '30929',
        departmentName: 'SS千歳店',
      },
      {
        departmentId: '30931',
        departmentName: 'SS福岡片江店',
      },
      {
        departmentId: '30932',
        departmentName: 'SS堺上野芝店',
      },
      {
        departmentId: '30933',
        departmentName: 'SS四日市日永店',
      },
      {
        departmentId: '30934',
        departmentName: 'SO上越店',
      },
      {
        departmentId: '30935',
        departmentName: 'SS加古川店',
      },
      {
        departmentId: '30936',
        departmentName: 'SS半道橋店',
      },
      {
        departmentId: '30937',
        departmentName: 'SS尾張旭店',
      },
      {
        departmentId: '30938',
        departmentName: 'SSS柏沼南店',
      },
      {
        departmentId: '30939',
        departmentName: 'SSS八千代店',
      },
      {
        departmentId: '30940',
        departmentName: 'SS東香里店',
      },
      {
        departmentId: '30941',
        departmentName: 'SS北長池店',
      },
      {
        departmentId: '30942',
        departmentName: 'SSｳｲﾝｸﾞﾍﾞｲ小樽店',
      },
      {
        departmentId: '30943',
        departmentName: 'SS天文館店',
      },
      {
        departmentId: '30944',
        departmentName: 'SS旭店',
      },
      {
        departmentId: '30945',
        departmentName: 'SS大和高田店',
      },
      {
        departmentId: '30947',
        departmentName: 'SS岡山大福店',
      },
      {
        departmentId: '30948',
        departmentName: 'SS和歌山岩出店',
      },
      {
        departmentId: '30950',
        departmentName: 'SSｱｸﾛｽﾌﾟﾗｻﾞ南栄店',
      },
      {
        departmentId: '30952',
        departmentName: 'SS横浜六浦店',
      },
      {
        departmentId: '30953',
        departmentName: 'SS福島南店',
      },
      {
        departmentId: '30954',
        departmentName: 'SS上尾店',
      },
      {
        departmentId: '30955',
        departmentName: 'SSS大宮日進店',
      },
      {
        departmentId: '30956',
        departmentName: 'SS北九州到津店',
      },
      {
        departmentId: '30957',
        departmentName: 'SSおゆみ野店',
      },
      {
        departmentId: '30958',
        departmentName: 'SS東金店',
      },
      {
        departmentId: '30959',
        departmentName: 'SS東川口店',
      },
      {
        departmentId: '30960',
        departmentName: 'SS神戸三宮店',
      },
      {
        departmentId: '30961',
        departmentName: 'SS郡山南店',
      },
      {
        departmentId: '30962',
        departmentName: 'SS岐阜市橋店',
      },
      {
        departmentId: '30963',
        departmentName: 'SS小倉魚町店',
      },
      {
        departmentId: '30964',
        departmentName: 'SS霧島店',
      },
      {
        departmentId: '30965',
        departmentName: 'SS相模原橋本店',
      },
      {
        departmentId: '30966',
        departmentName: 'SS佐野店',
      },
      {
        departmentId: '30967',
        departmentName: 'SS深谷店',
      },
      {
        departmentId: '30968',
        departmentName: 'SS一宮音羽店',
      },
      {
        departmentId: '30971',
        departmentName: 'SS和歌山土入店',
      },
      {
        departmentId: '30972',
        departmentName: 'SS福山蔵王店',
      },
      {
        departmentId: '30973',
        departmentName: 'SS福岡天神店',
      },
      {
        departmentId: '30974',
        departmentName: 'SS多賀城店',
      },
      {
        departmentId: '30975',
        departmentName: 'SS駒沢大学店',
      },
      {
        departmentId: '30976',
        departmentName: 'SS大分高城店',
      },
      {
        departmentId: '30979',
        departmentName: 'SS富谷店',
      },
      {
        departmentId: '30980',
        departmentName: 'SS越谷ﾚｲｸﾀｳﾝ店',
      },
      {
        departmentId: '30981',
        departmentName: 'SS京都醍醐店',
      },
      {
        departmentId: '30982',
        departmentName: 'SS奈良法華寺店',
      },
      {
        departmentId: '30984',
        departmentName: 'SS西春店',
      },
      {
        departmentId: '30985',
        departmentName: 'SS倉敷ｲﾝﾀｰ店',
      },
      {
        departmentId: '30987',
        departmentName: 'SS小田井店',
      },
      {
        departmentId: '30988',
        departmentName: 'SSS大谷地店',
      },
      {
        departmentId: '30989',
        departmentName: 'SS仙台一番町店',
      },
      {
        departmentId: '30990',
        departmentName: 'SS高岡野村店',
      },
      {
        departmentId: '30991',
        departmentName: 'SS高崎問屋町店',
      },
      {
        departmentId: '30992',
        departmentName: 'SS龍ヶ崎店',
      },
      {
        departmentId: '30993',
        departmentName: 'SS広島本通店',
      },
      {
        departmentId: '30994',
        departmentName: 'SS尼崎ｲﾝﾀｰ店',
      },
      {
        departmentId: '30995',
        departmentName: 'SS時津店',
      },
      {
        departmentId: '30997',
        departmentName: 'SS守谷店',
      },
      {
        departmentId: '30999',
        departmentName: 'SS神戸垂水店',
      },
      {
        departmentId: '31000',
        departmentName: 'SS大宮東口店',
      },
      {
        departmentId: '31001',
        departmentName: 'SS亀田店',
      },
      {
        departmentId: '31002',
        departmentName: 'SSあすと長町店',
      },
      {
        departmentId: '31004',
        departmentName: 'SS狸小路4丁目店',
      },
      {
        departmentId: '31005',
        departmentName: 'SS恵み野店',
      },
      {
        departmentId: '31006',
        departmentName: 'SO船橋14号店',
      },
      {
        departmentId: '31007',
        departmentName: 'SS川越新宿店',
      },
      {
        departmentId: '31008',
        departmentName: 'SS松本平田店',
      },
      {
        departmentId: '31009',
        departmentName: 'SS高宮通り店',
      },
      {
        departmentId: '31010',
        departmentName: 'SS諫早店',
      },
      {
        departmentId: '31011',
        departmentName: 'SS赤嶺店',
      },
      {
        departmentId: '31012',
        departmentName: 'SS泡瀬店',
      },
      {
        departmentId: '31013',
        departmentName: 'SS八事店',
      },
      {
        departmentId: '31017',
        departmentName: 'SS長浜店',
      },
      {
        departmentId: '31018',
        departmentName: 'SS今福鶴見店',
      },
      {
        departmentId: '31019',
        departmentName: 'SS姫路山吹店',
      },
      {
        departmentId: '31020',
        departmentName: 'SSつくば研究学園店',
      },
      {
        departmentId: '31021',
        departmentName: 'SS前橋北店',
      },
      {
        departmentId: '31022',
        departmentName: 'SS柏崎店',
      },
      {
        departmentId: '31024',
        departmentName: 'SS仙台六丁の目店',
      },
      {
        departmentId: '31025',
        departmentName: 'SS美濃加茂店',
      },
      {
        departmentId: '31026',
        departmentName: 'SS鈴鹿西条店',
      },
      {
        departmentId: '31028',
        departmentName: 'SS広島大芝店',
      },
      {
        departmentId: '31029',
        departmentName: 'SS甘木店',
      },
      {
        departmentId: '31030',
        departmentName: 'SS大分明野店',
      },
      {
        departmentId: '31031',
        departmentName: 'SSS箱崎店',
      },
      {
        departmentId: '31032',
        departmentName: 'SS生駒店',
      },
      {
        departmentId: '31033',
        departmentName: 'SS志免店',
      },
      {
        departmentId: '31035',
        departmentName: 'SS丘珠空港通店',
      },
      {
        departmentId: '31036',
        departmentName: 'SS赤穂店',
      },
      {
        departmentId: '31037',
        departmentName: 'SS京都洛西店',
      },
      {
        departmentId: '31038',
        departmentName: 'SS行橋店',
      },
      {
        departmentId: '31039',
        departmentName: 'SS蕨店',
      },
      {
        departmentId: '31040',
        departmentName: 'SS袋井店',
      },
      {
        departmentId: '31041',
        departmentName: 'SS仙台愛子店',
      },
      {
        departmentId: '31042',
        departmentName: 'SS四街道大日店',
      },
      {
        departmentId: '31043',
        departmentName: 'SSｲｵﾝﾀｳﾝ館山店',
      },
      {
        departmentId: '31044',
        departmentName: 'SS丸亀南店',
      },
      {
        departmentId: '31045',
        departmentName: 'SS堺北花田店',
      },
      {
        departmentId: '31047',
        departmentName: 'SS長野稲葉店',
      },
      {
        departmentId: '31049',
        departmentName: 'SS福生店',
      },
      {
        departmentId: '31050',
        departmentName: 'SS横浜中山店',
      },
      {
        departmentId: '31051',
        departmentName: 'SS大泉学園店',
      },
      {
        departmentId: '31052',
        departmentName: 'SS高円寺店',
      },
      {
        departmentId: '31053',
        departmentName: 'SSつるせ店',
      },
      {
        departmentId: '31054',
        departmentName: 'SS浜松天王店',
      },
      {
        departmentId: '31055',
        departmentName: 'SS犬山小牧店',
      },
      {
        departmentId: '31056',
        departmentName: 'SS木田余店',
      },
      {
        departmentId: '31057',
        departmentName: 'SS神戸六甲道店',
      },
      {
        departmentId: '31058',
        departmentName: 'SS広島南観音店',
      },
      {
        departmentId: '31059',
        departmentName: 'SSﾌﾚｽﾎﾟ帯広稲田店',
      },
      {
        departmentId: '31061',
        departmentName: 'SS奥田店',
      },
      {
        departmentId: '31062',
        departmentName: 'SS羽咋店',
      },
      {
        departmentId: '31063',
        departmentName: 'SS宮崎大塚店',
      },
      {
        departmentId: '31065',
        departmentName: 'SS吉祥寺ｻﾝﾛｰﾄﾞ店',
      },
      {
        departmentId: '31066',
        departmentName: 'SS筑後店',
      },
      {
        departmentId: '31067',
        departmentName: 'SS高松上天神店',
      },
      {
        departmentId: '31068',
        departmentName: 'SS佐世保大塔店',
      },
      {
        departmentId: '31069',
        departmentName: 'SS姶良店',
      },
      {
        departmentId: '31070',
        departmentName: 'SS米沢店',
      },
      {
        departmentId: '31071',
        departmentName: 'SS加須店',
      },
      {
        departmentId: '31072',
        departmentName: 'SS調布仙川店',
      },
      {
        departmentId: '31074',
        departmentName: 'SS横浜希望ヶ丘店',
      },
      {
        departmentId: '31075',
        departmentName: 'SS上新庄店',
      },
      {
        departmentId: '31078',
        departmentName: 'SS山口大学前店',
      },
      {
        departmentId: '31079',
        departmentName: 'SS掛尾店',
      },
      {
        departmentId: '31080',
        departmentName: 'SS八代松江店',
      },
      {
        departmentId: '31081',
        departmentName: 'SS大東店',
      },
      {
        departmentId: '31082',
        departmentName: 'SS京都駅八条口店',
      },
      {
        departmentId: '31083',
        departmentName: 'SS甲賀水口店',
      },
      {
        departmentId: '31084',
        departmentName: 'SS久留米上津店',
      },
      {
        departmentId: '31086',
        departmentName: 'SS佐賀南部ﾊﾞｲﾊﾟｽ店',
      },
      {
        departmentId: '31087',
        departmentName: 'SS多治見店',
      },
      {
        departmentId: '31090',
        departmentName: 'SS糸満店',
      },
      {
        departmentId: '31091',
        departmentName: 'SS下関稗田店',
      },
      {
        departmentId: '31093',
        departmentName: 'SS旭川大町店',
      },
      {
        departmentId: '31094',
        departmentName: 'SS由利本荘店',
      },
      {
        departmentId: '31095',
        departmentName: 'SS滝の水店',
      },
      {
        departmentId: '31096',
        departmentName: 'SS浜松さんじの店',
      },
      {
        departmentId: '31097',
        departmentName: 'SS豊玉店',
      },
      {
        departmentId: '31098',
        departmentName: 'SS栃木店',
      },
      {
        departmentId: '31100',
        departmentName: 'SS飯能店',
      },
      {
        departmentId: '31101',
        departmentName: 'SS鴻巣吹上店',
      },
      {
        departmentId: '31103',
        departmentName: 'SS広島緑井店',
      },
      {
        departmentId: '31104',
        departmentName: 'SS神戸西店',
      },
      {
        departmentId: '31106',
        departmentName: 'SS柳川店',
      },
      {
        departmentId: '31107',
        departmentName: 'SSいすみ深堀店',
      },
      {
        departmentId: '31108',
        departmentName: 'SS自由が丘店',
      },
      {
        departmentId: '31109',
        departmentName: 'SSｱｰﾊﾞﾝﾃﾗｽ茶屋町梅田店',
      },
      {
        departmentId: '31110',
        departmentName: 'SS八女店',
      },
      {
        departmentId: '31111',
        departmentName: 'SS大牟田北店',
      },
      {
        departmentId: '31112',
        departmentName: 'SS那珂店',
      },
      {
        departmentId: '31113',
        departmentName: 'SS北九州折尾店',
      },
      {
        departmentId: '31114',
        departmentName: 'SS大野城御笠川店',
      },
      {
        departmentId: '31115',
        departmentName: 'SS春日上白水店',
      },
      {
        departmentId: '31117',
        departmentName: 'SS新御堂緑地店',
      },
      {
        departmentId: '31118',
        departmentName: 'SS天童店',
      },
      {
        departmentId: '31120',
        departmentName: 'SS加古川土山店',
      },
      {
        departmentId: '31121',
        departmentName: 'SS富里7Aｽｸｴｱ店',
      },
      {
        departmentId: '31122',
        departmentName: 'SS国立店',
      },
      {
        departmentId: '31123',
        departmentName: 'SS豊中南桜塚店',
      },
      {
        departmentId: '31124',
        departmentName: 'SS三田八景店',
      },
      {
        departmentId: '31125',
        departmentName: 'SS能代店',
      },
      {
        departmentId: '31126',
        departmentName: 'SS日立金沢店',
      },
      {
        departmentId: '31127',
        departmentName: 'SS本山買取専門店',
      },
      {
        departmentId: '31128',
        departmentName: 'SS浦添58号店',
      },
      {
        departmentId: '31129',
        departmentName: 'SS二子玉川店',
      },
      {
        departmentId: '31130',
        departmentName: 'SS静岡曲金店',
      },
      {
        departmentId: '31131',
        departmentName: 'SS静岡ｲﾝﾀｰ店',
      },
      {
        departmentId: '31132',
        departmentName: 'SS諏訪ｲﾝﾀｰ店',
      },
      {
        departmentId: '31133',
        departmentName: 'SS白根店',
      },
      {
        departmentId: '31134',
        departmentName: 'SS豊中穂積店',
      },
      {
        departmentId: '31135',
        departmentName: 'SS草津店',
      },
      {
        departmentId: '31136',
        departmentName: 'SS中環鶴見店',
      },
      {
        departmentId: '31137',
        departmentName: 'SSﾅｺﾞﾔﾄﾞｰﾑ前店',
      },
      {
        departmentId: '31138',
        departmentName: 'SS仙台西多賀店',
      },
      {
        departmentId: '31139',
        departmentName: 'SS下北沢店',
      },
      {
        departmentId: '31140',
        departmentName: 'SS江坂店',
      },
      {
        departmentId: '31141',
        departmentName: 'SS八幡店',
      },
      {
        departmentId: '31142',
        departmentName: 'SS横浜都筑店',
      },
      {
        departmentId: '31143',
        departmentName: 'SS東習志野店',
      },
      {
        departmentId: '31145',
        departmentName: 'SS横浜戸塚店',
      },
      {
        departmentId: '31146',
        departmentName: 'SS入間店',
      },
      {
        departmentId: '31147',
        departmentName: 'SS幕張店',
      },
      {
        departmentId: '31149',
        departmentName: 'SS吹田岸部店',
      },
      {
        departmentId: '31151',
        departmentName: 'SS新金岡店',
      },
      {
        departmentId: '31152',
        departmentName: 'SS直方店',
      },
      {
        departmentId: '31153',
        departmentName: 'SS春日井19号店',
      },
      {
        departmentId: '31154',
        departmentName: 'SS富士厚原店',
      },
      {
        departmentId: '31155',
        departmentName: 'SS富士宮店',
      },
      {
        departmentId: '31158',
        departmentName: 'SS和歌山国体道路店',
      },
      {
        departmentId: '31160',
        departmentName: 'SS阿南店',
      },
      {
        departmentId: '31161',
        departmentName: 'SS佐賀北部ﾊﾞｲﾊﾟｽ店',
      },
      {
        departmentId: '31162',
        departmentName: 'SS野並店',
      },
      {
        departmentId: '31163',
        departmentName: 'SS墨田東向島店',
      },
      {
        departmentId: '31164',
        departmentName: 'SO越谷谷中店',
      },
      {
        departmentId: '31165',
        departmentName: 'SS大田原店',
      },
      {
        departmentId: '31166',
        departmentName: 'SS宮崎北店',
      },
      {
        departmentId: '31167',
        departmentName: 'SS足利店',
      },
      {
        departmentId: '31170',
        departmentName: 'SS藤枝店',
      },
      {
        departmentId: '31172',
        departmentName: 'SS新南陽店',
      },
      {
        departmentId: '31173',
        departmentName: 'SS各務原店',
      },
      {
        departmentId: '31174',
        departmentName: 'SS小牧常普請店',
      },
      {
        departmentId: '31175',
        departmentName: 'SS稲沢店',
      },
      {
        departmentId: '31178',
        departmentName: 'SS伊丹西野店',
      },
      {
        departmentId: '31180',
        departmentName: 'SS大洲店',
      },
      {
        departmentId: '31181',
        departmentName: 'SS熊本白山通り店',
      },
      {
        departmentId: '31182',
        departmentName: 'SS東予店',
      },
      {
        departmentId: '31183',
        departmentName: 'SS町田金森店',
      },
      {
        departmentId: '31184',
        departmentName: 'SS甲府店',
      },
      {
        departmentId: '31185',
        departmentName: 'SS亀岡店',
      },
      {
        departmentId: '31186',
        departmentName: 'SS枚方くずは店',
      },
      {
        departmentId: '31187',
        departmentName: 'SSJR吉塚駅買取専門店',
      },
      {
        departmentId: '31188',
        departmentName: 'SS宇土ｼﾃｨ店',
      },
      {
        departmentId: '31189',
        departmentName: 'SO北野店',
      },
      {
        departmentId: '31190',
        departmentName: 'SS横手店',
      },
      {
        departmentId: '31191',
        departmentName: 'SS鹿児島中洲通り店',
      },
      {
        departmentId: '31193',
        departmentName: 'SS真岡店',
      },
      {
        departmentId: '31194',
        departmentName: 'SSいわき小名浜店',
      },
      {
        departmentId: '31195',
        departmentName: 'SS川越ｸﾚｱﾓｰﾙ店',
      },
      {
        departmentId: '31196',
        departmentName: 'SS大分森町店',
      },
      {
        departmentId: '31197',
        departmentName: 'SSABLOうるま店',
      },
      {
        departmentId: '31198',
        departmentName: 'SS河内長野店',
      },
      {
        departmentId: '31199',
        departmentName: 'SS大須万松寺通店',
      },
      {
        departmentId: '31200',
        departmentName: 'SS浦和店',
      },
      {
        departmentId: '31202',
        departmentName: 'SS葛飾水元店',
      },
      {
        departmentId: '31203',
        departmentName: 'SS所沢航空公園店',
      },
      {
        departmentId: '31204',
        departmentName: 'SS綾瀬深谷店',
      },
      {
        departmentId: '31205',
        departmentName: 'SS宇都宮簗瀬町店',
      },
      {
        departmentId: '31206',
        departmentName: 'SS石狩店',
      },
      {
        departmentId: '31207',
        departmentName: 'SS姫路駅南店',
      },
      {
        departmentId: '31208',
        departmentName: 'SS大村店',
      },
      {
        departmentId: '31209',
        departmentName: 'SS松任店',
      },
      {
        departmentId: '31210',
        departmentName: 'SS立川店',
      },
      {
        departmentId: '31211',
        departmentName: 'SS八王子松木店',
      },
      {
        departmentId: '31213',
        departmentName: 'SS新宿店',
      },
      {
        departmentId: '31214',
        departmentName: 'SO仙台古城店',
      },
      {
        departmentId: '31217',
        departmentName: 'SS和歌山ｲﾝﾀｰ店',
      },
      {
        departmentId: '31218',
        departmentName: 'SS八尾旭ヶ丘店',
      },
      {
        departmentId: '31219',
        departmentName: 'SS三条河原町通店',
      },
      {
        departmentId: '31220',
        departmentName: 'SS船橋駅南口店',
      },
      {
        departmentId: '31222',
        departmentName: 'SS糸島店',
      },
      {
        departmentId: '31223',
        departmentName: 'SS大津におの浜店',
      },
      {
        departmentId: '31224',
        departmentName: 'SS八王子高倉店',
      },
      {
        departmentId: '31225',
        departmentName: 'SS可児店',
      },
      {
        departmentId: '31226',
        departmentName: 'SS浜松幸店',
      },
      {
        departmentId: '31228',
        departmentName: 'SS東大阪長田店',
      },
      {
        departmentId: '31229',
        departmentName: 'SS大館店',
      },
      {
        departmentId: '31230',
        departmentName: 'SS豊平36号店',
      },
      {
        departmentId: '31231',
        departmentName: 'SS久留米合川店',
      },
      {
        departmentId: '31233',
        departmentName: 'SS青葉台東急ｽｸｴｱ店',
      },
      {
        departmentId: '31234',
        departmentName: 'SSﾓﾘｼｱ津田沼店',
      },
      {
        departmentId: '31235',
        departmentName: 'SS守山吉身店',
      },
      {
        departmentId: '31236',
        departmentName: 'SS神戸東灘店',
      },
      {
        departmentId: '31237',
        departmentName: 'SS観音寺店',
      },
      {
        departmentId: '31238',
        departmentName: 'SSBRANCH福岡下原店',
      },
      {
        departmentId: '31239',
        departmentName: 'SS東大阪宝持店',
      },
      {
        departmentId: '31240',
        departmentName: 'SS高山店',
      },
      {
        departmentId: '31241',
        departmentName: 'SS守山吉根店',
      },
      {
        departmentId: '31242',
        departmentName: 'SS京都白梅町店',
      },
      {
        departmentId: '31245',
        departmentName: 'SS草加松江店',
      },
      {
        departmentId: '31246',
        departmentName: 'SS宇治大久保店',
      },
      {
        departmentId: '31247',
        departmentName: 'SS苫小牧緑町店',
      },
      {
        departmentId: '31248',
        departmentName: 'SSSいわき平店',
      },
      {
        departmentId: '31250',
        departmentName: 'SS寒川倉見店',
      },
      {
        departmentId: '31251',
        departmentName: 'SS中間店',
      },
      {
        departmentId: '31253',
        departmentName: 'SS倉敷沖店',
      },
      {
        departmentId: '31254',
        departmentName: 'SS大阪難波買取専門店',
      },
      {
        departmentId: '31255',
        departmentName: 'SS姫路広畑店',
      },
      {
        departmentId: '31256',
        departmentName: 'SS心斎橋中央店',
      },
      {
        departmentId: '31257',
        departmentName: 'SS祐天寺店',
      },
      {
        departmentId: '31258',
        departmentName: 'SS日向店',
      },
      {
        departmentId: '31259',
        departmentName: 'SS岐阜六条店',
      },
      {
        departmentId: '31260',
        departmentName: 'SS田井島店',
      },
      {
        departmentId: '31261',
        departmentName: 'SS秋田新国道店',
      },
      {
        departmentId: '31262',
        departmentName: 'SS一宮名岐ﾊﾞｲﾊﾟｽ店',
      },
      {
        departmentId: '31263',
        departmentName: 'SSﾌﾚｽﾎﾟ山形北店',
      },
      {
        departmentId: '31264',
        departmentName: 'SS高松ﾚｲﾝﾎﾞｰﾛｰﾄﾞ店',
      },
      {
        departmentId: '31265',
        departmentName: 'SS旭川花咲店',
      },
      {
        departmentId: '31266',
        departmentName: 'SS横浜港南台店',
      },
      {
        departmentId: '31267',
        departmentName: 'SS阿佐ヶ谷店',
      },
      {
        departmentId: '31268',
        departmentName: 'SS前橋文京店',
      },
      {
        departmentId: '31269',
        departmentName: 'SS南宮崎店',
      },
      {
        departmentId: '31270',
        departmentName: 'SS松戸五香店',
      },
      {
        departmentId: '31271',
        departmentName: 'SS新宿2号店',
      },
      {
        departmentId: '31272',
        departmentName: 'SS東海荒尾店',
      },
      {
        departmentId: '31273',
        departmentName: 'SS豊中庄内店',
      },
      {
        departmentId: '31274',
        departmentName: 'SS楽器館下北沢店',
      },
      {
        departmentId: '31275',
        departmentName: 'SS草牟田店',
      },
      {
        departmentId: '31276',
        departmentName: 'SS神戸三宮ｾﾝﾀｰ街店',
      },
      {
        departmentId: '31277',
        departmentName: 'SS鹿児島中山店',
      },
      {
        departmentId: '31278',
        departmentName: 'SS姫路車崎店',
      },
      {
        departmentId: '31279',
        departmentName: 'SS新下関店',
      },
      {
        departmentId: '31280',
        departmentName: 'SS那珂川片縄店',
      },
      {
        departmentId: '31281',
        departmentName: 'SSﾚﾌﾟｻﾓｰﾙつくば店',
      },
      {
        departmentId: '31282',
        departmentName: 'SS横浜緑園都市店',
      },
      {
        departmentId: '31283',
        departmentName: 'SS東大和中央店',
      },
      {
        departmentId: '31285',
        departmentName: 'SS山形南館店',
      },
      {
        departmentId: '31286',
        departmentName: 'SS鹿屋寿店',
      },
      {
        departmentId: '31287',
        departmentName: 'SS平野加美店',
      },
      {
        departmentId: '31288',
        departmentName: 'SS武蔵小山店',
      },
      {
        departmentId: '31290',
        departmentName: 'SSBRANCH札幌月寒店',
      },
      {
        departmentId: '31291',
        departmentName: 'SSS厚木林店',
      },
      {
        departmentId: '31292',
        departmentName: 'SS野々市新庄店',
      },
      {
        departmentId: '31293',
        departmentName: 'SSSｲｵﾝ仙台中山店',
      },
      {
        departmentId: '31294',
        departmentName: 'SS新潟桜木ｲﾝﾀｰ店',
      },
      {
        departmentId: '31295',
        departmentName: 'SS京都北山店',
      },
      {
        departmentId: '31297',
        departmentName: 'SSﾌﾚｽﾎﾟ桜井店',
      },
      {
        departmentId: '31298',
        departmentName: 'SS奈良からもも店',
      },
      {
        departmentId: '31300',
        departmentName: 'SS福岡賀茂買取専門店',
      },
      {
        departmentId: '31302',
        departmentName: 'SS広島府中店',
      },
      {
        departmentId: '31303',
        departmentName: 'SS京都桂店',
      },
      {
        departmentId: '31304',
        departmentName: 'SSｲｵﾝﾀｳﾝ各務原鵜沼店',
      },
      {
        departmentId: '31305',
        departmentName: 'SS船橋新高根店',
      },
      {
        departmentId: '31307',
        departmentName: 'SSむつ苫生店',
      },
      {
        departmentId: '31312',
        departmentName: 'SS佐賀兵庫店',
      },
      {
        departmentId: '31315',
        departmentName: 'SS博多ﾊﾟﾋﾟﾖﾝｶﾞｰﾃﾞﾝ店',
      },
      {
        departmentId: '31316',
        departmentName: 'SS井荻店',
      },
      {
        departmentId: '31317',
        departmentName: 'SS伊川谷店',
      },
      {
        departmentId: '31318',
        departmentName: 'SS福島西店',
      },
      {
        departmentId: '31319',
        departmentName: 'SS伊丹北店',
      },
      {
        departmentId: '31320',
        departmentName: 'SS鳥取安長店',
      },
      {
        departmentId: '31321',
        departmentName: 'SS歌島橋店',
      },
      {
        departmentId: '31323',
        departmentName: 'SS甲府昭和店',
      },
      {
        departmentId: '31324',
        departmentName: 'SSｽﾋﾟﾅ上到津店',
      },
      {
        departmentId: '31325',
        departmentName: 'SS台北西門店',
      },
      {
        departmentId: '31327',
        departmentName: 'SSｱﾒﾘｶ村店',
      },
      {
        departmentId: '31329',
        departmentName: 'SS松山ﾌﾗｲﾌﾞﾙｸ通り店',
      },
      {
        departmentId: '31332',
        departmentName: 'SS東大阪善根寺店',
      },
      {
        departmentId: '31333',
        departmentName: 'SS代官山店',
      },
      {
        departmentId: '31334',
        departmentName: 'SS高尾台店',
      },
      {
        departmentId: '31335',
        departmentName: 'SS筑紫野ｲﾝﾀｰ店',
      },
      {
        departmentId: '31336',
        departmentName: 'SS土岐店',
      },
      {
        departmentId: '31337',
        departmentName: 'SS尼崎浜田店',
      },
      {
        departmentId: '31338',
        departmentName: 'SS西昆陽店',
      },
      {
        departmentId: '31342',
        departmentName: 'SS和泉中央店',
      },
      {
        departmentId: '31343',
        departmentName: 'SS桧原店',
      },
      {
        departmentId: '31344',
        departmentName: 'SS大須万松寺通ﾌﾞﾗﾝﾄﾞ専門店',
      },
      {
        departmentId: '31345',
        departmentName: 'SS宇部厚南店',
      },
      {
        departmentId: '31346',
        departmentName: 'SO新潟大学前店',
      },
      {
        departmentId: '31348',
        departmentName: 'SS静岡長沼店',
      },
      {
        departmentId: '31349',
        departmentName: 'SS坂井春江店',
      },
      {
        departmentId: '31350',
        departmentName: 'SS大正千島店',
      },
      {
        departmentId: '31351',
        departmentName: 'SS岡本店',
      },
      {
        departmentId: '31353',
        departmentName: 'SS亀戸店',
      },
      {
        departmentId: '31354',
        departmentName: 'SS江南店',
      },
      {
        departmentId: '31355',
        departmentName: 'SS日進竹の山店',
      },
      {
        departmentId: '31356',
        departmentName: 'SS一社店',
      },
      {
        departmentId: '31357',
        departmentName: 'SS新潟中野山店',
      },
      {
        departmentId: '31358',
        departmentName: 'SSｲﾝﾀｰﾊﾟｰｸ宇都宮店',
      },
      {
        departmentId: '31360',
        departmentName: 'SS西新店',
      },
      {
        departmentId: '31361',
        departmentName: 'SS太田店',
      },
      {
        departmentId: '31363',
        departmentName: 'SS札幌美しが丘南店',
      },
      {
        departmentId: '31364',
        departmentName: 'SS札幌宮の森店',
      },
      {
        departmentId: '31365',
        departmentName: 'SS堀江店',
      },
      {
        departmentId: '31366',
        departmentName: 'SS加西店',
      },
      {
        departmentId: '31367',
        departmentName: 'SS梅島店',
      },
      {
        departmentId: '31368',
        departmentName: 'SS千葉駅前店',
      },
      {
        departmentId: '31370',
        departmentName: 'SSﾌﾚｽﾎﾟ高松店',
      },
      {
        departmentId: '31371',
        departmentName: 'SS微風南山atre店',
      },
      {
        departmentId: '31373',
        departmentName: 'SSﾙﾋﾞｯﾄﾊﾟｰｸ岡崎店',
      },
      {
        departmentId: '31374',
        departmentName: 'SS心斎橋南店',
      },
      {
        departmentId: '31375',
        departmentName: 'SSｲｵﾝﾀｳﾝ矢本店',
      },
      {
        departmentId: '31376',
        departmentName: 'SS南千住買取専門店',
      },
      {
        departmentId: '31377',
        departmentName: 'SSS金沢示野店',
      },
      {
        departmentId: '31378',
        departmentName: 'SSｱｸﾛｽﾌﾟﾗｻﾞ笠懸店',
      },
      {
        departmentId: '31379',
        departmentName: 'SS野田つつみ野店',
      },
      {
        departmentId: '31380',
        departmentName: 'SS柏駅東口店',
      },
      {
        departmentId: '31381',
        departmentName: 'SS神戸ﾄｱﾛｰﾄﾞ店',
      },
      {
        departmentId: '31382',
        departmentName: 'SS梅田店',
      },
      {
        departmentId: '31383',
        departmentName: 'SS上牧店',
      },
      {
        departmentId: '31384',
        departmentName: 'SS久喜店',
      },
      {
        departmentId: '31385',
        departmentName: 'SS津嘉山店',
      },
      {
        departmentId: '31386',
        departmentName: 'SS川口樹ﾓｰﾙ買取専門店',
      },
      {
        departmentId: '31387',
        departmentName: 'SS関緑ヶ丘店',
      },
      {
        departmentId: '31388',
        departmentName: 'SS鶴岡西店',
      },
      {
        departmentId: '31389',
        departmentName: 'SSS所沢ﾄｺﾄｺｽｸｴｱ店',
      },
      {
        departmentId: '31390',
        departmentName: 'SS茂原店',
      },
      {
        departmentId: '31392',
        departmentName: 'SS八代海士江店',
      },
      {
        departmentId: '31393',
        departmentName: 'SSｷｾﾗ川西店',
      },
      {
        departmentId: '31395',
        departmentName: 'SS村上店',
      },
      {
        departmentId: '31396',
        departmentName: 'SS洲本店',
      },
      {
        departmentId: '31397',
        departmentName: 'SSS八尾店',
      },
      {
        departmentId: '31399',
        departmentName: 'SSつくばみどりの店',
      },
      {
        departmentId: '31400',
        departmentName: 'SS廿日市買取専門店',
      },
      {
        departmentId: '31401',
        departmentName: 'SS小林店',
      },
      {
        departmentId: '31403',
        departmentName: 'SS台中新時代店',
      },
      {
        departmentId: '31404',
        departmentName: 'SS戸越銀座店',
      },
      {
        departmentId: '31405',
        departmentName: 'SSｲｺｱｽ千城台店',
      },
      {
        departmentId: '31406',
        departmentName: 'SS岐阜茜部店',
      },
      {
        departmentId: '31407',
        departmentName: 'SS茨木西河原店',
      },
      {
        departmentId: '31408',
        departmentName: 'SS佐久平店',
      },
      {
        departmentId: '31409',
        departmentName: 'SS蛍茶屋店',
      },
      {
        departmentId: '31411',
        departmentName: 'SS金沢御経塚買取専門店',
      },
      {
        departmentId: '31413',
        departmentName: 'SS福岡新宮店',
      },
      {
        departmentId: '31414',
        departmentName: 'SS足利福居町店',
      },
      {
        departmentId: '31415',
        departmentName: 'SSSLIVINよこすか店',
      },
      {
        departmentId: '31416',
        departmentName: 'SSふじみ野店',
      },
      {
        departmentId: '31417',
        departmentName: 'SS横浜片倉町店',
      },
      {
        departmentId: '31418',
        departmentName: 'SS生野巽店',
      },
      {
        departmentId: '31419',
        departmentName: 'SSｲｵﾝﾀｳﾝ吉川美南店',
      },
      {
        departmentId: '31420',
        departmentName: 'SS高崎上中居店',
      },
      {
        departmentId: '31421',
        departmentName: 'SS汐止遠雄店',
      },
      {
        departmentId: '31423',
        departmentName: 'SS台北中山收購専門店',
      },
      {
        departmentId: '31424',
        departmentName: 'SS信義市府收購専門店',
      },
      {
        departmentId: '31425',
        departmentName: 'SSｲｵﾝﾓｰﾙ新利府北館店',
      },
      {
        departmentId: '31426',
        departmentName: 'SS小田原扇町店',
      },
      {
        departmentId: '31427',
        departmentName: 'SS甲府湯村ｳｪﾙｻｲﾄﾞ山の手店',
      },
      {
        departmentId: '31428',
        departmentName: 'SS新小松店',
      },
      {
        departmentId: '31429',
        departmentName: 'SS枚方星丘店',
      },
      {
        departmentId: '31430',
        departmentName: 'SS阪急茨木市駅前買取専門店',
      },
      {
        departmentId: '31432',
        departmentName: 'SS福津店',
      },
      {
        departmentId: '31433',
        departmentName: 'SS台中一中店',
      },
      {
        departmentId: '31434',
        departmentName: 'SS武蔵小杉買取専門店',
      },
      {
        departmentId: '31435',
        departmentName: 'SS相模原淵野辺店',
      },
      {
        departmentId: '31436',
        departmentName: 'SS奥州水沢店',
      },
      {
        departmentId: '31437',
        departmentName: 'SS桜山店',
      },
      {
        departmentId: '31438',
        departmentName: 'SSららぽーと富士見店',
      },
      {
        departmentId: '31439',
        departmentName: 'SS光店',
      },
      {
        departmentId: '31441',
        departmentName: 'SS春日桜ｹ丘店',
      },
      {
        departmentId: '31442',
        departmentName: 'SS仙台駅前ｲｰﾋﾞｰﾝｽﾞ店',
      },
      {
        departmentId: '31443',
        departmentName: 'SS燕三条店',
      },
      {
        departmentId: '31444',
        departmentName: 'SSPARCOｼﾃｨ浦添店',
      },
      {
        departmentId: '31445',
        departmentName: 'SS都島店',
      },
      {
        departmentId: '31446',
        departmentName: 'SSみたけ店',
      },
      {
        departmentId: '31447',
        departmentName: 'SS南港店',
      },
      {
        departmentId: '31449',
        departmentName: 'SS美里店',
      },
      {
        departmentId: '31451',
        departmentName: 'SS伊達店',
      },
      {
        departmentId: '31452',
        departmentName: 'SS町田ﾏﾙｲ店',
      },
      {
        departmentId: '31453',
        departmentName: 'SS綾瀬店',
      },
      {
        departmentId: '31454',
        departmentName: 'SS天神橋3丁目買取専門店',
      },
      {
        departmentId: '31455',
        departmentName: 'SS三原店',
      },
      {
        departmentId: '31456',
        departmentName: 'SSｴｽﾎﾟｯﾄ清水天王店',
      },
      {
        departmentId: '31457',
        departmentName: 'SS小山喜沢店',
      },
      {
        departmentId: '31458',
        departmentName: 'SSCOMBOX秦野店',
      },
      {
        departmentId: '31459',
        departmentName: 'SSﾖｰｸﾀｳﾝ坂東店',
      },
      {
        departmentId: '31460',
        departmentName: 'SS大久保ｲﾝﾀｰ店',
      },
      {
        departmentId: '31461',
        departmentName: 'SS朝霞店',
      },
      {
        departmentId: '31462',
        departmentName: 'SS名張店',
      },
      {
        departmentId: '31463',
        departmentName: 'SS津山ｲﾝﾀｰ店',
      },
      {
        departmentId: '31464',
        departmentName: 'SS八戸根城店',
      },
      {
        departmentId: '31465',
        departmentName: 'SS高槻買取専門店',
      },
      {
        departmentId: '31466',
        departmentName: 'SSｲｵﾝﾀｳﾝ須賀川店',
      },
      {
        departmentId: '31467',
        departmentName: 'SS町屋店',
      },
      {
        departmentId: '31468',
        departmentName: 'SS水戸ｵｰﾊﾟ店',
      },
      {
        departmentId: '31469',
        departmentName: 'SS伊勢小木店',
      },
      {
        departmentId: '31470',
        departmentName: 'SS土浦大町店',
      },
      {
        departmentId: '31471',
        departmentName: 'SS京橋店',
      },
      {
        departmentId: '31472',
        departmentName: 'SOみのおｷｭｰｽﾞﾓｰﾙ店',
      },
      {
        departmentId: '31473',
        departmentName: 'SS楽器館ｱﾒﾘｶ村店',
      },
      {
        departmentId: '31474',
        departmentName: 'SS鹿児島下荒田店',
      },
      {
        departmentId: '31475',
        departmentName: 'SO長野高田店',
      },
      {
        departmentId: '31476',
        departmentName: 'SS今池買取専門店',
      },
      {
        departmentId: '31481',
        departmentName: 'SS桃園統領店',
      },
      {
        departmentId: '31485',
        departmentName: 'SSｺﾄｴ流山おおたかの森店',
      },
      {
        departmentId: '31486',
        departmentName: 'SS熊本日赤通り店',
      },
      {
        departmentId: '31487',
        departmentName: 'SS磐田店',
      },
      {
        departmentId: '31488',
        departmentName: 'SSS宇品店',
      },
      {
        departmentId: '31489',
        departmentName: 'SSﾋﾞｴﾗ御影店',
      },
      {
        departmentId: '31490',
        departmentName: 'SS帯広白樺通り店',
      },
      {
        departmentId: '31491',
        departmentName: 'SS高知あぞの店',
      },
      {
        departmentId: '31493',
        departmentName: 'SS西宮今津店',
      },
      {
        departmentId: '31494',
        departmentName: 'SS中標津店',
      },
      {
        departmentId: '31498',
        departmentName: 'SS台北車站館前店',
      },
      {
        departmentId: '31499',
        departmentName: 'SS台中廣三SOGO店',
      },
      {
        departmentId: '31500',
        departmentName: 'SSｼﾞｪｰﾑｽ山店',
      },
      {
        departmentId: '31501',
        departmentName: 'SS松阪大黒田店',
      },
      {
        departmentId: '31502',
        departmentName: 'SSS印西ﾋﾞｯｸﾞﾎｯﾌﾟ店',
      },
      {
        departmentId: '31503',
        departmentName: 'SS丸井錦糸町店',
      },
      {
        departmentId: '31506',
        departmentName: 'SS前橋みなみﾓｰﾙ店',
      },
      {
        departmentId: '31507',
        departmentName: 'SS魚津吉島店',
      },
      {
        departmentId: '31508',
        departmentName: 'SS会津城南店',
      },
      {
        departmentId: '31511',
        departmentName: 'SS高雄夢時代店',
      },
      {
        departmentId: '31513',
        departmentName: 'SS岐阜羽島店',
      },
      {
        departmentId: '31514',
        departmentName: 'SS大津瀬田店',
      },
      {
        departmentId: '31515',
        departmentName: 'SS高槻大塚店',
      },
      {
        departmentId: '31516',
        departmentName: 'SS大和南店',
      },
      {
        departmentId: '31517',
        departmentName: 'SS芦屋店',
      },
      {
        departmentId: '31518',
        departmentName: 'SSﾘｯﾌﾟｽ旭岡店',
      },
      {
        departmentId: '31519',
        departmentName: 'SSSゆめﾓｰﾙ西条店',
      },
      {
        departmentId: '31520',
        departmentName: 'SS六本松買取専門店',
      },
      {
        departmentId: '31521',
        departmentName: 'SS南海住之江店',
      },
      {
        departmentId: '31527',
        departmentName: 'SS環球板橋車站店',
      },
      {
        departmentId: '31528',
        departmentName: 'SS西東京富士町店',
      },
      {
        departmentId: '31530',
        departmentName: 'SS羽生店',
      },
      {
        departmentId: '31531',
        departmentName: 'SS山科東野店',
      },
      {
        departmentId: '31532',
        departmentName: 'SS東久留米店',
      },
      {
        departmentId: '31533',
        departmentName: 'SS江古田店',
      },
      {
        departmentId: '31534',
        departmentName: 'SSﾌﾚｽﾎﾟ阿波座店',
      },
      {
        departmentId: '31535',
        departmentName: 'SS微風南京店',
      },
      {
        departmentId: '31536',
        departmentName: 'SS高雄SKMPARK店',
      },
      {
        departmentId: '31537',
        departmentName: 'GEO高岡昭和店',
      },
      {
        departmentId: '31539',
        departmentName: 'SS静岡流通通り店',
      },
      {
        departmentId: '31540',
        departmentName: 'ｶﾌﾟｾﾙ楽局江古田店',
      },
      {
        departmentId: '31541',
        departmentName: 'LRｲﾄｰﾖｰｶﾄﾞｰ明石店',
      },
      {
        departmentId: '31542',
        departmentName: 'SS青梅新町店',
      },
      {
        departmentId: '31543',
        departmentName: 'SO豊田店',
      },
      {
        departmentId: '31544',
        departmentName: 'SS東住吉今川店',
      },
      {
        departmentId: '31545',
        departmentName: 'SS尼崎杭瀬店',
      },
      {
        departmentId: '31546',
        departmentName: 'OKURA銀座中央通り店',
      },
      {
        departmentId: '31547',
        departmentName: 'SS大須赤門店',
      },
      {
        departmentId: '31548',
        departmentName: 'GEO新潟赤道店',
      },
      {
        departmentId: '31549',
        departmentName: 'SS本厚木店',
      },
      {
        departmentId: '31550',
        departmentName: 'SS福岡天神買取専門店',
      },
      {
        departmentId: '31554',
        departmentName: 'SS西友大船店',
      },
      {
        departmentId: '31555',
        departmentName: 'OKURA HAB@熊本店',
      },
      {
        departmentId: '31556',
        departmentName: 'SSもりのみやｷｭｰｽﾞﾓｰﾙBASE店',
      },
      {
        departmentId: '31557',
        departmentName: 'SS神栖店',
      },
      {
        departmentId: '31558',
        departmentName: 'OKURA福岡中洲店',
      },
      {
        departmentId: '31559',
        departmentName: 'SS唐津店',
      },
      {
        departmentId: '31561',
        departmentName: 'SSJR尼崎駅店',
      },
      {
        departmentId: '31562',
        departmentName: 'LR町田ﾓﾃﾞｨ店',
      },
      {
        departmentId: '31563',
        departmentName: 'SS池袋P’ﾊﾟﾙｺ店',
      },
      {
        departmentId: '31564',
        departmentName: 'SSS八王子みなみ野店',
      },
      {
        departmentId: '31565',
        departmentName: 'SS横浜西口店',
      },
      {
        departmentId: '31566',
        departmentName: 'SO南笹口店',
      },
      {
        departmentId: '31567',
        departmentName: 'SS宜蘭家樂福店',
      },
      {
        departmentId: '31568',
        departmentName: 'GEO徳島南昭和店',
      },
      {
        departmentId: '31569',
        departmentName: 'SS北広島店',
      },
      {
        departmentId: '31570',
        departmentName: 'GMBｴﾃﾞｨｵﾝなんば本店',
      },
      {
        departmentId: '31571',
        departmentName: 'GEO北上常盤台店',
      },
      {
        departmentId: '31572',
        departmentName: 'SSｲｵﾝｽﾀｲﾙ上田店',
      },
      {
        departmentId: '31573',
        departmentName: 'SSﾏﾁﾉﾏ大森店',
      },
      {
        departmentId: '31574',
        departmentName: 'LRﾏﾙｲﾌｧﾐﾘｰ溝口店',
      },
      {
        departmentId: '31575',
        departmentName: 'GMBMEGAﾄﾞﾝ･ｷﾎｰﾃ上水戸店',
      },
      {
        departmentId: '31578',
        departmentName: 'GMB浦安猫実店',
      },
      {
        departmentId: '31580',
        departmentName: 'SS環球桃園A8店',
      },
      {
        departmentId: '31581',
        departmentName: 'LR浦和ﾊﾟﾙｺ店',
      },
      {
        departmentId: '31583',
        departmentName: 'LR上大岡京急店',
      },
      {
        departmentId: '31584',
        departmentName: 'SS東根店',
      },
      {
        departmentId: '31585',
        departmentName: 'SSﾗﾗｶﾞｰﾃﾞﾝ川口店',
      },
      {
        departmentId: '31586',
        departmentName: 'SS佐世保早岐店',
      },
      {
        departmentId: '31587',
        departmentName: 'GMB京都ｱﾊﾞﾝﾃｨ店',
      },
      {
        departmentId: '31592',
        departmentName: 'SS成城学園前買取専門店',
      },
      {
        departmentId: '31593',
        departmentName: 'ｶﾌﾟｾﾙ楽局戸越銀座店',
      },
      {
        departmentId: '31594',
        departmentName: 'LRｲｵﾝﾓｰﾙ大日店',
      },
      {
        departmentId: '32030',
        departmentName: 'SS宇部店',
      },
      {
        departmentId: '32043',
        departmentName: 'SS筑紫野原田店',
      },
      {
        departmentId: '36920',
        departmentName: '北海道出張買取',
      },
      {
        departmentId: '36921',
        departmentName: '三河出張買取',
      },
      {
        departmentId: '36922',
        departmentName: '新潟出張買取',
      },
      {
        departmentId: '36925',
        departmentName: '宮城出張買取',
      },
      {
        departmentId: '36926',
        departmentName: '埼玉出張買取',
      },
      {
        departmentId: '36928',
        departmentName: '秋田出張買取',
      },
      {
        departmentId: '36929',
        departmentName: '石川出張買取',
      },
      {
        departmentId: '36931',
        departmentName: '熊本出張買取',
      },
      {
        departmentId: '36932',
        departmentName: '鹿児島出張買取',
      },
      {
        departmentId: '36933',
        departmentName: '福島出張買取',
      },
      {
        departmentId: '36934',
        departmentName: '福岡出張買取',
      },
      {
        departmentId: '36937',
        departmentName: '富山出張買取',
      },
      {
        departmentId: '36943',
        departmentName: '福岡南部出張買取',
      },
      {
        departmentId: '36944',
        departmentName: '千葉出張買取',
      },
      {
        departmentId: '36946',
        departmentName: '長野出張買取',
      },
      {
        departmentId: '36947',
        departmentName: '浜松出張買取',
      },
      {
        departmentId: '36949',
        departmentName: '京都出張買取',
      },
      {
        departmentId: '36950',
        departmentName: '兵庫出張買取1',
      },
      {
        departmentId: '36951',
        departmentName: '大阪出張買取',
      },
      {
        departmentId: '36952',
        departmentName: '沖縄出張買取',
      },
      {
        departmentId: '36953',
        departmentName: '名古屋出張買取',
      },
      {
        departmentId: '36956',
        departmentName: '宮崎出張買取',
      },
      {
        departmentId: '36957',
        departmentName: '香川出張買取',
      },
      {
        departmentId: '36958',
        departmentName: '福山出張買取',
      },
      {
        departmentId: '36959',
        departmentName: '広島出張買取',
      },
      {
        departmentId: '36960',
        departmentName: '横浜出張買取',
      },
      {
        departmentId: '36962',
        departmentName: '群馬出張買取',
      },
      {
        departmentId: '36963',
        departmentName: '岐阜出張買取',
      },
      {
        departmentId: '36965',
        departmentName: '滋賀出張買取',
      },
      {
        departmentId: '36967',
        departmentName: '奈良出張買取',
      },
      {
        departmentId: '36968',
        departmentName: '福井出張買取',
      },
      {
        departmentId: '36971',
        departmentName: '長崎出張買取',
      },
      {
        departmentId: '36972',
        departmentName: '大分出張買取',
      },
      {
        departmentId: '36973',
        departmentName: '鹿児島北部出張買取',
      },
      {
        departmentId: '36974',
        departmentName: '九州ｺｰﾙｾﾝﾀｰ',
      },
      {
        departmentId: '38311',
        departmentName: '岩倉六反田ﾘﾕｰｽEC買取倉庫',
      },
      {
        departmentId: '40031',
        departmentName: 'GEO羽村店',
      },
      {
        departmentId: '40035',
        departmentName: 'GEO高槻緑町店',
      },
      {
        departmentId: '40039',
        departmentName: 'GEO佐世保大塔店',
      },
      {
        departmentId: '40100',
        departmentName: 'WH越谷店',
      },
      {
        departmentId: '40101',
        departmentName: 'WH上尾店',
      },
      {
        departmentId: '40102',
        departmentName: 'WH岩槻店',
      },
      {
        departmentId: '40104',
        departmentName: 'WH三橋店',
      },
      {
        departmentId: '40105',
        departmentName: 'WH保木間店',
      },
      {
        departmentId: '40106',
        departmentName: 'WH南流山店',
      },
      {
        departmentId: '40107',
        departmentName: 'WH入谷店',
      },
      {
        departmentId: '40108',
        departmentName: 'WH草加店',
      },
      {
        departmentId: '40111',
        departmentName: 'WH三橋店(ｶﾗｵｹ)',
      },
      {
        departmentId: '40112',
        departmentName: 'WH入谷店(ｶﾗｵｹ)',
      },
      {
        departmentId: '40114',
        departmentName: 'WH入谷店(ｺﾞﾙﾌ)',
      },
      {
        departmentId: '40199',
        departmentName: 'WH一橋学園店',
      },
      {
        departmentId: '40276',
        departmentName: 'ｹﾞｵｶﾞﾁｬときわ台駅前店(仮)',
      },
      {
        departmentId: '40300',
        departmentName: 'GMB中野ﾌﾞﾛｰﾄﾞｳｪｲ店',
      },
      {
        departmentId: '40302',
        departmentName: 'GEO浜松さんじの店',
      },
      {
        departmentId: '40303',
        departmentName: 'GMB博多駅筑紫口店',
      },
      {
        departmentId: '40307',
        departmentName: 'GEO北九州折尾店',
      },
      {
        departmentId: '40308',
        departmentName: 'GEOｸﾛｽﾓｰﾙ清武店',
      },
      {
        departmentId: '40314',
        departmentName: 'GMB大宮駅前店',
      },
      {
        departmentId: '40315',
        departmentName: 'GEO日立金沢店',
      },
      {
        departmentId: '40316',
        departmentName: 'GEO金沢鞍月店',
      },
      {
        departmentId: '40328',
        departmentName: 'GEO小林店',
      },
      {
        departmentId: '40329',
        departmentName: 'GEO上原店',
      },
      {
        departmentId: '40347',
        departmentName: 'GEO湯沢店',
      },
      {
        departmentId: '40348',
        departmentName: 'GMB大阪駅前第3ﾋﾞﾙ店',
      },
      {
        departmentId: '40349',
        departmentName: 'GEO札幌狸小路2丁目店',
      },
      {
        departmentId: '40350',
        departmentName: 'GEO三条店',
      },
      {
        departmentId: '40351',
        departmentName: 'GEOｲｵﾝﾀｳﾝ西熊本店',
      },
      {
        departmentId: '40352',
        departmentName: 'GEO志摩店',
      },
      {
        departmentId: '40355',
        departmentName: 'GEO岩見沢店',
      },
      {
        departmentId: '40357',
        departmentName: 'GEO和歌山国体道路店',
      },
      {
        departmentId: '40358',
        departmentName: 'GEOｱｸﾛｽﾌﾟﾗｻﾞ児島店',
      },
      {
        departmentId: '40359',
        departmentName: 'GEO佐賀北部ﾊﾞｲﾊﾟｽ店',
      },
      {
        departmentId: '40361',
        departmentName: 'GEO砺波ｲﾝﾀｰ店',
      },
      {
        departmentId: '40363',
        departmentName: 'WM大阪日本橋店',
      },
      {
        departmentId: '40367',
        departmentName: 'GMB大阪なんば店',
      },
      {
        departmentId: '40368',
        departmentName: 'GEO大洲店',
      },
      {
        departmentId: '40369',
        departmentName: 'GEO鹿児島新栄店',
      },
      {
        departmentId: '40370',
        departmentName: 'ｹﾞｵﾌﾟﾚｲｶﾞｲﾄﾞ',
      },
      {
        departmentId: '40372',
        departmentName: 'GEO岐阜市橋店',
      },
      {
        departmentId: '40373',
        departmentName: 'GEO新輪島店',
      },
      {
        departmentId: '40375',
        departmentName: 'GEO知多店',
      },
      {
        departmentId: '40380',
        departmentName: 'GEOｸﾞﾗｰﾄﾞ東開店',
      },
      {
        departmentId: '40385',
        departmentName: 'GEO天正寺店',
      },
      {
        departmentId: '40389',
        departmentName: 'GEO名古屋大須店',
      },
      {
        departmentId: '40395',
        departmentName: 'GEOABLOうるま店',
      },
      {
        departmentId: '40397',
        departmentName: 'GEOｲｵﾝ石狩緑苑台店',
      },
      {
        departmentId: '40400',
        departmentName: 'GEO高松ﾚｲﾝﾎﾞｰﾛｰﾄﾞ店',
      },
      {
        departmentId: '40402',
        departmentName: 'GEO大河原店',
      },
      {
        departmentId: '40416',
        departmentName: 'GEO和光市駅南口店',
      },
      {
        departmentId: '40418',
        departmentName: 'GEO東大泉店',
      },
      {
        departmentId: '40419',
        departmentName: 'GEO長浜店',
      },
      {
        departmentId: '40422',
        departmentName: '文具のﾌﾞﾝｿﾞｳ 北本店',
      },
      {
        departmentId: '40425',
        departmentName: 'LRｺｰﾅﾝ港北ｲﾝﾀｰ店',
      },
      {
        departmentId: '40426',
        departmentName: 'GMB蒲田駅西口店',
      },
      {
        departmentId: '40428',
        departmentName: 'GMBﾗﾊﾟｰｸ瑞江店',
      },
      {
        departmentId: '40430',
        departmentName: 'GMB川越ｸﾚｱﾓｰﾙ店',
      },
      {
        departmentId: '40434',
        departmentName: 'GMB八王子ﾕｰﾛｰﾄﾞ店',
      },
      {
        departmentId: '40435',
        departmentName: 'GEO熊本小峯店',
      },
      {
        departmentId: '40436',
        departmentName: 'GEO旭川永山3条店',
      },
      {
        departmentId: '40439',
        departmentName: 'GEO姫路車崎店',
      },
      {
        departmentId: '40440',
        departmentName: 'GEO千葉都町店',
      },
      {
        departmentId: '40443',
        departmentName: 'GEOｲｵﾝﾀｳﾝ周南久米店',
      },
      {
        departmentId: '40444',
        departmentName: 'WM大須ｱﾒ横店',
      },
      {
        departmentId: '40445',
        departmentName: '文具のﾌﾞﾝｿﾞｳ 岸和田店',
      },
      {
        departmentId: '40448',
        departmentName: 'GEO川崎ｾﾞﾛｹﾞｰﾄ店',
      },
      {
        departmentId: '40449',
        departmentName: 'GMBｲｵﾝﾀｳﾝ名西店',
      },
      {
        departmentId: '40451',
        departmentName: 'GEOｲｵﾝﾀｳﾝ青森浜田店',
      },
      {
        departmentId: '40452',
        departmentName: '文具のﾌﾞﾝｿﾞｳ 千葉都町店',
      },
      {
        departmentId: '40454',
        departmentName: 'OKURA池袋駅東口店',
      },
      {
        departmentId: '40455',
        departmentName: 'OKURA福岡天神店',
      },
      {
        departmentId: '40457',
        departmentName: '文具のﾌﾞﾝｿﾞｳ 八尾桜ヶ丘店',
      },
      {
        departmentId: '40460',
        departmentName: 'GEO西大津店',
      },
      {
        departmentId: '40461',
        departmentName: 'OKURA上野御徒町店',
      },
      {
        departmentId: '40462',
        departmentName: 'OKURA新宿歌舞伎町時計専門店',
      },
      {
        departmentId: '40464',
        departmentName: 'GMBMEGAﾄﾞﾝ･ｷﾎｰﾃ長野店',
      },
      {
        departmentId: '40466',
        departmentName: 'GMBMEGAﾄﾞﾝ･ｷﾎｰﾃ蓮田店',
      },
      {
        departmentId: '40467',
        departmentName: 'GEO那覇真嘉比店',
      },
      {
        departmentId: '40468',
        departmentName: 'OKURA横浜駅西口店',
      },
      {
        departmentId: '40473',
        departmentName: 'GEO飯塚幸袋店',
      },
      {
        departmentId: '40475',
        departmentName: 'OKURAなんば戎橋店',
      },
      {
        departmentId: '40477',
        departmentName: 'OKURA静岡ﾊﾟﾙｺ店',
      },
      {
        departmentId: '40478',
        departmentName: 'GMB成増店',
      },
      {
        departmentId: '40480',
        departmentName: 'LR新所沢ﾊﾟﾙｺ店',
      },
      {
        departmentId: '40481',
        departmentName: 'OKURA渋谷ｾﾝﾀｰ街店',
      },
      {
        departmentId: '40482',
        departmentName: 'GEO直方店',
      },
      {
        departmentId: '40483',
        departmentName: 'GEO広島庚午店',
      },
      {
        departmentId: '40484',
        departmentName: 'GEO北見夕陽ヶ丘店',
      },
      {
        departmentId: '40487',
        departmentName: 'GEO町田小川店',
      },
      {
        departmentId: '40492',
        departmentName: 'OKURA LIVINｵｽﾞ大泉店',
      },
      {
        departmentId: '40493',
        departmentName: 'GEOﾖｰｸﾀｳﾝ福島野田店',
      },
      {
        departmentId: '40494',
        departmentName: 'GEOｸﾞﾗﾝﾃﾞｭｵ蒲田店',
      },
      {
        departmentId: '40495',
        departmentName: 'GEO坂出元町店',
      },
      {
        departmentId: '40499',
        departmentName: 'OKURA名古屋大須店',
      },
      {
        departmentId: '40500',
        departmentName: 'OKURA銀座本店',
      },
      {
        departmentId: '40502',
        departmentName: 'OKURA心斎橋時計専門店',
      },
      {
        departmentId: '40508',
        departmentName: 'GEO新潟中野山店',
      },
      {
        departmentId: '40509',
        departmentName: 'GEO福岡西新店',
      },
      {
        departmentId: '40516',
        departmentName: 'GEOﾌﾚｽﾎﾟ高松店',
      },
      {
        departmentId: '40517',
        departmentName: 'LRﾐｰﾅ町田店',
      },
      {
        departmentId: '40518',
        departmentName: 'LR名古屋名鉄百貨店',
      },
      {
        departmentId: '40519',
        departmentName: 'OKURA大阪本店',
      },
      {
        departmentId: '40521',
        departmentName: 'LR松坂屋静岡店',
      },
      {
        departmentId: '40522',
        departmentName: 'GMB京都新京極店',
      },
      {
        departmentId: '40523',
        departmentName: 'LRﾘﾉｱｽ八尾店',
      },
      {
        departmentId: '40526',
        departmentName: 'OKURA新宿歌舞伎町店',
      },
      {
        departmentId: '40527',
        departmentName: 'GEO八尾店',
      },
      {
        departmentId: '40531',
        departmentName: 'GEOLIVINよこすか店',
      },
      {
        departmentId: '40532',
        departmentName: 'GEOｱｰﾊﾞﾝﾓｰﾙ新宮中央店',
      },
      {
        departmentId: '40534',
        departmentName: 'OKURA新宿駅東口店',
      },
      {
        departmentId: '40536',
        departmentName: 'GEO彦根高宮店',
      },
      {
        departmentId: '40541',
        departmentName: 'GEO高浜店',
      },
      {
        departmentId: '40542',
        departmentName: 'WMｱｷﾊﾞ店',
      },
      {
        departmentId: '40543',
        departmentName: 'LRｲｵﾝﾓｰﾙ川口前川店',
      },
      {
        departmentId: '40545',
        departmentName: 'LR海老名ﾋﾞﾅｳｫｰｸ店',
      },
      {
        departmentId: '40546',
        departmentName: 'OKURAららぽーと福岡店',
      },
      {
        departmentId: '40547',
        departmentName: 'OKURA心斎橋店',
      },
      {
        departmentId: '40548',
        departmentName: 'LRｲｵﾝﾓｰﾙつくば店',
      },
      {
        departmentId: '40549',
        departmentName: 'OKURA京都烏丸店',
      },
      {
        departmentId: '40551',
        departmentName: 'OKURA鹿児島天文館店',
      },
      {
        departmentId: '40552',
        departmentName: 'LRららぽーと和泉店',
      },
      {
        departmentId: '40554',
        departmentName: 'GEO姶良店',
      },
      {
        departmentId: '40555',
        departmentName: 'LRなんばﾏﾙｲ店',
      },
      {
        departmentId: '40556',
        departmentName: 'LR LINKS UMEDA店',
      },
      {
        departmentId: '40558',
        departmentName: 'LRﾉｰｽﾎﾟｰﾄ･ﾓｰﾙ港北店',
      },
      {
        departmentId: '40564',
        departmentName: 'GEO豊橋岩田店',
      },
      {
        departmentId: '40565',
        departmentName: 'GEO黒磯店',
      },
      {
        departmentId: '40566',
        departmentName: 'OKURA梅田ﾄﾞｰﾁｶ店',
      },
      {
        departmentId: '40567',
        departmentName: 'GEO釧路鳥取店',
      },
      {
        departmentId: '40568',
        departmentName: 'WM要町店',
      },
      {
        departmentId: '40569',
        departmentName: 'LR浦和ﾊﾟﾙｺ店 3F',
      },
      {
        departmentId: '40570',
        departmentName: 'GEO大宮指扇店',
      },
      {
        departmentId: '41109',
        departmentName: 'WH四万十店',
      },
      {
        departmentId: '50134',
        departmentName: '浦添ﾚﾝﾀﾙ流通 (琉球通運)',
      },
      {
        departmentId: '50165',
        departmentName: '岩倉ﾒﾃﾞｨｱEC買取倉庫',
      },
      {
        departmentId: '50194',
        departmentName: '岩倉六反田ﾘﾕｰｽEC海外出荷ｾﾝﾀｰ',
      },
      {
        departmentId: '50207',
        departmentName: '犬山ﾘﾕｰｽ出荷ｾﾝﾀｰ',
      },
      {
        departmentId: '50336',
        departmentName: '海外特販ﾕﾆｯﾄ',
      },
      {
        departmentId: '50707',
        departmentName: '岩倉特販倉庫',
      },
    ];

    jest
      .spyOn(oracleRepository, 'getDepartment')
      .mockImplementation(() => results);

    expect(await oracleService.getDepartment()).toMatchObject(results);
  });
  test('get user oracle', async () => {
    const results: any = {
      data: [
        {
          username: 'miki.sakamoto',
          fullName: '坂本 幹',
          department: 'ｼｽﾃﾑ管理課',
          departmentId: '01237',
          companyId: '0010',
          company: '株式会社ゲオホールディングス',
          email: 'miki.sakamoto@geonet.co.jp',
          employeeNumber: '2013492',
        },
        {
          username: 'yusuke.endo',
          fullName: '遠藤 優介',
          department: '物流ｼｽﾃﾑ開発課',
          departmentId: '17113',
          companyId: '0010',
          company: '株式会社ゲオホールディングス',
          email: 'yusuke.endo@geonet.co.jp',
          employeeNumber: '2013367',
        },
        {
          username: 'geo.system.mdm',
          fullName: 'MDM システム管理',
          department: 'ｼｽﾃﾑ管理課',
          departmentId: '01237',
          companyId: '0010',
          company: '株式会社ゲオホールディングス',
          email: 'geo.system.mdm@geonet.co.jp',
          employeeNumber: '2013344',
        },
        {
          username: 'chiemi.tanaka',
          fullName: '田中 智恵美',
          department: 'ﾁｪﾙｼｰ',
          departmentId: '14123',
          companyId: '0960',
          company: '株式会社チェルシー',
          email: 'chiemi.tanaka@geonet.co.jp',
          employeeNumber: '2013330',
        },
        {
          username: 'kotaro.yamada',
          fullName: '山田 高太郎',
          department: 'ｼｽﾃﾑ管理課',
          departmentId: '01237',
          companyId: '0010',
          company: '株式会社ゲオホールディングス',
          email: 'kotaro.yamada@geonet.co.jp',
          employeeNumber: '2013326',
        },
        {
          username: 'katsuhiro.kishida',
          fullName: '岸田 克弘',
          department: 'ﾘﾕｰｽｱﾗｲｱﾝｽ事業課',
          departmentId: '17125',
          companyId: '0100',
          company: '株式会社ゲオ',
          email: 'katsuhiro.kishida@geonet.co.jp',
          employeeNumber: '2013299',
        },
        {
          username: 'y.sakai2013298',
          fullName: '酒井 康行',
          department: 'ﾘﾕｰｽｱﾗｲｱﾝｽ事業課',
          departmentId: '17125',
          companyId: '0100',
          company: '株式会社ゲオ',
          email: 'y.sakai2013298@geonet.co.jp',
          employeeNumber: '2013298',
        },
        {
          username: 'worldmobile_ec',
          fullName: 'ワールドモバイル EC',
          department: 'ﾓﾊﾞｲﾙ買取推進課(WM)',
          departmentId: '16705',
          positionId: '910',
          position: 'パートアルバイト',
          companyId: '0492',
          company: '株式会社ワールドモバイル',
          email: 'worldmobile_ec@geonet.co.jp',
          employeeNumber: '2013257',
        },
        {
          username: 'yota.enjoji',
          fullName: '圓城寺 洋太',
          department: '物流ｼｽﾃﾑ開発課',
          departmentId: '17113',
          companyId: '0010',
          company: '株式会社ゲオホールディングス',
          email: 'yota.enjoji@geonet.co.jp',
          employeeNumber: '2013196',
        },
        {
          username: 'hirotaka.nakayama',
          fullName: '中山 弘隆',
          department: '物流ｼｽﾃﾑ開発課',
          departmentId: '17113',
          companyId: '0010',
          company: '株式会社ゲオホールディングス',
          email: 'hirotaka.nakayama@geonet.co.jp',
          employeeNumber: '2013183',
        },
        {
          username: 'tsuyoshi.takayama',
          fullName: '高山 剛',
          department: '経理1課',
          departmentId: '00921',
          positionId: '930',
          position: '派遣社員',
          companyId: '0010',
          company: '株式会社ゲオホールディングス',
          email: 'tsuyoshi.takayama@geonet.co.jp',
          employeeNumber: '2013167',
        },
        {
          username: 'tatsuya.shigyo',
          fullName: '執行 達也',
          department: 'ﾓﾊﾞｲﾙ法人商品課(WM)',
          departmentId: '16704',
          companyId: '0492',
          company: '株式会社ワールドモバイル',
          email: 'tatsuya.shigyo@geonet.co.jp',
          employeeNumber: '2013152',
        },
        {
          username: 'fumio.shinonome',
          fullName: '東雲 文男',
          department: '物流ｼｽﾃﾑ開発課',
          departmentId: '17113',
          companyId: '0010',
          company: '株式会社ゲオホールディングス',
          email: 'fumio.shinonome@geonet.co.jp',
          employeeNumber: '2013097',
        },
        {
          username: 'takahiro.ishikawa',
          fullName: '石川 貴大',
          department: 'ｼｽﾃﾑ管理課',
          departmentId: '01237',
          companyId: '0010',
          company: '株式会社ゲオホールディングス',
          email: 'takahiro.ishikawa@geonet.co.jp',
          employeeNumber: '2013078',
        },
        {
          username: 'kensuke.ashida',
          fullName: '蘆田 健介',
          department: 'ｼｽﾃﾑ管理課',
          departmentId: '01237',
          companyId: '0010',
          company: '株式会社ゲオホールディングス',
          email: 'kensuke.ashida@geonet.co.jp',
          employeeNumber: '2013077',
        },
        {
          username: 'junkaiseisotokai',
          fullName: 'GBS巡回清掃 東海',
          department: 'GBS巡回清掃ﾕﾆｯﾄ(岐阜)',
          departmentId: '17104',
          companyId: '0690',
          company: '株式会社ゲオビジネスサポート',
          email: 'junkaiseisotokai@geonet.co.jp',
          employeeNumber: '2013062',
        },
        {
          username: 'arranging_ch',
          fullName: '社宅寮 手配担当',
          department: '総務課',
          departmentId: '16508',
          companyId: '0010',
          company: '株式会社ゲオホールディングス',
          email: 'arranging_ch@geonet.co.jp',
          employeeNumber: '2013053',
        },
        {
          username: 'warehouse_team',
          fullName: '流通購買SYSチーム チーム共有',
          department: '物流ｼｽﾃﾑ開発課',
          departmentId: '17113',
          companyId: '0010',
          company: '株式会社ゲオホールディングス',
          email: 'warehouse_team@geonet.co.jp',
          employeeNumber: '2013046',
        },
        {
          username: 'misaki.hashimoto',
          fullName: '橋本 みさ希',
          department: 'ECｼｽﾃﾑ開発課',
          departmentId: '16884',
          companyId: '0010',
          company: '株式会社ゲオホールディングス',
          email: 'misaki.hashimoto@geonet.co.jp',
          employeeNumber: '2013013',
        },
        {
          username: 'yoshikazu.arimitsu',
          fullName: '有光 喜一',
          department: '店舗ｼｽﾃﾑ開発課',
          departmentId: '16883',
          companyId: '0010',
          company: '株式会社ゲオホールディングス',
          email: 'yoshikazu.arimitsu@geonet.co.jp',
          employeeNumber: '2013012',
        },
      ],
      total: 7061,
    };

    jest
      .spyOn(oracleRepository, 'getUserDataOracleDb')
      .mockImplementation(() => results);

    expect(
      await oracleService.getUserDataOracleDb({
        offset: 0,
        next: 20,
        departmentId: 'すべて',
        email: undefined,
        company: '株式会社ゲオホールディングス',
      }),
    ).toMatchObject(results);
  });
});
