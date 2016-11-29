"use strict";

module.exports = function (sequelize, DataTypes) {
  var Travel = sequelize.define("Travel", {
    numberid: { type: DataTypes.STRING, allowNull: false, unique: true },
    arrival: { type: DataTypes.STRING, allowNull: false },
    departure: { type: DataTypes.STRING, allowNull: false },
    detail: { type: DataTypes.STRING, allowNull: true }
  },
    {
      classMethods: {
        associate: function (models) {
          Travel.belongsTo(models.Course, { foreignKey: "idcourse" });  
          Travel.hasMany(models.Schedule, { foreignKey: "idtravel" });        
        }
      }
    }
  );
  return Travel;
};