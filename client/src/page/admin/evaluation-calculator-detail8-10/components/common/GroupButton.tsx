import { Affix, Button, Col, Row } from 'antd';
import { t } from 'i18next';
import React, { Dispatch, memo, SetStateAction } from 'react';

interface Props {
  isAffixed: boolean | undefined;
  setIsAffixed: Dispatch<SetStateAction<boolean | undefined>>;
  isEdit: boolean;
  record: any;
  handleEditButton: () => void;
  publicVersion: () => Promise<void>;
  breaks: any;
  handleSaveDraftButton: () => void;
  isLoading: boolean;
  isLoadingButton: boolean;
  cancelVersion: () => void;
  savePublic: () => void;
}

const GroupButton = ({
  isAffixed,
  setIsAffixed,
  isEdit,
  record,
  handleEditButton,
  publicVersion,
  breaks,
  handleSaveDraftButton,
  isLoading,
  isLoadingButton,
  cancelVersion,
  savePublic,
}: Props) => {
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
          <Row gutter={{ xs: 8, sm: 16, md: 20, lg: 10 }}>
            {!isEdit && record.status !== 2 && (
              <>
                {record.status === 4 && !record.isHaveEditRecord && (
                  <Col>
                    <Button type="primary" className="button-normal" onClick={handleEditButton}>
                      {t('IDS_EDIT')}
                    </Button>
                  </Col>
                )}
                {record.status === 3 && (
                  <Col>
                    <Button type="primary" className="button-normal" onClick={publicVersion}>
                      {t('IDS_PUBLIC')}
                    </Button>
                  </Col>
                )}{' '}
              </>
            )}

            {isEdit && (
              <>
                <Col style={{ marginBottom: breaks.xs ? '0.5rem' : 0 }}>
                  <Button
                    type="primary"
                    className="button-normal"
                    onClick={handleSaveDraftButton}
                    loading={isLoading || isLoadingButton}
                  >
                    {t('IDS_BUTTON_SAVE_DRAFT')}
                  </Button>
                </Col>

                <Col>
                  <Button
                    type="primary"
                    className="button-normal"
                    loading={isLoading || isLoadingButton}
                    onClick={cancelVersion}
                  >
                    {t('IDS_BUTTON_CANCELED')}
                  </Button>
                </Col>
                <Col>
                  <Button
                    type="primary"
                    className="button-normal"
                    loading={isLoading || isLoadingButton}
                    onClick={savePublic}
                  >
                    {t('IDS_BUTTON_SAVE_PUBLIC')}
                  </Button>
                </Col>
              </>
            )}
          </Row>
        </div>
      </Affix>
    </>
  );
};

export default GroupButton;
