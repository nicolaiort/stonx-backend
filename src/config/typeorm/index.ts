// @tsed/cli do not edit

const db_config = {
    name: "default",
    type: "sqlite",
    database: "database.sqlite",
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