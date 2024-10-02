import { ServiceContainer, Lifecycle } from '../ServiceContainer';

/**
 * Interface for service options.
 *
 * @interface ServiceOptions
 * @property {string} [name] - The name of the service (optional).
 * @property {Lifecycle} [lifecycle] - The lifecycle of the service (optional).
 */
export interface ServiceOptions {
    name?: string;
    lifecycle?: Lifecycle;
}

/**
 * A class decorator function that registers a class as a service.
 *
 * @param {ServiceOptions} [options] - Optional configuration for the service.
 * @returns {ClassDecorator} - A decorator that registers the class as a service.
 */
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

        ServiceContainer.getInstance().register(options.name!, target, options.lifecycle);
    };
}
