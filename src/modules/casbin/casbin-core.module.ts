import { Global, Module, DynamicModule, Provider, Type } from '@nestjs/common';
import { FileAdapter, newEnforcer } from 'casbin';
import { CASBIN_ENFORCER, CASBIN_OPTIONS, NEST_CASBIN_MODULE_ID } from './casbin.constants';
import { CasbinService } from './casbin.service';
import { CasbinModuleAsyncOptions, CasbinModuleOptions, CasbinOptionsFactory } from './interface/casbin-options.interface';
import TypeORMAdapter from './typeorm-adapter/adapter';
import { v4 as uuid } from 'uuid';


export const generateString = () => uuid();

@Global()
@Module({
    providers: [CasbinService],
    exports: [CasbinService]
})
export class CasbinCoreModule {
    public static register(options: CasbinModuleOptions): DynamicModule {
        const casbinEnforcerProvider: Provider = {
            provide: CASBIN_ENFORCER,
            useFactory: async () => {
                let adapter;
                if(options.policyType === 'csv'){
                    adapter = new FileAdapter(options.policyPath);
                }else if(options.policyType === 'string'){
                    adapter = new FileAdapter(options.policyString);
                }else {
                    adapter = await TypeORMAdapter.newAdapter(options.typeOrmOptions);
                }

                const enforcer = await newEnforcer(options.modelPath, adapter);
                await enforcer.loadPolicy();
                return enforcer;
            },
        };
        return {
            exports: [casbinEnforcerProvider, CasbinService],
            module: CasbinCoreModule,
            providers: [casbinEnforcerProvider, CasbinService]
        };
    }

    public static registerAsync(options: CasbinModuleAsyncOptions): DynamicModule {
        const casbinEnforcerProvider: Provider = {
            provide: CASBIN_ENFORCER,
            useFactory: async (casbinOptions: CasbinModuleOptions) => {
                let adapter;
                if(casbinOptions.policyType === 'csv'){
                    adapter = new FileAdapter(casbinOptions.policyPath);
                }else if(casbinOptions.policyType === 'string'){
                    adapter = new FileAdapter(casbinOptions.policyString);
                }else {
                    adapter = await TypeORMAdapter.newAdapter(
                        casbinOptions.typeOrmOptions
                    );
                }
                const enforcer = await newEnforcer(casbinOptions.modelPath, adapter);
                await enforcer.loadPolicy();
                return enforcer;
            },
            inject: [CASBIN_OPTIONS]
        };

        const asyncProviders = this.createAsyncProviders(options);
        return {
            module: CasbinCoreModule,
            imports: options.imports,
            providers: [
              ...asyncProviders,
              casbinEnforcerProvider,
              CasbinService,
              {
                provide: NEST_CASBIN_MODULE_ID,
                useValue: generateString(),
              },
            ],
            exports: [casbinEnforcerProvider, CasbinService],
          };
    }

    private static createAsyncProviders(
        options: CasbinModuleAsyncOptions,
      ): Provider[] {
        if (options.useExisting || options.useFactory) {
          return [this.createAsyncOptionsProvider(options)];
        }
        const useClass = options.useClass as Type<CasbinOptionsFactory>;
        return [
          this.createAsyncOptionsProvider(options),
          {
            provide: useClass,
            useClass,
          },
        ];
    }
    
    private static createAsyncOptionsProvider(
    options: CasbinModuleAsyncOptions,
    ): Provider {
        if (options.useFactory) {
            return {
            provide: CASBIN_OPTIONS,
            useFactory: options.useFactory,
            inject: options.inject || [],
            };
        }
        const inject = [
            (options.useClass || options.useExisting) as Type<CasbinOptionsFactory>,
        ];
        return {
            provide: CASBIN_OPTIONS,
            useFactory: async (optionsFactory: CasbinOptionsFactory) =>
            await optionsFactory.createCasbinOptions(),
            inject,
        };
    }
}
