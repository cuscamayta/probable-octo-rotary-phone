"use strict";

module.exports = function (sequelize, DataTypes) {
    var Page = sequelize.define("Page", {
        title: { type: DataTypes.STRING, allowNull: false, unique: true },
        path: { type: DataTypes.STRING, allowNull: false },
    },
        {
            classMethods: {
                associate: function (models) {
                    Page.belongsTo(models.Module, { foreignKey: "idmodule" });
                    Page.hasMany(models.Permit, { foreignKey: 'idpage' });
                }
            }
        }
    );
    return Page;
};