import { Result, Row, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import feedbackApiService from '../../../common/api/feedback';
import RequireAuth from '../../../layouts/RequireAuth';
import JSZip from 'jszip';
import { LoadingOutlined } from '@ant-design/icons';
import { t } from 'i18next';
const contentStyle: React.CSSProperties = {
  padding: 50,
  background: 'rgba(0, 0, 0, 0.05)',
  borderRadius: 4,
};

const content = <div style={contentStyle} />;
const DownloadFileFromExcel: React.FC = () => {
  const param = useParams();
  const [isDownloading, setIsDownloading] = useState<boolean>(true);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
    const id = param.id;
    const callback = async (datas: any) => {
      const zip = new JSZip();
      const { data, folderName } = datas;
      // Add each file to the zip

      data.forEach((file: any) => {
        if (file.name != '') {
          const byteArray = new Uint8Array(file.data.data);
          const blob = new Blob([byteArray], { type: file.contentType });
          zip.file(file.name, blob); // Add the Buffer as a Blob
        }
      });
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = window.URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${folderName}.zip`); // Specify the download filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    };
    feedbackApiService.downloadFileFromExcel({ id: id || '' }, callback, setIsDownloading, setIsSuccess);
  }, []);

  return (
    <>
      <RequireAuth isPublic={true} />
      {isDownloading ? (
        <Row justify={'center'} style={{ height: '100%', width: '100%' }} align="middle">
          <Spin tip={t('IDS_DOWNLOADING')} size="large">
            {content}
          </Spin>
        </Row>
      ) : isSuccess ? (
        <Result status="success" title={t('IDS_DOWNLOAD_SUCCESS')} />
      ) : (
        <Result status="error" title={t('IDS_DOWNLOAD_FAIL')}></Result>
      )}
    </>
  );
};

export default DownloadFileFromExcel;
