"use strict";

module.exports = function (sequelize, DataTypes) {
    var Salesdetail = sequelize.define("Salesdetail", {
        price: { type: DataTypes.DECIMAL, allowNull: false },
        number: { type: DataTypes.INTEGER, allowNull: false },
        detail: { type: DataTypes.STRING, allowNull: true },
        status: { type: DataTypes.INTEGER(4), allowNull: false }
    },
        {
            classMethods: {
                associate: function (models) {
                    Salesdetail.belongsTo(models.Ticket, { foreignKey: "idticket" });
                    Salesdetail.belongsTo(models.Sale, { foreignKey: "idsale" });
                }
            }
        }
    );
    return Salesdetail;
};