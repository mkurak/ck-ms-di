import 'reflect-metadata';
/**
 * Type representing the lifecycle of a service.
 *
 * - **singleton**: Only one instance of the service is created and reused.
 * - **transient**: A new instance is created each time the service is requested.
 * - **scoped**: A new instance is created per session.
 */
export type Lifecycle = 'singleton' | 'transient' | 'scoped';
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
export declare class ServiceContainer implements IServiceContainer {
    private static instance;
    private _services;
    private sessions;
    private constructor();
    static getInstance(): ServiceContainer;
    /**
     * Begins a new session and returns a unique session ID.
     *
     * @returns {string} - The generated session ID.
     */
    beginSession(): string;
    /**
     * Ends the specified session and removes it from the container.
     *
     * @param {string} sessionId - The ID of the session to end.
     */
    endSession(sessionId: string): void;
    /**
     * Registers a service with the container.
     *
     * @param {string} name - The name of the service.
     * @param {new (...args: any[]) => any} classType - The class constructor for the service.
     * @param {Lifecycle} lifecycle - The lifecycle of the service.
     * @throws {Error} If a service with the same name already exists.
     */
    register(name: string, classType: new (...args: any[]) => any, lifecycle: Lifecycle): void;
    /**
     * Resolves a service by name or class type.
     *
     * @param {string | any} nameOrType - The name or constructor of the service.
     * @param {string} [sessionId] - The session ID for resolving scoped services.
     * @returns {T} - The resolved service instance.
     * @throws {Error} If the service does not exist or if there are lifecycle conflicts.
     */
    resolve<T>(nameOrType: any, sessionId?: string): T;
    /**
     * Clears all registered services and sessions.
     */
    clear(): void;
    /**
     * Creates an instance of the given service, resolving its dependencies.
     *
     * @private
     * @param {ServiceModel} service - The service model to create an instance of.
     * @param {string} [sessionId] - The session ID for resolving scoped services.
     * @returns {T} - The created service instance.
     * @throws {Error} If there is a dependency that cannot be resolved.
     */
    private _createInstance;
    /**
     * Resolves a scoped service from a session.
     *
     * @private
     * @param {ServiceModel} service - The service model to resolve.
     * @param {string} sessionId - The session ID for the scoped service.
     * @returns {T} - The resolved service instance.
     * @throws {Error} If the session does not exist.
     */
    private _resolveFromSession;
}
//# sourceMappingURL=ServiceContainer.d.ts.map