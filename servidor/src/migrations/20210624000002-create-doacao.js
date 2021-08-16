'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('doacao', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tipo_doacao: {
        type: Sequelize.STRING
      },
      data: {
        type: Sequelize.STRING
      },
      local: {
        type: Sequelize.STRING
      },
      doadorId: {
        type: Sequelize.INTEGER
      },
      receptorId: {
        type: Sequelize.INTEGER
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('doacao');
  }
};