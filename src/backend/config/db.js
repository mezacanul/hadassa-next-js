export const dbConfig = {
    // LOCAL
    // host: "localhost",
    // port: 3306,
    // user: "root",
    // password: "",
    // database: "hadassa",

    // REMOTE
    // host: "162.241.60.214",
    // port: 3306,
    // user: "joseedu4_administrador",
    // password: "Eduardo_26_$",
    // database: "joseedu4_hadassa",

    host: process.env.REMOTE_HOST,
    port: process.env.REMOTE_PORT,
    user: process.env.REMOTE_USER,
    password: process.env.REMOTE_PSW,
    database: process.env.REMOTE_DB,
};
