import { Service } from '../src/decorators/Service';
import { ServiceContainer } from '../src/ServiceContainer';

describe('ServiceContainer', () => {
    const services: ServiceContainer = ServiceContainer.getInstance();

    afterAll(() => {
        services.clear();
    });

    describe('Singleton service tests.', () => {
        test('Singleton service should be added and retrieved by name.', () => {
            // Arrange
            @Service({ lifecycle: 'singleton' })
            class TestService_eP66MAYRg27K {
                public test() {
                    return 'test';
                }
            }

            // Act
            const service = services.resolve<TestService_eP66MAYRg27K>('TestService_eP66MAYRg27K');

            // Assert
            expect(service.test()).toBe('test');
        });

        test('Singleton service should be added and retrieved by type.', () => {
            // Arrange
            @Service({ lifecycle: 'singleton' })
            class TestService_DPefktwcJbvr {
                public test() {
                    return 'test';
                }
            }

            // Act
            const service = services.resolve<TestService_DPefktwcJbvr>(TestService_DPefktwcJbvr);

            // Assert
            expect(service.test()).toBe('test');
        });

        test('Singleton service should be added, retrieved by name, and return the same reference on each call.', () => {
            // Arrange
            @Service({ lifecycle: 'singleton' })
            class TestService_7FKRGTMSk923 {
                public test() {
                    return 'test';
                }
            }

            // Act
            const service1 = services.resolve<TestService_7FKRGTMSk923>('TestService_7FKRGTMSk923');
            const service2 = services.resolve<TestService_7FKRGTMSk923>('TestService_7FKRGTMSk923');

            // Assert
            expect(service1).toBe(service2);
        });

        test('Singleton service should be added, retrieved by type, and return the same reference on each call.', () => {
            // Arrange
            @Service({ lifecycle: 'singleton' })
            class TestService_SUdeg3RuGS76 {
                public test() {
                    return 'test';
                }
            }

            // Act
            const service1 = services.resolve<TestService_SUdeg3RuGS76>(TestService_SUdeg3RuGS76);
            const service2 = services.resolve<TestService_SUdeg3RuGS76>(TestService_SUdeg3RuGS76);

            // Assert
            expect(service1).toBe(service2);
        });

        test('Singleton service should be added with a given name and retrieved by that name.', () => {
            // Arrange
            @Service({ name: 'W9cdpHV5Ecfx', lifecycle: 'singleton' })
            class TestService_W9cdpHV5Ecfx {
                public test() {
                    return 'test';
                }
            }

            // Act
            const service = services.resolve<TestService_W9cdpHV5Ecfx>('W9cdpHV5Ecfx');

            // Assert
            expect(service.test()).toBe('test');
        });

        test('Singleton service that injects another singleton service should be added.', () => {
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
            const service = services.resolve<TestService_B4jr5YCQn6t3>(TestService_B4jr5YCQn6t3);

            // Assert
            expect(service.test()).toBe('test');
        });

        test('Singleton service that injects two of the same singleton service should be added.', () => {
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
            const service = services.resolve<TestService_3f5rYHb4jG5t2>(TestService_3f5rYHb4jG5t2);

            // Assert
            expect(service.test1()).toBe('test');
            expect(service.test2()).toBe('test');
        });

        test('Singleton service that injects two of the same singleton service should be added and both should have the same reference.', () => {
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
            const service = services.resolve<TestService_Sd7TTnPvMuTT>(TestService_Sd7TTnPvMuTT);

            // Assert
            expect(service.service1).toBe(service.service2);
            expect(service.test1()).toBe('test');
            expect(service.test2()).toBe('test');
        });

        test('Singleton service should not inject a scoped service.', () => {
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

        test('Singleton service should inject both transient and singleton services.', () => {
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
            const service = services.resolve<TestService_W32HcpB8bDHE>(TestService_W32HcpB8bDHE);
            const answer = service.test();

            // Assert
            expect(answer).not.toBeNull();
            expect(answer.transientServiceAnswer).toBe('test for transient');
            expect(answer.singletonServiceAnswer).toBe('test for singleton');
        });

        test('Non-service parameters should not be used.', () => {
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

    describe('Transient service tests.', () => {
        test('Transient service should be added and retrieved by name.', () => {
            // Arrange
            @Service()
            class TestService_uESBCvxbUgPT {
                public test() {
                    return 'test';
                }
            }

            // Act
            const service = services.resolve<TestService_uESBCvxbUgPT>('TestService_uESBCvxbUgPT');

            // Assert
            expect(service.test()).toBe('test');
        });

        test('Transient service added with a given name should be retrieved by that name.', () => {
            // Arrange
            @Service({ name: '39WvJ4Yj74gg' })
            class TestService_39WvJ4Yj74gg {
                public test() {
                    return 'test';
                }
            }

            // Act
            const service = services.resolve<TestService_39WvJ4Yj74gg>('39WvJ4Yj74gg');

            // Assert
            expect(service.test()).toBe('test');
        });

        test('Injecting a transient service twice should result in different references.', () => {
            // Arrange
            @Service()
            class TestService_8DEEUXRZPRsz {
                public test() {
                    return 'test';
                }
            }

            // Act
            const service1 = services.resolve<TestService_8DEEUXRZPRsz>('TestService_8DEEUXRZPRsz');
            const service2 = services.resolve<TestService_8DEEUXRZPRsz>('TestService_8DEEUXRZPRsz');

            // Assert
            expect(service1).not.toBe(service2);
        });

        test('Injecting a transient service twice by type should result in different references.', () => {
            // Arrange
            @Service()
            class TestService_kfCFC5MLSAZb {
                public test() {
                    return 'test';
                }
            }

            // Act
            const service1 = services.resolve<TestService_kfCFC5MLSAZb>(TestService_kfCFC5MLSAZb);
            const service2 = services.resolve<TestService_kfCFC5MLSAZb>(TestService_kfCFC5MLSAZb);

            // Assert
            expect(service1).not.toBe(service2);
        });

        test('Transient services can depend on singleton services.', () => {
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
            const service = services.resolve<TestService_5j5j5j5j5j5>(TestService_5j5j5j5j5j5);

            // Assert
            expect(service.test()).toBe('test');
        });

        test('Transient services can depend on multiple singleton services.', () => {
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
            const service = services.resolve<TestService_uAkqRgPLFxce>(TestService_uAkqRgPLFxce);

            // Assert
            expect(service.test().singletonServiceAnswer).toBe('test');
            expect(service.test().singletonService2Answer).toBe('test');
        });

        test('Transient services can depend on other transient services.', () => {
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
            const service = services.resolve<TestService_jz4cvVXRhEwZ>(TestService_jz4cvVXRhEwZ);

            // Assert
            expect(service.test()).toBe('test');
        });

        test('Transient services can depend on multiple transient services.', () => {
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
            const service = services.resolve<TestService_hS6pSPuaPCHF>(TestService_hS6pSPuaPCHF);

            // Assert
            expect(service.test().transientServiceAnswer).toBe('test');
            expect(service.test().transientService2Answer).toBe('test');
        });

        test('Transient services can depend on scoped services.', () => {
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
            const sessionId = services.beginSession();
            const service = services.resolve<TestService_M8GerMymmccJ>(TestService_M8GerMymmccJ, sessionId);
            const answer = service.test();
            services.endSession(sessionId);

            // Assert
            expect(answer).toBe('test for scoped');
        });
    });

    describe('Scoped service tests.', () => {
        test('Scoped service should be added and retrieved by name.', () => {
            // Arrange
            @Service({ lifecycle: 'scoped' })
            class TestService_2Jr7dDx5Jr7d {
                constructor() {}

                public test() {
                    return 'test';
                }
            }

            // Act
            const sessionId = services.beginSession();
            const service = services.resolve<TestService_2Jr7dDx5Jr7d>('TestService_2Jr7dDx5Jr7d', sessionId);
            const answer = service.test();
            services.endSession(sessionId);

            // Assert
            expect(answer).toBe('test');
        });

        test('Scoped service cannot be created with the same name in multiple sessions, as all service definitions are kept in a single pool.', () => {
            // Arrange
            @Service({ lifecycle: 'scoped' })
            class TestService_3Jr7dDx5Jr7d {
                constructor() {}

                public test() {
                    return 'test';
                }
            }

            // Act
            const sessionId1 = services.beginSession();
            const service1 = services.resolve<TestService_3Jr7dDx5Jr7d>('TestService_3Jr7dDx5Jr7d', sessionId1);

            const sessionId2 = services.beginSession();
            const service2 = services.resolve<TestService_3Jr7dDx5Jr7d>('TestService_3Jr7dDx5Jr7d', sessionId2);

            // Assert
            expect(() => {
                service1.test();
            }).not.toThrow();

            expect(() => {
                service2.test();
            }).not.toThrow();

            services.endSession(sessionId1);
            services.endSession(sessionId2);
        });

        test('Scoped service can be used in multiple sessions and each should have different references.', () => {
            // Arrange
            @Service({ lifecycle: 'scoped' })
            class TestService_4Jr7dDx5Jr7d {
                constructor() {}

                public test() {
                    return 'test';
                }
            }

            // Act
            const sessionId1 = services.beginSession();
            const service1 = services.resolve<TestService_4Jr7dDx5Jr7d>('TestService_4Jr7dDx5Jr7d', sessionId1);

            const sessionId2 = services.beginSession();
            const service2 = services.resolve<TestService_4Jr7dDx5Jr7d>('TestService_4Jr7dDx5Jr7d', sessionId2);

            // Assert
            expect(service1).not.toBe(service2);

            services.endSession(sessionId1);
            services.endSession(sessionId2);
        });

        test('Scoped service can depend on singleton services.', () => {
            // Arrange
            @Service({ lifecycle: 'singleton' })
            class TestService_NyZMzV4dR3UC {
                public test() {
                    return 'test';
                }
            }

            @Service({ lifecycle: 'scoped' })
            class TestService_J9sAbmPaNWn6 {
                constructor(private singletonService: TestService_NyZMzV4dR3UC) {}

                public test() {
                    return this.singletonService.test();
                }
            }

            // Act
            const sessionId = services.beginSession();
            const service = services.resolve<TestService_J9sAbmPaNWn6>(TestService_J9sAbmPaNWn6, sessionId);

            // Assert
            expect(service.test()).toBe('test');

            services.endSession(sessionId);
        });

        test('Scoped services in multiple sessions should have different references when they depend on transient services.', () => {
            // Arrange
            @Service({ lifecycle: 'transient' })
            class TestService_3Hj7dDx5Jr7d {
                public test() {
                    return 'test';
                }
            }

            @Service({ lifecycle: 'scoped' })
            class TestService_3Jj7dDx5Jr7d {
                constructor(private transientService: TestService_3Hj7dDx5Jr7d) {}

                public test() {
                    return this.transientService.test();
                }
            }

            // Act
            const sessionId1 = services.beginSession();
            const service1 = services.resolve<TestService_3Jj7dDx5Jr7d>(TestService_3Jj7dDx5Jr7d, sessionId1);

            const sessionId2 = services.beginSession();
            const service2 = services.resolve<TestService_3Jj7dDx5Jr7d>(TestService_3Jj7dDx5Jr7d, sessionId2);

            // Assert
            expect(service1).not.toBe(service2);

            services.endSession(sessionId1);
            services.endSession(sessionId2);
        });

        test('An error should be thrown if a scoped service is resolved without specifying a sessionId.', () => {
            // Arrange
            @Service({ lifecycle: 'scoped' })
            class TestService_fqyjnDU2GpvV {
                constructor() {}

                public test() {
                    return 'test';
                }
            }

            // Act
            // Assert
            expect(() => {
                services.resolve<TestService_fqyjnDU2GpvV>('TestService_fqyjnDU2GpvV');
            }).toThrow('Service with name TestService_fqyjnDU2GpvV is scoped and requires a session ID for resolution');
        });
    });

    test('Servis ServiceContainer sınıfına bağımlıysa, güncel instance kendisine verilir.', () => {
        // Arrange
        @Service()
        class TestService_n3TZhF8PLp7J {
            constructor() {}

            public test() {
                return 'test: TestService_n3TZhF8PLp7J';
            }
        }

        @Service()
        class TestService_Yfcnjg7rMnLp {
            constructor(private serviceContainer: ServiceContainer) {}

            public test() {
                const service = this.serviceContainer.resolve<TestService_n3TZhF8PLp7J>(TestService_n3TZhF8PLp7J);
                const result = service.test();
                return result;
            }
        }

        // Act
        const service = services.resolve<TestService_Yfcnjg7rMnLp>(TestService_Yfcnjg7rMnLp);

        // Assert
        expect(service.test()).toEqual('test: TestService_n3TZhF8PLp7J');
    });
});
