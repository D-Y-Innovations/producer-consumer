import { Model, Utils } from "./Model"


console.log("build")

const m = new Model(100, async (job: number, thread_id: number) => {
    console.log("hi", {job, thread_id})
    await Utils.sleep(1000)
})

for (var i=0; i<1000; i++){
    m.addJob(i)
}