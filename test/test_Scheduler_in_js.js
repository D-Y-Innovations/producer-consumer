const Scheduler = require("../src/Patterns").Scheduler
const Utils = require("../src/Patterns").Utils

const co = require("co")

Scheduler.start(()=>co(function *() {
    console.log("hello")
    yield Utils.sleep(1000)
    console.log("123")
}), 1000)


