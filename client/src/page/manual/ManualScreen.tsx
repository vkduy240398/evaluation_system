import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import manualApiService from '../../common/api/manual';
import { Mime } from '../../constant/Mime';
import { Progress } from 'antd';

const ManualScreen = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();

  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const interval = 50; // Thời gian (giây) để tăng từ 0 lên 100%
    const increment = 100 / ((interval * 1000) / 100); // Tính giá trị tăng mỗi lần

    const timer = setInterval(() => {
      setPercent((prevPercent) => {
        const newPercent = prevPercent + increment;

        return newPercent >= 100 ? 100 : Math.ceil(newPercent);
      });
    }, 50); // Tăng giá trị mỗi 10ms

    setTimeout(() => {
      clearInterval(timer);
    }, interval * 1000); // Dừng sau 2 giây

    return () => clearInterval(timer);
  }, []);

  const dataCallback = async (data: Buffer) => {
    const blob = new Blob([data], { type: Mime.PDF });
    const element = document.createElement('a');
    element.href = URL.createObjectURL(blob);
    window.location.replace(element.href);
  };

  const getData = async () => {
    const type = searchParams.get('type');
    const query = { type: type };
    await manualApiService.getManualFile(query, dataCallback);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Progress
      percent={percent}
      status="active"
      strokeColor={{
        from: '#108ee9',
        to: '#87d068',
      }}
    />
  );
};

export default ManualScreen;
