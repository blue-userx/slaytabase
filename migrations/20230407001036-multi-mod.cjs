'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => Promise.all([
      queryInterface.sequelize.query(`UPDATE ServerSettings SET mod='["'||mod||'"]';`)
    ]));
  },
  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => Promise.all([

    ]));
  }
};