module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users',{
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(225),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(225),
      unique: 'users_email_unique',
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(225),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'users',
    timestamps: true,
    underscored: true,
  });

  users.associate = (models) => {
    users.hasOne(models.user_wallets, {as: 'wallet'})
  }
  return users;
};
