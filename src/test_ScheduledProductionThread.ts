import { Model, Utils } from "./Model"
import { ScheduledProductionThread } from "./Patterns"

const c = new ScheduledProductionThread<number>(
    async (model: Model<number>)=>{
        for (let i=0; i< 100; ++i){
            model.addJob(i)
        }
    },
    3,
    async (job: number)=>{
        console.log("ScheduledProductionThread ", job)
        await Utils.sleep(1000)
    })

c.run().then(()=>{
    console.log("Closed")
})

setTimeout(()=>{
    c.close()
}, 5000)