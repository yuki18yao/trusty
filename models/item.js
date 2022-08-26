'use strict';
const {sequelize, DataTypes} = require('./sequelize-loader');

const Item = sequelize.define(
  'item',
  {
    itemId: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false
    },
    itemName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    condition: {
      type: DataTypes.STRING,
      allowNull: false
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: true
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
    indexes: [
      {
        fields: ['createdBy']
      }
    ]
  }
);

module.exports = Item;