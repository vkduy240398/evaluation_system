import { User } from 'src/entity/User';
import { UserHistoryUpdate } from 'src/entity/UserHistoryUpdate';
export declare class UserHistoryUpdateRepo {
    getVersionSrtting(): void;
    private userHistoryUpdate;
    private user;
    buildCreate(object: {
        userId: number;
        beforeUpdateContent: string;
        afterUpdateContent: string;
        option: string;
        companyGroupCode: string;
    }[]): Promise<UserHistoryUpdate[]>;
    getHistoryUpdateUserList(companyGroupCode: string, userId: string): Promise<User>;
}
