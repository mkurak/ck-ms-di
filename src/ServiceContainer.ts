import 'reflect-metadata';
import { v4 as uuidv4 } from 'uuid';

/**
 * Type representing the lifecycle of a service.
 *
 * - **singleton**: Only one instance of the service is created and reused.
 * - **transient**: A new instance is created each time the service is requested.
 * - **scoped**: A new instance is created per session.
 */
export type Lifecycle = 'singleton' | 'transient' | 'scoped';

/**
 * Interface representing a service model within the container.
 *
 * @interface ServiceModel
 * @property {string} name - The name of the service.
 * @property {Lifecycle} lifecycle - The lifecycle of the service.
 * @property {new (...args: any[]) => any} classType - The class constructor for the service.
 * @property {any} [instance] - The instance of the service (optional, for singleton services).
 * @property {string} [sessionId] - The session ID for scoped services (optional).
 */
interface ServiceModel {
    name: string;
    lifecycle: Lifecycle;
    classType: new (...args: any[]) => any;
    instance?: any;
    sessionId?: string;
}

/**
 * Interface representing a session model, which holds the services for a specific session.
 *
 * @interface SessionModel
 * @property {Map<string, ServiceModel>} services - A map of service names to their corresponding service models within the session.
 */
interface SessionModel {
    services: Map<string, ServiceModel>;
}

export interface IServiceContainer {
    beginSession(): string;
    endSession(sessionId: string): void;
    register(name: string, classType: new (...args: any[]) => any, lifecycle: Lifecycle): void;
    resolve<T>(nameOrType: any, sessionId?: string): T;
    clear(): void;
}

/**
 * The service container that manages the registration, resolution, and lifecycle management of services.
 * Provides methods for creating sessions, resolving services, and handling dependencies.
 * Implements the IServiceContainer interface.
 */
export class ServiceContainer implements IServiceContainer {
    private static instance: ServiceContainer;
    private _services: Map<string, ServiceModel> = new Map();
    private sessions: Map<string, SessionModel> = new Map();

    private constructor() {
        // Private constructor to prevent direct instantiation
    }

    // Singleton instance getter
    public static getInstance(): ServiceContainer {
        if (!ServiceContainer.instance) {
            ServiceContainer.instance = new ServiceContainer();
        }
        return ServiceContainer.instance;
    }

    /**
     * Begins a new session and returns a unique session ID.
     *
     * @returns {string} - The generated session ID.
     */
    public beginSession(): string {
        const sessionId = uuidv4();

        if (this.sessions.has(sessionId)) {
            return this.beginSession();
        }

        this.sessions.set(sessionId, { services: new Map() });

        return sessionId;
    }

    /**
     * Ends the specified session and removes it from the container.
     *
     * @param {string} sessionId - The ID of the session to end.
     */
    public endSession(sessionId: string): void {
        this.sessions.delete(sessionId);
    }

    /**
     * Registers a service with the container.
     *
     * @param {string} name - The name of the service.
     * @param {new (...args: any[]) => any} classType - The class constructor for the service.
     * @param {Lifecycle} lifecycle - The lifecycle of the service.
     * @throws {Error} If a service with the same name already exists.
     */
    public register(name: string, classType: new (...args: any[]) => any, lifecycle: Lifecycle): void {
        if (this._services.has(name)) {
            throw new Error(`Service with name ${name} already exists`);
        }

        const service = {
            name,
            lifecycle,
            classType,
        } as ServiceModel;

        if (lifecycle === 'singleton') {
            service.instance = this._createInstance(service);
        }

        this._services.set(name, service);
    }

    /**
     * Resolves a service by name or class type.
     *
     * @param {string | any} nameOrType - The name or constructor of the service.
     * @param {string} [sessionId] - The session ID for resolving scoped services.
     * @returns {T} - The resolved service instance.
     * @throws {Error} If the service does not exist or if there are lifecycle conflicts.
     */
    public resolve<T>(nameOrType: any, sessionId?: string): T {
        let serviceName: string | null = null;

        if (typeof nameOrType === 'string') {
            serviceName = nameOrType;
        } else {
            serviceName = nameOrType.name;
        }

        const service = this._services.get(serviceName!);
        if (!service) {
            throw new Error(`Service with name ${serviceName} does not exist`);
        }

        if (service.lifecycle == 'scoped' && !sessionId) {
            throw new Error(`Service with name ${serviceName} is scoped and requires a session ID for resolution`);
        }

        if (service.lifecycle == 'scoped' && sessionId) {
            return this._resolveFromSession<T>(service, sessionId);
        }

        if (service.lifecycle === 'singleton' && service.instance) {
            return service.instance;
        }

        return this._createInstance<T>(service, sessionId);
    }

    /**
     * Clears all registered services and sessions.
     */
    public clear(): void {
        this._services.clear();
        this.sessions.clear();
    }

    /**
     * Creates an instance of the given service, resolving its dependencies.
     *
     * @private
     * @param {ServiceModel} service - The service model to create an instance of.
     * @param {string} [sessionId] - The session ID for resolving scoped services.
     * @returns {T} - The created service instance.
     * @throws {Error} If there is a dependency that cannot be resolved.
     */
    private _createInstance<T>(service: ServiceModel, sessionId?: string): T {
        const dependencies = Reflect.getMetadata('design:paramtypes', service.classType) || [];

        const resolvedDependencies = dependencies.map((dependency: any) => {
            if (dependency.name === 'ServiceContainer') {
                return ServiceContainer.getInstance();
            }

            const depService = this._services.get(dependency.name);
            if (!depService) {
                throw new Error(`Dependency with type ${dependency.name} does not exist for service ${service.name}`);
            }

            if (service.lifecycle == 'singleton' && depService?.lifecycle == 'scoped') {
                throw new Error(`Service with name ${dependency.name} is scoped and cannot be injected into a singleton service`);
            }

            return this.resolve(dependency.name, sessionId);
        });

        return new service.classType(...resolvedDependencies);
    }

    /**
     * Resolves a scoped service from a session.
     *
     * @private
     * @param {ServiceModel} service - The service model to resolve.
     * @param {string} sessionId - The session ID for the scoped service.
     * @returns {T} - The resolved service instance.
     * @throws {Error} If the session does not exist.
     */
    private _resolveFromSession<T>(service: ServiceModel, sessionId: string): T {
        const session = this.sessions.get(sessionId);
        if (!session) {
            throw new Error(`Session with id ${sessionId} does not exist`);
        }

        const scopedService = session.services.get(service.name);
        if (scopedService) {
            return scopedService?.instance;
        }

        service.instance = this._createInstance(service, sessionId);
        session.services.set(service.name, service);

        return service?.instance;
    }
}
