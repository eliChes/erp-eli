const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const PR_PO = sequelize.define('purchase_req_po_prd', {
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
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  product_tag_supplier_ID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
});

module.exports = PR_PO;