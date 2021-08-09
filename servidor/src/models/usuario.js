const { Model, DataTypes } = require('sequelize');

class Usuario extends Model {
  static init(connection) {
    super.init({
      nome: DataTypes.STRING,
      cpf: DataTypes.STRING,
      senha: DataTypes.STRING,
      email: DataTypes.STRING,
      telefone: DataTypes.STRING,
      endereco: DataTypes.STRING,
      tipo: DataTypes.INTEGER,
      tipo_doacao: DataTypes.STRING,
    }, {
      sequelize: connection,
      modelName: 'Usuario',
      tableName: 'Usuario'
    })
  }

  static associate(models) {
    // define association here
  }
};

module.exports = Usuario