import { JwtModuleAsyncOptions } from '@nestjs/jwt';
import 'dotenv/config';

export const jwtConfig: JwtModuleAsyncOptions = {
  useFactory: () => {
    return {
      secret: process.env.APP_SECRET_KEY,
      signOptions: { expiresIn: '1d' },
    };
  },
};
