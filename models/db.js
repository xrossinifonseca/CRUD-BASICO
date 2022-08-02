//   CONECÇÃO COM O BANCO DE DADOS

const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("node_exemplo", "root", "", {
  host: "127.0.0.1",
  dialect: "mysql",
  define: {
    charset: "utf8",
    collate: "utf8_general_ci",
    timestamps: true,
  },
  logging: false,
});

// testando a conecção com o banco!!

// sequelize
//   .authenticate()
//   .then(function () {
//     console.log("conectado no banco com sucesso");
//   })
//   .catch((err) => {
//     console.log(`falha ao se conectar: ${err}`);
//   });

// exportar para arquivo model
module.exports = { Sequelize, sequelize };
