const Model = require("./Model")

const m = Model.build(100   , function *(job, id){
    console.log("hi", job, id)
    yield Model.sleep(100)
})

for (var i=0; i<1000; i++){
    m.addJob(i)
}