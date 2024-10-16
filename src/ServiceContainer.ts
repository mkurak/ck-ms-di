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

export interface IServiceContainer {
    beginSession(): string;
    endSession(sessionId: string): void;
    resolveAsync<T>(nameOrType: any, sessionId?: string): Promise<T | undefined>;
    register(name: string, classType: new (...args: any[]) => any, lifecycle: Lifecycle): void;
    clear(): void;
    get foundedServicesCount(): number;
    get foundedSessionsCount(): number;
}

export class ServiceContainer implements IServiceContainer {
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

    public endSession(sessionId: string): void {
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
        let serviceName: string = typeof nameOrType === 'string' ? nameOrType : nameOrType.name;
        let service: ServiceModel | undefined;

        if (sessionId) {
            const session = this._sessions.get(sessionId);
            if (session) {
                const service = session.services.get(serviceName);
                if (!service) {
                    const serviceMain = this._services.get(serviceName);
                    if (!serviceMain) {
                        console.error(`Service with name ${serviceName} does not exist`);
                        return undefined;
                    }

                    if (serviceMain.lifecycle !== 'scoped') {
                        console.error(`Service with name ${serviceName} is not scoped`);
                        return undefined;
                    }

                    const newService = {
                        name: serviceName,
                        lifecycle: 'scoped',
                        classType: serviceMain.classType,
                    } as ServiceModel;
                    newService.instance = await this._createInstanceAsync(newService, sessionId);
                    session.services.set(serviceName, newService);

                    return newService.instance;
                } else {
                    return service.instance;
                }
            } else {
                console.error(`Session with id ${sessionId} does not exist`);
                return undefined;
            }
        } else {
            service = this._services.get(serviceName);
            if (!service) {
                console.error(`Service with name ${nameOrType} does not exist`);
                return undefined;
            }

            switch (service.lifecycle) {
                case 'singleton':
                    if (!service.instance) {
                        service.instance = await this._createInstanceAsync(service);
                    }
                    return service.instance;
                case 'transient':
                    return await this._createInstanceAsync(service);
                default:
                    console.error(`Service with name ${nameOrType} is scoped and requires a session id to resolve`);
                    return undefined;
            }
        }
    }

    public register(name: string, classType: new (...args: any[]) => any, lifecycle: Lifecycle): void {
        if (this._services.has(name)) {
            console.error(`Service with name ${name} already exists`);
            return;
        }

        const metadata = Reflect.getMetadata('ck:service', classType);
        if (!metadata || metadata !== name) {
            console.error(`Decorator not used for the service. You must use the @Service decorator to add the service... Service name: ${name}`);
            return;
        }

        const service = {
            name,
            lifecycle,
            classType,
        } as ServiceModel;

        this._services.set(name, service);
    }

    public clear(): void {
        this._services.clear();
        this._sessions.clear();
    }

    public get foundedServicesCount(): number {
        return this._services.size;
    }

    public get foundedSessionsCount(): number {
        return this._sessions.size;
    }
}
