type Runnable = () => Promise<void>
type RunnableWithThreadIndex = (i: number) => Promise<void>

export class Model<JOB_TYPE>{
    queue: Array<JOB_TYPE> = []
    idle: Array<Runnable> = []

    constructor(
        consumer_number: number,
        consumer_function: (job: JOB_TYPE, thread_idx: number)=>Promise<void>
    ){
        for (let thread_idx=0; thread_idx<consumer_number; ++thread_idx){
            let thread = async () => {
                while (true) {
                    const job = this.queue.shift()
                    if (job === undefined) {
                        this.idle.push(thread)
                        break
                    }
                    await consumer_function(job, thread_idx)
                }
            }
            this.idle.push(thread)
        }
    }

    async addJob(job: JOB_TYPE){
        this.queue.push(job)
        const t = this.idle.shift()
        if (t !== undefined) await t()
    }

    build(consumer_number: number){
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

