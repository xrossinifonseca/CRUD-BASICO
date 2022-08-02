// Ferramentas = nodejs/mysql/sequalize/express/handbars

const express = require("express");
const app = express();
const hbs = require("express-handlebars");
const PORT = process.env.PORT || 3000;

// bodyParser O body-parser é um módulo capaz de converter o body da requisição para vários formatos. Um desses formatos é json, exatamente o que queremos.
const bodyParser = require("body-parser");
// sessão é uma variavel temporaria que é armezanado no servidor para guardar uma informação
const session = require("express-session");

// CONFIGURAÇÃO DO HANDLEBARS!!

app.engine(
  "hbs",
  hbs.engine({
    extname: "hbs",
    defaultLayout: "main",
  })
);
app.set("view engine", "hbs");

// config para funcionar bodyParser
app.use(bodyParser.urlencoded({ extended: false }));

// IMPORTAR MODEL USUARIOS

const Usuario = require("./models/Usuario");

// Config das Sessions

app.use(
  session({
    secret: "criar uma chave qualquer123",
    resave: false,
    saveUninitialized: true,
  })
);

app.get("/", (req, res) => {
  // mensagem de erro
  if (req.session.errors) {
    let arrayErros = req.session.errors;
    req.session.errors = "";
    return res.render("index", { NavActivedCad: true, error: arrayErros });
  }

  //   mensagem de sucesso
  if (req.session.success) {
    req.session.success = false;
    return res.render("index", { NavActivedCad: true, MsgSuccess: true });
  }

  res.render("index", { NavActivedCad: true });
});
app.get("/users", (req, res) => {
  // puxar informação no banco de dados
  Usuario.findAll()
    .then((valores) => {
      // console.log(valores.map((valores) => valores.toJSON()));
      if (valores.length > 0) {
        return res.render("users", {
          NavActivedUsers: true,
          table: true,
          usuarios: valores.map((valores) => valores.toJSON()),
        });
      } else {
        return res.render("users", {
          NavActivedUsers: true,
          table: false,
        });
      }
    })
    .catch((err) => console.log(`hove um problema:${err}`)); //FindAll = buscar todos
});
// Enviar dados para atualizar
app.post("/editar", (req, res) => {
  // receber o valor
  let id = req.body.id;
  Usuario.findByPk(id) //findByPk = procurar pela chave primaria.
    .then((dados) => {
      return res.render("editar", {
        erros: false,
        id: dados.id,
        nome: dados.nome,
        email: dados.email,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.render("editar", {
        error: true,
        problema: "Não é possivel editar este registro!",
      });
    });

  // res.render("editar");
});

// Recebendo as informções do Form
app.post("/cad", (req, res) => {
  //   validar os valores que vieram do formulario
  let nome = req.body.nome;
  let email = req.body.email;

  //   ARRAY QUE VAI CONTER ERROS
  const erros = [];

  //   REMOVER O ESPAÇOS EM BRANCOS  ANTES/DEPOIS

  nome = nome.trim(); // remove os espaços vazios
  email = email.trim();

  //  LIMPAR O NOME DE CARACTERES ESPECIAIS (APENAS LETRAS)
  nome = nome.replace(/[^A-zÀ-ú\s]/gi, ""); //expressôes regulares
  nome = nome.trim();
  //   console.log(nome);

  //  VERFICAR SE O CAMPO ESTA VAZIO OU NÃO
  if (nome == "" || typeof nome == undefined || nome == null) {
    // push metodo para inserir um valor dentro de um array
    erros.push({ mensagem: "Campo nome não pode ser vazio" });
  }

  // VERFICAR SE O CAMPO NOME É VALIDO (APENAS LETRAS)
  if (/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ\-']+$/.test(nome)) {
    // teste() = verfica se bate com a expressão regular
    console.log(nome);
    erros.push({ mensagem: "nome inválido" });
  }

  //   VERFICAR SE O EMAIL ESTA VAZIO
  if (email == "" || typeof email == undefined || email == null) {
    // push metodo para inserir um valor dentro de um array
    erros.push({ mensagem: "Campo nome não pode ser vazio" });
  }

  //   VERFICAR O EMAIL É VALIDO

  if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    erros.push({ mensagem: "Campo email inválido" });
  }

  //   Se ele passou por algum erro
  if (erros.length > 0) {
    console.log(erros);
    req.session.errors = erros;
    req.session.success = false;
    return res.redirect("/");
  }

  // enviar esses valores para um banco de dados
  Usuario.create({
    nome: nome,
    email: email.toLowerCase(), // toLowerCase tornar todos as letras minusculas
  })
    .then(() => {
      //   SUCESSO NENHUM ERRO SALVAR NO BANCO DE DADOS
      console.log("validação realizada com sucesso");

      req.session.success = true;
      return res.redirect("/");
    })
    .catch((err) => {
      console.log(`Ops, houve um erro:${err}`);
    });
});

// Rodar update = edição
app.post("/update", (req, res) => {
  //   validar os valores que vieram do formulario
  let nome = req.body.nome;
  let email = req.body.email;

  //   ARRAY QUE VAI CONTER ERROS
  const erros = [];

  //   REMOVER O ESPAÇOS EM BRANCOS  ANTES/DEPOIS

  nome = nome.trim(); // remove os espaços vazios
  email = email.trim();

  //  LIMPAR O NOME DE CARACTERES ESPECIAIS (APENAS LETRAS)
  nome = nome.replace(/[^A-zÀ-ú\s]/gi, ""); //expressôes regulares
  nome = nome.trim();
  //   console.log(nome);

  //  VERFICAR SE O CAMPO ESTA VAZIO OU NÃO
  if (nome == "" || typeof nome == undefined || nome == null) {
    // push metodo para inserir um valor dentro de um array
    erros.push({ mensagem: "Campo nome não pode ser vazio" });
  }

  // VERFICAR SE O CAMPO NOME É VALIDO (APENAS LETRAS)
  if (!/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ\-']+$/.test(nome)) {
    // teste() = verfica se bate com a expressão regular
    console.log(nome);
    erros.push({ mensagem: "nome inválido" });
  }

  //   VERFICAR SE O EMAIL ESTA VAZIO
  if (email == "" || typeof email == undefined || email == null) {
    // push metodo para inserir um valor dentro de um array
    erros.push({ mensagem: "Campo nome não pode ser vazio" });
  }

  //   VERFICAR O EMAIL É VALIDO

  if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    erros.push({ mensagem: "Campo email inválido" });
  }

  //   Se ele passou por algum erro
  if (erros.length > 0) {
    console.log(erros);
    return res.status(400).send({ status: 400, erros: erros });
  }

  //  Sucess nenhum erro
  // Atualizar registro no banco de dados
  Usuario.update(
    {
      nome: nome,
      email: email.toLowerCase(),
    },
    {
      where: {
        id: req.body.id,
      },
    }
  )
    .then((resultado) => {
      console.log(resultado);
      return res.redirect("/users");
    })
    .catch((err) => {
      console.log(err);
    });
});

// Deletar conteudo banco de dados
app.post("/del", (req, res) => {
  Usuario.destroy({
    //detruir registro
    where: {
      id: req.body.id,
    },
  })
    .then((retorno) => {
      return res.redirect("/users");
    })
    .catch((err) => console.log(err));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
