import {Configuration, Inject} from "@tsed/di";
import {PlatformApplication} from "@tsed/common";
import "@tsed/platform-express"; // /!\ keep this import
import bodyParser from "body-parser";
import compress from "compression";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import cors from "cors";
import "@tsed/ajv";
import "@tsed/swagger";
import "@tsed/typeorm";
import {config, rootDir} from "./config";
import{ config as env} from "./config/env";
import {IndexCtrl} from "./controllers/pages/IndexController";
import session from "express-session";
import { User } from "./models/entity/User";

@Configuration({
  ...config,
  acceptMimes: ["application/json"],
  httpPort: process.env.PORT || 8083,
  httpsPort: false, // CHANGE
  componentsScan: [
    `${rootDir}/services/**/*.ts`,
    `${rootDir}/protocols/**/*.ts`
  ],
  mount: {
    "/rest": [
      `${rootDir}/controllers/**/*.ts`
    ],
    "/": [IndexCtrl]
  },
  swagger: [
    {
      path: "/v2/docs",
      specVersion: "2.0"
    },
    {
      path: "/v3/docs",
      specVersion: "3.0.1"
    }
  ],
  exclude: [
    "**/*.spec.ts"
  ],
  passport: {
    userInfoModel: User
  }
})
export class Server {
  @Inject()
  app: PlatformApplication;

  @Configuration()
  settings: Configuration;

  $beforeRoutesInit(): void {
    this.app
      .use(cors())
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride())
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({
        extended: true
      }));
  }
}
