"use strict";

module.exports = function (sequelize, DataTypes) {
  var Bustype = sequelize.define("Bustype", {
    title: { type: DataTypes.STRING, allowNull: false, unique: true },
  }, {
      classMethods: {
        associate: function (models) {
          Bustype.hasMany(models.Bus, { foreignKey: 'idbustype' });
        }
      }
    });
  return Bustype;
};