export default {
    appEnv: process.env.NODE_ENV,
    application: {
        port: process.env.PORT,
        token: process.env.TOKEN,
        isMaintenance: false,
        maintenanceMessage: "Scheduled maintenance activity is going on, we will be available soon.",
        versionNumbers: process.env.VERSIONS.split(", "),
        jwtSecret: process.env.JWT_SECRET,
        jwtAdminSecret: process.env.JWT_ADMIN_SECRET
    },
    storage: {
        databases: {
          mongo: {
            writer: process.env.MONGO_DB_WRITER,
            reader: process.env.MONGO_DB_READER,
            database: process.env.MONGO_DB
          }
        }
      }
};