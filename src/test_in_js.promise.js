const Model = require("./Model").Model
const Utils = require("./Model").Utils

const co = require("co")

const m = new Model(100, (job, thread_id) =>
    new Promise((resolve, reject) => {
        console.log("hi", {job, thread_id})
        Utils.sleep(1000).then(resolve).catch(reject)
    })
)

for (var i=0; i<1000; i++){
    m.addJob(i)
}