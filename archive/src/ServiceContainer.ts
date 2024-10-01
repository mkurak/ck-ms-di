import 'reflect-metadata';
import { IRegisteredService } from './interfaces/IRegisteredService';
import { ScopeContext } from './ScopeContext';
import { getServiceInterface, getServiceLifecycle, getServiceName, isService } from './decorators/Service';
import { v4 as uuidv4 } from 'uuid';

/**
 * The ServiceContainer is responsible for managing the registration and resolution of services
 * in the Dependency Injection (DI) system. It supports different lifecycles for services, including
 * singleton and scoped lifecycles, and manages scopes for handling request, event, and queue-based processes.
 *
 * @class ServiceContainer
 * @version 1.0.0
 */
export class ServiceContainer {
    /**
     * Stores the registered services in the container.
     *
     * @private
     * @type {Map<any, IRegisteredService>}
     */
    private services: Map<any, IRegisteredService> = new Map<any, IRegisteredService>();

    /**
     * Manages active scopes for scoped services.
     *
     * @private
     * @type {Set<ScopeContext>}
     */
    private scopes: Set<ScopeContext> = new Set<ScopeContext>();

    /**
     * Tracks services currently being resolved to detect and prevent circular dependencies.
     *
     * @private
     * @type {Set<any>}
     */
    private resolving: Set<any> = new Set<any>();

    constructor() {}

    /**
     * Registers a service in the container. The service must be decorated with the appropriate metadata
     * to be considered a valid service.
     *
     * @param {new (...args: any[]) => any} serviceClass - The service class to register.
     * @throws {Error} - Throws an error if the service is already registered or if it is not a valid service.
     */
    public registerService(serviceClass: new (...args: any[]) => any) {
        if (!isService(serviceClass)) {
            throw new Error(`${serviceClass.name} is not a registered service`);
        }

        const serviceName = getServiceName(serviceClass);
        const serviceLifecycle = getServiceLifecycle(serviceClass);
        const serviceInterface = getServiceInterface(serviceClass);

        if (this.services.has(serviceClass) || this.services.has(serviceName)) {
            throw new Error(`Service ${serviceName} is already registered.`);
        }

        const registeredService: IRegisteredService = {
            classType: serviceClass,
            lifecycle: serviceLifecycle,
            name: serviceName,
        };

        this.services.set(serviceClass, registeredService);
        if (serviceInterface) {
            this.services.set(serviceInterface, registeredService);
        }
        this.services.set(serviceName, registeredService);
    }

    /**
     * Adds some metadata to the service instance retrieved from the container.
     *
     * @param {T} instance - The service instance to register.
     */
    private setMetadataForServiceInstance<T>(instance: T) {
        Reflect.defineMetadata('serviceInstanceId', uuidv4(), instance as any);
    }

    /**
     * Servise eklenen metadata bilgilerinden "serviceInstanceId" bilgisini verir.
     *
     * @param {T} instance - The service instance to register.
     */
    public getServiceInstanceId<T>(instance: T): string {
        return Reflect.getMetadata('serviceInstanceId', instance as any);
    }

    /**
     * Resolves a service by its class or name, and injects any required dependencies.
     * If the service is not registered or cannot be resolved, an error will be thrown.
     *
     * If the service has dependencies, they are resolved recursively.
     *
     * @param {any} service - The service class or name to resolve.
     * @param {ScopeContext} [currentScope] - The current scope for scoped services.
     * @returns {T} - Returns an instance of the resolved service.
     * @throws {Error} - Throws an error if the service cannot be resolved or circular dependencies are detected.
     */
    // public resolve<T>(service: any, currentScope?: ScopeContext): T {
    //     if (!service) {
    //         throw new Error(`Service not found: Possibly a recursive reference or unresolved forward reference.`);
    //     }

    //     let registeredService = null;

    //     if (typeof service === 'string') {
    //         registeredService = this.services.get(service);
    //     } else {
    //         registeredService = this.services.get(service);
    //     }

    //     if (!registeredService) {
    //         throw new Error(`Service ${service || 'anonymous'} not found: This might indicate a class resolution issue.`);
    //     }

    //     service = registeredService.classType;

    //     if (this.resolving.has(service)) {
    //         throw new Error(`Circular dependency detected while resolving service: ${service.name || 'anonymous'}`);
    //     }

    //     const dependencies = Reflect.getMetadata('design:paramtypes', registeredService.classType) || [];

    //     if (dependencies.includes(undefined)) {
    //         throw new Error(`Undefined dependency detected: Likely a circular dependency in ${registeredService.name}`);
    //     }

    //     dependencies.forEach((dependency: any) => {
    //         const depService = this.services.get(dependency);
    //         if (depService && depService.lifecycle === 'scoped' && registeredService.lifecycle === 'singleton') {
    //             throw new Error(`Singleton service ${registeredService.name} cannot depend on scoped service ${depService.name}`);
    //         }
    //     });

