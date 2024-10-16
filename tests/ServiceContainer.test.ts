import 'reflect-metadata';
import { Service, ServiceContainer } from '../src';

describe('ServiceContainer Tests', () => {
    it('ServiceContainer instance can be accessed', () => {
        const container = ServiceContainer.getInstance();
        expect(container).toBeDefined();
    });

    it('ServiceContainer instance is a singleton', () => {
        const container1 = ServiceContainer.getInstance();
        const container2 = ServiceContainer.getInstance();
        expect(container1).toBe(container2);
    });

    it('No services are defined initially', () => {
        const container = ServiceContainer.getInstance();
        expect(container.foundedServicesCount).toBe(0);
    });

    describe('Services without Injection', () => {
        it('Singleton service can be defined (with string type name)', async () => {
            @Service({ lifecycle: 'singleton' })
            class dBRJBdWj9Bm2 {
                public value: number = 5;
            }

            const container = ServiceContainer.getInstance();

            const service = await container.resolveAsync<dBRJBdWj9Bm2>('dBRJBdWj9Bm2');

            expect(service).toBeDefined();
            expect(service?.value).toBe(5);
        });

        it('Singleton service can be defined (with type)', async () => {
            @Service({ lifecycle: 'singleton' })
            class dBRJBdWj9Bm2 {
                public value: number = 5;
            }

            const container = ServiceContainer.getInstance();

            const service = await container.resolveAsync<dBRJBdWj9Bm2>(dBRJBdWj9Bm2);

            expect(service).toBeDefined();
            expect(service?.value).toBe(5);
        });

        it('The same instance is returned when the defined singleton service is called', async () => {
            @Service({ lifecycle: 'singleton' })
            class tmjZvWgmySPe {
                public value: number = 5;
            }

            const container = ServiceContainer.getInstance();

            const service1 = await container.resolveAsync<tmjZvWgmySPe>('tmjZvWgmySPe');
            const service2 = await container.resolveAsync<tmjZvWgmySPe>('tmjZvWgmySPe');

            expect(service1).toBe(service2);
        });

        it('Transient service can be defined (with string type name)', async () => {
            @Service({ lifecycle: 'transient' })
            class e2hvPSqxRfaj {
                public value: number = 5;
            }

            const container = ServiceContainer.getInstance();

            const service = await container.resolveAsync<e2hvPSqxRfaj>('e2hvPSqxRfaj');

            expect(service).toBeDefined();
            expect(service?.value).toBe(5);
        });

        it('Transient service can be defined (with type)', async () => {
            @Service({ lifecycle: 'transient' })
            class dNxNyZxBPXp9 {
                public value: number = 5;
            }

            const container = ServiceContainer.getInstance();

            const service = await container.resolveAsync<dNxNyZxBPXp9>(dNxNyZxBPXp9);

            expect(service).toBeDefined();
            expect(service?.value).toBe(5);
        });

        it('Different instances are returned when the defined transient service is called', async () => {
            @Service({ lifecycle: 'transient' })
            class VNhk7mM8QZpB {
                public value: number = 5;
            }

            const container = ServiceContainer.getInstance();

            const service1 = await container.resolveAsync<VNhk7mM8QZpB>('VNhk7mM8QZpB');
            const service2 = await container.resolveAsync<VNhk7mM8QZpB>('VNhk7mM8QZpB');

            expect(service1).not.toBe(service2);
        });

        it('Scoped service can be defined (with string type name)', async () => {
            @Service({ lifecycle: 'scoped' })
            class zrTftRRzZG4j {
                public value: number = 5;
            }

            const container = ServiceContainer.getInstance();

            const sessionId = container.beginSession();
            const service = await container.resolveAsync<zrTftRRzZG4j>('zrTftRRzZG4j', sessionId);

            expect(service).toBeDefined();
            expect(service?.value).toBe(5);

            container.endSession(sessionId);
        });

        it('A service added as singleton cannot be found within a session', async () => {
            @Service({ lifecycle: 'singleton' })
            class Avk2YQNyKBvU {
                public value: number = 5;
            }

            const container = ServiceContainer.getInstance();

            const sessionId = container.beginSession();
            const service = await container.resolveAsync<Avk2YQNyKBvU>('Avk2YQNyKBvU', sessionId);
            expect(service).toBeUndefined();

            container.endSession(sessionId);
        });

        it('A service added as transient cannot be found within a session', async () => {
            @Service({ lifecycle: 'transient' })
            class bnYpPTEvNtLF {
                public value: number = 5;
            }

            const container = ServiceContainer.getInstance();

            const sessionId = container.beginSession();
            const service = await container.resolveAsync<bnYpPTEvNtLF>('bnYpPTEvNtLF', sessionId);
            expect(service).toBeUndefined();

            container.endSession(sessionId);
        });
    });

    describe('Services with Injection', () => {
        it('Services with injection can be defined', async () => {
            @Service({ lifecycle: 'singleton' })
            class hTp3LptHUTWd {
                public value: number = 5;
            }

            @Service({ lifecycle: 'singleton' })
            class bwaXeFqfS66Z {
                public value: number = 10;
            }

            @Service({ lifecycle: 'singleton' })
            class QgzEu7nUNtJ9 {
                constructor(
                    private service1: hTp3LptHUTWd,
                    private service2: bwaXeFqfS66Z,
                ) {}

                public sum(): number {
                    return this.service1.value + this.service2.value;
                }
            }

            const container = ServiceContainer.getInstance();

            const service = await container.resolveAsync<QgzEu7nUNtJ9>(QgzEu7nUNtJ9);

            expect(service).toBeDefined();
            expect(service?.sum()).toBe(15);
        });

        it('Singleton service cannot inject scoped service', async () => {
            @Service({ lifecycle: 'singleton' })
            class dsLGCCsTNket {
                public value: number = 5;
            }

            @Service({ lifecycle: 'scoped' })
            class W4jzNzJDGWgD {
                public value: number = 10;
            }

            @Service({ lifecycle: 'singleton' })
            class WkYehaK9gHRR {
                constructor(
                    public service1: dsLGCCsTNket,
                    public service2: W4jzNzJDGWgD,
                ) {}

                public sum(): number {
                    return this.service1.value + (this.service2?.value || 0);
                }
            }

            const container = ServiceContainer.getInstance();

            const service = await container.resolveAsync<WkYehaK9gHRR>(WkYehaK9gHRR);

            expect(service).toBeDefined();
            expect(service?.service1).toBeDefined();
            expect(service?.service1.value).toBe(5);
            expect(service?.service2).toBeUndefined();
            expect(service?.sum()).toBe(5);
        });
    });
});
