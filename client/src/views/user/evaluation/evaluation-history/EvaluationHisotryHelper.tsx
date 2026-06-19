import { CheckCircleOutlined, CloseCircleOutlined, ProfileOutlined } from '@ant-design/icons';
import { EvaluationApprovalHistoryResponse, EvaluatorApproval } from '../../../../model/EvaluationApprovalHistory';
import { HistoryApproveStatus } from '../../../../constant/HistoryApproveStatus';
import { t, TFunction } from 'i18next';
import { filter, from, map } from 'rxjs';
import { Button, Space, TimelineItemProps } from 'antd';
import moment from 'moment-timezone';
import { Typography } from 'antd/lib';
import { dayJsFormat } from '../../../../common/util';
import dayjs from 'dayjs';
import { useAuth } from '../../../../hooks/useAuth';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
const EMPTY = '';
dayjs.extend(utc);
dayjs.extend(timezone);
export default class EvaluationHisotryHelper {
  public static isValidJSON(str: string) {
    // 1. Kiểm tra input có phải là string không
    if (typeof str !== 'string' || str.trim() === '') {
      return false;
    }

    try {
      // 2. Thử phân tích chuỗi
      const parsedValue = JSON.parse(str);

      // 3. (Tùy chọn) Kiểm tra thêm: JSON hợp lệ có thể là 'null', 'true', 'false', '123' (những giá trị nguyên thủy)
      // Nếu bạn chỉ muốn kiểm tra các đối tượng hoặc mảng JSON thực sự (ví dụ: chuỗi phải bắt đầu bằng '{' hoặc '['),
      // bạn có thể thêm điều kiện này:
      if (typeof parsedValue !== 'object' || parsedValue === null) {
        return false;
      }

      return true;
    } catch (e) {
      // 4. Nếu có lỗi (SyntaxError) xảy ra trong quá trình phân tích, chuỗi không hợp lệ
      // console.error("Invalid JSON:", e.message); // Có thể bật để xem lỗi cụ thể
      return false;
    }
  }

  public static processingData(
    datasource: EvaluationApprovalHistoryResponse,
    typeDisplay: number,
    openModalProSkillDisable: (
      data: { jobType: string; itemNo: number; itemTitle: string; content: string; note: string; difficulty: number }[],
    ) => void,
    t: TFunction,
  ) {
    const results: TimelineItemProps[] = [];
    const auth = useAuth();

    from(datasource.approvalHistories)
      .pipe(
        filter((el) => el.type === typeDisplay),
        map((el) => {
          const isArray = this.isValidJSON(el.comment);

          return {
            dot:
              t(el.status) !== HistoryApproveStatus.APPROVED &&
              t(el.status) !== HistoryApproveStatus.SUBMIT &&
              t(el.status) !== HistoryApproveStatus.EVALUATORSUBMIT ? (
                <CloseCircleOutlined style={{ fontSize: '14px', color: 'red' }} />
              ) : (
                <CheckCircleOutlined style={{ fontSize: '14px', color: 'green' }} />
              ),
            children: (
              <>
                <div>
                  {/* {moment(el.createdTime).format('YYYY/M/D H:mm')}　 */}
                  {dayjs(el.createdTime)
                    .tz(auth.user?.timeZone || 'Asia/Tokyo')
                    .format('YYYY/MM/DD H:mm')}{' '}
                  {el.approverUser ? el.approverUser?.fullName : el.receiverUser?.fullName} : {t(el.status)}
                </div>
                {!isArray ? (
                  <div style={{ whiteSpace: 'pre-wrap' }}>{t(el.comment)}</div>
                ) : (
                  <Space direction="horizontal" align="center">
                    <Typography.Text> {t('MESSAGE.COMMON.IDS_PRO_SKILL_NO_EVALUATE')}</Typography.Text>
                    <Button
                      type="text"
                      onClick={() => {
                        openModalProSkillDisable(isArray ? JSON.parse(el.comment) : (null as any));
                      }}
                      icon={<ProfileOutlined color="#fff" style={{ color: '#007240 ', fontSize: 25, marginTop: 2 }} />}
                    ></Button>
                  </Space>
                )}
              </>
            ),
          };
        }),
      )
      .subscribe((el) => results.push(el));

    return results;
  }

  public static getOrderEvaluators(evaluator: EvaluatorApproval[]) {
    const results = [];
    for (let i = 0; i < evaluator!.length; i++) {
      const rater = evaluator[i];
      if (rater.evaluationOrder !== 0.5 && rater.evaluationOrder !== 1 && rater.evaluationOrder !== 2) {
        continue;
      }
      if (rater.evaluationOrder === 0.5) {
        results.push(`${t('IDS_EVALUATOR_0_5')}: ${rater.fullName}`);
      } else if (rater.evaluationOrder === 1) {
        results.push(`${t('IDS_EVALUATOR_1')}: ${rater.fullName}`);
      } else {
        results.push(`${t('IDS_EVALUATOR_2')}: ${rater.fullName}`);
      }
    }

    return results.join('、');
  }
}
