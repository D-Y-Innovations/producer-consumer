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
console.log("build");
const m = new Model_1.Model(100, (job, thread_id) => __awaiter(this, void 0, void 0, function* () {
    console.log("hi", { job, thread_id });
    yield Model_1.Utils.sleep(1000);
}));
for (var i = 0; i < 1000; i++) {
    m.addJob(i);
}
