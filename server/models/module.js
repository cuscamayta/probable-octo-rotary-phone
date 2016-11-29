"use strict";

module.exports = function (sequelize, DataTypes) {
  var Module = sequelize.define("Module", {
    title: { type: DataTypes.STRING, allowNull: false, unique: true },
    class: { type: DataTypes.STRING, allowNull: false },
  }, {
      classMethods: {
        associate: function (models) {
          Module.hasMany(models.Page, { foreignKey: 'idmodule' });
        }
      }
    });
  return Module;
};