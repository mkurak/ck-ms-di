import { Service } from '../src/decorators/Service';
import ServiceContainer from '../src/ServiceContainer';

describe('ServiceContainer', () => {
    afterAll(() => {
        ServiceContainer.clear();
    });

    describe('Singleton servis testleri.', () => {
        test('Singleton servis eklenebilmeli ve ismiyle çekilebilmeli.', () => {
            // Arrange
            @Service({ lifecycle: 'singleton' })
            class TestService_eP66MAYRg27K {
                public test() {
                    return 'test';
                }
            }

            // Act
            const service = ServiceContainer.resolve<TestService_eP66MAYRg27K>('TestService_eP66MAYRg27K');

            // Assert
            expect(service.test()).toBe('test');
        });

        test('Singleton servis eklenebilmeli ve tipiyle çekilebilmeli.', () => {
            // Arrange
            @Service({ lifecycle: 'singleton' })
            class TestService_DPefktwcJbvr {
                public test() {
                    return 'test';
                }
            }

            // Act
            const service = ServiceContainer.resolve<TestService_DPefktwcJbvr>(TestService_DPefktwcJbvr);

            // Assert
            expect(service.test()).toBe('test');
        });

        test('Singleton servis eklenebilmeli, ismiyle çekilebilmeli ve her çağrımda aynı referansı dönmeli.', () => {
            // Arrange
            @Service({ lifecycle: 'singleton' })
            class TestService_7FKRGTMSk923 {
                public test() {
                    return 'test';
                }
            }

            // Act
            const service1 = ServiceContainer.resolve<TestService_7FKRGTMSk923>('TestService_7FKRGTMSk923');
            const service2 = ServiceContainer.resolve<TestService_7FKRGTMSk923>('TestService_7FKRGTMSk923');

            // Assert
            expect(service1).toBe(service2);
        });

        test('Singleton servis eklenebilmeli, tipiyle çekilebilmeli ve her çağrımda aynı referansı dönmeli.', () => {
            // Arrange
            @Service({ lifecycle: 'singleton' })
            class TestService_SUdeg3RuGS76 {
                public test() {
                    return 'test';
                }
            }

            // Act
            const service1 = ServiceContainer.resolve<TestService_SUdeg3RuGS76>(TestService_SUdeg3RuGS76);
            const service2 = ServiceContainer.resolve<TestService_SUdeg3RuGS76>(TestService_SUdeg3RuGS76);

            // Assert
            expect(service1).toBe(service2);
        });

        test('İsim verilerek singleton servis eklenebilmeli ve eklendiği ismiyle çekilebilmeli.', () => {
            // Arrange
            @Service({ name: 'W9cdpHV5Ecfx', lifecycle: 'singleton' })
            class TestService_W9cdpHV5Ecfx {
                public test() {
                    return 'test';
                }
            }

            // Act
            const service = ServiceContainer.resolve<TestService_W9cdpHV5Ecfx>('W9cdpHV5Ecfx');

            // Assert
            expect(service.test()).toBe('test');
        });

        test('Başka servisleri inject eden singleton servis eklenebilmeli: Singleton bir servis.', () => {
            // Arrange
            @Service({ lifecycle: 'singleton' })
            class TestService_9fzZbAG3nHab {
                public test() {
                    return 'test';
                }
            }

            @Service({ lifecycle: 'singleton' })
            class TestService_B4jr5YCQn6t3 {
                constructor(private testService: TestService_9fzZbAG3nHab) {}

                public test() {
                    return this.testService.test();
                }
            }

            // Act
            const service = ServiceContainer.resolve<TestService_B4jr5YCQn6t3>(TestService_B4jr5YCQn6t3);

            // Assert
            expect(service.test()).toBe('test');
        });

        test('Başka servisleri inject eden singleton servis eklenebilmeli: İki aynı servisin inject edilmesi', () => {
            // Arrange
            @Service({ lifecycle: 'singleton' })
            class TestService_WJVeSTZbKuq7 {
                public test() {
                    return 'test';
                }
            }

            @Service({ lifecycle: 'singleton' })
            class TestService_3f5rYHb4jG5t2 {
                constructor(private testService1: TestService_WJVeSTZbKuq7, private testService2: TestService_WJVeSTZbKuq7) {}

                public test1() {
                    return this.testService1.test();
                }

                public test2() {
                    return this.testService2.test();
                }
            }

            // Act
            const service = ServiceContainer.resolve<TestService_3f5rYHb4jG5t2>(TestService_3f5rYHb4jG5t2);

            // Assert
            expect(service.test1()).toBe('test');
            expect(service.test2()).toBe('test');
        });

        test('Başka servisleri inject eden singleton servis eklenebilmeli: İki aynı servisin inject edilmesi ve her ikisinin de aynı referans olması.', () => {
            // Arrange
            @Service({ lifecycle: 'singleton' })
            class TestService_Bk3SdD6NkQ4U {
                public test() {
                    return 'test';
                }
            }

            @Service({ lifecycle: 'singleton' })
            class TestService_Sd7TTnPvMuTT {
                constructor(private testService1: TestService_Bk3SdD6NkQ4U, private testService2: TestService_Bk3SdD6NkQ4U) {}

                public test1() {
                    return this.testService1.test();
                }

                public test2() {
                    return this.testService2.test();
                }

                public get service1() {
                    return this.testService1;
                }

                public get service2() {
                    return this.testService2;
                }
            }

            // Act
            const service = ServiceContainer.resolve<TestService_Sd7TTnPvMuTT>(TestService_Sd7TTnPvMuTT);

            // Assert
            expect(service.service1).toBe(service.service2);
            expect(service.test1()).toBe('test');
            expect(service.test2()).toBe('test');
        });

        test('Scoped bir servisi inject eden bir singleton servis eklenemeli.', () => {
            // Arrange
            @Service({ lifecycle: 'scoped' })
            class TestService_3wSssXnr8ZbG {
                constructor() {}

                public test() {
                    return 'test';
                }
            }

            // Act

            // Assert
            expect(() => {
                @Service({ lifecycle: 'singleton' })
                class TestService_tXnMT53YQBC6 {
                    constructor(private testService: TestService_3wSssXnr8ZbG) {}

                    public test() {
                        return this.testService.test();
                    }
                }
            }).toThrow('Service with name TestService_3wSssXnr8ZbG is scoped and cannot be injected into a singleton service');
        });

        test('Transient ve singleton servislerin aynı anda inject edilmesi', () => {
            // Arrange
            @Service({ lifecycle: 'transient' })
            class TestService_HNAuX8nxSUwB {
                constructor() {}

                public test() {
                    return 'test for transient';
                }
            }

            @Service({ lifecycle: 'singleton' })
            class TestService_TxL4WkhtxCZ8 {
                constructor() {}

                public test() {
                    return 'test for singleton';
                }
            }

            @Service({ lifecycle: 'singleton' })
            class TestService_W32HcpB8bDHE {
                constructor(private transientService: TestService_HNAuX8nxSUwB, private singletonService: TestService_TxL4WkhtxCZ8) {}

                public test() {
                    return {
                        transientServiceAnswer: this.transientService.test(),
                        singletonServiceAnswer: this.singletonService.test(),
                    };
                }
            }

            // Act
            const service = ServiceContainer.resolve<TestService_W32HcpB8bDHE>(TestService_W32HcpB8bDHE);
            const answer = service.test();

            // Assert
            expect(answer).not.toBeNull();
            expect(answer.transientServiceAnswer).toBe('test for transient');
            expect(answer.singletonServiceAnswer).toBe('test for singleton');
        });

        test('Servis olmayan bir parametre kullanılamaz.', () => {
            // Arrange
            @Service({ lifecycle: 'transient' })
            class TestService_5qcmAFeFv5f6V {
                constructor() {}

                public test() {
                    return 'test for transient';
                }
            }

            @Service({ lifecycle: 'singleton' })
            class TestService_Yg6FPVcJpuh6 {
                constructor() {}

                public test() {
                    return 'test for singleton';
                }
            }

            // Act

            // Assert
            expect(() => {
                @Service({ lifecycle: 'singleton' })
                class TestService_nTfNHUGVQLfZ {
                    constructor(private transientService: TestService_5qcmAFeFv5f6V, private singletonService: TestService_Yg6FPVcJpuh6, private stringParameter: string) {}

                    public test() {
                        return {
                            transientServiceAnswer: this.transientService.test(),
                            singletonServiceAnswer: this.singletonService,
                        };
                    }
                }
            }).toThrow('Dependency with type String does not exist for service TestService_nTfNHUGVQLfZ');
        });
    });

    describe('Transient servis testleri.', () => {
        test('Transient servis eklenebilmeli ve ismiyle çekilebilmeli.', () => {
            // Arrange
            @Service()
            class TestService_uESBCvxbUgPT {
                public test() {
                    return 'test';
                }
            }

            // Act
            const service = ServiceContainer.resolve<TestService_uESBCvxbUgPT>('TestService_uESBCvxbUgPT');

            // Assert
            expect(service.test()).toBe('test');
        });

        test('İsim verilerek eklenen transient servis, verilen isimle çağrılabilmeli.', () => {
            // Arrange
            @Service({ name: '39WvJ4Yj74gg' })
            class TestService_39WvJ4Yj74gg {
                public test() {
                    return 'test';
                }
            }

            // Act
            const service = ServiceContainer.resolve<TestService_39WvJ4Yj74gg>('39WvJ4Yj74gg');

            // Assert
            expect(service.test()).toBe('test');
        });

        test('Bir transient servisin iki kere inject edilmesinde her iki servis de farklı referans olmalı.', () => {
            // Arrange
            @Service()
            class TestService_8DEEUXRZPRsz {
                public test() {
                    return 'test';
                }
            }

            // Act
            const service1 = ServiceContainer.resolve<TestService_8DEEUXRZPRsz>('TestService_8DEEUXRZPRsz');
            const service2 = ServiceContainer.resolve<TestService_8DEEUXRZPRsz>('TestService_8DEEUXRZPRsz');

            // Assert
            expect(service1).not.toBe(service2);
        });

        test('Bir transient servisin iki kere inject edilmesinde her iki servis de farklı referans olmalı. (tip adıyla çekerek)', () => {
            // Arrange
            @Service()
            class TestService_kfCFC5MLSAZb {
                public test() {
                    return 'test';
                }
            }

            // Act
            const service1 = ServiceContainer.resolve<TestService_kfCFC5MLSAZb>(TestService_kfCFC5MLSAZb);
            const service2 = ServiceContainer.resolve<TestService_kfCFC5MLSAZb>(TestService_kfCFC5MLSAZb);

            // Assert
            expect(service1).not.toBe(service2);
        });

        test('Transient servisler singleton servislere bağımlı olabilir.', () => {
            // Arrange
            @Service({ lifecycle: 'singleton' })
            class TestService_8j4jyj6j5j6 {
                public test() {
                    return 'test';
                }
            }

            @Service()
            class TestService_5j5j5j5j5j5 {
                constructor(private singletonService: TestService_8j4jyj6j5j6) {}

                public test() {
                    return this.singletonService.test();
                }
            }

            // Act
            const service = ServiceContainer.resolve<TestService_5j5j5j5j5j5>(TestService_5j5j5j5j5j5);

            // Assert
            expect(service.test()).toBe('test');
        });

        test('Transient servisler singleton servislere bağımlı olabilir. (iki servis)', () => {
            // Arrange
            @Service({ lifecycle: 'singleton' })
            class TestService_ftgbzLxS54Jx {
                public test() {
                    return 'test';
                }
            }

            @Service({ lifecycle: 'singleton' })
            class TestService_7jdwpZmnrk7c {
                public test() {
                    return 'test';
                }
            }

            @Service()
            class TestService_uAkqRgPLFxce {
                constructor(private singletonService: TestService_ftgbzLxS54Jx, private singletonService2: TestService_7jdwpZmnrk7c) {}

                public test() {
                    return {
                        singletonServiceAnswer: this.singletonService.test(),
                        singletonService2Answer: this.singletonService2.test(),
                    };
                }
            }

            // Act
            const service = ServiceContainer.resolve<TestService_uAkqRgPLFxce>(TestService_uAkqRgPLFxce);

            // Assert
            expect(service.test().singletonServiceAnswer).toBe('test');
            expect(service.test().singletonService2Answer).toBe('test');
        });

        test('Transient servisler transient servislere bağımlı olabilir.', () => {
            // Arrange
            @Service()
            class TestService_JF476VsA7hgt {
                public test() {
                    return 'test';
                }
            }

            @Service()
            class TestService_jz4cvVXRhEwZ {
                constructor(private transientService: TestService_JF476VsA7hgt) {}

                public test() {
                    return this.transientService.test();
                }
            }

            // Act
            const service = ServiceContainer.resolve<TestService_jz4cvVXRhEwZ>(TestService_jz4cvVXRhEwZ);

            // Assert
            expect(service.test()).toBe('test');
        });

        test('Transient servisler transient servislere bağımlı olabilir. (iki servis)', () => {
            // Arrange
            @Service()
            class TestService_wDuJgPnKpXvh {
                public test() {
                    return 'test';
                }
            }

            @Service()
            class TestService_UNgqJyxNyspJ {
                public test() {
                    return 'test';
                }
            }

            @Service()
            class TestService_hS6pSPuaPCHF {
                constructor(private transientService: TestService_wDuJgPnKpXvh, private transientService2: TestService_UNgqJyxNyspJ) {}

                public test() {
                    return {
                        transientServiceAnswer: this.transientService.test(),
                        transientService2Answer: this.transientService2.test(),
                    };
                }
            }

            // Act
            const service = ServiceContainer.resolve<TestService_hS6pSPuaPCHF>(TestService_hS6pSPuaPCHF);

            // Assert
            expect(service.test().transientServiceAnswer).toBe('test');
            expect(service.test().transientService2Answer).toBe('test');
        });

        test('Transient servisler scoped servislere bağımlı olabilir.', () => {
            // Arrange
            @Service({ lifecycle: 'scoped' })
            class TestService_RAR3Pm4LXT82 {
                constructor() {}

                public test() {
                    return 'test for scoped';
                }
            }

            @Service()
            class TestService_M8GerMymmccJ {
                constructor(private scopedService: TestService_RAR3Pm4LXT82) {}

                public test() {
                    return this.scopedService.test();
                }
            }

            // Act
            const sessionId = ServiceContainer.beginSession();
            const service = ServiceContainer.resolve<TestService_M8GerMymmccJ>(TestService_M8GerMymmccJ, sessionId);
            const answer = service.test();
            ServiceContainer.endSession(sessionId);

            // Assert
            expect(answer).toBe('test for scoped');
        });
    });
});
