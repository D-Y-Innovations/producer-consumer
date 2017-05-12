type Runnable = () => Promise<void>
type RunnableWithThreadIndex = (i: number) => Promise<void>

class _Model<JOB_TYPE>{
    queue: Array<JOB_TYPE> = []
    idle: Array<Runnable> = []

    async addJob(job: JOB_TYPE){
        this.queue.push(job)
        const t = this.idle.shift()
        if (t !== undefined) await t()
    }
}

export class Model<JOB_TYPE> extends _Model<JOB_TYPE>{

    static build<JOB_TYPE>(
        consumer_number: number,
        consumer_function: (job: JOB_TYPE, thread_idx: number)=>Promise<void>){

        const model = new Model<JOB_TYPE>()
        for (let thread_idx=0; thread_idx<consumer_number; ++thread_idx){
            let thread = async () => {
                while (true) {
                    const job = model.queue.shift()
                    if (job === undefined) {
                        model.idle.push(thread)
                        break
                    }
                    await consumer_function(job, thread_idx)
                }
            }
            model.idle.push(thread)
        }
        return model
    }

    static buildFuncModel(consumer_number: number){

        return Model.build<RunnableWithThreadIndex>(
            consumer_number,
            (job: RunnableWithThreadIndex, thread_idx: number) => job(thread_idx)
        )
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

