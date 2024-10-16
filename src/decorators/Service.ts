import 'reflect-metadata';
import { ServiceContainer } from '../ServiceContainer';

export interface ServiceOptions {
    name?: string;
    lifecycle?: 'singleton' | 'transient';
}

export function Service(options?: ServiceOptions) {
    return function (target: any) {
        const name = options?.name || target.name;
        const lifecycle = options?.lifecycle || 'transient';

        (async () => {
            const container = ServiceContainer.getInstance();
            await container.registerAsync(name, target, lifecycle);
        })();
    };
}