    //     this.resolving.add(service);

    //     try {
    //         const injections = dependencies.map((dep: any) => {
    //             if (dep === ServiceContainer) {
    //                 return this;
    //             }
    //             if (!isService(dep)) {
    //                 return dep;
    //             }
    //             return this.resolve(dep, currentScope);
    //         });

    //         if (registeredService.lifecycle === 'singleton') {
    //             if (!registeredService.instance) {
    //                 registeredService.instance = new registeredService.classType(...injections);
    //                 this.setMetadataForServiceInstance(registeredService.instance);
    //             }
    //             return registeredService.instance as T;
    //         }

    //         if (registeredService.lifecycle === 'scoped') {
    //             if (!currentScope) {
    //                 throw new Error('No active scope found for scoped service resolution.');
    //             }

    //             if (!this.scopes.has(currentScope)) {
    //                 throw new Error('The current scope is no longer active.');
    //             }

    //             const scopedInstance = currentScope.getInstance(service);
    //             if (!scopedInstance) {
    //                 const newScopedInstance = new registeredService.classType(...injections);
    //                 this.setMetadataForServiceInstance(newScopedInstance);
    //                 currentScope.addInstance(service, newScopedInstance);
    //                 return newScopedInstance as T;
    //             }
    //             return scopedInstance as T;
    //         }

    //         const transientInstance = new registeredService.classType(...injections);
    //         this.setMetadataForServiceInstance(transientInstance);
    //         return transientInstance;
    //     } finally {
    //         this.resolving.delete(service);
    //     }
    // }
    public resolve<T>(service: any, currentScope?: ScopeContext): T {
        if (!service) {
            throw new Error(`Service not found: Possibly a recursive reference or unresolved forward reference.`);
        }

        let registeredService = null;

        if (typeof service === 'string') {
            registeredService = this.services.get(service);
        } else {
            registeredService = this.services.get(service);
        }

        if (!registeredService) {
            throw new Error(`Service ${service || 'anonymous'} not found: This might indicate a class resolution issue.`);
        }

        service = registeredService.classType;

        if (this.resolving.has(service)) {
            throw new Error(`Circular dependency detected while resolving service: ${service.name || 'anonymous'}`);
        }

        const dependencies = Reflect.getMetadata('design:paramtypes', registeredService.classType) || [];

        if (dependencies.includes(undefined)) {
            throw new Error(`Undefined dependency detected: Likely a circular dependency in ${registeredService.name}`);
        }

        dependencies.forEach((dependency: any) => {
            const depService = this.services.get(dependency);
            if (depService && depService.lifecycle === 'scoped' && registeredService.lifecycle === 'singleton') {
                throw new Error(`Singleton service ${registeredService.name} cannot depend on scoped service ${depService.name}`);
            }
        });

        this.resolving.add(service);

        try {
            const injections = dependencies.map((dep: any) => {
                if (dep === ServiceContainer) {
                    return this;
                }
                if (!isService(dep)) {
                    return dep;
                }
                return this.resolve(dep, currentScope);
            });

            let instance: T;
            if (registeredService.lifecycle === 'singleton') {
                if (!registeredService.instance) {
                    registeredService.instance = new registeredService.classType(...injections);
                    this.setMetadataForServiceInstance(registeredService.instance);
                }
                instance = registeredService.instance as T;
            } else if (registeredService.lifecycle === 'scoped') {
                if (!currentScope) {
                    throw new Error('No active scope found for scoped service resolution.');
                }

                if (!this.scopes.has(currentScope)) {
                    throw new Error('The current scope is no longer active.');
                }

                const scopedInstance = currentScope.getInstance(service);
                if (!scopedInstance) {
                    const newScopedInstance = new registeredService.classType(...injections);
                    this.setMetadataForServiceInstance(newScopedInstance);
                    currentScope.addInstance(service, newScopedInstance);
                    instance = newScopedInstance as T;
                } else {
                    instance = scopedInstance as T;
                }
            } else {
                // Transient services always create a new instance
                const transientInstance = new registeredService.classType(...injections);
                this.setMetadataForServiceInstance(transientInstance);
                instance = transientInstance as T;
            }

            return instance;
        } finally {
            this.resolving.delete(service);
        }
    }

    /**
     * Begins a new scope for scoped services, allowing them to be resolved within a specific lifecycle context.
     *
     * @returns {ScopeContext} - Returns a new ScopeContext instance.
     *
     * @example
     * const scope = container.beginScope();
     */
    public beginScope(): ScopeContext {
        const scopeContext = new ScopeContext();
        this.scopes.add(scopeContext);
        return scopeContext;
    }

    /**
     * Ends a scope and clears all instances within that scope.
     *
     * @param {ScopeContext} scopeContext - The scope to end.
     *
     * @example
     * container.endScope(scope);
     */
    public endScope(scopeContext: ScopeContext) {
        scopeContext.clear();
        this.scopes.delete(scopeContext);
    }
}
