import ServiceContainer, { Lifecycle } from '../ServiceContainer';

export interface ServiceOptions {
    name?: string;
    lifecycle?: Lifecycle;
}

export function Service(options?: ServiceOptions): ClassDecorator {
    return function (target: any) {
        if (!options) {
            options = {} as ServiceOptions;
        }

        if (!options.name) {
            options.name = target.name;
        }

        if (!options.lifecycle) {
            options.lifecycle = 'transient';
        }

        ServiceContainer.register(options.name!, target, options.lifecycle);
    };
}
