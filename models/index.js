'use strict';

import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
const config = JSON.parse(fs.readFileSync('./config/config.json'));
const db = {};

let sequelize = new Sequelize(config.database, config.username, config.password, config);

await Promise.all(fs
  .readdirSync('models')
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) === '.js');
  })
  .map(async file => {
    const model = await (await import('./'+file)).default(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  }));

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;