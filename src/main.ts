import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import * as compression from 'compression';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'verbose'],
  });

  app.enableCors({
    origin: ['https://bite-rush-client.vercel.app'],
    credentials: true,
  });

  app.use(helmet());
  app.use(compression());

  app.use(json());
  app.use(urlencoded({ extended: true }));

  const config = new DocumentBuilder()
    .setTitle('BiteRush API Documentation')
    .setDescription('API documentation for BiteRush application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 8000);
  console.log(`app listening on  ${process.env.PORT || 8000}...`);
}
bootstrap();
