import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { createHash } from 'crypto';
import { readFileSync } from 'fs';
import { basename, extname } from 'path';
import { AttachEntity } from 'src/entity/attach.entity';

import { FileUploadRequestArgs } from './dto/file-upload.request';

//@ApiTags()给swaager文档分组
@ApiTags('文件上传相关')
@Controller('attachment')
export class AttachmentController {
  @ApiOperation({ summary: '文件上传接口' })
  @ApiConsumes('multipart/form-data') //指定处理请求的提交内容类型
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload')
  async uploadFile(@UploadedFile() file, @Body() data: FileUploadRequestArgs) {
    // 这里的 file 已经是保存后的文件信息了，在此处做数据库处理，或者直接返回保存后的文件信息
    const attach = new AttachEntity();

    //basename语法格式：
    //1.basename 文件（目录） //删除路径最后一个"/“符号（包括”/"）前面的所有内容
    //2.basename 文件或目录 后缀（后缀：可选参数，指定要去除的文件后缀字符串）
    //示例：
    //  #basename /root/basename/1.sh  //不加上后缀，只给文件的路径
    //     1.sh
    //  #basename /root/basename/1.sh  .sh //加后缀
    //     1
    attach.attachname = basename(file.originalname); //originalname获取上传文件的原名
    //extname返回path路径文件扩展名，如果path以 ‘.' 为结尾，将返回 ‘.'，如果无扩展名 又 不以'.'结尾，将返回空值。
    //   path.extname('index.html')； // returns '.html'
    //   path.extname('index.')； // returns '.'
    //   path.extname('index')； // returns ''
    //slice(开始位置[含],结束位置[不含])；substring(开始位置[含,负数或其它按0处理],截取长度>0[否则返回空])、substr(开始位置[含，可为负],截取长度>0[否则返回空])
    attach.extension = extname(file.originalname).slice(1);
    attach.filepath = `${file.destination.slice(1)}/${file.filename}`;
    attach.size = file.size;
    //mimetype:资源的媒体类型，通过 HTTP 协议，由 Web 服务器告知浏览器（通过 Content-Type 来表示）处理的文件类型
    attach.mimetype = file.mimetype;
    attach.note = data.note;

    //readFile()是异步读取文件方法，返回数据data是buffer（二进制）
    //readFileSync()是同步读取文件方法，会产生阻塞效果
    const bin = readFileSync('./' + attach.filepath);
    //crypto加密数据
    const shasum = createHash('sha1');
    shasum.update(bin);
    attach.sha1 = shasum.digest('hex');

    //将数据存到attach表
    const result = await attach.save();
    return result;
  }
}
