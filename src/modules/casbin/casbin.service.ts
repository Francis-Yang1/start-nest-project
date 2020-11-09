import { Inject, Injectable } from '@nestjs/common';
import { CASBIN_ENFORCER } from './casbin.constants';
import { Enforcer } from 'casbin'; //yarn add casbin  或 npm i casbin --save
import { Cron } from '@nestjs/schedule';

@Injectable()
export class CasbinService {
    constructor(@Inject(CASBIN_ENFORCER) private readonly enforcer: Enforcer){}

    // *    *    *    *    *
    // -    -    -    -    -
    // |    |    |    |    |
    // |    |    |    |    +----- 星期中星期几 (0 - 7) (星期天 为0)
    // |    |    |    +---------- 月份 (1 - 12) 
    // |    |    +--------------- 一个月中的第几天 (1 - 31)
    // |    +-------------------- 小时 (0 - 23)
    // +------------------------- 分钟 (0 - 59)
    // 使用者也可以将所有的设定先存放在文件中，用 crontab file 的方式来设定执行时间。

    // 实例
    // 每一分钟执行一次 /bin/ls：

    // * * * * * /bin/ls
    // 在 12 月内, 每天的早上 6 点到 12 点，每隔 3 个小时 0 分钟执行一次 /usr/bin/backup：

    // 0 6-12/3 * 12 * /usr/bin/backup
    // 周一到周五每天下午 5:00 寄一封信给 alex@domain.name：

    // 0 17 * * 1-5 mail -s "hi" alex@domain.name < /tmp/maildata
    // 每月每天的午夜 0 点 20 分, 2 点 20 分, 4 点 20 分....执行 echo "haha"：

    // 20 0-23/2 * * * echo "haha"
    // 下面再看看几个具体的例子：

    // 0 */2 * * * /sbin/service httpd restart  意思是每两个小时重启一次apache 

    // 50 7 * * * /sbin/service sshd start  意思是每天7：50开启ssh服务 

    // 50 22 * * * /sbin/service sshd stop  意思是每天22：50关闭ssh服务 

    // 0 0 1,15 * * fsck /home  每月1号和15号检查/home 磁盘 

    // 1 * * * * /home/bruce/backup  每小时的第一分执行 /home/bruce/backup这个文件 

    // 00 03 * * 1-5 find /home "*.xxx" -mtime +4 -exec rm {} \;  每周一至周五3点钟，在目录/home中，查找文件名为*.xxx的文件，并删除4天前的文件。

    // 30 6 */10 * * ls  意思是每月的1、11、21、31日是的6：30执行一次ls命令
    @Cron('*/30 * * * * *')
    public async reloadPolicy() {
        await this.enforcer.loadPolicy();
    }

    public async addPolicy(...params: string[]){
        const added = await this.enforcer.addPolicy(...params);
        if(added){
            await this.enforcer.savePolicy();
        }
    }

    public async removePolicy(...params: string[]){
        const removed = await this.enforcer.removePolicy(...params);
        if(removed){
            await this.enforcer.savePolicy();
        }
    }

    public async checkPermission(...params: any[]): Promise<boolean>{
        return await this.enforcer.enforce(...params);
    }
}
