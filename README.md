# producer-consumer

## Using Model Constructor and passing arguments as job into queue

```node
const Model = require("./Model")

const m = Model.build(100, function *(job, id){
    console.log("hi", job, id)
    yield Model.sleep(100)
})

for (var i=0; i<1000; i++){
    m.addJob(i)
}
```

## Using Model Build and passing function as job into queue

```node
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
```
