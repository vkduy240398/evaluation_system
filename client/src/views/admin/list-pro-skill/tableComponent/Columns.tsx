import { ColumnsType } from 'antd/es/table';
import React from 'react';
import { SkillRecord, TableRow } from '../interfaces/listProSkillInterfaces';
import { Button, Space, Tag } from 'antd';
import { dateFormatLanguge, urlCompanyCode } from '../../../../common/util';
import { EditOutlined, EyeOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { i18n } from 'i18next';
import { useNavigate } from 'react-router-dom';
interface Props {
  optionStatus: {
    label: string;
    value: number;
  }[];
  i18n: i18n;
  optionPublicStatus: {
    label: string;
    value: number;
  }[];
}
const ColumnsListProSkills = (props: Props) => {
  const { optionStatus, i18n, optionPublicStatus } = props;
  const navigates = useNavigate();

  return [
    {
      title: 'テンプレート',
      dataIndex: 'template',
      key: 'template',
      width: '20%',
      // Hiển thị icon expand mặc định của Antd
    },
    {
      title: 'Version',
      dataIndex: 'version',
      key: 'version',
      align: 'center',
      width: 100,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: 200,
      render: (text) => {
        const colorMap = {
          承認済み: 'green',
          編集中: 'gold',
          取消: 'error',
          差戻: 'warning',
          非公開: 'default',
        };
        const status = optionStatus.find((e) => e.value === text)?.label as SkillRecord['status'];

        return <Tag color={colorMap[status]}>{status}</Tag>;
      },
    },
    {
      title: 'Công khai',
      dataIndex: 'isPublic',
      key: 'isPublic',
      align: 'center',
      width: 200,
      render: (text) => {
        const colorMap = {
          公開中: 'green',
          編集中: 'default',
        } as any;
        const publicStatus = optionPublicStatus.find((e) => {
          return e.value === text;
        });
        const colorStatus = publicStatus?.label || ('公開中' as SkillRecord['isPublic']);

        return text === publicStatus?.value ? (
          <Tag color={colorMap[colorStatus]}>{publicStatus?.label}</Tag>
        ) : (
          publicStatus?.label
        );
      },
    },
    {
      title: 'Người cập nhật',
      dataIndex: 'updatedBy',
      key: 'updatedBy',
      render: (text: any, _record: any, _index: any) => {
        return <div>{text}</div>;
      },
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 200,
      align: 'center',
      render: (text: any, _record: any, _index: any) => {
        return <div>{dateFormatLanguge(text, i18n.language)}</div>;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center',
      width: 100,
      render: (_, record) => (
        <Space size="middle">
          {/* Logic hiển thị icon dựa trên trạng thái giống file gốc */}
          {record.status === 1 ? (
            <Button
              type="default"
              onClick={() => {
                navigates(urlCompanyCode() + `/pro-setting/edit-pro-skill/${record.versionId}`, {
                  state: {
                    id: record.versionId,
                  },
                });
              }}
            >
              <EditOutlined style={{ color: 'red' }} title="Tiếp tục sửa" />
            </Button>
          ) : record.isPublic === 1 && record.children && record.children.filter((v) => v.status === 1).length <= 0 ? (
            <Button type="default">
              <PlusCircleOutlined
                style={{ color: '#00796b' }}
                title="Thêm mới"
                onClick={() => {
                  navigates(urlCompanyCode() + `/pro-setting/detail-pro-skill/${record.versionId}`, {
                    state: {
                      id: record.versionId,
                    },
                  });

                  //    navigates(urlCompanyCode() + '/pro-setting/create', {
                  //       state: {
                  //         skillId: record.,
                  //         name: record.skill_name,
                  //         skillName: record.skill_name,
                  //       },
                  //     });
                }}
              />
            </Button>
          ) : (
            <Button
              type="default"
              onClick={() => {
                navigates(urlCompanyCode() + `/pro-setting/detail-pro-skill/${record.versionId}`, {
                  state: {
                    id: record.versionId,
                  },
                });
              }}
            >
              <EyeOutlined style={{ color: '#1a73e8' }} title="Xem" />
            </Button>
          )}
        </Space>
      ),
    },
  ] as ColumnsType<TableRow>;
};

export default ColumnsListProSkills;
