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
class Thread {
    constructor(runnable) {
        this.runnable = runnable;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            while (yield this.runnable()) { }
        });
    }
}
class Model {
    constructor() {
        this.queue = [];
        this.idle = [];
    }
    static sleep(timeout) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                setTimeout(() => {
                    resolve();
                }, timeout);
            });
        });
    }
    static build(consumer_number, consumer_function) {
        const model = new Model();
        for (let i = 0; i < consumer_number; ++i) {
            let thread = new Thread(() => __awaiter(this, void 0, void 0, function* () {
                const job = model.queue.shift();
                if (job === undefined) {
                    model.idle.push(thread);
                    return false;
                }
                yield consumer_function(job, i);
                return true;
            }));
            model.idle.push(thread);
        }
        return model;
    }
    addJob(job) {
        return __awaiter(this, void 0, void 0, function* () {
            this.queue.push(job);
            const t = this.idle.shift();
            if (t !== undefined)
                yield t.run();
        });
    }
}
exports.Model = Model;
