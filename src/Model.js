
class Thread{
    constructor(runnable){
        this.runnable = runnable
    }

    *run(){
        while (yield this.runnable()){}
    }
}

const co = require("co")

class Model{

    constructor(exceptionHandler){
        this.queue = []
        this.idle = []

        this.exceptionHandler = exceptionHandler
    }

    static *sleep(timeout){
        return new Promise(function(resolve, reject){
            setTimeout(()=>{
                resolve()
            }, timeout)
        })
    }

    static build(consumer_number, consumer_function, timeout=1000, exceptionHandler = console.log.bind(console)){
        const model = new Model(exceptionHandler)
        for (let i=0; i<consumer_number; ++i){
            let thread = new Thread(function *(){
                const job = model.queue.shift()
                if (job === undefined) { 
                    model.idle.push(thread)
                    return false
                }
                yield consumer_function(job, i)
                return true
            })
            model.idle.push(thread)
        }
        return model
    }

    stop(){
        for (var i in this.threads){
            const t = this.threads[i]
            t.isRunning = false
        }
    }

    addJob(job){
        this.queue.push(job)
        const t = this.idle.shift()
        // console.log("Fetch thread", t)
        if (t !== undefined) co(t.run(this.exceptionHandler))
    }

}

module.exports = Model
