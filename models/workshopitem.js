'use strict';
export default async (sequelize, DataTypes) => {
  const {
    Model
  } = await import('sequelize');
  class WorkshopItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  WorkshopItem.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING
    },
  }, {
    sequelize,
    modelName: 'WorkshopItem',
  });
  return WorkshopItem;
};