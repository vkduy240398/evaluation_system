import { Row, Typography } from 'antd';
import { t } from 'i18next';

const TooltipNote = () => {
  return (
    <div>
      <Typography.Title
        style={{
          fontSize: '1rem',
          color: '#fff',
        }}
        level={5}
      >
        {t('NOTE_TITLE_TOOLTIP')}
      </Typography.Title>
      <Row>
        <div style={{ fontSize: '11px' }}>{`5: ${t('NOTE_PRO_SKILL_FIVE')}`} </div>
        <div
          style={{
            width: '100%',
            height: '10px',
            marginTop: '4px',
            marginLeft: '4px',
          }}
        />
      </Row>
      <Row>
        <div style={{ fontSize: '11px' }}>{`4: ${t('NOTE_PRO_SKILL_FOUR')}`} </div>
        <div
          style={{
            width: '100%',
            height: '10px',
            marginTop: '4px',
            marginLeft: '4px',
          }}
        />
      </Row>
      <Row>
        <div style={{ fontSize: '11px' }}>{`3: ${t('NOTE_PRO_SKILL_TREE')}`} </div>
        <div
          style={{
            width: '100%',
            height: '10px',
            marginTop: '4px',
            marginLeft: '4px',
          }}
        />
      </Row>
      <Row>
        <div style={{ fontSize: '11px' }}>{`2: ${t('NOTE_PRO_SKILL_TWO')}`} </div>
        <div
          style={{
            width: '100%',
            height: '10px',
            marginTop: '4px',
            marginLeft: '4px',
          }}
        />
      </Row>
      <Row>
        <div style={{ fontSize: '11px' }}>{`1: ${t('NOTE_PRO_SKILL_ONE')}`} </div>
        <div
          style={{
            width: '100%',
            height: '10px',
            marginTop: '4px',
            marginLeft: '4px',
          }}
        />
      </Row>
    </div>
  );
};
export default TooltipNote;
