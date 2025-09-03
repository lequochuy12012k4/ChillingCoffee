declare const module: any;

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3001;

  // Enable CORS for frontend
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));
  app.setGlobalPrefix('api/v1', {exclude: ['']});

  // Serve uploaded images statically
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

  await app.listen(port);
  console.log(`🚀 Server running on port ${port}`);
  
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
  return app;
}

export const vercel = async (req, res) => {
  const app = await bootstrap();
  const server = app.getHttpAdapter().getInstance();
  server(req, res);
};
bootstrap();
