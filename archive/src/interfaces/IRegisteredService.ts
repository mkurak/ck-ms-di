import { Lifecycle } from '../decorators/Service';

/**
 * Stores information about the services added to the container.
 *
 * @interface IRegisteredService
 * @version 1.0.0
 *
 * @example
 * const service: IRegisteredService = {
 *   classType: MyClass,
 *   instance: new MyClass(),
 *   lifecycle: 'singleton',
 *   name: 'MyClass'
 * };
 */
export interface IRegisteredService {
    /**
     * The type information of the service that was added.
     * This is expected to be either a class or an interface.
     *
     * @type {new (...args: any[]) => any | string} - Expected to be a class constructor.
     */
    classType: new (...args: any[]) => any | string;

    /**
     * In singleton services, this holds the instance of the service.
     * This is expected to be an instance of a class.
     *
     * @type {object} - Expected to be an instance of the classType.
     */
    instance?: object;

    /**
     * The lifecycle information of the service.
     * It determines whether the service is singleton, transient, or scoped.
     *
     * @type {Lifecycle}
     */
    lifecycle: Lifecycle;

    /**
     * The name of the service.
     * This is expected to be the name of the class or interface.
     *
     * @type {string}
     */
    name: string;
}
