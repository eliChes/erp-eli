const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const SubPart_image = sequelize.define('subPart_image', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    subpart_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    subpart_image: {
        type: DataTypes.BLOB('long'),
        allowNull: false,
        get() {
          const value = this.getDataValue('subpart_image')
          return value ? value.toString('base64') : null
        },
        set(value){
          this.setDataValue('subpart_image', Buffer.from(value, 'base64'));
        }
    }
  });
  
  module.exports = SubPart_image;