import "@tsed/ajv";
import { PlatformApplication } from "@tsed/common";
import { Configuration, Inject } from "@tsed/di";
import "@tsed/platform-express"; // /!\ keep this import
import "@tsed/swagger";
import "@tsed/typeorm";
import bodyParser from "body-parser";
import compress from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import methodOverride from "method-override";
import { config, rootDir } from "./config";
import { IndexCtrl } from "./controllers/pages/IndexController";
import { User } from "./models/entity/User";

@Configuration({
  ...config,
  acceptMimes: ["application/json"],
  httpPort: process.env.PORT || 8083,
  httpsPort: false, // CHANGE
  componentsScan: [`${rootDir}/services/**/*.ts`, `${rootDir}/protocols/**/*.ts`],
  mount: {
    "/rest": [`${rootDir}/controllers/**/*.ts`],
    "/": [IndexCtrl]
  },
  swagger: [
    {
      path: "/docs",
      specVersion: "3.0.1",
      spec: {
        components: {
          securitySchemes: {
            "jwt": {
              "type": "http",
              "scheme": "bearer",
              "bearerFormat": "JWT",
              description: "A JWT based access token. Use /rest/auth/login to get one."
            },
          }
        }
      }
    }
  ],
  exclude: ["**/*.spec.ts"],
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
      .use(
        bodyParser.urlencoded({
          extended: true
        })
      );
  }
}
