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
class Model {
    constructor(consumer_number, consumer_function) {
        this.consumer_number = consumer_number;
        this.queue = [];
        this.idle = [];
        this.isRunning = true;
        for (let thread_idx = 0; thread_idx < consumer_number; ++thread_idx) {
            let thread = () => __awaiter(this, void 0, void 0, function* () {
                try {
                    while (this.isRunning) {
                        const job = this.queue.shift();
                        if (job === undefined) {
                            break;
                        }
                        yield consumer_function(job, thread_idx);
                    }
                }
                finally {
                    this.idle.push(thread);
                }
            });
            this.idle.push(thread);
        }
    }
    shutdown() {
        this.isRunning = false;
    }
    addJob(job) {
        if (!this.isRunning) {
            return false;
        }
        this.queue.push(job);
        const t = this.idle.shift();
        if (t !== undefined)
            t();
        return true;
    }
    // default maximum_waiting_mills is undefined, means waiting forever
    waitUntilAllDone(maximum_waiting_mills = undefined, check_interval_mills = 100) {
        return __awaiter(this, void 0, void 0, function* () {
            const end = Date.now() + maximum_waiting_mills;
            while (this.idle.length < this.consumer_number) {
                if (Date.now() > end)
                    return false;
                yield Utils.sleep(check_interval_mills);
            }
            return true;
        });
    }
    build(consumer_number) {
        return new Model(consumer_number, (job, thread_idx) => job(thread_idx));
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
