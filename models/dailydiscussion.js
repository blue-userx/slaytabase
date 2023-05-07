'use strict';
export default async (sequelize, DataTypes) => {
  const {
    Model
  } = await import('sequelize');
  class DailyDiscussion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  DailyDiscussion.init({
    guild: DataTypes.STRING,
    channel: DataTypes.STRING,
    item: DataTypes.STRING,
    voteMessage: DataTypes.STRING,
    voteOptions: DataTypes.STRING,
    next: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'DailyDiscussion',
  });
  return DailyDiscussion;
};