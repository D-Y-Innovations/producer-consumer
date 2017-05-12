const Model = require("./Model").Model

const co = require("co")

const m = Model.build(100, (job, thread_id) => co(function *(){
    console.log("hi", {job, thread_id})
    yield Model.sleep(1000)
}))

for (var i=0; i<1000; i++){
    m.addJob(i)
}