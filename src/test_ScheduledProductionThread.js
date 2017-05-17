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
const Patterns_1 = require("./Patterns");
const c = new Patterns_1.ScheduledProductionThread((model) => __awaiter(this, void 0, void 0, function* () {
    for (let i = 0; i < 100; ++i) {
        model.addJob(i);
    }
}), 3, (job) => __awaiter(this, void 0, void 0, function* () {
    console.log("ScheduledProductionThread ", job);
    yield Model_1.Utils.sleep(1000);
}));
c.run().then(() => {
    console.log("Closed");
});
setTimeout(() => {
    c.close();
}, 5000);
