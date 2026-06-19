import { Button, Row } from 'antd';
import { t } from 'i18next';
interface Props {
  isLoading: boolean;
  saveDraft: () => void;
  cancelVersion: () => void;
  savePublic: () => void;
  isPending: boolean;
}
const ButtonFooterComponent = (props: Props) => {
  const { isLoading, saveDraft, cancelVersion, savePublic, isPending } = props;

  return (
    <>
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
          disabled={isLoading || isPending}
          loading={isLoading || isPending}
          onClick={saveDraft}
          size="middle"
        >
          {t('IDS_BUTTON_SAVE_DRAFT')}
        </Button>
        <Button
          type="primary"
          disabled={isLoading || isPending}
          loading={isLoading || isPending}
          className="button-normal"
          onClick={cancelVersion}
          size="middle"
        >
          {t('IDS_BUTTON_CANCELED')}
        </Button>
        <Button
          type="primary"
          disabled={isLoading || isPending}
          loading={isLoading || isPending}
          onClick={savePublic}
          className="button-normal"
          size="middle"
        >
          {t('IDS_BUTTON_SAVE_PUBLIC')}
        </Button>
      </Row>
    </>
  );
};

export default ButtonFooterComponent;
