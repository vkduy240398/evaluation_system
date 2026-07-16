import { Row } from "antd";
import { t } from "i18next";

const TooltipExplaination = () => {
    return (
        <div>
            <Row>
                <div style={{ fontSize: '11px' }}>{t('IDS_ADD')} </div>
                <div style={{ backgroundColor: process.env.REACT_APP_BACKGROUND_PRO_SKILL_ADD, width: '50px', height: '10px', marginTop: '4px', marginLeft: '4px' }} />
            </Row>
            <Row>
                <div style={{ fontSize: '11px' }}>{t('IDS_EDIT')} </div>
                <div style={{ backgroundColor: process.env.REACT_APP_BACKGROUND_PRO_SKILL_MOD, width: '50px', height: '10px', marginTop: '4px', marginLeft: '4px' }} />
            </Row>
            <Row>
                <div style={{ fontSize: '11px' }}>{t('IDS_DELETE')} </div>
                <div style={{ backgroundColor: process.env.REACT_APP_BACKGROUND_PRO_SKILL_DEL, width: '50px', height: '10px', marginTop: '4px', marginLeft: '4px' }} />
            </Row>
        </div>
    );
};
export default TooltipExplaination;