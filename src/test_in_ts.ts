import { Model, Utils } from "./Model"


console.log("build")

const m = Model.build(100, async (job, thread_id) => {
    console.log("hi", {job, thread_id})
    await Utils.sleep(1000)
})

for (var i=0; i<1000; i++){
    m.addJob(i)
}