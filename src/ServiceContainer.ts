import 'reflect-metadata';
import { v4 as uuidv4 } from 'uuid';

export type Lifecycle = 'singleton' | 'transient' | 'scoped';

interface ServiceModel {
    name: string;
    lifecycle: Lifecycle;
    classType: new (...args: any[]) => any;
    instance?: any;
    sessionId?: string;
}

interface SessionModel {
    services: Map<string, ServiceModel>;
}

class ServiceContainer {
    private _services: Map<string, ServiceModel> = new Map();
    private sessions: Map<string, SessionModel> = new Map();

    public beginSession(): string {
        const sessionId = uuidv4();

        if (this.sessions.has(sessionId)) {
            return this.beginSession();
        }

        this.sessions.set(sessionId, { services: new Map() });

        return sessionId;
    }

    public endSession(sessionId: string): void {
        this.sessions.delete(sessionId);
    }

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

        if (service.lifecycle == 'scoped' && sessionId) {
            return this._resolveFromSession<T>(service, sessionId);
        }

        if (service.lifecycle === 'singleton' && service.instance) {
            return service.instance;
        }

        return this._createInstance<T>(service);
    }

    public clear(): void {
        this._services.clear();
        this.sessions.clear();
    }

    private _createInstance<T>(service: ServiceModel, sessionId?: string): T {
        const dependencies = Reflect.getMetadata('design:paramtypes', service.classType) || [];

        const resolvedDependencies = dependencies.map((dependency: any) => {
            if (dependency.name === 'ServiceContainer') {
                return this;
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

const currentContainer = new ServiceContainer();

export default currentContainer;
