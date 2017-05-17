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
const Model_1 = require("./Model");
class ScheduledProductionThread {
    constructor(productionFunc, consumerNum, consumer) {
        this.productionFunc = productionFunc;
        this.consumerNum = consumerNum;
        this.consumer = consumer;
        this.model = new Model_1.Model(consumerNum, consumer);
    }
    run(interval_millis = 1000) {
        return __awaiter(this, void 0, void 0, function* () {
            while (this.model.isRunning) {
                yield this.productionFunc(this.model);
                yield Model_1.Utils.sleep(1000);
            }
        });
    }
    close() {
        this.model.shutdown();
    }
}
exports.ScheduledProductionThread = ScheduledProductionThread;
