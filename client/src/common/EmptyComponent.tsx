import { t } from 'i18next';
const EmptyComponent: React.FC = () => {
    return(
        <div>
            <p style={{textAlign: 'center', marginBottom: 0}}>{t('MESSAGE.COMMON.IDM_EMPTY_DATA')}</p>
        </div>
    );
};
export default EmptyComponent;