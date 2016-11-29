"use strict";

module.exports = function (sequelize, DataTypes) {
    var Permit = sequelize.define("Permit", {
    }, {
            classMethods: {
                associate: function (models) {
                    Permit.belongsTo(models.Role, { foreignKey: 'idrole', primaryKey: true });
                    Permit.belongsTo(models.Page, { foreignKey: 'idpage', primaryKey: true });
                }
            }
        }
    );
    return Permit;
};