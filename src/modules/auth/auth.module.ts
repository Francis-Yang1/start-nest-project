import { HttpModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TmploginEntity } from 'src/entity/tmplogin.entity';
import { UserEntity } from 'src/entity/user.entity';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JWT_KEY } from './constants';
import { JwtStrategy } from './jwt.strategy';

export const jwtOptions = {
  secret: JWT_KEY,
  signOptions: { expiresIn: '365 days', issuer: 'MoMo' },
};

@Module({
  imports: [
    //Passport,护照，用于身份验证
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register(jwtOptions),
    TypeOrmModule.forFeature([UserEntity, TmploginEntity]),
    HttpModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [TypeOrmModule, HttpModule],
})
export class AuthModule {}
