import { $log } from "@tsed/common";
import { PlatformExpress } from "@tsed/platform-express";
import { Server } from "./Server";
import { TimeSeriesManager } from "./TimeSeriesManager";

async function bootstrap() {
  try {
    $log.debug("Start server...");
    const platform = await PlatformExpress.bootstrap(Server);

    await platform.listen();
    $log.debug("Server initialized");
  } catch (er) {
    $log.error(er);
  }
  const timeSeries: TimeSeriesManager = new TimeSeriesManager();
  timeSeries.init();
  $log.debug("Timeseries initialized");
}

bootstrap();
