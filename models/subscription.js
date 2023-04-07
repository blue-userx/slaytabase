'use strict';
export default async (sequelize, DataTypes) => {
  const {
    Model
  } = await import('sequelize');
  class Subscription extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Subscription.init({
    user: DataTypes.STRING,
    guild: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Subscription',
  });
  return Subscription;
};