"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class _Model {
    constructor() {
        this.queue = [];
        this.idle = [];
    }
    addJob(job) {
        return __awaiter(this, void 0, void 0, function* () {
            this.queue.push(job);
            const t = this.idle.shift();
            if (t !== undefined)
                yield t();
        });
    }
}
class Model extends _Model {
    static build(consumer_number, consumer_function) {
        const model = new Model();
        for (let thread_idx = 0; thread_idx < consumer_number; ++thread_idx) {
            let thread = () => __awaiter(this, void 0, void 0, function* () {
                while (true) {
                    const job = model.queue.shift();
                    if (job === undefined) {
                        model.idle.push(thread);
                        break;
                    }
                    yield consumer_function(job, thread_idx);
                }
            });
            model.idle.push(thread);
        }
        return model;
    }
    static buildFuncModel(consumer_number) {
        return Model.build(consumer_number, (job, thread_idx) => job(thread_idx));
    }
}
exports.Model = Model;
class Utils {
    static sleep(timeout) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                setTimeout(() => {
                    resolve();
                }, timeout);
            });
        });
    }
}
exports.Utils = Utils;
