import 'reflect-metadata';
import { ServiceContainer } from '../ServiceContainer';

export interface ServiceOptions {
    name?: string;
    lifecycle?: 'singleton' | 'transient' | 'scoped';
}

export function Service(options?: ServiceOptions) {
    return function (target: any) {
        const name = options?.name || target.name;
        const lifecycle = options?.lifecycle || 'transient';

        Reflect.defineMetadata('ck:service', name, target);

        const container = ServiceContainer.getInstance();
        container.register(name, target, lifecycle);
    };
}
