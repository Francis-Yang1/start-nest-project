import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder,SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from 'nestjs-config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe());

  //为所有路由设置一个统一的根路径
  app.setGlobalPrefix('api');

  //为项目建立swagger文档，可以访问文档地址，在上边测试接口
  //先安装swagger:  yarn add swagger-ui-express @nestjs/swagger
  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('NestJs API')//设置标题头
    .setDescription('NestJs 开发学习')//描述
    .setVersion('1.0')//设置版本
    // .addServer('https://xxxx/ddd')  //线上环境地址
    .addServer(
      `http://localhost:${process.env.PORT || app.get(ConfigService).get('express.port', 6060)}`,
    )//设置接口执行路径，可多个，用于测试/线上环境
    .build();

    const document = SwaggerModule.createDocument(app,options);
    SwaggerModule.setup('api-docs',app,document);

  //先安装： yarn add nestjs-config
  //先创建个.env 配置文件，里边定义了端口启动项目，数据库等信息
  await app.listen(
    process.env.PORT || app.get(ConfigService).get('express.port',6060),// 如果 ||  前有就用前的，没有就用后边的
  );   
  
  // await app.listen(3000);
}
bootstrap();
