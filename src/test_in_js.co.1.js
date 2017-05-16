const Model = require("./Model").Model
const Utils = require("./Model").Utils

const co = require("co")

const m = Model.build(100)

for (let i=0; i<1000; i++){
    m.addJob((job, thread_id) => co(function *(){
        console.log("hi", {job, i})
        yield Utils.sleep(1000)
    }))
}