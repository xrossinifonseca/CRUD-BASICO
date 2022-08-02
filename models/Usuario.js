const db = require("./db");
// define define o nome da nossa tabela

const Usuario = db.sequelize.define("usuario", {
  id: {
    type: db.Sequelize.INTEGER, // PARA O NUMERO SER INTEIRO
    autoIncrement: true, // SEMPRE COLOCAR UM ID A CADA NOVO REGISTRO
    allowNull: false,
    primaryKey: true,
  },
  nome: {
    type: db.Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: db.Sequelize.STRING,
    allowNull: false,
  },
});

// SINCRONIZAR COM O BANCO DE DADOS
Usuario.sync();

module.exports = Usuario;
