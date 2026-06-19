import { Button, Col, Row } from 'antd';
import { DataSourceEditProSkill } from '../../../../page/detail-pro-skill/interfaces/Interfaces';
import { t } from 'i18next';
import { urlCompanyCode } from '../../../../common/util';

interface Props {
  breaks: any;
  saveDraft: () => void;
  isLoading: boolean;
  cancelVersion: () => void;
  submitData: () => void;
  dataSources: DataSourceEditProSkill;
}
const ButtonFooter = (props: Props) => {
  const { breaks, saveDraft, isLoading, cancelVersion, submitData, dataSources } = props;

  return (
    <>
      <Row style={{ justifyContent: 'space-between' }}>
        <Col
          xl={12}
          md={12}
          style={{
            marginBottom: breaks.xs ? 5 : 0,
          }}
          xs={24}
          sm={18}
        >
          <Row
            style={{
              flexWrap: 'wrap',
              display: 'flex',
              alignItems: 'baseline',
              gap: 5,
            }}
          >
            <Button
              type="primary"
              className="button-normal"
              onClick={saveDraft}
              loading={isLoading}
              disabled={isLoading}
            >
              {t('IDS_BUTTON_SAVE_DRAFT')}
            </Button>

            {(dataSources.data.status !== 4 && dataSources.data.versionMain > 0) ||
            (dataSources.data.versionSub > 1 && [1, 5].includes(dataSources.data.status)) ? (
              <Button
                type="primary"
                onClick={cancelVersion}
                className="button-normal"
                loading={isLoading}
                disabled={isLoading}
              >
                {t('IDS_BUTTON_CANCELED')}
              </Button>
            ) : (
              ''
            )}

            <Button
              type="primary"
              onClick={submitData}
              className="button-normal"
              disabled={isLoading}
              loading={isLoading}
            >
              {t('IDS_BUTTON_SUBMIT')}
            </Button>
          </Row>
        </Col>
        {(dataSources.data?.status === 1 || dataSources.data?.status === 5) && dataSources.data?.versionId !== 0 && (
          <Col sm={6} xs={24} md={12} style={{ display: 'flex', justifyContent: breaks.xs ? 'start' : 'end' }}>
            <Button
              type="primary"
              className="button-normal"
              onClick={() =>
                window.open(
                  urlCompanyCode() + '/' + window.location.pathname.split('/')[3] + `/pro-skill/history/${dataSources.data.versionId}`,
                  '_blank',
                )
              }
            >
              {t('IDS_HISTORY_APPROVE')}
            </Button>
          </Col>
        )}
      </Row>
    </>
  );
};

export default ButtonFooter;
