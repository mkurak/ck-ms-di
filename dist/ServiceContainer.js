"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const uuid_1 = require("uuid");
/**
 * The service container that manages the registration, resolution, and lifecycle management of services.
 * Provides methods for creating sessions, resolving services, and handling dependencies.
 */
class ServiceContainer {
    constructor() {
        this._services = new Map();
        this.sessions = new Map();
    }
    /**
     * Begins a new session and returns a unique session ID.
     *
     * @returns {string} - The generated session ID.
     */
    beginSession() {
        const sessionId = (0, uuid_1.v4)();
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
    endSession(sessionId) {
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
    register(name, classType, lifecycle) {
        if (this._services.has(name)) {
            throw new Error(`Service with name ${name} already exists`);
        }
        const service = {
            name,
            lifecycle,
            classType,
        };
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
    resolve(nameOrType, sessionId) {
        let serviceName = null;
        if (typeof nameOrType === 'string') {
            serviceName = nameOrType;
        }
        else {
            serviceName = nameOrType.name;
        }
        const service = this._services.get(serviceName);
        if (!service) {
            throw new Error(`Service with name ${serviceName} does not exist`);
        }
        if (service.lifecycle == 'scoped' && sessionId) {
            return this._resolveFromSession(service, sessionId);
        }
        if (service.lifecycle === 'singleton' && service.instance) {
            return service.instance;
        }
        return this._createInstance(service);
    }
    /**
     * Clears all registered services and sessions.
     */
    clear() {
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
    _createInstance(service, sessionId) {
        const dependencies = Reflect.getMetadata('design:paramtypes', service.classType) || [];
        const resolvedDependencies = dependencies.map((dependency) => {
            if (dependency.name === 'ServiceContainer') {
                return this;
            }
            const depService = this._services.get(dependency.name);
            if (!depService) {
                throw new Error(`Dependency with type ${dependency.name} does not exist for service ${service.name}`);
            }
            if (service.lifecycle == 'singleton' && (depService === null || depService === void 0 ? void 0 : depService.lifecycle) == 'scoped') {
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
    _resolveFromSession(service, sessionId) {
        const session = this.sessions.get(sessionId);
        if (!session) {
            throw new Error(`Session with id ${sessionId} does not exist`);
        }
        const scopedService = session.services.get(service.name);
        if (scopedService) {
            return scopedService === null || scopedService === void 0 ? void 0 : scopedService.instance;
        }
        service.instance = this._createInstance(service, sessionId);
        session.services.set(service.name, service);
        return service === null || service === void 0 ? void 0 : service.instance;
    }
}
/**
 * The current instance of the service container.
 */
const currentContainer = new ServiceContainer();
exports.default = currentContainer;
//# sourceMappingURL=ServiceContainer.js.map