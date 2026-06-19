"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelizeConfig = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const EntityExport_1 = require("../entity/EntityExport");
const data_dump_1 = require("../constant/data.dump");
const sequelize_1 = require("sequelize");
const config_1 = require("@nestjs/config");
exports.sequelizeConfig = {
    provide: 'SEQUELIZE',
    inject: [config_1.ConfigService],
    useFactory: async (configService) => {
        const DEFAULT_PORT = 3000;
        const username = configService.get('DB_USERNAME') || '';
        const password = configService.get('DB_PASSWORD') || '';
        const host = configService.get('DB_HOST') || '';
        const port = configService.get('DB_PORT') || DEFAULT_PORT;
        const dbName = configService.get('DB_NAME');
        const DB_SYNC = configService.get('DB_SYNC');
        const DB_ALTER = configService.get('DB_ALTER');
        const sequelize = new sequelize_typescript_1.Sequelize({
            pool: {
                max: 5,
                min: 0,
                acquire: 300000,
                idle: 10000,
            },
            database: dbName,
            username: username,
            password: password,
            host: host,
            port: Number(port),
            dialect: 'postgres',
            logging: false,
            dialectOptions: {
                ssl: false
            },
        });
        sequelize.addModels(EntityExport_1.LIST_ENTITIES);
        if (DB_SYNC === 'true' || DB_ALTER === 'true') {
            await sequelize
                .sync({
                force: DB_SYNC === 'true' ? true : false,
                alter: DB_ALTER === 'true' ? true : false,
            })
                .catch((error) => {
                console.log(error);
            });
        }
        if (DB_SYNC === 'true') {
            await sequelize.query('DROP SEQUENCE IF EXISTS department_creation_seq', {
                raw: true,
            });
            await sequelize.query('CREATE SEQUENCE department_creation_seq START 1 INCREMENT 1', { raw: true });
            await sequelize.authenticate().then(async () => await (0, data_dump_1.dumpData)());
            const queryInterface = sequelize.getQueryInterface();
            queryInterface.addConstraint('department_tbl', {
                fields: ['class'],
                type: 'check',
                where: {
                    class: { [sequelize_1.Op.in]: [0, 1] },
                },
            });
            queryInterface.addConstraint('department_tbl', {
                fields: ['type'],
                type: 'check',
                where: {
                    type: { [sequelize_1.Op.in]: [0, 1, 2] },
                },
            });
            queryInterface.addConstraint('department_tbl', {
                fields: ['active'],
                type: 'check',
                where: {
                    active: { [sequelize_1.Op.in]: [0, 1] },
                },
            });
            queryInterface.addConstraint('skill_role_tbl', {
                fields: ['role'],
                type: 'check',
                where: {
                    role: { [sequelize_1.Op.in]: [1, 2] },
                },
            });
            queryInterface.addConstraint('user_tbl', {
                fields: ['active'],
                type: 'check',
                where: {
                    active: { [sequelize_1.Op.in]: [0, 1] },
                },
            });
            queryInterface.addConstraint('user_tbl', {
                fields: ['level'],
                type: 'check',
                where: {
                    level: { [sequelize_1.Op.between]: [1, 10] },
                },
            });
            queryInterface.addConstraint('evaluation_tbl', {
                fields: ['status'],
                type: 'check',
                where: {
                    status: {
                        [sequelize_1.Op.in]: [
                            0, 1, 2, 3, 4, 5, 6, 7, 8, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58,
                            59, 60, 61, 98, 99, 100,
                        ],
                    },
                },
            });
            queryInterface.addConstraint('evaluation_tbl', {
                fields: ['level'],
                type: 'check',
                where: {
                    level: { [sequelize_1.Op.between]: [1, 10] },
                },
            });
            queryInterface.addConstraint('evaluation_basic_behavior_tbl', {
                fields: ['type'],
                type: 'check',
                where: {
                    type: { [sequelize_1.Op.in]: [1, 2, 3] },
                },
            });
            queryInterface.addConstraint('evaluation_period_tbl', {
                fields: ['period_index'],
                type: 'check',
                where: {
                    period_index: { [sequelize_1.Op.in]: [1, 2] },
                },
            });
            queryInterface.addConstraint('version_pro_skill_tbl', {
                fields: ['status'],
                type: 'check',
                where: {
                    status: { [sequelize_1.Op.between]: [1, 5] },
                },
            });
            queryInterface.addConstraint('version_pro_skill_tbl', {
                fields: ['public_status'],
                type: 'check',
                where: {
                    public_status: { [sequelize_1.Op.between]: [0, 2] },
                },
            });
            queryInterface.addConstraint('version_basic_behavior_tbl', {
                fields: ['type'],
                type: 'check',
                where: {
                    type: { [sequelize_1.Op.in]: [1, 2, 3] },
                },
            });
            queryInterface.addConstraint('version_basic_behavior_tbl', {
                fields: ['status'],
                type: 'check',
                where: {
                    status: { [sequelize_1.Op.between]: [1, 4] },
                },
            });
            queryInterface.addConstraint('version_guide_evaluation_tbl', {
                fields: ['type'],
                type: 'check',
                where: {
                    type: { [sequelize_1.Op.in]: [1, 2, 3, 4] },
                },
            });
            queryInterface.addConstraint('version_guide_evaluation_tbl', {
                fields: ['status'],
                type: 'check',
                where: {
                    status: { [sequelize_1.Op.between]: [1, 4] },
                },
            });
            queryInterface.addConstraint('history_approve_evaluation_tbl', {
                fields: ['type'],
                type: 'check',
                where: {
                    type: { [sequelize_1.Op.in]: [0, 1] },
                },
            });
            queryInterface.addConstraint('version_setting_tbl', {
                fields: ['type'],
                type: 'check',
                where: {
                    type: { [sequelize_1.Op.in]: [1, 2, 3, 4] },
                },
            });
            queryInterface.addConstraint('version_setting_tbl', {
                fields: ['status'],
                type: 'check',
                where: {
                    status: { [sequelize_1.Op.between]: [1, 4] },
                },
            });
            queryInterface.addConstraint('setting_point_basic_behavior_pro_tbl', {
                fields: ['type'],
                type: 'check',
                where: {
                    type: { [sequelize_1.Op.between]: [1, 3] },
                },
            });
            queryInterface.addConstraint('setting_achievement_personal_tbl', {
                fields: ['type'],
                type: 'check',
                where: {
                    type: { [sequelize_1.Op.in]: [1, 2] },
                },
            });
            queryInterface.addConstraint('setting_achievement_personal_tbl', {
                fields: ['type_evaluation'],
                type: 'check',
                where: {
                    type: { [sequelize_1.Op.in]: [1, 2, 3] },
                },
            });
            queryInterface.addConstraint('setting_achievement_additional_tbl', {
                fields: ['type'],
                type: 'check',
                where: {
                    type: { [sequelize_1.Op.in]: [1, 2, 3] },
                },
            });
            queryInterface.addConstraint('setting_level_tbl', {
                fields: ['level'],
                type: 'check',
                where: {
                    level: { [sequelize_1.Op.between]: [1, 10] },
                },
            });
            queryInterface.addConstraint('feedback_tbl', {
                fields: ['type'],
                type: 'check',
                where: {
                    type: { [sequelize_1.Op.in]: [0, 1] },
                },
            });
            queryInterface.addConstraint('feedback_tbl', {
                fields: ['status'],
                type: 'check',
                where: {
                    status: { [sequelize_1.Op.between]: [1, 7] },
                },
            });
            queryInterface.addIndex('version_pro_skill_tbl', [
                'skill_id',
                'public_status',
            ]);
            queryInterface.addIndex('list_pro_skill_tbl', ['version_id']);
            queryInterface.addIndex('history_approve_evaluation_tbl', [
                'evaluation_id',
                'created_time',
            ]);
            queryInterface.addIndex('evaluation_tbl', ['id', 'user_id']);
            queryInterface.addIndex('version_setting_tbl', ['type', 'status']);
            queryInterface.addIndex('evaluation_period_tbl', [
                'date_creation_goal_start',
                'date_creation_goal_end',
                'date_evaluation_start',
                'date_evaluation_end',
                'date_creation_goal_department_start',
                'date_creation_goal_department_end',
                'date_evaluation_department_start',
                'date_evaluation_department_end',
                'year',
            ]);
            queryInterface.addIndex('version_guide_evaluation_tbl', [
                'type',
                'status',
            ]);
            queryInterface.addIndex('department_tbl', ['active', 'name']);
            queryInterface.addIndex('department_tbl', ['active', 'type']);
        }
        return sequelize;
    },
};
//# sourceMappingURL=SequelizeConfig.js.map