'use strict';
export default async (sequelize, DataTypes) => {
  const {
    Model
  } = await import('sequelize');
  class DiscussionVote extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  DiscussionVote.init({
    discussion: DataTypes.INTEGER,
    user: DataTypes.STRING,
    vote: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'DiscussionVote',
  });
  return DiscussionVote;
};