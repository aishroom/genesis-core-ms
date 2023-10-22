import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import configuration, { CONST_DATA } from './share/config/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('GENESIS API')
    .setVersion('1.0')
    .addTag('genesis')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(app.get(configuration.KEY).PORT);
}
bootstrap();
