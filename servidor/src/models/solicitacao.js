const { Model, DataTypes } = require('sequelize');

class Solicitacao extends Model {
  static init(connection) {
    super.init({
      tipo_doacao: DataTypes.STRING,
      data: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
      receptorId: DataTypes.INTEGER,
      doacaoId: DataTypes.INTEGER,
    }, {
      sequelize: connection,
      modelName: 'solicitacao',
      tableName: 'solicitacao'
    })
  }

  static associate(models) {
    // define association here
  }
};

module.exports = Solicitacao