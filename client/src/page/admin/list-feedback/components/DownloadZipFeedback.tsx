import { FileZipOutlined } from '@ant-design/icons';
import { Button, message, Tooltip } from 'antd';
import { t } from 'i18next';
import httpAxios from '../../../../common/http';
import JSZip from 'jszip';
import { useState } from 'react';

const DownloadZipFeedback = ({ params }: any) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleDownloadZip = async (params: any) => {
    setIsLoading(true);
    await httpAxios
      .Get(`/api/v1/f5/management-evaluation-history/list-feedback/download-zip`, { params: { id: params.id } })
      .then(async (res) => {
        if (res && res.status === 200) {
          const filterFolders = res.data.filter((v: any) => v.name !== '');
          if (filterFolders.length > 1) {
            const zip = new JSZip();
            res.data.forEach((file: any) => {
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
            const textFileZip = `フィードバック_${params.send_time}.zip`;
            link.setAttribute('download', textFileZip); // Specify the download filename
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
          } else if (filterFolders.length === 1) {
            const byteArray = new Uint8Array(filterFolders[0].data.data);
            const blob = new Blob([byteArray], { type: filterFolders[0].contentType });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${filterFolders[0].name}`); // Specify the download filename
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
          }
        }
      });
    setIsLoading(false);
  };

  return (
    <>
      <Tooltip placement="topRight" title={t('IDS_BUTTON_OUTPUT_ZIP')} color="grey">
        <Button
          disabled={params?.attach_files === null || params?.attach_files === undefined || params.attach_files === ''}
          loading={isLoading}
          icon={<FileZipOutlined />}
          style={{ color: '#007240 ' }}
          onClick={async (e) => {
            e.stopPropagation();
            await handleDownloadZip(params);
          }}
        />
      </Tooltip>
    </>
  );
};

export default DownloadZipFeedback;
