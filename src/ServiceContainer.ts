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

export class ServiceContainer {
    private static _instance: ServiceContainer;
    private _services: Map<string, ServiceModel> = new Map();
    private _sessions: Map<string, SessionModel> = new Map();

    private constructor() {}

    public static getInstance() {
        if (!ServiceContainer._instance) {
            ServiceContainer._instance = new ServiceContainer();
        }

        return ServiceContainer._instance;
    }

    public beginSession(): string {
        const sessionId = uuidv4();

        if (this._sessions.has(sessionId)) {
            return this.beginSession();
        }

        this._sessions.set(sessionId, { services: new Map() });

        return sessionId;
    }

    public endSession(sessionId: string) {
        this._sessions.delete(sessionId);
    }

    private async _createInstanceAsync<T>(service: ServiceModel, sessionId?: string): Promise<T> {
        const dependencies = Reflect.getMetadata('design:paramtypes', service.classType) || [];

        let resolvedDependencies: Array<any> = new Array();

        for (let dependency of dependencies) {
            if (dependency.name === 'ServiceContainer') {
                resolvedDependencies.push(this);
                continue;
            }

            if (!this._services.has(dependency.name)) {
                resolvedDependencies.push(undefined);
                continue;
            }

            const depService = this._services.get(dependency.name);
            if (!depService) {
                console.error(`Dependency with type ${dependency.name} does not exist for service ${service.name}`);
                resolvedDependencies.push(undefined);
                continue;
            }

            if (service.lifecycle == 'singleton' && depService?.lifecycle == 'scoped') {
                console.error(`Service with name ${dependency.name} is scoped and cannot be injected into a singleton service`);
                resolvedDependencies.push(undefined);
                continue;
            }

            const _service = await this.resolveAsync(dependency.name, sessionId);
            resolvedDependencies.push(_service);
        }

        const instance = new service.classType(...resolvedDependencies);
        if (instance['init']) {
            const initResult = instance['init']();

            if (initResult instanceof Promise) {
                await initResult;
            }
        }

        return instance;
    }

    public async resolveAsync<T>(nameOrType: any, sessionId?: string): Promise<T | undefined> {
        let service: ServiceModel | undefined;

        if (typeof nameOrType === 'string') {
            service = this._services.get(nameOrType);
        } else {
            service = this._services.get(nameOrType.name);
        }

        if (!service) {
            console.error(`Service with name ${nameOrType} does not exist`);
            return undefined;
        }

        if (service.lifecycle == 'singleton') {
            if (!service.instance) {
                service.instance = await this._createInstanceAsync(service, sessionId);
            }

            return service.instance;
        }

        if (service.lifecycle == 'transient') {
            return await this._createInstanceAsync(service, sessionId);
        }

        if (service.lifecycle == 'scoped') {
            if (!sessionId) {
                console.error(`Service with name ${service.name} is scoped and requires a session id to resolve`);
                return undefined;
            }

            const session = this._sessions.get(sessionId);
            if (!session) {
                console.error(`Session with id ${sessionId} does not exist`);
                return undefined;
            }

            if (!session.services.has(service.name)) {
                const instance = await this._createInstanceAsync(service, sessionId);
                session.services.set(service.name, { ...service, instance });
            }

            return session.services.get(service.name)?.instance;
        }

        return undefined;
    }

    public async registerAsync(name: string, classType: new (...args: any[]) => any, lifecycle: Lifecycle): Promise<void> {
        if (this._services.has(name)) {
            console.error(`Service with name ${name} already exists`);
            return;
        }

        const service = {
            name,
            lifecycle,
            classType,
        } as ServiceModel;

        if (lifecycle === 'singleton') {
            service.instance = await this._createInstanceAsync(service);
        }

        this._services.set(name, service);
    }

    public clear(): void {
        this._services.clear();
        this._sessions.clear();
    }
}
