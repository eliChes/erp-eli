const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const StockTransfer_product = sequelize.define('stockTransfer_product', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  stockTransfer_id:{
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  product_id:{
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
});

module.exports = StockTransfer_product;
