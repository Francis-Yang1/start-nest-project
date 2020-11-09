import { DynamicModule, Module } from '@nestjs/common';
import { CasbinService } from './casbin.service';
import { CasbinCoreModule } from './casbin-core.module';
import { CasbinModuleAsyncOptions, CasbinModuleOptions } from './interface/casbin-options.interface';

// casbin 模块 构造为 Nest 动态模块来自项目 https://github.com/juicycleff/nestjs-casbin.git
@Module({
  providers: [CasbinService],
  imports: [CasbinCoreModule]
})
export class CasbinModule {
  public static register(options: CasbinModuleOptions): DynamicModule {
    return {
      module: CasbinModule,
      imports: [CasbinCoreModule.register(options)]
    }
  }

  public static registerAsync(options: CasbinModuleAsyncOptions): DynamicModule {
    return {
      module: CasbinModule,
      imports: [CasbinCoreModule.registerAsync(options)]
    }
  }
}
