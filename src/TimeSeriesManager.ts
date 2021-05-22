import cron from 'node-cron';
import { getConnectionManager, Repository } from "typeorm";
import { TimeSeriesService } from "./services/entity/TimeSeriesService";

export class TimeSeriesManager {

    private timeSeriesService: Repository<TimeSeriesService>;

    constructor() {
        this.timeSeriesService = getConnectionManager().get().getRepository(TimeSeriesService);
    }

    public async init() {
        cron.schedule('* * * * *', () => {
            console.log('running a task every minute');
        });
    }
}