'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('solicitacao', {
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
      status: {
        type: Sequelize.INTEGER
      },
      receptorId: {
        type: Sequelize.INTEGER
      },
      doacaoId: {
        type: Sequelize.INTEGER
      },

    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('solicitacao');
  }
};