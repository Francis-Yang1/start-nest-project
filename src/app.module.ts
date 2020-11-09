import { Global, HttpModule, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from 'nestjs-config';
import { LoggerModule } from 'nestjs-pino';
import * as path from 'path';
import * as pino from 'pino';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EntitySubscriber } from './core/common/entity.subscriber';
import { AttachmentModule } from './modules/attachment/attachment.module';
import { AuthModule } from './modules/auth/auth.module';
import { CasbinCoreModule } from './modules/casbin/casbin-core.module';
import { CasbinModule } from './modules/casbin/casbin.module';

//读取当前系统的环境变量
const ENV = process.env.NODE_ENV;
@Global()
@Module({
  imports: [
    // 这里指定了需要读取当前目录下的的 config目录中的 以 ts/js结尾的文件
    ConfigModule.load(path.resolve(__dirname, 'config', '**/!(*.d).{ts,js}'), {
      // 这里根据环境变量读取指定的.env文件，默认读取.env文件 文件名格式示例 .env.develop .env.production
      path: path.resolve(process.cwd(), !ENV ? '.env' : `.env.${ENV}`),
    }),

    //注册数据库模块
    //安装typeOrm模块，yarn add @nestjs/typeorm typeorm mysql
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: configService.get('db.type'),
        host: configService.get('db.host'),
        port: configService.get('db.port'),
        username: configService.get('db.username'),
        password: configService.get('db.password'),
        database: configService.get('db.database'),
        entities: [path.resolve(__dirname, 'entity', '**/*.entity.{ts,js}')],
        logging: configService.get('db.logging'),
        synchronize: false,
      }),
    }),
    HttpModule.register({
      timeout: 60000,
    }),
    //注册日志模块, yarn add nestjs-pino 或 npm i nestjs-pino
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          pinoHttp: {
            enabled: configService.get('log.enabled'),
            timestamp: configService.get('log.timestamp'),
            level: configService.get('log.level'),
            useLevelLabels: configService.get('log.useLevelLabels'),
            prettyPrint: configService.get('log.prettyPrint'),
            stream: pino.destination(configService.get('log.path')),
          },
        };
      },
    }),

    //注册定时任务, yarn add @nestjs/schedule
    ScheduleModule.forRoot(),
    //casbin 鉴权  权限控制
    CasbinModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        policyType: 'typeorm',
        modelPath: path.resolve(__dirname, '../model/rbac_model.conf'),
        typeOrmOptions: {
          type: configService.get('db.type'),
          host: configService.get('db.host'),
          port: configService.get('db.port'),
          username: configService.get('db.username'),
          password: configService.get('db.password'),
          database: configService.get('db.database'),
          logging: configService.get('db.logging'),
        },
      }),
    }),
    CasbinModule,
    AuthModule,
    CasbinCoreModule,
    AttachmentModule,
  ],
  controllers: [AppController],
  providers: [AppService, EntitySubscriber], //EntitySubscriber订阅事件，自动生产crtime、uptime
  exports: [ConfigModule, CasbinModule, AuthModule],
})
export class AppModule {}
