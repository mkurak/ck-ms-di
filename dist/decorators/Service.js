"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = Service;
const ServiceContainer_1 = __importDefault(require("../ServiceContainer"));
/**
 * A class decorator function that registers a class as a service.
 *
 * @param {ServiceOptions} [options] - Optional configuration for the service.
 * @returns {ClassDecorator} - A decorator that registers the class as a service.
 */
function Service(options) {
    return function (target) {
        if (!options) {
            options = {};
        }
        if (!options.name) {
            options.name = target.name;
        }
        if (!options.lifecycle) {
            options.lifecycle = 'transient';
        }
        ServiceContainer_1.default.register(options.name, target, options.lifecycle);
    };
}
//# sourceMappingURL=Service.js.map