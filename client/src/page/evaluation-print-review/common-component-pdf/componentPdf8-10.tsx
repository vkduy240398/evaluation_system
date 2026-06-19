import { Table, Typography } from 'antd';
import React from 'react';
import { t } from 'i18next';
import { ColumnPDF17 } from './columnPDF17';
import { ColumnPDF810 } from './columnPDF810';

interface Props {
  item: any;
}

const ComponentPdf8_10: React.FC<Props> = (props: Props) => {
  const { item } = props;

  /**Mục tiêu cá nhân */
  const arrayAchievementPersonals = [];
  for (let i = 0; i < item?.personalGoalsMain?.dataSource?.length; i++) {
    const group = item?.personalGoalsMain?.dataSource[i];
    if (group.length === 1 && group[0].key === -1 && arrayAchievementPersonals.length > 0) {
      // Di chuyển object vào array trước đó
      arrayAchievementPersonals[arrayAchievementPersonals.length - 1].push(group[0]);
    } else {
      arrayAchievementPersonals.push([...group]);
    }
  }

  /**Mục tiêu bộ phận */
  const arrayAchievementDepartments = [];
  for (let i = 0; i < item?.departmentalGoalsMain.dataSource?.length; i++) {
    const group = item?.departmentalGoalsMain.dataSource[i];
    if (group.length === 1 && group[0].key === -1 && arrayAchievementDepartments.length > 0) {
      // Di chuyển object vào array trước đó
      arrayAchievementDepartments[arrayAchievementDepartments.length - 1].push(group[0]);
    } else {
      arrayAchievementDepartments.push([...group]);
    }
  }

  return (
    <div>
      <div style={{ paddingTop: 25 }}>
        <Typography.Title level={4}>{'部門'}</Typography.Title>
      </div>
      {((item?.status === 50 && item?.isEvaluationDate) || item?.status > 50) && (
        <div style={{ paddingTop: 5 }}>
          <Table
            dataSource={item?.dataTotalDepartment}
            columns={ColumnPDF810.columnTotal()}
            pagination={false}
            bordered
            locale={{
              emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
            }}
          />
        </div>
      )}

      <div style={{ paddingTop: (item?.status === 50 && item?.isEvaluationDate) || item?.status > 50 ? 25 : 0 }}>
        <Typography.Text>{item?.departmentalGoalsMain?.titleTable}</Typography.Text>
        {arrayAchievementDepartments.map((element: any, index: number) => {
          const dataFilterNoTotal = element.filter((item: any) => {
            return item.key !== -1;
          });

          return (
            <React.Fragment key={index}>
              {index > 0 && (
                <hr
                  style={{
                    border: 'none',
                    borderTop: '3px solid #000', // đường đậm màu đen
                    margin: '15px 0',
                  }}
                />
              )}

              <Table
                dataSource={dataFilterNoTotal}
                columns={ColumnPDF810.columnDepartmentGoalTable(
                  item?.isDisplayEvaluator05,
                  item?.isDisplayEvaluator1,
                  item?.isDisplayEvaluator2,
                  index + 1,
                )}
                pagination={false}
                bordered
                size="small"
                locale={{
                  emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
                }}
                expandable={{
                  defaultExpandAllRows: true,
                  showExpandColumn: false,
                  indentSize: 2,
                  rowExpandable: (record) => record?.subList,
                  expandedRowRender: (record) => (
                    <Table
                      columns={ColumnPDF810.achievementPersonalMainColumnSub()}
                      dataSource={record?.subList || []}
                      rowKey="key"
                      pagination={false}
                      bordered
                      style={{ margin: 0 }}
                      locale={{
                        emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
                      }}
                    />
                  ),
                }}
              />

              {((item?.status === 50 && item?.isEvaluationDate) || item?.status > 50) && (
                <div>
                  <Table
                    dataSource={element}
                    columns={ColumnPDF810.columnDepartmentAchievementTable(
                      item?.isDisplayEvaluator05,
                      item?.isDisplayEvaluator1,
                      item?.isDisplayEvaluator2,
                      index + 1,
                    )}
                    pagination={false}
                    bordered
                    locale={{
                      emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
                    }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {item?.isAchievementAdditionalDepartment && (
        <div style={{ paddingTop: 25 }}>
          <Typography.Text>{item?.achievementAdditionalDepartment?.titleTable}</Typography.Text>
          <Table
            dataSource={item?.achievementAdditionalDepartment?.dataSource}
            columns={ColumnPDF17.columnAchievementAdditional(
              item?.isDisplayUser,
              item?.isDisplayEvaluator05,
              item?.isDisplayEvaluator1,
              item?.isDisplayEvaluator2,
            )}
            pagination={false}
            bordered
            locale={{
              emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
            }}
          />
        </div>
      )}

      {item?.isDisplayComponent810 && (
        <div style={{ paddingTop: 25 }}>
          <Typography.Title level={4}>{'個人'}</Typography.Title>
        </div>
      )}

      {item?.isDisplayComponent810 && (
        <div style={{ paddingTop: 5 }}>
          <Table
            dataSource={item?.totalTable?.dataSource}
            columns={ColumnPDF17.columnTotalTableReview(item?.haveSkill)}
            pagination={false}
            bordered
            locale={{
              emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
            }}
          />
        </div>
      )}

      {item?.isDisplayComponent810 && (
        <div>
          {item?.haveSkill && (
            <div style={{ paddingTop: 25 }}>
              <Typography.Text>{item?.basicSkillTable?.titleTable}</Typography.Text>
              <Table
                dataSource={item?.basicSkillTable?.dataSource}
                columns={ColumnPDF17.columnBasicBehavior(
                  item?.isDisplayUser,
                  item?.isDisplayEvaluator05,
                  item?.isDisplayEvaluator1,
                  item?.isDisplayEvaluator2,
                )}
                pagination={false}
                bordered
                locale={{
                  emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
                }}
              />
            </div>
          )}
        </div>
      )}

      {item?.isDisplayComponent810 && (
        <div>
          {item?.haveSkill && (
            <div style={{ paddingTop: 25 }}>
              <Typography.Text>{item?.proSkillTable?.titleTable}</Typography.Text>
              <Table
                dataSource={item?.proSkillTable?.dataSource}
                columns={ColumnPDF17.columnProSkill(
                  item?.isDisplayUser,
                  item?.isDisplayEvaluator05,
                  item?.isDisplayEvaluator1,
                  item?.isDisplayEvaluator2,
                )}
                pagination={false}
                bordered
                locale={{
                  emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
                }}
              />
            </div>
          )}
        </div>
      )}

      {item?.isDisplayComponent810 && (
        <div style={{ paddingTop: 25 }}>
          <Typography.Text>{item?.behaviorTable?.titleTable}</Typography.Text>
          <Table
            dataSource={item?.behaviorTable?.dataSource}
            columns={ColumnPDF17.columnBasicBehavior(
              item?.isDisplayUser,
              item?.isDisplayEvaluator05,
              item?.isDisplayEvaluator1,
              item?.isDisplayEvaluator2,
            )}
            pagination={false}
            bordered
            locale={{
              emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
            }}
          />
        </div>
      )}

      {item?.isDisplayComponent810 && (
        <div style={{ paddingTop: 25 }}>
          <Typography.Text>{item?.personalGoalsMain?.titleTable}</Typography.Text>
          {arrayAchievementPersonals?.map((element: any, index: number) => {
            const dataFilterNoTotal = element.filter((item: any) => {
              return item.key !== -1;
            });

            return (
              <React.Fragment key={index}>
                {index > 0 && (
                  <hr
                    style={{
                      border: 'none',
                      borderTop: '3px solid #000', // đường đậm màu đen
                      margin: '15px 0',
                    }}
                  />
                )}
                <Table
                  dataSource={dataFilterNoTotal}
                  columns={ColumnPDF17.achievementPersonalMainColumnParent(
                    item?.isDisplayUser,
                    item?.isDisplayEvaluator05,
                    item?.isDisplayEvaluator1,
                    item?.isDisplayEvaluator2,
                    index + 1,
                  )}
                  pagination={false}
                  bordered
                  size="small"
                  locale={{
                    emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
                  }}
                  expandable={{
                    defaultExpandAllRows: true,
                    showExpandColumn: false,
                    indentSize: 2,
                    rowExpandable: (record) => record?.subList,
                    expandedRowRender: (record) => (
                      <Table
                        columns={ColumnPDF17.achievementPersonalMainColumnSub()}
                        dataSource={record?.subList}
                        rowKey="key"
                        pagination={false}
                        bordered
                        style={{ margin: 0 }}
                        locale={{
                          emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
                        }}
                      />
                    ),
                  }}
                />

                {item?.isDisplayComponent810 && (
                  <div>
                    {((item?.status === 50 && item?.isEvaluationDate) || item?.status > 50) && (
                      <div>
                        <Table
                          dataSource={element}
                          columns={ColumnPDF17.columnAchievementPersonalSub(
                            item?.isDisplayUser,
                            item?.isDisplayEvaluator05,
                            item?.isDisplayEvaluator1,
                            item?.isDisplayEvaluator2,
                            index + 1,
                          )}
                          pagination={false}
                          bordered
                          locale={{
                            emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}

      {item?.isDisplayComponent810 && (
        <div>
          {((item?.status === 50 && item?.isEvaluationDate) || item?.status > 50) &&
            item?.isAchievementAdditionalPersonal && (
              <div style={{ paddingTop: 25 }}>
                <Typography.Text>{item?.achievementAdditionalPersonal?.titleTable}</Typography.Text>
                <Table
                  dataSource={item?.achievementAdditionalPersonal?.dataSource}
                  columns={ColumnPDF17.columnAchievementAdditional(
                    item?.isDisplayUser,
                    item?.isDisplayEvaluator05,
                    item?.isDisplayEvaluator1,
                    item?.isDisplayEvaluator2,
                  )}
                  pagination={false}
                  bordered
                  locale={{
                    emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
                  }}
                />
              </div>
            )}
        </div>
      )}

      {((item?.status === 50 && item?.isEvaluationDate) || item?.status > 50) && (
        <div style={{ paddingTop: 25 }}>
          <Typography.Text>{t('IDS_COMMENT_USER')}</Typography.Text>
          <div>{item?.commentUser}</div>
        </div>
      )}

      {((item?.status === 50 && item?.isEvaluationDate) || item?.status > 50) && item?.isDisplayEvaluator05 && (
        <div style={{ paddingTop: 25 }}>
          <Typography.Text>{t('IDS_COMMENT_EVALUATOR_0_5')}</Typography.Text>
          <div>{item.commentEvaluator05}</div>
        </div>
      )}

      {((item?.status === 50 && item?.isEvaluationDate) || item?.status > 50) && item?.isDisplayEvaluator1 && (
        <div style={{ paddingTop: 25 }}>
          <Typography.Text>{t('IDS_COMMENT_EVALUATOR_1')}</Typography.Text>
          <div>{item?.commentEvaluator1}</div>
        </div>
      )}

      {((item?.status === 50 && item?.isEvaluationDate) || item?.status > 50) && item?.isDisplayEvaluator2 && (
        <div style={{ paddingTop: 25 }}>
          <Typography.Text>{t('IDS_COMMENT_EVALUATOR_2')}</Typography.Text>
          <div>{item?.commentEvaluator2}</div>
        </div>
      )}
    </div>
  );
};

export default ComponentPdf8_10;
