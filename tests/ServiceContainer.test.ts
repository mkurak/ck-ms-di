import 'reflect-metadata';
import { ServiceOptions, Service, Lifecycle, ServiceContainer } from '../src';

describe('ServiceContainer Tests', () => {
    it("ServiceContainer instance'ına erişilebilir", () => {
        const container = ServiceContainer.getInstance();
        expect(container).toBeDefined();
    });

    it("ServiceContainer instance'ı singleton'dır", () => {
        const container1 = ServiceContainer.getInstance();
        const container2 = ServiceContainer.getInstance();
        expect(container1).toBe(container2);
    });

    it('Başlangıçta hiçbir servis tanımlı değildir', () => {
        const container = ServiceContainer.getInstance();
        expect(container.foundedServicesCount).toBe(0);
    });

    describe('Injection içermeyen servisler', () => {
        it('Singleton servis tanımlanabilir (string tipinde isim verilerek)', async () => {
            @Service({ lifecycle: 'singleton' })
            class dBRJBdWj9Bm2 {
                public value: number = 5;
            }

            const container = ServiceContainer.getInstance();

            const service = await container.resolveAsync<dBRJBdWj9Bm2>('dBRJBdWj9Bm2');

            expect(service).toBeDefined();
            expect(service?.value).toBe(5);
        });

        it('Singleton servis tanımlanabilir (tip verilerek)', async () => {
            @Service({ lifecycle: 'singleton' })
            class dBRJBdWj9Bm2 {
                public value: number = 5;
            }

            const container = ServiceContainer.getInstance();

            const service = await container.resolveAsync<dBRJBdWj9Bm2>(dBRJBdWj9Bm2);

            expect(service).toBeDefined();
            expect(service?.value).toBe(5);
        });

        it('Tanımlanan singleton servis çağrıldığında aynı instance döner', async () => {
            @Service({ lifecycle: 'singleton' })
            class tmjZvWgmySPe {
                public value: number = 5;
            }

            const container = ServiceContainer.getInstance();

            const service1 = await container.resolveAsync<tmjZvWgmySPe>('tmjZvWgmySPe');
            const service2 = await container.resolveAsync<tmjZvWgmySPe>('tmjZvWgmySPe');

            expect(service1).toBe(service2);
        });

        it('Transient servis tanımlanabilir (string tipinde isim verilerek)', async () => {
            @Service({ lifecycle: 'transient' })
            class e2hvPSqxRfaj {
                public value: number = 5;
            }

            const container = ServiceContainer.getInstance();

            const service = await container.resolveAsync<e2hvPSqxRfaj>('e2hvPSqxRfaj');

            expect(service).toBeDefined();
            expect(service?.value).toBe(5);
        });

        it('Transient servis tanımlanabilir (tip verilerek)', async () => {
            @Service({ lifecycle: 'transient' })
            class dNxNyZxBPXp9 {
                public value: number = 5;
            }

            const container = ServiceContainer.getInstance();

            const service = await container.resolveAsync<dNxNyZxBPXp9>(dNxNyZxBPXp9);

            expect(service).toBeDefined();
            expect(service?.value).toBe(5);
        });

        it("Tanımlanan transient servis çağrıldığında farklı instance'lar döner", async () => {
            @Service({ lifecycle: 'transient' })
            class VNhk7mM8QZpB {
                public value: number = 5;
            }

            const container = ServiceContainer.getInstance();

            const service1 = await container.resolveAsync<VNhk7mM8QZpB>('VNhk7mM8QZpB');
            const service2 = await container.resolveAsync<VNhk7mM8QZpB>('VNhk7mM8QZpB');

            expect(service1).not.toBe(service2);
        });

        it('Scoped servis tanımlanabilir (string tipinde isim verilerek)', async () => {
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

        it('Singleton tipinde eklenmiş bir servis session içerisinde bulunamaz', async () => {
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

        it('Transient tipinde eklenmiş bir servis session içerisinde bulunamaz', async () => {
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

    describe('Injection içeren servisler', () => {
        it('Injection içeren servisler tanımlanabilir', async () => {
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

        it("Singleton servis, scoped servis'i injection olarak alamaz", async () => {
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
