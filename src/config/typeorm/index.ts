// @tsed/cli do not edit

import { config } from "../env";

const db_config = {
    name: "default",
    type: config["DATABASE_TYPE"],
    database: config["DATABASE_NAME"],
    host: config["DATABASE_HOST"],
    port: config["DATABASE_PORT"],
    username: config["DATABASE_USER"],
    password: config["DATABASE_PASSWORD"],
    synchronize: true,
    logging: false,
    entities: [
        "${rootDir}/models/entity/**/*.{js,ts}"
    ],
    migrations: [
        "${rootDir}/migration/**/*.{js,ts}"
    ],
    subscribers: [
        "${rootDir}/subscriber/**/*.{js,ts}"
    ],
    cli: {
        entitiesDir: "${rootDir}/models/entity",
        migrationsDir: "${rootDir}/migration",
        subscribersDir: "${rootDir}/subscriber"
    }
}

export default [db_config as any];