import { Model, Utils } from "./Model"

export { Model as ConsumersModel }
export { Utils as Utils }

export class ScheduledProductionThread<JOB_TYPE>{

    private model : Model<JOB_TYPE>

    constructor(
        public productionFunc: (model: Model<JOB_TYPE>)=>Promise<void>,
        public consumerNum: number,
        public consumer: (job: JOB_TYPE)=>Promise<void>
    ){
        this.model = new Model<JOB_TYPE>(consumerNum, consumer)
    }

    async start(interval_millis=1000){
        while (this.model.isRunning){
            try{
                await this.productionFunc(this.model)
            } catch (err) {
                console.error(err)
            }
            await Utils.sleep(interval_millis)
        }
    }

    stop(){
        this.model.shutdown()
    }

}

export class Scheduler{

    public isRunning = true
    constructor(private func: ()=>Promise<void>){}

    async start(interval_millis = 1000){
        while (this.isRunning){
            try {
                await this.func()
            } catch(err){
                console.error(err)
            }
            await Utils.sleep(interval_millis)
        }
    }

    stop(){
        this.isRunning = false
    }

    static start(func: ()=>Promise<void>, interval_millis = 1000){
        const s = new Scheduler(func)
        s.start()
        return s
    }
}
