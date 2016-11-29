"use strict";

var moment = require("moment");
var common = require('../routes/common');

module.exports = function (sequelize, DataTypes) {
  var Orderbook = sequelize.define("Orderbook", {
    type: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.INTEGER, allowNull: false },
    numberorder: { type: DataTypes.STRING, allowNull: false, unique: true },    
    controlkey: { type: DataTypes.TEXT, allowNull: false },
    dateofissue: {
      type: DataTypes.DATE, allowNull: false,
      set: function (val) {
        this.setDataValue('dateofissue', common.formatDate(val));
      },
      get: function (val) {
        var date = this.getDataValue('dateofissue');
        return moment(date).format("DD/MM/YYYY");
      }
    },
    deadline: {
      type: DataTypes.DATE, allowNull: false,
      set: function (val) {
        this.setDataValue('deadline', common.formatDate(val));
      },
      get: function (val) {
        var date = this.getDataValue('deadline');
        return moment(date).format("DD/MM/YYYY");
      }
    }
  }, {
      classMethods: {
        associate: function (models) {
          Orderbook.belongsTo(models.Office, { foreignKey: "idoffice" });
          Orderbook.hasMany(models.Salesbook, { foreignKey: 'idorderbook' });
        }
      }
    });
  return Orderbook;
};