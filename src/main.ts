import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigurationService } from './configuration/services/configuration.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigurationService);
  const PORT = configService.get('PORT');
  const CORS_ORIGINS = configService.get('CORS_ORIGINS');

  app.enableCors({
    origin: CORS_ORIGINS,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Authorization, priority, Content-Type',
    credentials: true,
  });

  await app.listen(PORT);
}

bootstrap();
