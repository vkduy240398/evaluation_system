import './components/DashboardFooter.css';
// import GitInfo from 'react-git-info/macro';
import { Typography } from 'antd';

const DashboardFooter: React.FC = () => {
  // const gitInfo = GitInfo();

  return (
    <div className="footer" style={{ padding: '3px 0' }}>
      <div>{`Copyright © ${new Date().getFullYear()} GEO HOLDINGS CORPORATION`}</div>
      {/* <Typography.Text
        type="secondary"
        style={{ display: 'flex', position: 'absolute', right: 0, bottom: 0, color: 'black' }}
      >{`Version: ${process.env.REACT_APP_VERSION} (${gitInfo.commit.shortHash})`}</Typography.Text> */}
    </div>
  );
};

export default DashboardFooter;
