const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const PR_history = sequelize.define('purchase_req_rejustify', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  pr_id:{
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  file: {
    type: DataTypes.BLOB('long'),
    allowNull: true,
  },
  remarks: {
    type: DataTypes.STRING,
    allowNull: true,
  }
});

module.exports = PR_history;
