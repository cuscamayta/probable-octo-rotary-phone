"use strict";

module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define("User", {
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    firstname: { type: DataTypes.STRING, allowNull: false },
    lastname: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: true, validate: { isEmail: true } },
    token: { type: DataTypes.TEXT, allowNull: true }
  }, {
      classMethods: {
        associate: function (models) {
          User.belongsTo(models.Role, { foreignKey: "idrole" });
          User.hasMany(models.Useroffice, { foreignKey: 'iduser' });
          User.hasMany(models.Sale, { foreignKey: "iduser" });
          User.hasMany(models.Ticket, { foreignKey: "iduser" });
        }
      },
      getterMethods: {
        fullName: function () { return this.firstname + " " + this.lastname }
      },
      setterMethods: {
        fullName: function (value) {
          var names = value.split(" ");
          this.setDataValue("firstname", names.slice(0, -1).join(" "));
          this.setDataValue("lastname", names.slice(-1).join(" "));
        },
      }
    }
  );
  return User;
};