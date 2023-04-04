'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => Promise.all([
      queryInterface.createTable('DailyDiscussions', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        guild: {
          allowNull: false,
          type: Sequelize.STRING
        },
        channel: {
          allowNull: false,
          type: Sequelize.STRING
        },
        item: {
          type: Sequelize.STRING
        },
        voteMessage: {
          allowNull: false,
          type: Sequelize.STRING
        },
        voteOptions: {
          allowNull: false,
          type: Sequelize.STRING
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      }),
      queryInterface.createTable('DiscussionVotes', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        discussion: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        user: {
          allowNull: false,
          type: Sequelize.STRING
        },
        vote: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      }),
      queryInterface.addColumn('ServerSettings', 'discussionChannel', {
        type: Sequelize.DataTypes.STRING
      }, { transaction: t }),
    ]));
  },
  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => Promise.all([
      queryInterface.dropTable('DailyDiscussions'),
      queryInterface.dropTable('DiscussionVotes'),
      queryInterface.removeColumn('ServerSettings', 'discussionChannel', { transaction: t }),
    ]));
  }
};