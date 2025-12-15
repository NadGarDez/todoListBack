require('dotenv').config(); 

module.exports = {
  development: {
    username: process.env.DB_USERNAME || 'admin',
    password: process.env.DB_PASSWORD || 'contraseña_local',
    database: process.env.DB_DATABASE || 'taskdb_dev',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql', 
    port: 3306,
    define: {
      timestamps: true, 
    },
    dialectOptions: {
      ssl: {
        require: false,
        rejectUnauthorized: false
      }
    }
  },
  production: {
    username: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_DATABASE,
    host: process.env.RDS_HOST, 
    dialect: 'mysql',
    port: 3306,
    dialectOptions: {
      ssl: {
        require: true, 
        rejectUnauthorized: false 
      }
    }
  }
};