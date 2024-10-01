/**
 * The class that represents the scopes created for using scoped services.
 * Each scope added to the DI system is managed using this model.
 * Different scopes are created to separate scoped services on a process basis,
 * especially for operations like requests, event handling, and queue consumers.
 * Each scope created is stored in the container using this model.
 *
 * @class ScopeContext
 * @version 1.0.0
 *
 * @example
 * const scope = new ScopeContext();
 * const myServiceInstance = new MyService();
 * scope.addInstance(MyService, myServiceInstance);
 * const retrievedInstance = scope.getInstance(MyService); // Returns the same instance
 */
export class ScopeContext {
    /**
     * A map that stores the instances of the services within the scope.
     * The service class is used as the key, and the corresponding instance is the value.
     *
     * @private
     * @type {Map<new (...args: any[]) => any, object>}
     */
    private instances: Map<new (...args: any[]) => any, object> = new Map<new (...args: any[]) => any, object>();

    /**
     * Adds an instance of a service to the scope.
     *
     * @param {new (...args: any[]) => any} serviceClass - The class of the service being added.
     * @param {object} instance - The instance of the service to add.
     *
     * @example
     * scope.addInstance(MyService, new MyService());
     */
    public addInstance(serviceClass: new (...args: any[]) => any, instance: object) {
        this.instances.set(serviceClass, instance);
    }

    /**
     * Retrieves an instance of a service from the scope.
     *
     * @param {new (...args: any[]) => any} serviceClass - The class of the service to retrieve.
     * @returns {object | undefined} - The instance of the service, or undefined if not found.
     *
     * @example
     * const instance = scope.getInstance(MyService);
     */
    public getInstance(serviceClass: new (...args: any[]) => any): object | undefined {
        return this.instances.get(serviceClass);
    }

    /**
     * Clears all instances stored in the scope, effectively resetting the scope.
     *
     * @example
     * scope.clear();
     */
    public clear() {
        this.instances.clear();
    }
}
