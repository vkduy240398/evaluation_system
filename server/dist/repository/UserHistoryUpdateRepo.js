"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserHistoryUpdateRepo = void 0;
const common_1 = require("@nestjs/common");
const EntityConstant_1 = require("../constant/EntityConstant");
const User_1 = require("../entity/User");
const UserHistoryUpdate_1 = require("../entity/UserHistoryUpdate");
let UserHistoryUpdateRepo = class UserHistoryUpdateRepo {
    getVersionSrtting() {
        throw new Error('Method not implemented.');
    }
    async buildCreate(object) {
        return await this.userHistoryUpdate.bulkCreate(object);
    }
    async getHistoryUpdateUserList(companyGroupCode, userId) {
        return await this.user.findOne({
            attributes: ['id', 'employeeNumber', 'fullName', 'email'],
            where: {
                id: userId,
                companyGroupCode,
            },
            include: [
                {
                    model: UserHistoryUpdate_1.UserHistoryUpdate,
                    as: 'userHistoryUpdates',
                    include: [
                        {
                            model: User_1.User,
                            as: 'creationUser',
                            attributes: ['id', 'employeeNumber', 'fullName', 'email'],
                        },
                    ],
                },
            ],
            order: [
                [
                    { model: UserHistoryUpdate_1.UserHistoryUpdate, as: 'userHistoryUpdates' },
                    'createdTime',
                    'DESC',
                ],
            ],
        });
    }
};
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.USER_HISTORY_UPDATE),
    __metadata("design:type", Object)
], UserHistoryUpdateRepo.prototype, "userHistoryUpdate", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.USER),
    __metadata("design:type", Object)
], UserHistoryUpdateRepo.prototype, "user", void 0);
UserHistoryUpdateRepo = __decorate([
    (0, common_1.Injectable)()
], UserHistoryUpdateRepo);
exports.UserHistoryUpdateRepo = UserHistoryUpdateRepo;
//# sourceMappingURL=UserHistoryUpdateRepo.js.map