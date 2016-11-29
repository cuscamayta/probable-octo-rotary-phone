"use strict";

module.exports = function (sequelize, DataTypes) {
    var Useroffice = sequelize.define("Useroffice", {
    }, {
            classMethods: {
                associate: function (models) {
                    Useroffice.belongsTo(models.User, { foreignKey: 'iduser', primaryKey: true });
                    Useroffice.belongsTo(models.Office, { foreignKey: 'idoffice', primaryKey: true });
                }
            }
        }
    );
    return Useroffice;
};