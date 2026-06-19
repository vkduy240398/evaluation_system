import { Model, BuildOptions, FindOptions } from 'sequelize';
import { RestfulServiceType } from 'src/interfaces/restful.interface';
type AnyModel = typeof Model & {
    new (values?: object, options?: BuildOptions): any;
};
declare class RestService implements RestfulServiceType {
    model: AnyModel;
    constructor(model: AnyModel);
    getAll(condition: FindOptions<any>): Promise<any[]>;
    getOne(condition: any): Promise<any>;
    postOne(data: any, condition: any): Promise<any>;
    postAll(data: any[], condition: any): Promise<any[]>;
    put(data: any, condition: any): Promise<[affectedCount: number, affectedRows: any[]]>;
    delete(condition: any): Promise<number>;
    count(condition: any): Promise<any>;
    findAndCount(condition: any): Promise<{
        rows: any[];
        count: number;
    }>;
    findOrCreate(condition: any): Promise<[any, boolean]>;
    createOrUpdate(condition: any): Promise<[any, boolean]>;
}
export default RestService;
