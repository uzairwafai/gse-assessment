const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./contacts.db", // SQLite
  logging: false,
});

const Contact = sequelize.define(
  "Contact",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // primary_contact_id: {
    //   type: DataTypes.INTEGER,
    //   allowNull: true,
    // },
    isPrimary: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    timestamps: false,
  }
);

(async () => {
  await sequelize.sync();
  console.log("Database & tables created!");
})();

module.exports = { sequelize, Contact };
