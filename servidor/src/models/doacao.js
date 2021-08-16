const { Model, DataTypes } = require('sequelize');

class Doacao extends Model {
  static init(connection) {
    super.init({
      tipo_doacao: DataTypes.STRING,
      data: DataTypes.STRING,
      local: DataTypes.STRING,
      doadorId: DataTypes.INTEGER,
      receptorId: DataTypes.INTEGER,
    }, {
      sequelize: connection,
      modelName: 'doacao',
      tableName: 'doacao'
    })
  }

  static associate(models) {
    // define association here
  }
};

module.exports = Doacao