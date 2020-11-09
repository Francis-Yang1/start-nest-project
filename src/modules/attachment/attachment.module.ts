import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import dayjs from 'dayjs';
import { diskStorage } from 'multer';
import * as nuid from 'nuid';

import { AttachmentController } from './attachment.controller';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        //配置文件上传后的文件夹路径
        destination: `./public/uploads/${dayjs().format('YYYY-MM-DD')}`, //yarn add dayjs
        //file上传的文件信息，callback 重命名处理
        filename: (req, file, callback) => {
          //自定义保存后的文件名称
          const fileFormat = file.originalname.split('.');
          //NUID 是一个高性能的唯一标识生成库，使用 GO 语言开发。
          //这里使用nuid.next()生成唯一标识，确保文件名不重复
          //yarn add nuid
          const filename = `${nuid.next()}.${
            fileFormat[fileFormat.length - 1]
          }`;

          return callback(null, filename);

          //mimetype文件类型
          // if (file.mimetype === 'image/gif') {
          //   callback(null, true); //允许
          // } else {
          //   req.err = '失败';
          //   callback(null, false);
          // }
        },
      }),
    }),
  ],
  controllers: [AttachmentController],
})
export class AttachmentModule {}
