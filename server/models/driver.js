"use strict";

var moment = require("moment");
var common = require('../routes/common');

module.exports = function (sequelize, DataTypes) {
  var Driver = sequelize.define("Driver", {
    numberid: {
      type: DataTypes.STRING, allowNull: false, unique: true,
      set: function (val) {
        this.setDataValue('numberid', val.toUpperCase());
      }
    },
    firstname: { type: DataTypes.STRING, allowNull: false },
    lastname: { type: DataTypes.STRING, allowNull: false },
    birthdate: {
      type: DataTypes.DATE, allowNull: true,
      set: function (val) {
        this.setDataValue('birthdate', common.formatDate(val));
      },
      get: function (val) {
        var date = this.getDataValue('birthdate');
        return moment(date).format("DD/MM/YYYY");
      }
    },
  }, {
      classMethods: {
        associate: function (models) {
          Driver.belongsTo(models.Drivertype, { foreignKey: "iddrivertype" });
          Driver.hasMany(models.Scheduledetail, { foreignKey: 'iddriver' });
        }
      },
      getterMethods: {
        fullName: function () { return this.firstname + " " + this.lastname }
      },
      setterMethods: {
        fullName: function (value) {
          var names = value.split(" ");
          this.setDataValue("firstname", names.slice(0, -1).join(" "));
          this.setDataValue("lastname", names.slice(-1).join(" "));
        },
      }
    }
  );
  return Driver;
};