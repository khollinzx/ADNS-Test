module.exports = (sequelize, DataTypes) => {
  const user_wallets = sequelize.define('user_wallets',{
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    amount: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    wallet_type: {
      type: DataTypes.STRING(225),
      allowNull: false,
    }
  }, {
    sequelize,
    tableName: 'user_wallets',
    underscored: true,
  });

  user_wallets.associate = (models) => {
    user_wallets.belongsTo(models.users, {as: 'user'})
  }

  return user_wallets;
};
