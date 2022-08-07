import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export default function setupSwagger(app: INestApplication): void {
    const options = new DocumentBuilder()
        .setTitle('Streaming Service API')
        .setDescription(
            'API for interacting with third-party music streaming services',
        )
        .setVersion('0.1.0')
        .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api-docs', app, document);
}
