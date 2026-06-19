import { Transaction } from 'sequelize';
import { HistoryCronJob } from 'src/entity/HistoryCronJob';
export declare class HistoryCronJobRepository {
    private historyCronJobRepository;
    add(object: {
        [x: string]: any;
    }): Promise<HistoryCronJob | [HistoryCronJob, boolean]>;
    getAllByCondition(condition: {
        [x: string]: any;
    }): Promise<HistoryCronJob[]>;
    deleteHistory(condition: {
        [x: string]: any;
    }, transaction: Transaction): Promise<number>;
    updateHistory(object: {
        [x: string]: any;
    }, condition: {
        [x: string]: any;
    }): Promise<[affectedCount: number]>;
    addNews(object: {
        [x: string]: any;
    }): Promise<HistoryCronJob>;
    findOneByCondition(condition: {
        [x: string]: any;
    }): Promise<HistoryCronJob>;
}
