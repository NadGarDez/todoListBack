import { Sequelize, DataTypes, Model, Optional } from 'sequelize'; // // archivo traducido a typescript a partir del archivo autogenerado
import fs from 'fs';
import path from 'path';
import process from 'process';

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '../../config/config.js'))[env];
interface Db {
  [key: string]: any;
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
}

const db: Db = {} as Db;

let sequelize: Sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable] as string, config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      (file.slice(-3) === '.ts' || file.slice(-3) === '.js') &&
      file.indexOf('.test.') === -1
    );
  })
  .forEach(file => {
    const modelPath = path.join(__dirname, file);
    const modelModule = require(modelPath);
    
    const model = modelModule.default 
      ? modelModule.default(sequelize, DataTypes)
      : modelModule(sequelize, DataTypes);
    
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;