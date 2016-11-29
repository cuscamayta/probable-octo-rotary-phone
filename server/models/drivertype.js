"use strict";

module.exports = function (sequelize, DataTypes) {
  var Drivertype = sequelize.define("Drivertype", {
    title: { type: DataTypes.STRING, allowNull: false, unique: true },
  }, {
      classMethods: {
        associate: function (models) {
          Drivertype.hasMany(models.Driver, { foreignKey: 'iddrivertype' });
        }
      }
    });
  return Drivertype;
};