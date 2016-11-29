"use strict";

module.exports = function (sequelize, DataTypes) {
  var Bus = sequelize.define("Bus", {
    numberid: {
      type: DataTypes.STRING, allowNull: false, unique: true,
      set: function (val) {
        this.setDataValue('numberid', val.toUpperCase());
      }
    },
    numberseats: { type: DataTypes.INTEGER, allowNull: false },
    numberrows: { type: DataTypes.INTEGER, allowNull: false },
    numberfloors: { type: DataTypes.INTEGER, allowNull: false },
    color: { type: DataTypes.STRING, allowNull: false },
    model: { type: DataTypes.STRING, allowNull: false },
    make: { type: DataTypes.STRING, allowNull: false },
    detail: { type: DataTypes.STRING, allowNull: true }
  },
    {
      classMethods: {
        associate: function (models) {
          Bus.belongsTo(models.Bustype, { foreignKey: "idbustype" });
          Bus.hasMany(models.Schedule, { foreignKey: 'idbus' });
          Bus.hasMany(models.Ticket, { foreignKey: 'idbus' });
        }
      }
    }
  );
  return Bus;
};