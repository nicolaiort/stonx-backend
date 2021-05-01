// @tsed/cli do not edit

const db_config = {
    name: "default",
    type: process.env.DATABASE_TYPE,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
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