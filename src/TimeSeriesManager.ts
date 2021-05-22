import cron from 'node-cron';

export class TimeSeriesManager {

    public async init() {
        cron.schedule('* * * * *', () => {
            console.log('running a task every minute');
        });
    }
}