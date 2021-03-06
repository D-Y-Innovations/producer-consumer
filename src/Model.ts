type Runnable = () => Promise<void>
type RunnableWithThreadIndex = (i: number) => Promise<void>

export class Model<JOB_TYPE>{
    queue: Array<JOB_TYPE> = []
    idle: Array<Runnable> = []

    isRunning = true
    shutdown(){
        this.isRunning = false
    }

    constructor(
        public consumer_number: number,
        consumer_function: (job: JOB_TYPE, thread_idx: number)=>Promise<void>
    ){
        for (let thread_idx=0; thread_idx<consumer_number; ++thread_idx){
            let thread = async () => {
                try{
                    while (this.isRunning) {
                        const job = this.queue.shift()
                        if (job === undefined) {
                            break
                        }
                        try{
                            await consumer_function(job, thread_idx)
                        }catch(err){
                            console.error(err)
                        }
                    }
                } finally {
                    this.idle.push(thread)
                }
            }
            this.idle.push(thread)
        }
    }

    addJob(job: JOB_TYPE): boolean{
        if (! this.isRunning){
            return false
        }
        this.queue.push(job)
        const t = this.idle.shift()
        if (t !== undefined) t()
        return true
    }

    // default maximum_waiting_mills is undefined, means waiting forever
    async waitUntilAllDone(
        maximum_waiting_mills: number = undefined,
        check_interval_mills: number = 100){
        
        const end = Date.now() + maximum_waiting_mills
        while (this.idle.length < this.consumer_number){
            if (Date.now() > end) return false
            await Utils.sleep(check_interval_mills)
        }
        return true
    }

    static build(consumer_number: number){
        return new Model(
            consumer_number,
            (job: RunnableWithThreadIndex, thread_idx: number) => job(thread_idx))
    }
}

export class Utils{
    static async sleep(timeout: number){
        return new Promise(function(resolve, reject){
            setTimeout(()=>{
                resolve()
            }, timeout)
        })
    }
}

