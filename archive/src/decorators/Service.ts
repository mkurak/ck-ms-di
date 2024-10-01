import 'reflect-metadata';

/**
 * The lifecycle information of the services added to the container.
 */
export type Lifecycle = 'singleton' | 'transient' | 'scoped';

const SERVICE_METADATA_KEY = Symbol('service');
const INTERFACE_METADATA_KEY = Symbol('interface');
const LIFECYCLE_METADATA_KEY = Symbol('lifecycle');
const NAME_METADATA_KEY = Symbol('name');

interface ServiceOptions {
    /**
     * Optional name for the service.
     * If not provided, the class name will be used.
     *
     * @type {string}
     */
    name?: string;

    /**
     * Optional interface to associate with the service.
     *
     * @type {any}
     */
    interface?: any;

    /**
     * Optional lifecycle for the service.
     * Default is 'transient'.
     *
     * @type {Lifecycle}
     */
    lifecycle?: Lifecycle;
}

/**
 * Service decorator that marks a class as a service and registers
 * its lifecycle, name, and optional interface.
 *
 * @param {ServiceOptions} [options] - Optional service options.
 * @returns {ClassDecorator} - Returns a decorator function that registers the service metadata.
 *
 * @example
 * @Service({ lifecycle: 'singleton' })
 * class MyService {}
 */
export function Service(options?: ServiceOptions): ClassDecorator {
    return function (target: any) {
        Reflect.defineMetadata(SERVICE_METADATA_KEY, true, target);

        if (options?.interface) {
            Reflect.defineMetadata(INTERFACE_METADATA_KEY, options.interface, target);
        }

        Reflect.defineMetadata(LIFECYCLE_METADATA_KEY, options?.lifecycle ?? 'transient', target);
        Reflect.defineMetadata(NAME_METADATA_KEY, options?.name ?? target.name, target);
    };
}

/**
 * Checks if a target class is registered as a service.
 *
 * @param {any} target - The target class to check.
 * @returns {boolean} - Returns true if the target is a registered service, otherwise false.
 */
export function isService(target: any): boolean {
    return Reflect.getMetadata(SERVICE_METADATA_KEY, target) === true;
}

/**
 * Retrieves the interface associated with a registered service.
 *
 * @param {any} target - The target class.
 * @returns {any | undefined} - Returns the interface if defined, otherwise undefined.
 */
export function getServiceInterface(target: any): any | undefined {
    return Reflect.getMetadata(INTERFACE_METADATA_KEY, target);
}

/**
 * Retrieves the lifecycle of a registered service.
 *
 * @param {any} target - The target class.
 * @returns {Lifecycle} - Returns the lifecycle of the service ('singleton', 'transient', or 'scoped').
 */
export function getServiceLifecycle(target: any): Lifecycle {
    return Reflect.getMetadata(LIFECYCLE_METADATA_KEY, target);
}

/**
 * Retrieves the name of a registered service.
 *
 * @param {any} target - The target class.
 * @returns {string} - Returns the name of the service.
 */
export function getServiceName(target: any): string {
    return Reflect.getMetadata(NAME_METADATA_KEY, target);
}
