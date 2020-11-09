import { ModuleMetadata, Type } from "@nestjs/common/interfaces";
import { ConnectionOptions } from "typeorm";

export declare type CasbinModuleOptions = {
    modelPath: string;
    policyType: 'csv' | 'string' | 'typeorm';
    policyPath?: string;
    policyString?: string;
    typeOrmOptions?: ConnectionOptions;
};

export interface CasbinOptionsFactory{
    createCasbinOptions(
        connectionName?: string,
    ): Promise<CasbinModuleOptions> | CasbinModuleOptions;
}

export interface CasbinModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    name?: string;
    useExisting?: Type<CasbinOptionsFactory>;
    useClass?: Type<CasbinOptionsFactory>;
    useFactory?: (
        ...args: any[]
    ) => Promise<CasbinModuleOptions> | CasbinModuleOptions;
    inject?: any[];
}