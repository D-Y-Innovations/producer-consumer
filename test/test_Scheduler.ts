import { Scheduler, Utils } from "../src/Patterns"

Scheduler.start(async ()=>{
    console.log("hello")
    await Utils.sleep(3000)
}, 1000)


