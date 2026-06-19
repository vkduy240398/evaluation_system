"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwaggerAPI = void 0;
const swagger_1 = require("@nestjs/swagger");
const fs_1 = require("fs");
const yaml_1 = require("yaml");
const PORT = process.env.PORT;
class SwaggerAPI {
    static getSwaggerConfig() {
        return new swagger_1.DocumentBuilder()
            .setTitle('機能設計書 API')
            .setDescription('API requirement for Evaluation System')
            .setVersion('1.0')
            .addServer(`http://localhost:${PORT}`)
            .build();
    }
    static setup(app, exportYmlDoc) {
        const document = swagger_1.SwaggerModule.createDocument(app, this.getSwaggerConfig());
        const yamlDoc = (0, yaml_1.stringify)(document, {});
        if (exportYmlDoc) {
            (0, fs_1.writeFileSync)('swagger.yml', yamlDoc);
        }
        swagger_1.SwaggerModule.setup('/', app, document);
    }
}
exports.SwaggerAPI = SwaggerAPI;
//# sourceMappingURL=SwaggerConfig.js.map