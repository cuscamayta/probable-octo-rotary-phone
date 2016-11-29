"use strict";

module.exports = function (sequelize, DataTypes) {
  var Office = sequelize.define("Office", {
    title: { type: DataTypes.STRING, allowNull: false, unique: true },
    address: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    detail: { type: DataTypes.STRING, allowNull: true }
  }, 
    {
      classMethods: {
        associate: function (models) {
          Office.belongsTo(models.Destination, { foreignKey: "idorigin" });
          Office.hasMany(models.Useroffice, { foreignKey: 'idoffice' });
          Office.hasMany(models.Orderbook, { foreignKey: 'idoffice' });
          Office.hasMany(models.Sale, { foreignKey: 'idoffice' });
          Office.hasMany(models.Salesbook, { foreignKey: 'idoffice' });
          Office.hasMany(models.Ticket, { foreignKey: 'idoffice' });
        }
      }
    }
  );
  return Office;
};