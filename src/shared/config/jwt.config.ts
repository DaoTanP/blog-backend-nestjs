import { JwtModuleAsyncOptions } from '@nestjs/jwt';
import 'dotenv/config';

export const jwtConfig: JwtModuleAsyncOptions = {
  useFactory: () => {
    return {
      secret: process.env.APP_SECRET,
      signOptions: {
        expiresIn:
          (parseInt(process.env.ACCESS_TOKEN_MAX_AGE_MILLIS, 10) || 3600000) /
          1000, // 1hr
      },
    };
  },
};
