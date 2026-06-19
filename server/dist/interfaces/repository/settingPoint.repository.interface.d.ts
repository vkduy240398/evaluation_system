import { Transaction } from 'sequelize';
export interface SettingPointI {
    bulkCreate(records: any, transaction: Transaction): Promise<any>;
    bulkDelete(...Args: any): Promise<any>;
}
