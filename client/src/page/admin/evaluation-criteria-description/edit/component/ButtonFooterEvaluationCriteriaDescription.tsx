import { Affix, Button, Row } from 'antd';
import { t } from 'i18next';
import { useState } from 'react';

interface Props {
  isLoading: any;
  saveDraft: any;
  cancelVersion: any;
  savePrivate: any;
  savePublic: any;
}

const ButtonFooterEvaluationCriteriaDescription = (props: Props) => {
  const { isLoading, saveDraft, cancelVersion, savePublic } = props;
  const [isAffixed, setIsAffixed] = useState<boolean>();

  return (
    <>
      <Affix
        offsetBottom={0}
        style={{ paddingBottom: 10 }}
        onChange={(affixed) => {
          setIsAffixed(affixed);
        }}
      >
        <div className={isAffixed ? 'evaluation-sider-affixed' : 'evaluation-sider'}>
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
              disabled={isLoading}
              loading={isLoading}
              onClick={saveDraft}
              size="middle"
            >
              {t('IDS_BUTTON_SAVE_DRAFT')}
            </Button>
            <Button
              type="primary"
              disabled={isLoading}
              loading={isLoading}
              className="button-normal"
              onClick={cancelVersion}
              size="middle"
            >
              {t('IDS_BUTTON_CANCELED')}
            </Button>
            <Button
              type="primary"
              disabled={isLoading}
              loading={isLoading}
              onClick={savePublic}
              className="button-normal"
              size="middle"
            >
              {t('IDS_BUTTON_SAVE_PUBLIC')}
            </Button>
          </Row>
        </div>
      </Affix>
    </>
  );
};
export default ButtonFooterEvaluationCriteriaDescription;
