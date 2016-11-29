"use strict";
var moment = require("moment");
var common = require('../routes/common');

module.exports = function (sequelize, DataTypes) {
  var Salesbook = sequelize.define("Salesbook", {
    type: { type: DataTypes.INTEGER(4), allowNull: false },
    numberorder: { type: DataTypes.STRING, allowNull: false },
    numbercontrol: { type: DataTypes.STRING, allowNull: false, unique: true },
    numberid: {
      type: DataTypes.INTEGER, allowNull: false      
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
      set: function (val) {
        this.setDataValue('fullname', val.toUpperCase());
      }
    },
    numberinvoice: { type: DataTypes.INTEGER, allowNull: false },
    dateregister: {
      type: DataTypes.DATE, allowNull: false,
      set: function (val) {
        this.setDataValue('dateregister', common.formatDate(val));
      },
      get: function (val) {
        var date = this.getDataValue('dateregister');
        return moment(date).format("DD/MM/YYYY");
      }
    },
    amountinvoice: { type: DataTypes.DECIMAL, allowNull: false },
    amountinvoiceice: { type: DataTypes.DECIMAL, allowNull: false },
    amountinvoiceexento: { type: DataTypes.DECIMAL, allowNull: false },
    amountinvoicenet: { type: DataTypes.DECIMAL, allowNull: false },
    amountoftax: { type: DataTypes.DECIMAL, allowNull: false },
    status: { type: DataTypes.INTEGER(4), allowNull: false }
  },
    {
      classMethods: {
        associate: function (models) {
          Salesbook.belongsTo(models.Orderbook, { foreignKey: "idorderbook" });
          Salesbook.belongsTo(models.Office, { foreignKey: "idoffice" });
          Salesbook.hasMany(models.Sale, { foreignKey: "idsalesbook" });
        }
      }
    }
  );
  return Salesbook;
};