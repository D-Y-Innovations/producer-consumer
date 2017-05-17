import { Model, Utils } from "./Model"

export { Model as ConsumersModel }

export class ScheduledProductionThread<JOB_TYPE>{

    private model : Model<JOB_TYPE>

    constructor(
        public productionFunc: (model: Model<JOB_TYPE>)=>Promise<void>,
        public consumerNum: number,
        public consumer: (job: JOB_TYPE)=>Promise<void>
    ){
        this.model = new Model<JOB_TYPE>(consumerNum, consumer)
    }

    async run(interval_millis=1000){
        while (this.model.isRunning){
            await this.productionFunc(this.model)
            await Utils.sleep(1000)
        }
    }

    close(){
        this.model.shutdown()
    }

}