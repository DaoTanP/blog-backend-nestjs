import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Blog API Documentation')
  .setDescription('')
  .setVersion('1.0')
  .addServer(`http://localhost:${parseInt(process.env.PORT, 10) || 3000}`)
  .build();
