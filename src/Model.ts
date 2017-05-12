
class Thread{
    constructor(private runnable: ()=>Promise<boolean>){}

    async run(){
        while (await this.runnable()){}
    }
}

export class Model{

    queue: Array<any> = []
    idle: Array<Thread> = []

    constructor(){}

    static async sleep(timeout){
        return new Promise(function(resolve, reject){
            setTimeout(()=>{
                resolve()
            }, timeout)
        })
    }

    static build(consumer_number, consumer_function){
        const model = new Model()
        for (let i=0; i<consumer_number; ++i){
            let thread = new Thread(async () => {
                const job = model.queue.shift()
                if (job === undefined) {
                    model.idle.push(thread)
                    return false
                }
                await consumer_function(job, i)
                return true
            })
            model.idle.push(thread)
        }
        return model
    }

    async addJob(job){
        this.queue.push(job)
        const t = this.idle.shift()
        if (t !== undefined) await t.run()
    }

}

