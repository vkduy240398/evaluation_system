import { BasicBehaviorSearchInterfaces } from 'src/interfaces/service/basicBehavior.interfaces';
export declare class BasicBehaviorServices {
    private basicBehaviorRepo;
    private mailService;
    private evaluationPeriodRepo;
    private versionSettingRepository;
    searchListBasicBehavior(params: BasicBehaviorSearchInterfaces): Promise<{
        dataSources: any[];
        counts: any;
    }>;
    displayLevel(type: any, level: any): any;
    getInformationCriteria(id: number, isEdit: string, companyGroupCode: string): Promise<{
        data: any;
        subVersion: any;
        listPoints: any[];
        edited: boolean;
    }>;
    publicVersion(params: any): Promise<any>;
    saveDraftData(body: any, userId: number, companyGroupCode: string, timeZone: string): Promise<{
        id: any;
        timer: any;
        subVersion: any;
        version: any;
        status: any;
        lastUpdatedTime: any;
        edited: boolean;
        code: number;
        type?: undefined;
        updatedTime?: undefined;
    } | {
        code: number;
        id: number;
        status: number;
        type: any;
        timer?: undefined;
        subVersion?: undefined;
        version?: undefined;
        lastUpdatedTime?: undefined;
        edited?: undefined;
        updatedTime?: undefined;
    } | {
        id: any;
        updatedTime: any;
        subVersion: any;
        version: any;
        status: any;
        lastUpdatedTime: any;
        code: number;
        timer?: undefined;
        edited?: undefined;
        type?: undefined;
    }>;
    cancelVersionPro(versionId: number, userId: number, body: any, companyGroupCode: string): Promise<any>;
    savePublicVersion(params: any): Promise<{
        code: number;
        start: string;
        end: string;
        id?: undefined;
        status?: undefined;
        type?: undefined;
    } | {
        code: number;
        id: any;
        status: number;
        type: any;
        start?: undefined;
        end?: undefined;
    } | {
        id: any;
        status: any;
        type: any;
        code?: undefined;
        start?: undefined;
        end?: undefined;
    }>;
}
