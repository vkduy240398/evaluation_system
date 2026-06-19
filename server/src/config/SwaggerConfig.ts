import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { stringify } from 'yaml';

const PORT = process.env.PORT;
export class SwaggerAPI {
  private static getSwaggerConfig() {
    return new DocumentBuilder()
      .setTitle('機能設計書 API')
      .setDescription('API requirement for Evaluation System')
      .setVersion('1.0')
      .addServer(`http://localhost:${PORT}`)
      .build();
  }

  public static setup(app: INestApplication, exportYmlDoc: boolean) {
    const document = SwaggerModule.createDocument(app, this.getSwaggerConfig());
    const yamlDoc: string = stringify(document, {});

    if (exportYmlDoc) {
      writeFileSync('swagger.yml', yamlDoc);
    }

    SwaggerModule.setup('/', app, document);
  }
}
